import crypto from "crypto";
import { Redis } from "@upstash/redis";
import { sanityClient } from "@/sanity/lib/client";

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

// Global In-Memory Store shared across all Next.js API routes
const globalForQuiz = globalThis as unknown as {
  _shegaQuizMemoryStore: Map<string, any>;
};

const memoryStore =
  globalForQuiz._shegaQuizMemoryStore ||
  (globalForQuiz._shegaQuizMemoryStore = new Map<string, any>());

// Project Key Prefix for Upstash Redis namespace isolation
const KEY_PREFIX = process.env.UPSTASH_REDIS_KEY_PREFIX || "shega:quiz:";

function formatKey(key: string): string {
  if (key.startsWith("shega:")) return key;
  return `${KEY_PREFIX}${key}`;
}

// Helper: Strict boolean parser for Redis REST string values ("true", "false", 1, 0, etc.)
export function parseBool(val: any, fallback: boolean = true): boolean {
  if (val === undefined || val === null) return fallback;
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val !== 0;
  if (typeof val === "string") {
    const clean = val.trim().toLowerCase();
    if (clean === "false" || clean === "0" || clean === "off" || clean === "no") return false;
    if (clean === "true" || clean === "1" || clean === "on" || clean === "yes") return true;
  }
  return Boolean(val);
}

async function getCache(key: string): Promise<any> {
  const fullKey = formatKey(key);
  if (redis) {
    try {
      const val = await redis.get(fullKey);
      if (val !== null && val !== undefined) {
        if (typeof val === "string") {
          const trimmed = val.trim();
          if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
            try {
              return JSON.parse(trimmed);
            } catch {
              // ignore parse failure and return raw string
            }
          }
        }
        return val;
      }
      return null;
    } catch (err) {
      console.warn(`Upstash Redis get error for key [${fullKey}]:`, err);
    }
  }
  return memoryStore.get(fullKey) ?? null;
}

async function setCache(key: string, value: any, ttlSeconds?: number): Promise<void> {
  const fullKey = formatKey(key);
  if (value === null || value === undefined) {
    memoryStore.delete(fullKey);
  } else {
    memoryStore.set(fullKey, value);
  }
  if (redis) {
    try {
      if (value === null || value === undefined) {
        await redis.del(fullKey);
      } else if (ttlSeconds) {
        await redis.set(fullKey, value, { ex: ttlSeconds });
      } else {
        await redis.set(fullKey, value);
      }
    } catch (err) {
      console.warn(`Upstash Redis set error for key [${fullKey}]:`, err);
    }
  }
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
    const a = Buffer.from(token);
    const b = Buffer.from(expectedToken);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(new Uint8Array(a), new Uint8Array(b));
  } catch {
    return false;
  }
}

