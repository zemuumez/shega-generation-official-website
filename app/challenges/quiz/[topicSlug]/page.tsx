"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface BroadcastQuestion {
  questionId: string;
  topicId: string;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  codeSnippet?: string;
  options: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
  orderIndex: number;
  timerDuration: number;
  remainingSeconds: number;
  endTime?: number;
  token: string;
  tokenExpiry: number;
  status: "IDLE" | "ACTIVE" | "INTERMISSION" | "EXPIRED" | "COMPLETED";
}

interface StoredParticipant {
  userId: string;
  playerName: string;
  playerHandle: string;
  expiryTimestamp: number;
}

const STORAGE_KEY = "shega_quiz_participant";

export default function MobileLiveQuizPage({
  params,
}: {
  params: { topicSlug: string };
}) {
  // 1. Ticking timer state for smooth seconds countdown without full-tree re-renders
  const [nowTime, setNowTime] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now());
    }, 500);

    return () => clearInterval(timer);
  }, []);

  // Registration & Session State
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [playerHandle, setPlayerHandle] = useState<string>("");

  // Live Broadcast & Submission State
  const [activeQuestion, setActiveQuestion] = useState<BroadcastQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [userScore, setUserScore] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Ref to track question transitions safely
  const currentQIdRef = useRef<string | null>(null);

  // 1. Restore persistent registration from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredParticipant = JSON.parse(raw);
        if (parsed && Date.now() < parsed.expiryTimestamp) {
          setUserId(parsed.userId);
          setPlayerName(parsed.playerName);
          setPlayerHandle(parsed.playerHandle);
          setIsRegistered(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/challenges/leaderboard");
      const data = await res.json();
      if (data.ok && Array.isArray(data.leaderboard)) {
        setLeaderboard((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(data.leaderboard)) {
            return data.leaderboard;
          }
          return prev;
        });

        // Auto-sync my live score from the real-time leaderboard
        const myEntry = data.leaderboard.find(
          (item: any) =>
            (playerHandle && item.participantHandle && item.participantHandle.toLowerCase() === playerHandle.toLowerCase()) ||
            (playerName && item.participantName && item.participantName.toLowerCase() === playerName.toLowerCase())
        );
        if (myEntry && typeof myEntry.score === "number") {
          setUserScore((prev) => (prev !== myEntry.score ? myEntry.score : prev));
        }
      }
    } catch {
      // ignore
    }
  };

  // 2. Real-Time Zero-Refresh Stream & Background Sync
  useEffect(() => {
    if (!isRegistered) return;

    fetchLeaderboard();

    const syncLiveState = async () => {
      try {
        const res = await fetch(`/api/quiz/live/state?userId=${userId}`);
        const data = await res.json();
        if (data.status === "ACTIVE" && data.activeQuestion) {
          if (currentQIdRef.current !== data.activeQuestion.questionId) {
            currentQIdRef.current = data.activeQuestion.questionId;
            setSelectedOption(null);
            setIsSubmitted(false);
            setSubmissionResult(null);
            setActiveQuestion(data.activeQuestion);
          } else {
            // Same question: Only update if status changed
            setActiveQuestion((prev) => {
              if (!prev || prev.status !== data.activeQuestion.status) {
                return data.activeQuestion;
              }
              return prev;
            });
          }
        } else if (data.status === "IDLE" && data.isReset) {
          currentQIdRef.current = null;
          setActiveQuestion(null);
        }
      } catch {
        // ignore
      }
    };

    // Initial sync
    syncLiveState();
    fetchLeaderboard();

    // 2s background polling for Vercel Serverless resilience
    const pollInterval = setInterval(() => {
      syncLiveState();
      fetchLeaderboard();
    }, 2000);

    // SSE Real-Time Zero-Refresh Broadcast Stream
    let sse: EventSource | null = null;
    try {
      sse = new EventSource(`/api/quiz/live/stream?userId=${userId}`);

      sse.addEventListener("QUESTION_BROADCAST", (e) => {
        try {
          const data: BroadcastQuestion = JSON.parse(e.data);
          if (currentQIdRef.current !== data.questionId) {
            currentQIdRef.current = data.questionId;
            setSelectedOption(null);
            setIsSubmitted(false);
            setSubmissionResult(null);
            setActiveQuestion(data);
            fetchLeaderboard();
          } else {
            setActiveQuestion((prev) => {
              if (!prev || prev.status !== data.status) {
                return data;
              }
              return prev;
            });
          }
        } catch {
          // ignore
        }
      });

      sse.addEventListener("IDLE_STATE", (e) => {
        try {
          const payload = JSON.parse(e.data || "{}");
          if (payload.isReset) {
            currentQIdRef.current = null;
            setActiveQuestion(null);
            setSelectedOption(null);
            setIsSubmitted(false);
            setSubmissionResult(null);
            fetchLeaderboard();
          }
        } catch {
          // ignore
        }
      });

      sse.addEventListener("QUESTION_EXPIRED", () => {
        fetchLeaderboard();
      });
    } catch {
      // ignore
    }

    return () => {
      clearInterval(pollInterval);
      if (sse) sse.close();
    };
  }, [isRegistered, userId, playerHandle, playerName]);

  const handleRegisterParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    const generatedUserId = `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const formattedHandle = playerHandle.trim()
      ? playerHandle.trim().startsWith("@")
        ? playerHandle.trim()
        : `@${playerHandle.trim()}`
      : `@${playerName.trim().toLowerCase().replace(/\s+/g, "_")}`;

    const storedData: StoredParticipant = {
      userId: generatedUserId,
      playerName: playerName.trim(),
      playerHandle: formattedHandle,
      expiryTimestamp: Date.now() + 24 * 60 * 60 * 1000, // 24-hour persistent session
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
    } catch {
      // ignore
    }

    setUserId(generatedUserId);
    setPlayerName(playerName.trim());
    setPlayerHandle(formattedHandle);
    setIsRegistered(true);
  };

  const handleLogoutParticipant = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsRegistered(false);
    setUserId("");
    setPlayerName("");
    setPlayerHandle("");
    setUserScore(0);
  };

  const handleSelectOption = async (optionIdx: number) => {
    if (isSubmitted || !activeQuestion) return;

    setSelectedOption(optionIdx);
    setIsSubmitted(true);

    try {
      const res = await fetch("/api/quiz/live/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          participantName: playerName || "Anonymous Student",
          participantHandle: playerHandle || `@${playerName.toLowerCase().replace(/\s+/g, "_")}`,
          questionId: activeQuestion.questionId,
          chosenOptionIndex: optionIdx,
          token: activeQuestion.token,
          tokenExpiry: activeQuestion.tokenExpiry,
        }),
      });

      const data = await res.json();
      setSubmissionResult(data);
      if (data.ok) {
        if (typeof data.pointsEarned === "number" && data.pointsEarned > 0) {
          setUserScore((s) => s + data.pointsEarned);
        }
        await fetchLeaderboard();
      }
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  // Registration Barrier Screen
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-ivory text-ink flex items-center justify-center p-4 font-sans selection:bg-ochre selection:text-white">


        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200/80 shadow-2xl text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre text-xl font-mono font-bold mx-auto mb-4">
            ⚡
          </div>

          <h1 className="text-2xl font-bold font-display text-ink mb-1">
            Join Shega Arena Live
          </h1>
          <p className="text-xs font-mono text-ink-soft mb-6">
            Enter your student handle to join the live question broadcast and climb the leaderboard.
          </p>

          <form onSubmit={handleRegisterParticipant} className="space-y-4 text-left font-sans">
            <div>
              <label className="block text-xs font-mono font-bold text-ink uppercase mb-1">
                Your Full Name / Alias *
              </label>
              <input
                type="text"
                required
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. Kidus M."
                className="w-full px-4 py-3.5 rounded-xl bg-ivory border border-zinc-300 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ochre"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-ink uppercase mb-1">
                Handle / Tag (Optional)
              </label>
              <input
                type="text"
                value={playerHandle}
                onChange={(e) => setPlayerHandle(e.target.value)}
                placeholder="e.g. @kidus_code"
                className="w-full px-4 py-3.5 rounded-xl bg-ivory border border-zinc-300 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ochre"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-extrabold text-sm py-4 rounded-xl shadow-md transition-all mt-2 active:scale-95"
            >
              Enter Live Arena Now
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Calculate local remaining seconds smoothly without object reference re-renders
  const activeRemainingSeconds = activeQuestion && activeQuestion.endTime
    ? Math.max(0, Math.ceil((activeQuestion.endTime - nowTime) / 1000))
    : (activeQuestion?.remainingSeconds ?? 0);

  const maxTimerDuration = activeQuestion?.timerDuration || 45;
  const timerRatio = Math.max(0, Math.min(1, activeRemainingSeconds / maxTimerDuration));

  let timerColorClass = "bg-ochre";
  if (timerRatio < 0.25) {
    timerColorClass = "bg-[#EF4444] animate-pulse";
  } else if (timerRatio < 0.5) {
    timerColorClass = "bg-[#F59E0B]";
  }

  const difficulty = activeQuestion?.difficulty || "MEDIUM";
  const points = activeQuestion?.points || (difficulty === "EASY" ? 100 : difficulty === "HARD" ? 400 : 200);

  // Compute my rank and accuracy
  const myLeaderboardIndex = leaderboard.findIndex(
    (item) =>
      (playerHandle && item.participantHandle && item.participantHandle.toLowerCase() === playerHandle.toLowerCase()) ||
      (playerName && item.participantName && item.participantName.toLowerCase() === playerName.toLowerCase())
  );

  const myEntry = myLeaderboardIndex >= 0 ? leaderboard[myLeaderboardIndex] : null;
  const myRankText = myLeaderboardIndex >= 0 ? `#${myLeaderboardIndex + 1}` : "Unranked";
  const myAccuracyText = myEntry && myEntry.totalQuestions > 0
    ? `${Math.round((myEntry.correctCount / myEntry.totalQuestions) * 100)}% Acc`
    : "100% Acc";

  return (
    <div className="min-h-screen bg-ivory text-ink p-3 sm:p-6 font-sans selection:bg-ochre selection:text-white pb-24">

      {/* Header Bar - Modern Glassmorphism Container */}
      <header className="max-w-6xl mx-auto w-full bg-white/90 backdrop-blur-md text-ink border border-zinc-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm font-mono text-xs mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre font-bold text-sm">
            ⚡
          </div>
          <div>
            <span className="font-extrabold text-ink text-sm font-display block leading-none">
              SHEGA ARENA LIVE
            </span>
            <span className="text-[10px] text-ink-soft block font-mono">
              Live Quiz Arena
            </span>
          </div>
        </div>

        <div className="text-center truncate hidden sm:block">
          <span className="text-[10px] text-ink-soft block">TOPIC DOMAIN</span>
          <span className="text-ochre font-bold uppercase truncate block text-xs">
            {params.topicSlug.replace(/-/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-ivory px-3 py-1.5 rounded-xl border border-zinc-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-ink text-xs truncate max-w-[110px]">
              {playerName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-ochre/15 border border-ochre/30 px-3.5 py-1.5 rounded-xl text-ochre font-bold">
            <span className="text-[10px] text-ink-soft font-normal">Score:</span>
            <strong className="text-ink text-xs">{userScore} Pts</strong>
          </div>

          <button
            onClick={handleLogoutParticipant}
            className="text-[11px] font-mono text-ink-soft hover:text-ink underline transition-colors px-2 py-1"
            title="Sign out or switch participant profile"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Live Question Stage */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {activeQuestion && (activeQuestion.status === "ACTIVE" || activeQuestion.status === "EXPIRED") && (
              <motion.div
                key={activeQuestion.questionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-5 sm:p-7 border border-zinc-200/80 shadow-xl relative overflow-hidden space-y-5"
              >
                {/* Countdown Timer Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-ink-soft">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-ochre animate-pulse" />
                      COUNTDOWN TIMER
                    </span>
                    <span className={timerRatio < 0.25 ? "text-[#EF4444] font-extrabold" : timerRatio < 0.5 ? "text-[#F59E0B]" : "text-ochre font-extrabold"}>
                      00:{activeRemainingSeconds < 10 ? `0${activeRemainingSeconds}` : activeRemainingSeconds}s
                    </span>
                  </div>
                  <div className="w-full h-3 bg-ivory rounded-full overflow-hidden border border-zinc-200 p-0.5">
                    <div
                      style={{ width: `${Math.max(0, timerRatio * 100)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${timerColorClass}`}
                    />
                  </div>
                </div>

                {/* Difficulty & Points Header Badges */}
                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase border ${
                      difficulty === "EASY"
                        ? "bg-ochre/15 border-ochre/40 text-ochre"
                        : difficulty === "HARD"
                        ? "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]"
                        : "bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]"
                    }`}
                  >
                    [ {difficulty} - {points} PTS ]
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-ivory border border-zinc-300 text-xs font-mono text-ink font-bold">
                    Q{activeQuestion.orderIndex || 1}
                  </span>
                </div>

                {/* Question Title */}
                <h3 className="text-lg sm:text-2xl font-bold font-display text-ink leading-snug">
                  {activeQuestion.questionText}
                </h3>

                {activeQuestion.codeSnippet && (
                  <pre className="bg-ivory rounded-2xl p-4 border border-zinc-300 font-mono text-xs text-ochre overflow-x-auto whitespace-pre shadow-inner">
                    {activeQuestion.codeSnippet}
                  </pre>
                )}

                {/* Option Target Buttons */}
                <div className="space-y-3 pt-2">
                  {activeQuestion.options?.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isLocked = isSubmitted || activeRemainingSeconds <= 0;

                    return (
                      <button
                        key={idx}
                        disabled={isLocked}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl font-sans text-sm sm:text-base font-semibold transition-all flex items-center justify-between border min-h-[64px] ${
                          isSelected
                            ? "bg-ochre/15 text-ink border-ochre ring-2 ring-ochre shadow-md"
                            : isLocked
                            ? "bg-ivory border-zinc-200 text-zinc-400 cursor-not-allowed"
                            : "bg-white hover:bg-ivory text-ink border-zinc-200 active:scale-[0.99] shadow-xs hover:border-ochre/50"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center border ${
                            isSelected
                              ? "bg-ochre text-white border-ochre shadow-sm"
                              : "bg-ivory text-ink border-zinc-300"
                          }`}>
                            ( {String.fromCharCode(65 + idx)} )
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] font-mono text-ochre font-extrabold uppercase px-2.5 py-1 rounded-lg bg-ochre/15 border border-ochre/40 shrink-0">
                            [SELECTED]
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submission Feedback Banner */}
                {submissionResult && (
                  <div
                    className={`p-4 rounded-2xl font-mono text-xs font-bold border text-center shadow-sm ${
                      submissionResult.isCorrect
                        ? "bg-ochre/15 border-ochre/40 text-ochre"
                        : "bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]"
                    }`}
                  >
                    {submissionResult.isCorrect
                      ? `🎉 Correct Answer! +${submissionResult.pointsEarned} Pts`
                      : submissionResult.pointsEarned > 0
                      ? `Answer Submitted! +${submissionResult.pointsEarned} Pts`
                      : "Answer Submitted & Recorded!"}
                  </div>
                )}
              </motion.div>
            )}

            {/* Intermission Phase */}
            {activeQuestion && activeQuestion.status === "INTERMISSION" && (
              <motion.div
                key="intermission"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-xl text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre text-xl mx-auto font-mono">
                  ⏱️
                </div>
                <h3 className="text-xl font-bold font-display text-ink">
                  Question Intermission
                </h3>
                <p className="text-xs font-mono text-ink-soft max-w-md mx-auto">
                  Check live ranks on the right panel. Next question pushing shortly...
                </p>
              </motion.div>
            )}

            {/* Idle State */}
            {(!activeQuestion || activeQuestion.status === "IDLE") && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl p-8 border border-zinc-200/80 text-center shadow-xl space-y-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre text-2xl font-bold mx-auto">
                  📡
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-ink">
                  Waiting for Live Broadcast...
                </h3>
                <p className="text-xs font-mono text-ink-soft max-w-md mx-auto leading-relaxed">
                  The operator will push the live question to all connected screens simultaneously.
                </p>

                <div className="p-4 rounded-2xl bg-ivory border border-zinc-200 text-xs font-mono text-ink-soft max-w-sm mx-auto">
                  Your Current Arena Score: <strong className="text-ochre font-bold text-sm ml-1">{userScore} Pts</strong>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Locked Footer Status */}
          <footer className="w-full pt-2 text-center">
            {isSubmitted || (activeQuestion && activeRemainingSeconds <= 0) ? (
              <div className="w-full bg-ochre/15 border border-ochre/40 text-ochre font-mono text-xs font-extrabold py-4 rounded-2xl shadow-sm tracking-widest uppercase">
                [ LOCKED AND SUBMITTED ]
              </div>
            ) : (
              <Link href="/challenges" className="text-xs font-mono text-ink-soft hover:text-ochre transition-colors">
                ← Exit to Challenge Hub
              </Link>
            )}
          </footer>
        </div>

        {/* Right Column: Live Topic Leaderboard Panel */}
        <div className="bg-white text-ink rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-xl space-y-5 font-mono text-xs sticky top-20">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-200">
            <div>
              <span className="text-[10px] text-ochre font-bold uppercase tracking-wider block">
                LIVE TOPIC RANKINGS
              </span>
              <h4 className="font-extrabold text-ink text-base font-display">
                Topic Leaderboard
              </h4>
            </div>
            <button
              onClick={fetchLeaderboard}
              className="text-[10px] bg-ivory hover:bg-zinc-200 text-ink px-3 py-1.5 rounded-xl border border-zinc-300 transition-all font-bold active:scale-95"
            >
              Refresh Ranks
            </button>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {leaderboard.length === 0 ? (
              <div className="p-6 text-center text-ink-soft text-xs bg-ivory rounded-2xl border border-zinc-200">
                No entries yet for this topic. Be the first to answer and climb the board!
              </div>
            ) : (
              leaderboard.map((item, idx) => {
                const rank = idx + 1;
                const isMe =
                  (playerHandle && item.participantHandle && item.participantHandle.toLowerCase() === playerHandle.toLowerCase()) ||
                  (playerName && item.participantName && item.participantName.toLowerCase() === playerName.toLowerCase());

                const totalQ = item.totalQuestions || 1;
                const accuracy = Math.round(((item.correctCount || 0) / totalQ) * 100);

                return (
                  <div
                    key={item._id || idx}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isMe
                        ? "bg-ochre/15 border-ochre ring-2 ring-ochre shadow-md"
                        : rank === 1
                        ? "bg-amber-50 border-amber-300"
                        : "bg-ivory border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-xl font-bold flex items-center justify-center text-xs border ${
                          rank === 1
                            ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                            : rank === 2
                            ? "bg-zinc-400 text-white border-zinc-400"
                            : rank === 3
                            ? "bg-amber-700 text-white border-amber-700"
                            : "bg-white text-ink border-zinc-300"
                        }`}
                      >
                        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
                      </span>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-ink font-sans text-sm">
                            {item.participantName}
                          </span>
                          {isMe && (
                            <span className="text-[9px] bg-ochre text-white font-mono px-1.5 py-0.5 rounded font-extrabold">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-ink-soft block font-mono">
                          {item.participantHandle || "@student"} • {accuracy}% Acc
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-ink font-mono text-sm block">
                        {item.score || 0} Pts
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Participant Performance Footer */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 max-w-4xl w-[94%] bg-white/95 backdrop-blur-md border border-zinc-200 shadow-2xl rounded-2xl p-3 px-5 flex items-center justify-between font-mono text-xs z-40 text-ink">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre font-bold text-xs">
            👤
          </div>
          <div>
            <span className="font-bold text-ink block font-sans text-xs sm:text-sm">
              {playerName} <span className="text-ink-soft text-[11px]">({playerHandle})</span>
            </span>
            <span className="text-[10px] text-ink-soft font-mono">
              Live Arena Participant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center">
            <span className="text-[10px] text-ink-soft block">RANK</span>
            <span className="font-extrabold text-ochre text-xs sm:text-sm">{myRankText}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-ink-soft block">ACCURACY</span>
            <span className="font-extrabold text-emerald-600 text-xs sm:text-sm">{myAccuracyText}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-ink-soft block">SCORE</span>
            <span className="font-extrabold text-ink text-xs sm:text-sm">{userScore} Pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
