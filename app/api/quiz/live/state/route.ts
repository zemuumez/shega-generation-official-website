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
  const requestedTopicId = url.searchParams.get("topicId") || url.searchParams.get("quizId") || null;

  const liveState = await getLiveState();
  const allowSoloPlayRaw = await getAllowSoloPlay();
  const allowSoloPlay = parseBool(allowSoloPlayRaw, true);
  const adminConfig = await getLiveAdminConfig();
  const epoch = await getCurrentEpoch();

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

  // Bug 1 Fix: Topic Isolation — compare requestedTopicId against BOTH liveState.topicId AND liveState.topicSlug
  const matchesTopic =
    !requestedTopicId ||
    requestedTopicId === "all" ||
    liveState.topicId === requestedTopicId ||
    liveState.topicSlug === requestedTopicId;

  if (!matchesTopic) {
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
      topicSlug: liveState.topicSlug,
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
