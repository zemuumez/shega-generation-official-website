import crypto from "crypto";
import { Redis } from "@upstash/redis";

const SECRET_KEY = process.env.QUIZ_HMAC_SECRET || "shega-generation-live-quiz-secret-2026";

// Initialize Upstash Redis if environment variables exist, else local in-memory fallback
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = Redis.fromEnv();
  } catch (err) {
    console.warn("Upstash Redis init failed, using memory fallback:", err);
  }
}

// In-Memory Fallback Store for local dev when Redis env is omitted
const memoryStore = new Map<string, any>();

async function getCache(key: string): Promise<any> {
  if (redis) {
    try {
      return await redis.get(key);
    } catch {
      // fallback
    }
  }
  return memoryStore.get(key) ?? null;
}

async function setCache(key: string, value: any, ttlSeconds?: number): Promise<void> {
  if (redis) {
    try {
      if (ttlSeconds) {
        await redis.set(key, value, { ex: ttlSeconds });
      } else {
        await redis.set(key, value);
      }
      return;
    } catch {
      // fallback
    }
  }
  memoryStore.set(key, value);
}

// 1. HMAC Token Generator & Verifier
export function generateQuestionToken(userId: string, questionId: string, expiryTimestamp: number): string {
  const payload = `${userId}:${questionId}:${expiryTimestamp}`;
  return crypto.createHmac("sha256", SECRET_KEY).update(payload).digest("hex");
}

export function verifyQuestionToken(
  token: string,
  userId: string,
  questionId: string,
  expiryTimestamp: number
): boolean {
  if (!token || !userId || !questionId || !expiryTimestamp) return false;
  
  // Check token expiry
  if (Date.now() > expiryTimestamp) {
    return false;
  }

  const expectedToken = generateQuestionToken(userId, questionId, expiryTimestamp);
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
  } catch {
    return false;
  }
}

// 2. Single-Submission Idempotency Lock (Upstash Redis SET NX)
export async function tryAcquireSubmissionLock(userId: string, questionId: string): Promise<boolean> {
  const lockKey = `quiz:live:lock:${userId}:${questionId}`;
  if (redis) {
    try {
      const res = await redis.set(lockKey, "LOCKED", { nx: true, ex: 60 });
      return res === "OK";
    } catch {
      // fallback
    }
  }

  if (memoryStore.has(lockKey)) {
    return false;
  }
  memoryStore.set(lockKey, true);
  setTimeout(() => memoryStore.delete(lockKey), 60000);
  return true;
}

export interface LiveQuestionPayload {
  questionId: string;
  topicId: string;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  codeSnippet?: string;
  options: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
  orderIndex: number;
  timerDuration: number; // default 45s
  startTime: number;
  endTime: number;
  isLocked: boolean;
  autoPush: boolean;
  allowSoloPlay?: boolean;
  status: "IDLE" | "ACTIVE" | "INTERMISSION" | "EXPIRED" | "COMPLETED";
}

// 3. Get / Set Live Broadcast State
export async function getLiveState(): Promise<LiveQuestionPayload | null> {
  return await getCache("quiz:live:active_state");
}

export async function setLiveState(state: LiveQuestionPayload | null): Promise<void> {
  await setCache("quiz:live:active_state", state);
}

// 4. Solo Play Mode Toggle Cache
export async function getAllowSoloPlay(): Promise<boolean> {
  const res = await getCache("quiz:config:allow_solo_play");
  return res !== false; // Defaults to true unless explicitly toggled OFF
}

export async function setAllowSoloPlay(allow: boolean): Promise<void> {
  await setCache("quiz:config:allow_solo_play", allow);
}

// 5. Pre-Cache Topic Questions Sequence
export async function cacheTopicSequence(topicId: string, questions: any[]): Promise<void> {
  await setCache(`quiz:live:sequence:${topicId}`, questions, 86400); // 24 hours
}

export async function getTopicSequence(topicId: string): Promise<any[] | null> {
  return await getCache(`quiz:live:sequence:${topicId}`);
}

// Helper: Calculate points by difficulty
export function getDifficultyPoints(difficulty: string): number {
  switch (difficulty?.toUpperCase()) {
    case "EASY":
      return 100;
    case "HARD":
      return 400;
    case "MEDIUM":
    default:
      return 200;
  }
}
