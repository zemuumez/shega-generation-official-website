import crypto from "crypto";
import { Redis } from "@upstash/redis";
import { sanityClient } from "@/sanity/lib/client";

const SECRET_KEY = process.env.QUIZ_HMAC_SECRET || "shega-generation-live-quiz-secret-2026";

// ---------------------------------------------------------------------------
// Redis init & in-memory fallback
// ---------------------------------------------------------------------------
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = Redis.fromEnv();
  } catch (err) {
    console.warn("Upstash Redis init failed, using memory fallback:", err);
  }
}

// Global in-memory store shared across hot-reload cycles in Next.js dev
const globalForQuiz = globalThis as unknown as {
  _shegaQuizMemoryStore: Map<string, any>;
};
const memoryStore =
  globalForQuiz._shegaQuizMemoryStore ||
  (globalForQuiz._shegaQuizMemoryStore = new Map<string, any>());

// ---------------------------------------------------------------------------
// Key-prefix convention
// All keys in this project live under "shega:quiz:" — one clean namespace, no
// double-nesting. formatKey() adds the prefix only when it isn't already there.
// ---------------------------------------------------------------------------
const KEY_PREFIX = "shega:quiz:";

function k(key: string): string {
  if (key.startsWith(KEY_PREFIX)) return key;
  return `${KEY_PREFIX}${key}`;
}

// ---------------------------------------------------------------------------
// Short-term read cache (1.5 s) — slashes Upstash REST requests by ~99 %
// ---------------------------------------------------------------------------
const shortTermCache = new Map<string, { val: any; expiry: number }>();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function parseBool(val: any, fallback: boolean = true): boolean {
  if (val === undefined || val === null) return fallback;
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val !== 0;
  if (typeof val === "string") {
    const c = val.trim().toLowerCase();
    if (c === "false" || c === "0" || c === "off" || c === "no") return false;
    if (c === "true" || c === "1" || c === "on" || c === "yes") return true;
  }
  return Boolean(val);
}

function tryParseJSON(raw: any): any {
  if (typeof raw !== "string") return raw;
  const t = raw.trim();
  if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
    try { return JSON.parse(t); } catch { /* ignore */ }
  }
  return raw;
}

export function getDifficultyPoints(difficulty: string): number {
  switch (difficulty?.toUpperCase()) {
    case "EASY": return 100;
    case "HARD": return 400;
    default: return 200;
  }
}

// ---------------------------------------------------------------------------
// Low-level cache GET / SET (Redis-first, memory fallback)
// ---------------------------------------------------------------------------
async function getCache(key: string): Promise<any> {
  const fk = k(key);
  const now = Date.now();
  const cached = shortTermCache.get(fk);
  if (cached && now < cached.expiry) return cached.val;

  if (redis) {
    try {
      let val = await redis.get(fk);
      if (val !== null && val !== undefined) {
        val = tryParseJSON(val);
        memoryStore.set(fk, val);
        shortTermCache.set(fk, { val, expiry: now + 1500 });
        return val;
      }
      return null; // key absent in Redis → don't fall through to stale memory
    } catch (err) {
      console.warn(`Redis get error [${fk}]:`, err);
      // fall through to memory on quota/network error
    }
  }
  return memoryStore.get(fk) ?? null;
}

async function setCache(key: string, value: any, ttlSeconds?: number): Promise<void> {
  const fk = k(key);
  const now = Date.now();

  if (value === null || value === undefined) {
    memoryStore.delete(fk);
    shortTermCache.delete(fk);
  } else {
    memoryStore.set(fk, value);
    shortTermCache.set(fk, { val: value, expiry: now + 1500 });
  }

  if (redis) {
    try {
      if (value === null || value === undefined) {
        await redis.del(fk);
      } else if (ttlSeconds) {
        await redis.set(fk, value, { ex: ttlSeconds });
      } else {
        await redis.set(fk, value);
      }
    } catch (err) {
      console.warn(`Redis set error [${fk}]:`, err);
    }
  }
}

// ---------------------------------------------------------------------------
// 1. HMAC Token — zero-leak security
// ---------------------------------------------------------------------------
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
  if (Date.now() > expiryTimestamp) return false;
  const expected = generateQuestionToken(userId, questionId, expiryTimestamp);
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(new Uint8Array(a), new Uint8Array(b));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// 2. Epoch — global session counter (one live topic at a time)
// ---------------------------------------------------------------------------
export async function getCurrentEpoch(): Promise<number> {
  const val = await getCache("epoch");
  return typeof val === "number" ? val : (Number(val) || 0);
}

