import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanityWriteClient } from "@/sanity/lib/writeClient";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendDiagnosticEmail } from "@/lib/email";

export const runtime = "nodejs";

const ETHIOPIAN_REGIONS = [
  "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa", "Gambela",
  "Harari", "Oromia", "Sidama", "Somali", "South Ethiopia",
  "South West Ethiopia Peoples'", "Tigray", "Central Ethiopia",
] as const;

const PRIMARY_INTERESTS = [
  "AI/ML", "Web Development", "Mobile Development", "DevOps", "Life Skills", "Indigenous Knowledge",
] as const;

// Every field is validated server-side regardless of what client-side
// validation exists, because client-side validation is a UX nicety, not
// a security boundary.
const ApplicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,15}$/, "Invalid phone number"),
  region: z.enum(ETHIOPIAN_REGIONS),
  primaryInterest: z.enum(PRIMARY_INTERESTS),
  preferredLocale: z.enum(["am", "en", "om", "ti"]).default("am"),
  personalSummary: z.string().trim().max(2000).optional().default(""),
  // Honeypot: a real applicant never fills this hidden field. Any value
  // here means a bot filled every field on the form indiscriminately.
  website: z.string().max(0, "Bot detected").optional().default(""),
});

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  // 1. Rate limit before touching the body. A flood of requests should
  //    never even reach JSON parsing or Sanity.
  const ip = getClientIp(req);
  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many applications from this address. Try again later." },
      { status: 429 }
    );
  }

  // 2. Parse and validate. Malformed JSON or a schema mismatch both
  //    return 400 with no internal detail leaked to the client.
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ApplicationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { website, ...data } = parsed.data;
  if (website.length > 0) {
    // Honeypot tripped. Respond as if it succeeded so the bot doesn't
    // learn its submission was flagged, but never write anything.
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // 3. Persist via the write-scoped client. This token can only create
  //    studentApplication documents, see sanity/lib/writeClient.ts.
  let created;
  try {
    created = await sanityWriteClient.create({
      _type: "studentApplication",
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      region: data.region,
      primaryInterest: data.primaryInterest,
      preferredLocale: data.preferredLocale,
      personalSummary: data.personalSummary,
      assessmentStatus: "Pending",
    });
  } catch (err) {
    console.error("Sanity write failed:", err);
    return NextResponse.json(
      { error: "Could not save your application. Please try again shortly." },
      { status: 502 }
    );
  }

  // 4. Fire the diagnostic email asynchronously. Its failure is logged
  //    but never rolls back the application, which has already been
  //    saved with assessmentStatus "Pending" and can be resent manually
  //    from Sanity Studio if delivery fails.
  sendDiagnosticEmail({
    to: data.email,
    name: data.fullName,
    locale: data.preferredLocale,
  }).catch((err) => {
    console.error("Diagnostic email failed to send for application", created._id, err);
  });

  return NextResponse.json({ ok: true, id: created._id }, { status: 201 });
}

// Only POST is supported. Every other method is rejected explicitly
// rather than falling through to a default 404 that leaks less
// information about intent.
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
