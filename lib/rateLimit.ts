import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 5 submissions per IP per hour. Onboarding applications are a low-frequency
// action for a real applicant; anything past this rate is either a bug in
// the client or an abuse attempt, and either way it should be blocked
// rather than silently accepted.
let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "shega:onboarding",
  });
  return ratelimit;
}

export async function checkRateLimit(identifier: string): Promise<{ allowed: boolean; remaining: number }> {
  const limiter = getRatelimit();
  if (!limiter) {
    // No Redis configured. Fail open only in local development so you can
    // test the form; fail closed everywhere else. Do not remove this
    // distinction, unlimited-traffic-by-default is how the endpoint gets
    // used as a spam cannon in production.
    if (process.env.NODE_ENV === "development") return { allowed: true, remaining: 1 };
    return { allowed: false, remaining: 0 };
  }

  const { success, remaining } = await limiter.limit(identifier);
  return { allowed: success, remaining };
}
