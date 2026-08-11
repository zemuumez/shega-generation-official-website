import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  verifyQuestionToken,
  getLiveState,
  getTopicSequence,
  cacheTopicSequence,
  getDifficultyPoints,
  markAnswered,
  addScoreToLeaderboard,
  updateAccuracy,
  getParticipantScore,
  getAccuracy,
  upsertParticipantMeta,
} from "@/lib/quizLiveEngine";
import { sanityClient } from "@/sanity/lib/client";
import { sanityWriteClient } from "@/sanity/lib/writeClient";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SubmitSchema = z.object({
  userId: z.string().min(1, "userId required"),
  participantName: z.string().trim().min(2).max(100),
  participantHandle: z.string().trim().max(50).optional().default(""),
  questionId: z.string().min(1, "questionId required"),
  chosenOptionIndex: z.number().min(0).max(5),
  token: z.string().min(1, "HMAC token required"),
  tokenExpiry: z.number().min(1, "tokenExpiry required"),
  epoch: z.number().optional(), // client echoes the epoch it received
});

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too many submission attempts." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const { userId, participantName, participantHandle, questionId, chosenOptionIndex, token, tokenExpiry, epoch: clientEpoch } = parsed.data;

  // 1. Verify HMAC token signature & expiry
  const isTokenValid = verifyQuestionToken(token, userId, questionId, tokenExpiry);
  if (!isTokenValid) {
    return NextResponse.json(
      { error: "Security Exception: Invalid or expired HMAC token." },
      { status: 403 }
    );
  }

  // 2. Load current live state
  const liveState = await getLiveState();
  if (!liveState || liveState.questionId !== questionId) {
    return NextResponse.json({ error: "This question is no longer active." }, { status: 410 });
  }

  // 3. Epoch guard — reject stale in-flight submissions from reset sessions
  if (clientEpoch !== undefined && liveState.epoch !== clientEpoch) {
    return NextResponse.json({ error: "STALE_SESSION: session was reset, submission rejected." }, { status: 409 });
  }

  // 4. Grace period check (1.5 s server-side tolerance for network latency)
  const nowServer = Date.now();
  const GRACE_MS = 1500;
  if (nowServer > liveState.endTime + GRACE_MS) {
    return NextResponse.json(
      { error: "Submission Rejected: question timer expired." },
      { status: 408 }
    );
  }

  // 5. Idempotent answered guard — BEFORE scoring
  //    SADD returns 0 if participantId already in the set → already answered
  const participantId = (participantHandle || participantName).toLowerCase().replace(/\s+/g, "_").replace(/^@/, "");
  const isFirstAnswer = await markAnswered(liveState.epoch, questionId, participantId);
  if (!isFirstAnswer) {
    return NextResponse.json(
      { error: "ALREADY_ANSWERED: duplicate submission for this question." },
      { status: 409 }
    );
  }

  // 6. Secure backend evaluation (correct answer never sent to client)
  let questions = await getTopicSequence(liveState.topicId);
  if (!questions?.length) {
    try {
      const doc = await sanityClient.fetch(
        `*[_type == "challengeQuiz" && (topic._ref == $topicId || _id == $topicId)][0]`,
        { topicId: liveState.topicId }
      );
      questions = doc?.questions || [];
      if (questions && questions.length) await cacheTopicSequence(liveState.topicId, questions);
    } catch {
      questions = [];
    }
  }

  let targetQuestion = questions?.find((q: any) => q._key === questionId || q._id === questionId);
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

  const correctOptionIndex = liveState.correctOptionIndex ?? targetQuestion?.correctOptionIndex ?? 0;
  const isCorrect = chosenOptionIndex === correctOptionIndex;

  // 7. Calculate points (speed bonus: 5 pts/second remaining)
  let pointsEarned = 0;
  if (isCorrect) {
    const difficulty = targetQuestion?.difficulty || liveState.difficulty || "MEDIUM";
    const basePoints = targetQuestion?.points || getDifficultyPoints(difficulty);
    const remainingSeconds = Math.max(0, Math.ceil((liveState.endTime - nowServer) / 1000));
    pointsEarned = basePoints + remainingSeconds * 5;
  }

  const handleTag = participantHandle?.startsWith("@")
    ? participantHandle
    : participantHandle
    ? `@${participantHandle}`
    : `@${participantName.toLowerCase().replace(/\s+/g, "_")}`;

  const timeSpentSeconds = Math.max(1, Math.round((nowServer - liveState.startTime) / 1000));

  // 8. Persist to ZSET leaderboard & accuracy hash
  await addScoreToLeaderboard(liveState.topicId, participantId, pointsEarned);
  const accuracy = await updateAccuracy(liveState.topicId, participantId, isCorrect);
  const newTotalScore = await getParticipantScore(liveState.topicId, participantId);

  // 9. Upsert participant metadata (name/handle lookup for leaderboard display)
  await upsertParticipantMeta({
    participantId,
    participantName,
    participantHandle: handleTag,
    lastActive: new Date().toISOString(),
  });

  // 10. Optional async Sanity CMS write
  try {
    if (process.env.SANITY_WRITE_TOKEN) {
      await sanityWriteClient.create({
        _type: "challengeSubmission",
        participantName,
        participantHandle: handleTag,
        score: pointsEarned,
        totalQuestions: 1,
        correctCount: isCorrect ? 1 : 0,
        timeSpentSeconds,
        completedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error("Sanity write for live submission failed:", err);
  }

  // 11. Return synchronous result — client updates score immediately from this response
  return NextResponse.json(
    {
      ok: true,
      correct: isCorrect,
      pointsAwarded: pointsEarned,
      correctOptionIndex,
      explanation: targetQuestion?.explanation || null,
      newTotalScore,
      accuracy: {
        correct: accuracy.correct,
        total: accuracy.total,
        pct: accuracy.total > 0 ? Math.round((accuracy.correct / accuracy.total) * 100) : 0,
      },
    },
    { status: 200 }
  );
}
