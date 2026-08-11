import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/sanity/lib/writeClient";
import { sendDonationReceiptEmail } from "@/lib/email";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const chapaSignature = req.headers.get("x-chapa-signature");
  const stripeSignature = req.headers.get("stripe-signature");

  const rawBody = await req.text();
  let eventData: Record<string, unknown> = {};

  try {
    eventData = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload JSON." }, { status: 400 });
  }

  // Handle Chapa Webhook Signature Verification
  if (chapaSignature && process.env.CHAPA_WEBHOOK_SECRET) {
    const hash = crypto
      .createHmac("sha256", process.env.CHAPA_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (hash !== chapaSignature) {
      return NextResponse.json({ error: "Invalid Chapa signature." }, { status: 401 });
    }
  }

  // Extract transaction reference and status
  let txRef: string | null = null;
  let isSuccessful = false;

  // Chapa webhook structure
  if (eventData.tx_ref && typeof eventData.tx_ref === "string") {
    txRef = eventData.tx_ref;
    isSuccessful = eventData.status === "success";
  }

  // Stripe webhook structure
  if (eventData.type === "checkout.session.completed") {
    const eventObj = (eventData.data as { object?: Record<string, unknown> })?.object;
    if (eventObj && eventObj.client_reference_id) {
      txRef = String(eventObj.client_reference_id);
      isSuccessful = eventObj.payment_status === "paid";
    }
  }

  if (!txRef) {
    return NextResponse.json({ received: true, note: "No action required, tx_ref missing." });
  }

  // Update Sanity record
  try {
    const query = `*[_type == "donationRecord" && txRef == $txRef][0]`;
    const record = await sanityWriteClient.fetch(query, { txRef });

    if (record) {
      const newStatus = isSuccessful ? "success" : "failed";
      await sanityWriteClient.patch(record._id).set({ status: newStatus }).commit();

      if (isSuccessful) {
        sendDonationReceiptEmail({
          to: record.donorEmail,
          name: record.donorName,
          amount: record.amount,
          currency: record.currency,
          txRef: record.txRef,
          gateway: record.gateway,
        }).catch((err) => console.error("Webhook email failed:", err));
      }
    }
  } catch (err) {
    console.error("Error processing webhook in Sanity:", err);
  }

  return NextResponse.json({ received: true, status: isSuccessful ? "success" : "failed" });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
