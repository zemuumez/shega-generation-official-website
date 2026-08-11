import { NextRequest, NextResponse } from "next/server";
import {
  getLiveState,
  getAllowSoloPlay,
  getLiveAdminConfig,
  generateQuestionToken,
  getCurrentEpoch,
  parseBool,
} from "@/lib/quizLiveEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || `anon_${Math.random().toString(36).substring(2, 9)}`;
  // The client may send either a Sanity _id or a slug; we accept both.
  // Topic isolation happens at the client via the topicId stored in active_state.
  const requestedTopicId = url.searchParams.get("topicId") || null;

  const liveState = await getLiveState();
  const allowSoloPlayRaw = await getAllowSoloPlay();
  const allowSoloPlay = parseBool(allowSoloPlayRaw, true);
  const adminConfig = await getLiveAdminConfig();
  const epoch = await getCurrentEpoch();

  // No active state → always IDLE
  if (!liveState) {
    return NextResponse.json({
      status: "IDLE",
      allowSoloPlay,
      adminConfig,
      questionQueue: [],
      epoch,
      activeQuestion: null,
    });
  }

  // Topic isolation check:
  // If client sent a topicId AND it doesn't match the live topicId, return null question.
  // IMPORTANT: we only block if requestedTopicId is a Sanity _id format (24 hex chars or starts
  // with a known prefix). If the client sent a slug (e.g. "python-oop"), we let it through —
  // slug→id resolution is the admin's responsibility when pushing a question.
  // A simple heuristic: if requestedTopicId looks like a slug (contains "-" but no spaces and
  // is NOT equal to the live topicId) we do NOT block — we serve the question and let the client
  // decide if it matches by checking topicId in the payload.
  const looksLikeSanityId = requestedTopicId && !requestedTopicId.includes("-");
  const isTopicMismatch =
    requestedTopicId &&
    liveState.topicId &&
    looksLikeSanityId &&
    liveState.topicId !== requestedTopicId;

  if (isTopicMismatch) {
    return NextResponse.json({
      status: "IDLE",
      allowSoloPlay,
      adminConfig,
      questionQueue: [],
      epoch,
      activeQuestion: null,
    });
  }

  const now = Date.now();
  const remainingMs = Math.max(0, liveState.endTime - now);
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const tokenExpiry = liveState.endTime + 5000;
  const token = generateQuestionToken(userId, liveState.questionId, tokenExpiry);

  return NextResponse.json({
    status: liveState.status,
    allowSoloPlay,
    adminConfig,
    questionQueue: [],
    epoch,
    activeQuestion: {
      questionId: liveState.questionId,
      topicId: liveState.topicId,
      questionText: liveState.questionText,
      questionType: liveState.questionType,
      codeSnippet: liveState.codeSnippet,
      options: liveState.options,
      difficulty: liveState.difficulty,
      points: liveState.points,
      orderIndex: liveState.orderIndex,
      timerDuration: liveState.timerDuration,
      remainingSeconds,
      startTime: liveState.startTime,
      endTime: liveState.endTime,
      epoch: liveState.epoch,
      token,
      tokenExpiry,
      status: liveState.status,
      isLocked: liveState.isLocked,
      autoPush: liveState.autoPush,
    },
  });
}
