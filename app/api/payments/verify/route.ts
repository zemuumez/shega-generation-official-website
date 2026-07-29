import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/sanity/lib/writeClient";
import { verifyChapaTransaction } from "@/lib/chapa";
import { verifyStripeSession } from "@/lib/stripe";
import { sendDonationReceiptEmail } from "@/lib/email";

export const runtime = "nodejs";

interface SanityDonationRecord {
  _id: string;
  txRef: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  gateway: string;
  status: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const txRef = searchParams.get("tx_ref");
  const gateway = searchParams.get("gateway") || "demo";
  const sessionId = searchParams.get("session_id");

  if (!txRef) {
    return NextResponse.json({ error: "Missing tx_ref parameter." }, { status: 400 });
  }

  // 1. Fetch matching donationRecord from Sanity
  let record: SanityDonationRecord | null = null;
  try {
    const query = `*[_type == "donationRecord" && txRef == $txRef][0]`;
    record = await sanityWriteClient.fetch(query, { txRef });
  } catch (err) {
    console.error("Sanity query error in verify endpoint:", err);
  }

  // If not found in Sanity yet, construct fallback from searchParams for display
  const currentRecord = record || {
    _id: "demo-id",
    txRef,
    donorName: searchParams.get("name") || "Valued Supporter",
    donorEmail: searchParams.get("email") || "supporter@example.com",
    amount: Number(searchParams.get("amount")) || 100,
    currency: searchParams.get("currency") || "ETB",
    gateway,
    status: "pending",
  };

  let isVerified = false;

  // 2. Perform verification based on gateway
  if (gateway === "chapa" && process.env.CHAPA_SECRET_KEY) {
    const verifyRes = await verifyChapaTransaction(txRef);
    if (verifyRes.status === "success" && verifyRes.data?.status === "success") {
      isVerified = true;
    }
  } else if (gateway === "stripe" && sessionId && process.env.STRIPE_SECRET_KEY) {
    const stripeRes = await verifyStripeSession(sessionId);
    if (stripeRes.paid) {
      isVerified = true;
    }
  } else {
    // Demo / Sandbox mode automatically completes
    isVerified = true;
  }

  // 3. Update record in Sanity & send email receipt if verified
  if (isVerified && currentRecord._id && currentRecord._id !== "demo-id") {
    try {
      await sanityWriteClient
        .patch(currentRecord._id)
        .set({ status: "success" })
        .commit();

      // Trigger receipt email
      sendDonationReceiptEmail({
        to: currentRecord.donorEmail,
        name: currentRecord.donorName,
        amount: currentRecord.amount,
        currency: currentRecord.currency,
        txRef: currentRecord.txRef,
        gateway: currentRecord.gateway,
      }).catch((emailErr) => {
        console.error("Failed sending donation receipt email:", emailErr);
      });
    } catch (updateErr) {
      console.error("Failed to patch Sanity record status:", updateErr);
    }
  }

  return NextResponse.json({
    ok: true,
    verified: isVerified,
    record: {
      txRef: currentRecord.txRef,
      donorName: currentRecord.donorName,
      amount: currentRecord.amount,
      currency: currentRecord.currency,
      gateway: currentRecord.gateway,
      status: isVerified ? "success" : "pending",
    },
  });
}
