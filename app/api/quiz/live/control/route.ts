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
  setLiveAdminConfig,
  resetSession,
  resetLeaderboard,
  getCurrentEpoch,
  enqueueQuestion,
  parseBool,
  verifyAdminSessionToken,
} from "@/lib/quizLiveEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ControlSchema = z.object({
  action: z.enum([
    "PUSH_QUESTION",
    "TOGGLE_AUTO_PUSH",
    "TOGGLE_SOLO_PLAY",
    "UPDATE_CONFIG",
    "RESET_SESSION",
    "RESET_LEADERBOARD",
  ]),
  topicId: z.string().optional(),
  questionId: z.string().optional(),
  orderIndex: z.number().optional(),
  timerDuration: z.number().min(5).max(300).optional(),
  autoPush: z.boolean().optional(),
  allowSoloPlay: z.boolean().optional(),
  selectedTopicId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const authToken = req.headers.get("x-admin-token") || req.headers.get("authorization") || "";
  const isAuthorized = await verifyAdminSessionToken(authToken);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized: Admin authentication required." }, { status: 401 });
  }

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

  const { action, topicId, questionId, orderIndex, timerDuration, autoPush, allowSoloPlay, selectedTopicId } =
    parsed.data;

  const currentState = await getLiveState();

  // ── RESET_SESSION ────────────────────────────────────────────────────────
  if (action === "RESET_SESSION") {
    const newEpoch = await resetSession();
    return NextResponse.json({ ok: true, epoch: newEpoch, message: "Session reset." });
  }

  // ── RESET_LEADERBOARD ────────────────────────────────────────────────────
  if (action === "RESET_LEADERBOARD") {
    if (!topicId) {
      return NextResponse.json({ error: "topicId required for RESET_LEADERBOARD." }, { status: 400 });
    }
    await resetLeaderboard(topicId);
    return NextResponse.json({ ok: true, message: `Leaderboard for topic ${topicId} cleared.` });
  }

  // ── UPDATE_CONFIG ────────────────────────────────────────────────────────
  if (action === "UPDATE_CONFIG") {
    const updated = await setLiveAdminConfig({
      ...(timerDuration !== undefined && { timerDuration }),
      ...(autoPush !== undefined && { autoPush }),
      ...(allowSoloPlay !== undefined && { allowSoloPlay }),
      ...(selectedTopicId !== undefined && { selectedTopicId }),
    });
    return NextResponse.json({ ok: true, adminConfig: updated });
  }

  // ── TOGGLE_AUTO_PUSH ─────────────────────────────────────────────────────
  if (action === "TOGGLE_AUTO_PUSH") {
    const nextVal = autoPush !== undefined ? autoPush : !(currentState?.autoPush ?? false);
    if (currentState) {
      currentState.autoPush = nextVal;
      await setLiveState(currentState);
    }
    await setLiveAdminConfig({ autoPush: nextVal });
    return NextResponse.json({ ok: true, autoPush: nextVal });
  }

  // ── TOGGLE_SOLO_PLAY ─────────────────────────────────────────────────────
  if (action === "TOGGLE_SOLO_PLAY") {
    const currentVal = await getAllowSoloPlay();
    const nextVal = allowSoloPlay !== undefined ? allowSoloPlay : !currentVal;
    await setAllowSoloPlay(nextVal);
    await setLiveAdminConfig({ allowSoloPlay: nextVal });
    if (currentState) {
      currentState.allowSoloPlay = nextVal;
      await setLiveState(currentState);
    }
    return NextResponse.json({ ok: true, allowSoloPlay: nextVal });
  }

  // ── PUSH_QUESTION ────────────────────────────────────────────────────────
  if (action === "PUSH_QUESTION") {
    if (!topicId) {
      return NextResponse.json({ error: "topicId is required for PUSH_QUESTION." }, { status: 400 });
    }

    // Resolve question sequence
    let questions: any[] = (await getTopicSequence(topicId)) || [];
    if (questions.length === 0) {
      try {
        const doc = await sanityClient.fetch(
          `*[_type == "challengeQuiz" && (topic._ref == $topicId || _id == $topicId)][0]`,
          { topicId }
        );
        questions = doc?.questions || [];
        if (questions.length > 0) await cacheTopicSequence(topicId, questions);
      } catch {
        questions = [];
      }
    }

    if (!questions.length) {
      return NextResponse.json({ error: "No questions found for this topic." }, { status: 404 });
    }

    let targetQuestion: any = null;
    if (questionId) {
      targetQuestion = questions.find((q: any) => q._key === questionId || q._id === questionId);
      if (!targetQuestion) {
        try {
          const doc = await sanityClient.fetch(
            `*[_type == "challengeQuiz" && (questions[]._key == $qId || questions[]._id == $qId)][0]`,
            { qId: questionId }
          );
          if (doc?.questions) {
            targetQuestion = doc.questions.find((q: any) => q._key === questionId || q._id === questionId);
          }
        } catch { /* ignore */ }
      }
    } else if (orderIndex !== undefined) {
      targetQuestion = questions.find((q: any) => q.orderIndex === orderIndex) || questions[orderIndex - 1];
    }

    if (!targetQuestion) targetQuestion = questions[0];

    const targetQId = targetQuestion._key || targetQuestion._id || `q_${Date.now()}`;

    // Bug 4 Fix: Handle Lock Collision gracefully without red 423 error
    if (currentState && currentState.status === "ACTIVE" && Date.now() < currentState.endTime) {
      await enqueueQuestion(topicId, targetQId);
      return NextResponse.json(
        {
          ok: true,
          queued: true,
          message: `Question #${targetQuestion.orderIndex || 1} enqueued to broadcast stack.`,
        },
        { status: 200 }
      );
    }

    // Bug 1 & 3 Fix: Resolve topicSlug from Sanity for exact topic isolation & scoring
    let topicSlug = topicId;
    try {
      const topicDoc = await sanityClient.fetch(
        `*[_type == "challengeTopic" && (_id == $topicId || slug.current == $topicId)][0]{ "slug": slug.current, _id }`,
        { topicId }
      );
      if (topicDoc?.slug) topicSlug = topicDoc.slug;
    } catch { /* ignore */ }

    const durationSeconds = timerDuration && timerDuration >= 5 ? timerDuration : (targetQuestion.timerDuration || 45);
    const now = Date.now();
    const endTime = now + durationSeconds * 1000;
    const points = targetQuestion.points || getDifficultyPoints(targetQuestion.difficulty || "MEDIUM");
    const currentSoloState = await getAllowSoloPlay();
    const epoch = await getCurrentEpoch();

    const newLiveState = {
      questionId: targetQId,
      topicId,
      topicSlug,
      questionText: targetQuestion.questionText,
      questionType: (targetQuestion.questionType || "MULTIPLE_CHOICE") as "MULTIPLE_CHOICE" | "TRUE_FALSE",
      codeSnippet: targetQuestion.codeSnippet || undefined,
      options: targetQuestion.options || [],
      correctOptionIndex: targetQuestion.correctOptionIndex ?? 0,
      explanation: targetQuestion.explanation || undefined,
      difficulty: (targetQuestion.difficulty || "MEDIUM") as "EASY" | "MEDIUM" | "HARD",
      points,
      orderIndex: targetQuestion.orderIndex || (orderIndex || 1),
      timerDuration: durationSeconds,
      startTime: now,
      endTime,
      epoch,
      isLocked: true,
      autoPush: autoPush !== undefined ? parseBool(autoPush) : (currentState?.autoPush ?? false),
      allowSoloPlay: currentSoloState,
      status: "ACTIVE" as const,
    };

    await setLiveState(newLiveState);
    return NextResponse.json({ ok: true, state: newLiveState }, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
