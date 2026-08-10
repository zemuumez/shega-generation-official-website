import { NextRequest, NextResponse } from "next/server";
import {
  getLiveState,
  getAllowSoloPlay,
  getLiveAdminConfig,
  getLiveQuestionQueue,
  generateQuestionToken,
} from "@/lib/quizLiveEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || `anon_${Math.random().toString(36).substring(2, 9)}`;

  const liveState = await getLiveState();
  const allowSoloPlay = await getAllowSoloPlay();
  const adminConfig = await getLiveAdminConfig();
  const questionQueue = await getLiveQuestionQueue();

  if (!liveState) {
    return NextResponse.json({
      status: "IDLE",
      allowSoloPlay,
      adminConfig,
      questionQueue,
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
    questionQueue,
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
      token,
      tokenExpiry,
      status: liveState.status,
      isLocked: liveState.isLocked,
      autoPush: liveState.autoPush,
    },
  });
}
