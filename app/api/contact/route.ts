import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanityWriteClient } from "@/sanity/lib/writeClient";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const ContactSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Invalid email address").max(254),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(4000),
  // Honeypot field
  website: z.string().max(0).optional().default(""),
});

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const ip = getClientIp(req);
  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages sent from this IP address. Please try again later." },
      { status: 429 }
    );
  }

  // 2. Parse payload
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { website, ...data } = parsed.data;

  // Honeypot check
  if (website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // 3. Persist message in Sanity CMS
  try {
    const created = await sanityWriteClient.create({
      _type: "contactMessage",
      fullName: data.fullName,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: "New",
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, id: created._id }, { status: 201 });
  } catch (err) {
    console.error("Sanity write failed for contact message:", err);
    return NextResponse.json(
      { error: "Failed to store message. Please try again shortly." },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
