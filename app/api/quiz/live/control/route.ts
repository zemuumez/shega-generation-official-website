import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanityClient } from "@/sanity/lib/client";
import {
  setLiveState,
  getLiveState,
  cacheTopicSequence,
  getTopicSequence,
  getDifficultyPoints,
  setAllowSoloPlay,
  getAllowSoloPlay,
  advanceToNextQuestion,
} from "@/lib/quizLiveEngine";

export const runtime = "nodejs";

const ControlSchema = z.object({
  action: z.enum(["PUSH_QUESTION", "TOGGLE_AUTO_PUSH", "TOGGLE_SOLO_PLAY", "AUTO_ADVANCE_NEXT", "RESET_SESSION"]),
  topicId: z.string().optional(),
  questionId: z.string().optional(),
  orderIndex: z.number().optional(),
  timerDuration: z.number().min(5).max(300).optional(),
  autoPush: z.boolean().optional(),
  allowSoloPlay: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = ControlSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const { action, topicId, questionId, orderIndex, timerDuration, autoPush, allowSoloPlay } = parsed.data;
  const currentState = await getLiveState();

  if (action === "RESET_SESSION") {
    await setLiveState(null);
    return NextResponse.json({ ok: true, message: "Live quiz session reset." });
  }

  if (action === "TOGGLE_AUTO_PUSH") {
    if (currentState) {
      currentState.autoPush = autoPush !== undefined ? autoPush : !currentState.autoPush;
      await setLiveState(currentState);
    }
    return NextResponse.json({ ok: true, autoPush: currentState?.autoPush ?? false });
  }

  if (action === "TOGGLE_SOLO_PLAY") {
    const currentVal = await getAllowSoloPlay();
    const nextVal = allowSoloPlay !== undefined ? allowSoloPlay : !currentVal;
    await setAllowSoloPlay(nextVal);
    if (currentState) {
      currentState.allowSoloPlay = nextVal;
      await setLiveState(currentState);
    }
    return NextResponse.json({ ok: true, allowSoloPlay: nextVal });
  }

  if (action === "PUSH_QUESTION") {
    // Single Question Lock: If current question is active and countdown has NOT expired, block new push
    if (currentState && currentState.status === "ACTIVE" && Date.now() < currentState.endTime) {
      return NextResponse.json(
        { error: "Single Question Lock Active! Current question countdown is still running." },
        { status: 423 }
      );
    }

    if (!topicId) {
      return NextResponse.json({ error: "topicId is required for PUSH_QUESTION." }, { status: 400 });
    }

    // Fetch quiz from Sanity if not pre-cached
    let questions: any[] = (await getTopicSequence(topicId)) || [];
    if (questions.length === 0) {
      try {
        const doc = await sanityClient.fetch(
          `*[_type == "challengeQuiz" && (topic._ref == $topicId || _id == $topicId)][0]`,
          { topicId }
        );
        questions = doc?.questions || [];
        if (questions.length > 0) {
          await cacheTopicSequence(topicId, questions);
        }
      } catch (err) {
        console.error("Sanity fetch for topic questions failed:", err);
      }
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "No questions found for this topic." }, { status: 404 });
    }

    // Find target question by questionId or orderIndex
    let targetQuestion = questions[0];
    if (questionId) {
      targetQuestion = questions.find((q: any) => q._key === questionId || q._id === questionId) || questions[0];
    } else if (orderIndex !== undefined) {
      targetQuestion = questions.find((q: any) => q.orderIndex === orderIndex) || questions[orderIndex - 1] || questions[0];
    }

    // Explicit timer priority: timerDuration passed by Admin Deck > targetQuestion.timerDuration > 45s fallback
    const durationSeconds = timerDuration && timerDuration >= 5 ? timerDuration : (targetQuestion.timerDuration || 45);
    const now = Date.now();
    const endTime = now + durationSeconds * 1000;
    const points = targetQuestion.points || getDifficultyPoints(targetQuestion.difficulty || "MEDIUM");
    const currentSoloState = await getAllowSoloPlay();

    const newLiveState = {
      questionId: targetQuestion._key || targetQuestion._id || `q_${Date.now()}`,
      topicId,
      questionText: targetQuestion.questionText,
      questionType: targetQuestion.questionType || "MULTIPLE_CHOICE",
      codeSnippet: targetQuestion.codeSnippet || undefined,
      options: targetQuestion.options || [],
      difficulty: targetQuestion.difficulty || "MEDIUM",
      points,
      orderIndex: targetQuestion.orderIndex || (orderIndex || 1),
      timerDuration: durationSeconds,
      startTime: now,
      endTime,
      isLocked: true, // Single question lock activated
      autoPush: autoPush !== undefined ? autoPush : (currentState?.autoPush ?? false),
      allowSoloPlay: currentSoloState,
      status: "ACTIVE" as const,
    };

    await setLiveState(newLiveState);

    return NextResponse.json({ ok: true, state: newLiveState }, { status: 200 });
  }

  if (action === "AUTO_ADVANCE_NEXT") {
    if (!currentState) {
      return NextResponse.json({ error: "No active session to advance." }, { status: 400 });
    }

    await advanceToNextQuestion(currentState);
    return NextResponse.json({ ok: true, status: "INTERMISSION", intermissionDurationSeconds: 5 });
  }

  return NextResponse.json({ error: "Unknown control action." }, { status: 400 });
}
