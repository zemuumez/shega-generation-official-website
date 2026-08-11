import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  verifyAdminPassword,
  getAdminPasswordHash,
  changeAdminPassword,
  generateAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/quizLiveEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AuthSchema = z.object({
  action: z.enum(["LOGIN", "CHANGE_PASSWORD", "VERIFY"]),
  password: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  token: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = AuthSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const { action, password, currentPassword, newPassword, token } = parsed.data;

  // 1. LOGIN
  if (action === "LOGIN") {
    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }
    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
    }
    const pwdHash = await getAdminPasswordHash();
    const now = Date.now();
    const sessionToken = generateAdminSessionToken(pwdHash, now);
    return NextResponse.json({
      ok: true,
      token: sessionToken,
      message: "Admin authenticated successfully.",
    });
  }

  // 2. VERIFY TOKEN
  if (action === "VERIFY") {
    const tokenToVerify = token || req.headers.get("x-admin-token") || req.headers.get("authorization") || "";
    const isValid = await verifyAdminSessionToken(tokenToVerify);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired session token." }, { status: 401 });
    }
    return NextResponse.json({ ok: true, valid: true });
  }

  // 3. CHANGE PASSWORD
  if (action === "CHANGE_PASSWORD") {
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both currentPassword and newPassword are required." },
        { status: 400 }
      );
    }
    const result = await changeAdminPassword(currentPassword, newPassword);
    if (!result.ok) {
      return NextResponse.json({ error: result.error || "Password update failed." }, { status: 400 });
    }
    // Issue a new token with the updated password hash
    const newPwdHash = await getAdminPasswordHash();
    const now = Date.now();
    const newSessionToken = generateAdminSessionToken(newPwdHash, now);
    return NextResponse.json({
      ok: true,
      token: newSessionToken,
      message: "Admin password updated successfully.",
    });
  }

  return NextResponse.json({ error: "Invalid auth action." }, { status: 400 });
}