// 2. Single-Submission Idempotency Lock (Upstash Redis SET NX)
export async function tryAcquireSubmissionLock(userId: string, questionId: string): Promise<boolean> {
  const lockKey = formatKey(`quiz:live:lock:${userId}:${questionId}`);
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
  correctOptionIndex?: number;
  explanation?: string;
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

// Session Reset Triggering
export async function triggerSessionReset(): Promise<void> {
  await setCache("quiz:live:session_reset_time", Date.now(), 30);
}

export async function getLastSessionResetTime(): Promise<number> {
  const time = await getCache("quiz:live:session_reset_time");
  return typeof time === "number" ? time : 0;
}

// 4. Solo Play Mode Toggle Cache & Admin Configurations
export async function getAllowSoloPlay(): Promise<boolean> {
  const res = await getCache("quiz:config:allow_solo_play");
  return parseBool(res, true); // Defaults to true unless explicitly toggled OFF
}

export async function setAllowSoloPlay(allow: boolean): Promise<void> {
  await setCache("quiz:config:allow_solo_play", parseBool(allow, true));
}

export interface LiveAdminConfig {
  timerDuration: number;
  autoPush: boolean;
  allowSoloPlay: boolean;
  selectedTopicId?: string;
}

export async function getLiveAdminConfig(): Promise<LiveAdminConfig> {
  const cached = await getCache("quiz:config:admin_settings");
  if (!cached) {
    return {
      timerDuration: 45,
      autoPush: false,
      allowSoloPlay: true,
      selectedTopicId: "all",
    };
  }
  return {
    timerDuration: Number(cached.timerDuration) || 45,
    autoPush: parseBool(cached.autoPush, false),
    allowSoloPlay: parseBool(cached.allowSoloPlay, true),
    selectedTopicId: cached.selectedTopicId || "all",
  };
}

export async function setLiveAdminConfig(config: Partial<LiveAdminConfig>): Promise<LiveAdminConfig> {
  const current = await getLiveAdminConfig();
  const updated: LiveAdminConfig = {
    ...current,
    ...(config.timerDuration !== undefined && { timerDuration: Number(config.timerDuration) }),
    ...(config.autoPush !== undefined && { autoPush: parseBool(config.autoPush, false) }),
    ...(config.allowSoloPlay !== undefined && { allowSoloPlay: parseBool(config.allowSoloPlay, true) }),
    ...(config.selectedTopicId !== undefined && { selectedTopicId: config.selectedTopicId }),
  };
  await setCache("quiz:config:admin_settings", updated);
  if (config.allowSoloPlay !== undefined) {
    await setAllowSoloPlay(config.allowSoloPlay);
  }
  return updated;
}

export async function getLiveQuestionQueue(): Promise<any[]> {
  const queue = await getCache("quiz:live:question_queue");
  return Array.isArray(queue) ? queue : [];
}

export async function setLiveQuestionQueue(queue: any[]): Promise<void> {
  await setCache("quiz:live:question_queue", queue || []);
}

// 5. Pre-Cache Topic Questions Sequence
export async function cacheTopicSequence(topicId: string, questions: any[]): Promise<void> {
  await setCache(`quiz:live:sequence:${topicId}`, questions, 86400); // 24 hours
}

export async function getTopicSequence(topicId: string): Promise<any[] | null> {
  return await getCache(`quiz:live:sequence:${topicId}`);
}

// 6. Robust Auto-Advance Question Engine (Triggers 5s Intermission + Auto-Pushes Question #orderIndex+1)
let isAdvancingLock = false;

export async function advanceToNextQuestion(currentState: LiveQuestionPayload): Promise<void> {
  if (!currentState || isAdvancingLock) return;
  isAdvancingLock = true;

  try {
    // Transition to 5-second Leaderboard Intermission Phase
    currentState.status = "INTERMISSION";
    await setLiveState(currentState);

    setTimeout(async () => {
      try {
        const nextIndex = (currentState.orderIndex || 1) + 1;
        let questions: any[] = (await getTopicSequence(currentState.topicId)) || [];
        
        if (!questions || questions.length === 0) {
          try {
            const doc = await sanityClient.fetch(
              `*[_type == "challengeQuiz" && (topic._ref == $topicId || _id == $topicId)][0]`,
              { topicId: currentState.topicId }
            );
            questions = doc?.questions || [];
            if (questions.length > 0) {
              await cacheTopicSequence(currentState.topicId, questions);
            }
          } catch {
            questions = [];
          }
        }

        if (questions && nextIndex <= questions.length) {
          const nextQ = questions.find((q: any) => q.orderIndex === nextIndex) || questions[nextIndex - 1];
          if (nextQ) {
            const durationSeconds = currentState.timerDuration || 45;
            const now = Date.now();
            const endTime = now + durationSeconds * 1000;
            const points = nextQ.points || getDifficultyPoints(nextQ.difficulty || "MEDIUM");
            const currentSoloState = await getAllowSoloPlay();

            await setLiveState({
              questionId: nextQ._key || nextQ._id || `q_${Date.now()}`,
              topicId: currentState.topicId,
              questionText: nextQ.questionText,
              questionType: nextQ.questionType || "MULTIPLE_CHOICE",
              codeSnippet: nextQ.codeSnippet,
              options: nextQ.options || [],
              difficulty: nextQ.difficulty || "MEDIUM",
              points,
              orderIndex: nextIndex,
              timerDuration: durationSeconds,
              startTime: now,
              endTime,
              isLocked: true,
              autoPush: true,
              allowSoloPlay: currentSoloState,
              status: "ACTIVE",
            });
          }
        } else {
          // All questions in sequence completed
          currentState.status = "COMPLETED";
          currentState.isLocked = false;
          await setLiveState(currentState);
        }
      } finally {
        isAdvancingLock = false;
      }
    }, 5000); // 5-second Leaderboard Intermission Phase
  } catch (err) {
    isAdvancingLock = false;
    console.error("Error in advanceToNextQuestion:", err);
  }
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

// 7. Real-Time Leaderboard Memory & Cache Engine
export interface LiveLeaderboardEntry {
  _id: string;
  participantName: string;
  participantHandle: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  completedAt: string;
  quizId?: string;
  quizTitle?: string;
}

export async function recordSubmission(submission: Partial<LiveLeaderboardEntry>): Promise<LiveLeaderboardEntry> {
  const currentLeaderboard: LiveLeaderboardEntry[] = (await getCache("quiz:live:leaderboard_entries")) || [];
  
  const existingIdx = currentLeaderboard.findIndex(
    (e) =>
      (e.participantHandle && submission.participantHandle && e.participantHandle.toLowerCase() === submission.participantHandle.toLowerCase()) ||
      (e.participantName && submission.participantName && e.participantName.toLowerCase() === submission.participantName.toLowerCase())
  );

  const entryId = submission._id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let entryToReturn: LiveLeaderboardEntry;

  if (existingIdx >= 0) {
    const existing = currentLeaderboard[existingIdx];
    const updatedScore = (existing.score || 0) + (submission.score || 0);
    const updatedCorrect = (existing.correctCount || 0) + (submission.correctCount || 0);
    const updatedTotal = (existing.totalQuestions || 0) + (submission.totalQuestions || 1);
    const updatedTime = (existing.timeSpentSeconds || 0) + (submission.timeSpentSeconds || 0);

    entryToReturn = {
      ...existing,
      score: updatedScore,
      correctCount: updatedCorrect,
      totalQuestions: updatedTotal,
      timeSpentSeconds: updatedTime,
      completedAt: new Date().toISOString(),
      quizId: submission.quizId || existing.quizId,
      quizTitle: submission.quizTitle || existing.quizTitle,
    };
    currentLeaderboard[existingIdx] = entryToReturn;
  } else {
    entryToReturn = {
      _id: entryId,
      participantName: submission.participantName || "Anonymous Student",
      participantHandle: submission.participantHandle || "@student",
      score: submission.score || 0,
      totalQuestions: submission.totalQuestions || 1,
      correctCount: submission.correctCount || 0,
      timeSpentSeconds: submission.timeSpentSeconds || 0,
      completedAt: new Date().toISOString(),
      quizId: submission.quizId,
      quizTitle: submission.quizTitle,
    };
    currentLeaderboard.push(entryToReturn);
  }

  currentLeaderboard.sort((a, b) => b.score - a.score);
  await setCache("quiz:live:leaderboard_entries", currentLeaderboard);
  return entryToReturn;
}

export async function getLiveLeaderboardStore(): Promise<LiveLeaderboardEntry[]> {
  const memoryLeaderboard: LiveLeaderboardEntry[] = (await getCache("quiz:live:leaderboard_entries")) || [];
  return memoryLeaderboard;
}

export async function clearLiveLeaderboardStore(): Promise<void> {
  await setCache("quiz:live:leaderboard_entries", []);
}

// 8. Participant Redis Session Management with 24-Hour TTL
export interface ParticipantSession {
  userId: string;
  playerName: string;
  playerHandle: string;
  lastActive: string;
}

export async function registerParticipantSession(session: ParticipantSession): Promise<void> {
  if (!session.userId) return;
  const sessionKey = `quiz:session:${session.userId}`;
  await setCache(sessionKey, session, 86400); // 24-hour TTL in Redis
}

export async function getParticipantSession(userId: string): Promise<ParticipantSession | null> {
  if (!userId) return null;
  const sessionKey = `quiz:session:${userId}`;
  return await getCache(sessionKey);
}