export async function incrementEpoch(): Promise<number> {
  if (redis) {
    try {
      const newVal = await redis.incr(k("epoch"));
      memoryStore.set(k("epoch"), newVal);
      shortTermCache.set(k("epoch"), { val: newVal, expiry: Date.now() + 1500 });
      return newVal;
    } catch (err) {
      console.warn("Redis incr epoch failed:", err);
    }
  }
  const cur = (memoryStore.get(k("epoch")) as number) || 0;
  const next = cur + 1;
  memoryStore.set(k("epoch"), next);
  return next;
}

// ---------------------------------------------------------------------------
// 3. Live Active State — global, one slot
// ---------------------------------------------------------------------------
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
  timerDuration: number;
  startTime: number;
  endTime: number;
  epoch: number;
  isLocked: boolean;
  autoPush: boolean;
  allowSoloPlay?: boolean;
  status: "IDLE" | "ACTIVE" | "INTERMISSION" | "EXPIRED" | "COMPLETED";
}

export async function getLiveState(): Promise<LiveQuestionPayload | null> {
  return await getCache("active_state");
}

export async function setLiveState(state: LiveQuestionPayload | null): Promise<void> {
  await setCache("active_state", state);
}

// ---------------------------------------------------------------------------
// 4. Atomic session reset — explicit sequence so we never lose the topicId pointer
//    Step A: read active_state → capture topicId
//    Step B: increment epoch
//    Step C: clear queue:${topicId} and queue_set:${topicId}
//    Step D: delete active_state
// ---------------------------------------------------------------------------
export async function resetSession(): Promise<number> {
  // Step A: read active_state to capture topicId before we lose it
  const current = await getLiveState();
  const topicId = current?.topicId ?? null;

  // Step B: delete active_state FIRST — students immediately see no active question.
  // Doing this before the epoch increment means there is no window where a student
  // can see a stale question and still pass the epoch check.
  await setLiveState(null);

  // Step C: bump epoch — invalidates any in-flight submit payloads for the old session
  const newEpoch = await incrementEpoch();

  // Step D: clear that topic's queue and dedupe set.
  // We do this AFTER deleting active_state so we still have topicId from Step A.
  // Clearing active_state first (Step B) is safe because we already captured topicId.
  if (topicId) {
    const queueKey = k(`queue:${topicId}`);
    const queueSetKey = k(`queue_set:${topicId}`);
    memoryStore.delete(queueKey);
    shortTermCache.delete(queueKey);
    memoryStore.delete(queueSetKey);
    shortTermCache.delete(queueSetKey);
    if (redis) {
      try {
        await redis.del(queueKey, queueSetKey);
      } catch (err) {
        console.warn("Redis del queue on reset failed:", err);
      }
    }
  }

  return newEpoch;
}

// ---------------------------------------------------------------------------
// 5. Answered guard — idempotent SET before scoring
// Returns true if this is the FIRST answer (proceed to score),
// false if already answered (reject with ALREADY_ANSWERED).
// ---------------------------------------------------------------------------
export async function markAnswered(epoch: number, questionId: string, participantId: string): Promise<boolean> {
  const answeredKey = k(`answered:${epoch}:${questionId}`);

  if (redis) {
    try {
      const result = await redis.sadd(answeredKey, participantId);
      // sadd returns number of NEW members added; 0 means already present
      const added = typeof result === "number" ? result : Number(result);
      if (added === 0) return false; // already answered
      // auto-expire answered sets after 2 hours
      await redis.expire(answeredKey, 7200);
      return true;
    } catch (err) {
      console.warn("Redis sadd answered failed:", err);
    }
  }
  // memory fallback
  const existing: Set<string> = memoryStore.get(answeredKey) ?? new Set();
  if (existing.has(participantId)) return false;
  existing.add(participantId);
  memoryStore.set(answeredKey, existing);
  return true;
}

// ---------------------------------------------------------------------------
// 6. Queue — dedup + pipelined pop
// ---------------------------------------------------------------------------

/**
 * Enqueue a question for a topic. Silently ignores duplicate clicks.
 * Returns false if the question was already staged.
 */
export async function enqueueQuestion(topicId: string, questionId: string): Promise<boolean> {
  const listKey = k(`queue:${topicId}`);
  const setKey = k(`queue_set:${topicId}`);

  if (redis) {
    try {
      const added = await redis.sadd(setKey, questionId);
      const count = typeof added === "number" ? added : Number(added);
      if (count === 0) return false; // already queued
      await redis.rpush(listKey, questionId);
      return true;
    } catch (err) {
      console.warn("Redis enqueue failed:", err);
    }
  }
  // memory fallback
  const set: Set<string> = memoryStore.get(setKey) ?? new Set();
  if (set.has(questionId)) return false;
  set.add(questionId);
  memoryStore.set(setKey, set);
  const list: string[] = memoryStore.get(listKey) ?? [];
  list.push(questionId);
  memoryStore.set(listKey, list);
  return true;
}

