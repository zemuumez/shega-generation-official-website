import { NextRequest, NextResponse } from "next/server";
import { getTopicLeaderboard, getParticipantMeta, getAccuracy } from "@/lib/quizLiveEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const topicId = url.searchParams.get("quizId") || url.searchParams.get("topicId");

    if (!topicId || topicId === "all") {
      return NextResponse.json({ ok: true, leaderboard: [] }, { status: 200 });
    }

    // ZSET gives us ranked order for free — no manual sorting needed
    const ranked = await getTopicLeaderboard(topicId);

    // Hydrate with participant metadata (name, handle) and accuracy
    const leaderboard = await Promise.all(
      ranked.map(async ({ participantId, score }, index) => {
        const meta = await getParticipantMeta(participantId);
        const accuracy = await getAccuracy(topicId, participantId);
        return {
          _id: participantId,
          rank: index + 1,
          participantId,
          participantName: meta?.participantName || participantId,
          participantHandle: meta?.participantHandle || `@${participantId}`,
          score,
          correctCount: accuracy.correct,
          totalQuestions: accuracy.total,
          accuracy: accuracy.total > 0 ? Math.round((accuracy.correct / accuracy.total) * 100) : 0,
          quizId: topicId,
        };
      })
    );

    return NextResponse.json({ ok: true, leaderboard }, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    return NextResponse.json({ ok: true, leaderboard: [] }, { status: 200 });
  }
}
