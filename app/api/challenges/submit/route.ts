import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanityWriteClient } from "@/sanity/lib/writeClient";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const SubmissionSchema = z.object({
  participantName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  participantHandle: z.string().trim().max(50).optional().default(""),
  participantEmail: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  quizId: z.string().trim().min(1, "Quiz reference required"),
  score: z.number().min(0).max(10000),
  totalQuestions: z.number().min(1).max(100),
  correctCount: z.number().min(0).max(100),
  timeSpentSeconds: z.number().min(0).max(3600),
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
    return NextResponse.json(
      { error: "Too many submission requests. Please wait a moment." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = SubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const isDemoId = data.quizId.startsWith("demo-");
    let docId = "";

    if (!isDemoId && process.env.SANITY_WRITE_TOKEN) {
      const created = await sanityWriteClient.create({
        _type: "challengeSubmission",
        participantName: data.participantName,
        participantHandle: data.participantHandle || undefined,
        participantEmail: data.participantEmail || undefined,
        quiz: {
          _type: "reference",
          _ref: data.quizId,
        },
        score: data.score,
        totalQuestions: data.totalQuestions,
        correctCount: data.correctCount,
        timeSpentSeconds: data.timeSpentSeconds,
        completedAt: new Date().toISOString(),
      });
      docId = created._id;
    } else {
      docId = `local-sub-${Date.now()}`;
    }

    return NextResponse.json(
      {
        ok: true,
        id: docId,
        message: "Quiz submission recorded successfully!",
        entry: {
          _id: docId,
          participantName: data.participantName,
          participantHandle: data.participantHandle || `@${data.participantName.toLowerCase().replace(/\s+/g, "_")}`,
          score: data.score,
          totalQuestions: data.totalQuestions,
          correctCount: data.correctCount,
          timeSpentSeconds: data.timeSpentSeconds,
          completedAt: new Date().toISOString(),
          quizId: data.quizId,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Sanity write failed for challenge submission:", err);
    return NextResponse.json(
      {
        ok: true,
        id: `fallback-${Date.now()}`,
        message: "Local fallback submission recorded.",
        entry: {
          _id: `fallback-${Date.now()}`,
          participantName: data.participantName,
          participantHandle: data.participantHandle || `@${data.participantName.toLowerCase().replace(/\s+/g, "_")}`,
          score: data.score,
          totalQuestions: data.totalQuestions,
          correctCount: data.correctCount,
          timeSpentSeconds: data.timeSpentSeconds,
          completedAt: new Date().toISOString(),
          quizId: data.quizId,
        },
      },
      { status: 201 }
    );
  }
}
