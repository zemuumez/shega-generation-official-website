import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  verifyQuestionToken,
  tryAcquireSubmissionLock,
  getLiveState,
  getTopicSequence,
  getDifficultyPoints,
  recordSubmission,
  registerParticipantSession,
} from "@/lib/quizLiveEngine";
import { sanityClient } from "@/sanity/lib/client";
import { sanityWriteClient } from "@/sanity/lib/writeClient";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const SubmitSchema = z.object({
  userId: z.string().min(1, "userId required"),
  participantName: z.string().trim().min(2, "Name required").max(100),
  participantHandle: z.string().trim().max(50).optional().default(""),
  questionId: z.string().min(1, "questionId required"),
  chosenOptionIndex: z.number().min(0).max(5),
  token: z.string().min(1, "HMAC token required"),
  tokenExpiry: z.number().min(1, "tokenExpiry required"),
});

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  // Rate limiting check
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

  const { userId, participantName, participantHandle, questionId, chosenOptionIndex, token, tokenExpiry } =
    parsed.data;

  // 1. Verify HMAC Token Signature & Expiry
  const isTokenValid = verifyQuestionToken(token, userId, questionId, tokenExpiry);
  if (!isTokenValid) {
    return NextResponse.json(
      { error: "Security Exception: Invalid or expired HMAC payload token signature." },
      { status: 403 }
    );
  }

  // 2. Single-Submission Idempotency Lock
  const lockAcquired = await tryAcquireSubmissionLock(userId, questionId);
  if (!lockAcquired) {
    return NextResponse.json(
      { error: "Idempotency Lock: Duplicate submission detected for this question." },
      { status: 409 }
    );
  }

  // 3. Server-Side Timestamp Calculation & 1.5s Network Latency Grace Period
  const liveState = await getLiveState();
  if (!liveState || liveState.questionId !== questionId) {
    return NextResponse.json({ error: "This question is no longer active for submission." }, { status: 410 });
  }

  const nowServer = Date.now();
  const GRACE_PERIOD_MS = 1500; // 1.5 seconds network latency grace period
  if (nowServer > liveState.endTime + GRACE_PERIOD_MS) {
    return NextResponse.json(
      { error: "Submission Rejected: Question timer expired beyond the 1.5s server grace period." },
      { status: 408 }
    );
  }

  // 4. Secure Backend Evaluation (Zero-Leak Security)
  let questions = await getTopicSequence(liveState.topicId);
  if (!questions || questions.length === 0) {
    try {
      const doc = await sanityClient.fetch(
        `*[_type == "challengeQuiz" && (topic._ref == $topicId || _id == $topicId)][0]`,
        { topicId: liveState.topicId }
      );
      questions = doc?.questions || [];
    } catch {
      questions = [];
    }
  }

  let targetQuestion = questions?.find((q: any) => q._key === questionId || q._id === questionId);
  if (!targetQuestion && questionId) {
    try {
      const doc = await sanityClient.fetch(
        `*[_type == "challengeQuiz" && (questions[]._key == $qId || questions[]._id == $qId)][0]`,
        { qId: questionId }
      );
      if (doc?.questions) {
        targetQuestion = doc.questions.find((q: any) => q._key === questionId || q._id === questionId);
      }
    } catch {
      // ignore
    }
  }

  const correctOptionIndex = liveState.correctOptionIndex ?? targetQuestion?.correctOptionIndex ?? 0;
  const isCorrect = chosenOptionIndex === correctOptionIndex;

  let pointsEarned = 0;
  if (isCorrect) {
    const difficulty = targetQuestion?.difficulty || liveState.difficulty || "MEDIUM";
    const basePoints = targetQuestion?.points || getDifficultyPoints(difficulty);
    const remainingSeconds = Math.max(0, Math.ceil((liveState.endTime - nowServer) / 1000));
    const speedBonus = remainingSeconds * 5; // 5 bonus pts per second remaining
    pointsEarned = basePoints + speedBonus;
  }

  const handleTag = participantHandle?.startsWith("@")
    ? participantHandle
    : participantHandle
    ? `@${participantHandle}`
    : `@${participantName.toLowerCase().replace(/\s+/g, "_")}`;

  const timeSpentSeconds = Math.max(1, Math.round((nowServer - liveState.startTime) / 1000));

  // 5. Persist submission to real-time memory/Redis store & refresh 24h Redis Session
  await recordSubmission({
    participantName,
    participantHandle: handleTag,
    score: pointsEarned,
    totalQuestions: 1,
    correctCount: isCorrect ? 1 : 0,
    timeSpentSeconds,
    quizId: liveState.topicId,
  });

  await registerParticipantSession({
    userId,
    playerName: participantName,
    playerHandle: handleTag,
    lastActive: new Date().toISOString(),
  });

  // 6. Optional async sync to Sanity CMS if write token is configured
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

  return NextResponse.json(
    {
      ok: true,
      isCorrect,
      pointsEarned,
      message: isCorrect ? "Correct answer!" : "Incorrect answer.",
      explanation: isCorrect ? targetQuestion?.explanation || undefined : undefined,
    },
    { status: 200 }
  );
}
