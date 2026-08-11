import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { LEADERBOARD_QUERY } from "@/sanity/lib/queries";
import { getLiveLeaderboardStore } from "@/lib/quizLiveEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const quizId = url.searchParams.get("quizId");

    let sanityEntries: any[] = [];
    try {
      sanityEntries = await sanityClient.fetch(LEADERBOARD_QUERY);
    } catch {
      sanityEntries = [];
    }

    if (!sanityEntries) {
      sanityEntries = [];
    }

    const liveEntries = await getLiveLeaderboardStore();

    // Merge Sanity CMS and live memory/Redis entries by participant handle or name
    // liveEntries comes SECOND so active real-time updates overwrite stale CMS records
    const mergedMap = new Map<string, any>();

    for (const item of [...sanityEntries, ...liveEntries]) {
      const handleKey = (item.participantHandle || "").toLowerCase();
      const nameKey = (item.participantName || "").toLowerCase();
      const key = handleKey || nameKey;
      if (!key) continue;

      mergedMap.set(key, item);
    }

    let entries = Array.from(mergedMap.values());

    if (quizId && quizId !== "all") {
      const target = quizId.toLowerCase().replace(/-/g, " ").trim();
      entries = entries.filter((item) => {
        if (!item.quizId && !item.quizTitle) return true;
        const qId = (item.quizId || "").toLowerCase().replace(/-/g, " ").trim();
        const qTitle = (item.quizTitle || "").toLowerCase().replace(/-/g, " ").trim();
        return qId === target || qTitle === target || qId.includes(target) || target.includes(qId) || qTitle.includes(target) || target.includes(qTitle);
      });
    }

    // Sort by score DESC, then timeSpentSeconds ASC
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.timeSpentSeconds || 0) - (b.timeSpentSeconds || 0);
    });

    return NextResponse.json({ ok: true, leaderboard: entries }, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    return NextResponse.json({ ok: true, leaderboard: [] }, { status: 200 });
  }
}
