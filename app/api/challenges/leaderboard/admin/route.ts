import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { sanityWriteClient } from "@/sanity/lib/writeClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "export";

  if (action === "export") {
    let entries: any[] = [];
    try {
      entries = await sanityClient.fetch(
        `*[_type == "challengeSubmission"] | order(score desc) {
          _id,
          participantName,
          participantHandle,
          score,
          totalQuestions,
          correctCount,
          timeSpentSeconds,
          completedAt
        }`
      );
    } catch {
      entries = [];
    }

    if (!entries) {
      entries = [];
    }

    // Generate CSV String with UTF-8 BOM (\uFEFF) for Amharic encoding support in Excel / Sheets
    let csvContent = "\uFEFF";
    csvContent += "Rank,Participant Name,Handle,Score (Pts),Correct Answers,Total Questions,Accuracy (%),Time Spent (s),Completed Date\n";

    entries.forEach((item, idx) => {
      const rank = idx + 1;
      const name = `"${(item.participantName || "Anonymous").replace(/"/g, '""')}"`;
      const handle = `"${(item.participantHandle || "").replace(/"/g, '""')}"`;
      const score = item.score || 0;
      const correct = item.correctCount || 0;
      const total = item.totalQuestions || 20;
      const accuracyPct = Math.round((correct / (total || 1)) * 100);
      const timeSpent = item.timeSpentSeconds || 0;
      const date = item.completedAt ? `"${new Date(item.completedAt).toISOString()}"` : `""`;

      csvContent += `${rank},${name},${handle},${score},${correct},${total},${accuracyPct}%,${timeSpent},${date}\n`;
    });

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="shega_leaderboard_export_${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({ error: "Invalid action parameter." }, { status: 400 });
}

export async function DELETE() {
  try {
    if (process.env.SANITY_WRITE_TOKEN) {
      // Query all submission document IDs
      const submissions = await sanityClient.fetch(`*[_type == "challengeSubmission"]._id`);
      if (submissions && submissions.length > 0) {
        const tx = sanityWriteClient.transaction();
        submissions.forEach((id: string) => tx.delete(id));
        await tx.commit();
      }
    }
    return NextResponse.json({ ok: true, message: "Leaderboard cleared successfully." });
  } catch (err) {
    console.error("Failed to clear leaderboard entries:", err);
    return NextResponse.json({ error: "Failed to reset leaderboard." }, { status: 500 });
  }
}
