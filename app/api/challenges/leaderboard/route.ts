import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { LEADERBOARD_QUERY } from "@/sanity/lib/queries";
import { demoLeaderboard } from "@/lib/demoData";

export const runtime = "nodejs";
export const revalidate = 10;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const quizId = url.searchParams.get("quizId");

    let entries: any[] = [];
    try {
      entries = await sanityClient.fetch(LEADERBOARD_QUERY);
    } catch {
      entries = [];
    }

    if (!entries || entries.length === 0) {
      entries = demoLeaderboard;
    }

    if (quizId && quizId !== "all") {
      entries = entries.filter((item) => item.quizId === quizId || item.quizTitle === quizId);
    }

    // Sort by score DESC, then timeSpentSeconds ASC
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.timeSpentSeconds || 0) - (b.timeSpentSeconds || 0);
    });

    return NextResponse.json({ ok: true, leaderboard: entries }, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    return NextResponse.json({ ok: true, leaderboard: demoLeaderboard }, { status: 200 });
  }
}