/**
 * Pop the next question ID from the topic queue.
 * LPOP + SREM are pipelined to a single Upstash round-trip.
 */
export async function popQueueQuestion(topicId: string): Promise<string | null> {
  const listKey = k(`queue:${topicId}`);
  const setKey = k(`queue_set:${topicId}`);

  if (redis) {
    try {
      // Peek first so we know the id before removing from the set
      const questionId = await redis.lpop<string>(listKey);
      if (questionId) {
        // pipelined: remove from dedup set in same trip
        const pipeline = redis.pipeline();
        pipeline.srem(setKey, questionId);
        await pipeline.exec();
      }
      return questionId ?? null;
    } catch (err) {
      console.warn("Redis pop queue failed:", err);
    }
  }
  // memory fallback
  const list: string[] = memoryStore.get(listKey) ?? [];
  const questionId = list.shift() ?? null;
  if (questionId) {
    memoryStore.set(listKey, list);
    const set: Set<string> = memoryStore.get(setKey) ?? new Set();
    set.delete(questionId);
    memoryStore.set(setKey, set);
  }
  return questionId;
}

/** Read the full topic queue as an array of question IDs (for UI display) */
export async function getTopicQueue(topicId: string): Promise<string[]> {
  const listKey = k(`queue:${topicId}`);
  if (redis) {
    try {
      const items = await redis.lrange<string>(listKey, 0, -1);
      return Array.isArray(items) ? items : [];
    } catch { /* fall through */ }
  }
  return memoryStore.get(listKey) ?? [];
}

// ---------------------------------------------------------------------------
// 7. Topic-scoped persistent leaderboard — Redis ZSET
//    ZINCRBY → atomic score accumulation
//    ZREVRANGE → ranked list for free
//    ZSCORE → single participant lookup
// ---------------------------------------------------------------------------
export interface LeaderboardEntry {
  participantId: string;
  participantName: string;
  participantHandle: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  topicId: string;
}

/** Add points to a participant's topic score (atomic ZINCRBY on ZSET) */
export async function addScoreToLeaderboard(
  topicId: string,
  participantId: string,
  points: number
): Promise<void> {
  const zsetKey = k(`leaderboard:${topicId}`);
  if (redis) {
    try {
      await redis.zincrby(zsetKey, points, participantId);
      return;
    } catch (err) {
      console.warn("Redis zincrby failed:", err);
    }
  }
  // memory fallback
  const scores: Map<string, number> = memoryStore.get(zsetKey) ?? new Map();
  scores.set(participantId, (scores.get(participantId) ?? 0) + points);
  memoryStore.set(zsetKey, scores);
}

