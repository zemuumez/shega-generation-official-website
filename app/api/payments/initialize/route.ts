import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/sanity/lib/writeClient";
import { checkRateLimit } from "@/lib/rateLimit";
import { InitializePaymentSchema } from "@/lib/paymentValidation";
import { isChapaConfigured, initializeChapaTransaction } from "@/lib/chapa";
import { isStripeConfigured, initializeStripeCheckout } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  // 1. Rate limiting check
  const ip = getClientIp(req);
  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many payment initialization attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  // 2. Parse and validate payload
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = InitializePaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { website, donorName, donorEmail, amount, currency, paymentMethod, isAnonymous, message } = parsed.data;

  // 3. Honeypot check
  if (website && website.length > 0) {
    return NextResponse.json(
      { ok: true, isDemo: true, checkoutUrl: "/donate/success?tx_ref=SG-BOT-DETECTED&gateway=demo", txRef: "SG-BOT-DETECTED" },
      { status: 200 }
    );
  }

  const txRef = `SG-DON-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  // Determine gateway based on currency & availability
  const isChapaAvailable = isChapaConfigured();
  const isStripeAvailable = isStripeConfigured();

  let targetGateway: "chapa" | "stripe" | "demo" = "demo";
  if (currency === "ETB") {
    targetGateway = isChapaAvailable ? "chapa" : "demo";
  } else if (currency === "USD") {
    targetGateway = isStripeAvailable ? "stripe" : "demo";
  }

  // 4. Record draft donation in Sanity
  try {
    await sanityWriteClient.create({
      _type: "donationRecord",
      txRef,
      donorName: isAnonymous ? "Anonymous Donor" : donorName,
      donorEmail,
      amount,
      currency,
      gateway: targetGateway,
      paymentMethod,
      status: targetGateway === "demo" ? "pending" : "pending",
      isAnonymous: Boolean(isAnonymous),
      message: message || "",
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to write draft donationRecord to Sanity:", err);
  }

  // 5. Route to payment provider or Sandbox fallback
  if (targetGateway === "chapa") {
    const nameParts = donorName.split(" ");
    const firstName = nameParts[0] || "Donor";
    const lastName = nameParts.slice(1).join(" ") || "Supporter";

    const chapaRes = await initializeChapaTransaction({
      amount,
      currency: "ETB",
      email: donorEmail,
      firstName,
      lastName,
      txRef,
      title: "Shega Generations Talent Fund",
      description: `Donation by ${donorName}`,
    });

    if (chapaRes.status === "success" && chapaRes.checkoutUrl) {
      return NextResponse.json({
        ok: true,
        isDemo: false,
        gateway: "chapa",
        checkoutUrl: chapaRes.checkoutUrl,
        txRef,
      });
    }

    // Fallback to demo if API call fails
    return NextResponse.json({
      ok: true,
      isDemo: true,
      gateway: "demo",
      message: chapaRes.message,
      checkoutUrl: `/donate/success?tx_ref=${encodeURIComponent(txRef)}&gateway=demo`,
      txRef,
    });
  }

  if (targetGateway === "stripe") {
    const stripeRes = await initializeStripeCheckout({
      amount,
      currency: "USD",
      email: donorEmail,
      donorName,
      txRef,
    });

    if (stripeRes.status === "success" && stripeRes.checkoutUrl) {
      return NextResponse.json({
        ok: true,
        isDemo: false,
        gateway: "stripe",
        checkoutUrl: stripeRes.checkoutUrl,
        txRef,
      });
    }

    return NextResponse.json({
      ok: true,
      isDemo: true,
      gateway: "demo",
      message: stripeRes.message,
      checkoutUrl: `/donate/success?tx_ref=${encodeURIComponent(txRef)}&gateway=demo`,
      txRef,
    });
  }

  // Demo / Sandbox mode fallback
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const demoSuccessUrl = `${appUrl}/donate/success?tx_ref=${encodeURIComponent(txRef)}&gateway=demo&amount=${amount}&currency=${currency}`;

  return NextResponse.json({
    ok: true,
    isDemo: true,
    gateway: "demo",
    checkoutUrl: demoSuccessUrl,
    txRef,
  });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