/** Get ranked leaderboard entries for a topic */
export async function getTopicLeaderboard(topicId: string): Promise<{ participantId: string; score: number }[]> {
  const zsetKey = k(`leaderboard:${topicId}`);
  if (redis) {
    try {
      // Upstash SDK: zrange with rev:true + withScores returns [{member, score}]
      const results = await redis.zrange<{ member: string; score: number }[]>(
        zsetKey, 0, 49,
        { rev: true, withScores: true }
      );
      if (Array.isArray(results)) {
        return results.map((r) => ({
          participantId: String(r.member ?? r),
          score: Number((r as any).score ?? 0),
        }));
      }
    } catch (err) {
      console.warn("Redis zrange failed:", err);
    }
  }
  // memory fallback
  const scores: Map<string, number> = memoryStore.get(zsetKey) ?? new Map();
  return Array.from(scores.entries())
    .map(([participantId, score]) => ({ participantId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
}

/** Get a single participant's score for a topic */
export async function getParticipantScore(topicId: string, participantId: string): Promise<number> {
  const zsetKey = k(`leaderboard:${topicId}`);
  if (redis) {
    try {
      const val = await redis.zscore(zsetKey, participantId);
      return val !== null ? Number(val) : 0;
    } catch { /* fall through */ }
  }
  const scores: Map<string, number> = memoryStore.get(zsetKey) ?? new Map();
  return scores.get(participantId) ?? 0;
}

/** Delete the leaderboard for a topic (admin reset — does NOT touch epoch or active_state) */
export async function resetLeaderboard(topicId: string): Promise<void> {
  const zsetKey = k(`leaderboard:${topicId}`);
  memoryStore.delete(zsetKey);
  shortTermCache.delete(zsetKey);
  if (redis) {
    try {
      await redis.del(zsetKey);
    } catch (err) {
      console.warn("Redis del leaderboard failed:", err);
    }
  }
}

// ---------------------------------------------------------------------------
// 8. Per-topic per-participant accuracy tracking
// ---------------------------------------------------------------------------
export async function updateAccuracy(
  topicId: string,
  participantId: string,
  isCorrect: boolean
): Promise<{ correct: number; total: number }> {
  const hashKey = k(`accuracy:${topicId}:${participantId}`);
  if (redis) {
    try {
      const pipeline = redis.pipeline();
      if (isCorrect) pipeline.hincrby(hashKey, "correct", 1);
      pipeline.hincrby(hashKey, "total", 1);
      await pipeline.exec();
      const result = await redis.hgetall(hashKey) as Record<string, string> | null;
      return {
        correct: Number(result?.correct ?? 0),
        total: Number(result?.total ?? 0),
      };
    } catch (err) {
      console.warn("Redis accuracy update failed:", err);
    }
  }
  // memory fallback
  const acc: { correct: number; total: number } = memoryStore.get(hashKey) ?? { correct: 0, total: 0 };
  if (isCorrect) acc.correct++;
  acc.total++;
  memoryStore.set(hashKey, acc);
  return acc;
}

export async function getAccuracy(
  topicId: string,
  participantId: string
): Promise<{ correct: number; total: number }> {
  const hashKey = k(`accuracy:${topicId}:${participantId}`);
  if (redis) {
    try {
      const result = await redis.hgetall(hashKey) as Record<string, string> | null;
      if (result) return { correct: Number(result.correct ?? 0), total: Number(result.total ?? 0) };
    } catch { /* fall through */ }
  }
  return memoryStore.get(hashKey) ?? { correct: 0, total: 0 };
}

// ---------------------------------------------------------------------------
// 9. Participant metadata store — separate from scores
//    Keyed by participantId so ZSET scores can reference the same id.
// ---------------------------------------------------------------------------
export interface ParticipantMeta {
  participantId: string;
  participantName: string;
  participantHandle: string;
  lastActive: string;
}

export async function upsertParticipantMeta(meta: ParticipantMeta): Promise<void> {
  if (!meta.participantId) return;
  await setCache(`participant:${meta.participantId}`, meta, 86400);
}

export async function getParticipantMeta(participantId: string): Promise<ParticipantMeta | null> {
  return await getCache(`participant:${participantId}`);
}

// ---------------------------------------------------------------------------
// 10. Admin config
// ---------------------------------------------------------------------------
export interface LiveAdminConfig {
  timerDuration: number;
  autoPush: boolean;
  allowSoloPlay: boolean;
  selectedTopicId?: string;
}

export async function getLiveAdminConfig(): Promise<LiveAdminConfig> {
  const cached = await getCache("config:admin_settings");
  if (!cached) return { timerDuration: 45, autoPush: false, allowSoloPlay: true, selectedTopicId: "all" };
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
  await setCache("config:admin_settings", updated);
  return updated;
}

export async function getAllowSoloPlay(): Promise<boolean> {
  const config = await getLiveAdminConfig();
  return config.allowSoloPlay;
}

export async function setAllowSoloPlay(allow: boolean): Promise<void> {
  await setLiveAdminConfig({ allowSoloPlay: parseBool(allow, true) });
}

// ---------------------------------------------------------------------------
// 11. Topic question sequence cache (24 h TTL)
// ---------------------------------------------------------------------------
export async function cacheTopicSequence(topicId: string, questions: any[]): Promise<void> {
  await setCache(`sequence:${topicId}`, questions, 86400);
}

export async function getTopicSequence(topicId: string): Promise<any[] | null> {
  return await getCache(`sequence:${topicId}`);
}

// ---------------------------------------------------------------------------
// 12. Auto-advance engine (autoPush mode)
// ---------------------------------------------------------------------------
let isAdvancingLock = false;

export async function advanceToNextQuestion(currentState: LiveQuestionPayload): Promise<void> {
  if (!currentState || isAdvancingLock) return;
  isAdvancingLock = true;
  try {
    currentState.status = "INTERMISSION";
    await setLiveState(currentState);

    setTimeout(async () => {
      try {
        const nextIndex = (currentState.orderIndex || 1) + 1;
        let questions: any[] = (await getTopicSequence(currentState.topicId)) || [];
        if (!questions.length) {
          try {
            const doc = await sanityClient.fetch(
              `*[_type == "challengeQuiz" && (topic._ref == $topicId || _id == $topicId)][0]`,
              { topicId: currentState.topicId }
            );
            questions = doc?.questions || [];
            if (questions.length) await cacheTopicSequence(currentState.topicId, questions);
          } catch { questions = []; }
        }
        if (questions && nextIndex <= questions.length) {
          const nextQ = questions.find((q: any) => q.orderIndex === nextIndex) || questions[nextIndex - 1];
          if (nextQ) {
            const dur = currentState.timerDuration || 45;
            const now = Date.now();
            const epoch = await getCurrentEpoch();
            await setLiveState({
              questionId: nextQ._key || nextQ._id || `q_${Date.now()}`,
              topicId: currentState.topicId,
              questionText: nextQ.questionText,
              questionType: nextQ.questionType || "MULTIPLE_CHOICE",
              codeSnippet: nextQ.codeSnippet,
              options: nextQ.options || [],
              difficulty: nextQ.difficulty || "MEDIUM",
              points: nextQ.points || getDifficultyPoints(nextQ.difficulty || "MEDIUM"),
              orderIndex: nextIndex,
              timerDuration: dur,
              startTime: now,
              endTime: now + dur * 1000,
              epoch,
              isLocked: true,
              autoPush: true,
              allowSoloPlay: currentState.allowSoloPlay,
              status: "ACTIVE",
            });
          }
        } else {
          currentState.status = "COMPLETED";
          currentState.isLocked = false;
          await setLiveState(currentState);
        }
      } finally {
        isAdvancingLock = false;
      }
    }, 5000);
  } catch (err) {
    isAdvancingLock = false;
    console.error("advanceToNextQuestion error:", err);
  }
}

// ---------------------------------------------------------------------------
// LEGACY COMPATIBILITY SHIMS — keep old callers compiling during migration
// ---------------------------------------------------------------------------
export async function tryAcquireSubmissionLock(userId: string, questionId: string): Promise<boolean> {
  // Replaced by markAnswered() — kept so old import paths don't break during build
  const lockKey = k(`lock:${userId}:${questionId}`);
  if (redis) {
    try {
      const res = await redis.set(lockKey, "LOCKED", { nx: true, ex: 60 });
      return res === "OK";
    } catch { /* fall through */ }
  }
  if (memoryStore.has(lockKey)) return false;
  memoryStore.set(lockKey, true);
  setTimeout(() => memoryStore.delete(lockKey), 60000);
  return true;
}

/** @deprecated Use getTopicQueue() */
export async function getLiveQuestionQueue(): Promise<any[]> {
  const config = await getLiveAdminConfig();
  const topicId = config.selectedTopicId && config.selectedTopicId !== "all" ? config.selectedTopicId : null;
  if (!topicId) return [];
  return await getTopicQueue(topicId);
}

/** @deprecated Use resetSession() */
export async function triggerSessionReset(): Promise<void> {
  await resetSession();
}

/** @deprecated Use getTopicLeaderboard() */
export async function getLiveLeaderboardStore(): Promise<any[]> {
  const config = await getLiveAdminConfig();
  const topicId = config.selectedTopicId && config.selectedTopicId !== "all" ? config.selectedTopicId : null;
  if (!topicId) return [];
  return await getTopicLeaderboard(topicId);
}

/** @deprecated */
export async function setLiveQuestionQueue(_queue: any[]): Promise<void> {
  // no-op — queue is now Redis LIST per topic
}

/** @deprecated */
export async function recordSubmission(submission: any): Promise<any> {
  // Thin shim that writes to the ZSET leaderboard for backward compat
  const topicId = submission.quizId || "unknown";
  const pid = submission.participantHandle || submission.participantName || "anon";
  if (submission.score) await addScoreToLeaderboard(topicId, pid, submission.score);
  await upsertParticipantMeta({
    participantId: pid,
    participantName: submission.participantName || "Anonymous",
    participantHandle: submission.participantHandle || "@anon",
    lastActive: new Date().toISOString(),
  });
  return submission;
}

/** @deprecated */
export async function registerParticipantSession(session: any): Promise<void> {
  await upsertParticipantMeta({
    participantId: session.userId,
    participantName: session.playerName,
    participantHandle: session.playerHandle,
    lastActive: session.lastActive,
  });
}

/** @deprecated */
export async function getLastSessionResetTime(): Promise<number> {
  return 0; // epoch model replaces this
}
