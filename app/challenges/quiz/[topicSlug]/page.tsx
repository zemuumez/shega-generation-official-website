"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ThemeProvider from "@/components/ThemeProvider";

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
  startTime?: number;
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
const TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours TTL

export default function MobileLiveQuizPage({ params }: { params: { topicSlug: string } }) {
  // Local 500ms ticker for smooth timer calculation without forcing state re-renders
  const [nowTime, setNowTime] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  const [userId, setUserId] = useState<string>(() => `user_${Math.random().toString(36).substring(2, 9)}`);
  const [playerName, setPlayerName] = useState<string>("");
  const [playerHandle, setPlayerHandle] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const currentQIdRef = useRef<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<BroadcastQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [userScore, setUserScore] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // 1. Restore participant from 24-hour TTL localStorage on mount
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
        setLeaderboard(data.leaderboard);
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
        } else if (data.status === "IDLE") {
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

      sse.addEventListener("IDLE_STATE", () => {
        currentQIdRef.current = null;
        setActiveQuestion(null);
        setSelectedOption(null);
        setIsSubmitted(false);
        setSubmissionResult(null);
        fetchLeaderboard();
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
  }, [isRegistered, userId]);

  const handleRegisterParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    const newUserId = userId || `user_${Math.random().toString(36).substring(2, 9)}`;
    const handle = playerHandle.trim() || `@${playerName.toLowerCase().replace(/\s+/g, "_")}`;
    const payload: StoredParticipant = {
      userId: newUserId,
      playerName: playerName.trim(),
      playerHandle: handle,
      expiryTimestamp: Date.now() + TTL_MS,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }

    setUserId(newUserId);
    setPlayerHandle(handle);
    setIsRegistered(true);
  };

  const handleLogoutParticipant = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsRegistered(false);
    setPlayerName("");
    setPlayerHandle("");
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
      if (data.ok && data.pointsEarned) {
        setUserScore((s) => s + data.pointsEarned);
        fetchLeaderboard();
      }
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  // Registration step
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-ivory text-ink flex items-center justify-center p-4 font-sans selection:bg-ochre selection:text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200/80 shadow-xl text-center"
        >
          <h1 className="text-2xl font-bold font-display text-ink mb-2">
            Join Live Challenge Battle
          </h1>
          <p className="text-xs font-mono text-ink-soft mb-6">
            TOPIC: <span className="text-ochre font-bold uppercase">{params.topicSlug.replace(/-/g, " ")}</span>
          </p>

          <form onSubmit={handleRegisterParticipant} className="space-y-4 text-left font-sans">
            <div>
              <label className="block text-xs font-mono font-bold text-ink uppercase mb-1">
                Your Full Name *
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
              className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-extrabold text-sm py-4 rounded-xl shadow-md transition-all mt-2"
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

  return (
    <div className="min-h-screen bg-ivory text-ink p-3 sm:p-6 font-sans selection:bg-ochre selection:text-white">
      <ThemeProvider />

      {/* Header Bar */}
      <header className="max-w-6xl mx-auto w-full bg-white text-ink border border-zinc-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm font-mono text-xs mb-6">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-ink text-sm">SHEGA ARENA LIVE</span>
        </div>

        <div className="text-center truncate">
          <span className="text-[10px] text-ink-soft block">TOPIC DOMAIN</span>
          <span className="text-ochre font-bold uppercase truncate block text-xs">
            {params.topicSlug.replace(/-/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-ivory px-3 py-1.5 rounded-xl border border-zinc-200">
            <span className="font-bold text-ink text-xs truncate max-w-[100px]">
              {playerName}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-ochre/15 border border-ochre/30 px-3 py-1.5 rounded-xl text-ochre font-bold">
            <span>Score:</span>
            <strong className="text-ink">{userScore} Pts</strong>
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
        {/* Left Column: Live Question Player */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {activeQuestion && activeQuestion.status === "ACTIVE" && (
              <motion.div
                key={activeQuestion.questionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-5 sm:p-7 border border-zinc-200/80 shadow-xl relative overflow-hidden space-y-4"
              >
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-ink-soft">
                    <span>COUNTDOWN TIMER</span>
                    <span className={timerRatio < 0.25 ? "text-[#EF4444]" : timerRatio < 0.5 ? "text-[#F59E0B]" : "text-ochre"}>
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

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase border ${
                      difficulty === "EASY"
                        ? "bg-ochre/15 border-ochre/40 text-ochre"
                        : difficulty === "HARD"
                        ? "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]"
                        : "bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]"
                    }`}
                  >
                    [ {difficulty} - {points} Pts ]
                  </span>

                  <span className="text-xs font-mono text-ink-soft font-bold">
                    Q{activeQuestion.orderIndex || 1}
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-lg sm:text-xl font-bold font-display text-ink leading-snug">
                  {activeQuestion.questionText}
                </h3>

                {activeQuestion.codeSnippet && (
                  <pre className="bg-ivory rounded-xl p-3.5 border border-zinc-300 font-mono text-xs text-ochre overflow-x-auto whitespace-pre">
                    {activeQuestion.codeSnippet}
                  </pre>
                )}

                {/* Options */}
                <div className="space-y-3 pt-2">
                  {activeQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isLocked = isSubmitted || activeRemainingSeconds <= 0;

                    return (
                      <button
                        key={idx}
                        disabled={isLocked}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-4 rounded-2xl font-sans text-sm font-semibold transition-all flex items-center justify-between border min-h-[58px] ${
                          isSelected
                            ? "bg-ochre/15 text-ink border-ochre ring-2 ring-ochre shadow-md"
                            : isLocked
                            ? "bg-ivory border-zinc-200 text-zinc-400 cursor-not-allowed"
                            : "bg-white hover:bg-ivory text-ink border-zinc-200 active:scale-[0.99] shadow-xs"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center border ${
                            isSelected
                              ? "bg-ochre text-white border-ochre"
                              : "bg-ivory text-ink border-zinc-300"
                          }`}>
                            ( {String.fromCharCode(65 + idx)} )
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] font-mono text-ochre font-extrabold uppercase px-2 py-0.5 rounded bg-ochre/15 border border-ochre/40">
                            [SELECTED]
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submission Feedback */}
                {submissionResult && (
                  <div
                    className={`p-3.5 rounded-xl font-mono text-xs font-bold border text-center ${
                      submissionResult.isCorrect
                        ? "bg-ochre/15 border-ochre/40 text-ochre"
                        : "bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]"
                    }`}
                  >
                    {submissionResult.isCorrect
                      ? `Correct Answer! +${submissionResult.pointsEarned} Pts`
                      : "Submitted. Processing live leaderboard..."}
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
                className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xl text-center space-y-4"
              >
                <h3 className="text-lg font-bold font-display text-ink">
                  5s Question Intermission
                </h3>
                <p className="text-xs font-mono text-ink-soft">
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
                className="bg-white rounded-3xl p-8 border border-zinc-200/80 text-center shadow-xl space-y-4"
              >
                <h3 className="text-xl font-bold font-display text-ink">
                  Waiting for Admin Broadcast...
                </h3>
                <p className="text-xs font-mono text-ink-soft">
                  The operator will push the next question to all connected screens live.
                </p>

                <div className="p-3 rounded-xl bg-ivory border border-zinc-200 text-xs font-mono text-ink-soft">
                  Your Current Arena Score: <strong className="text-ochre font-bold">{userScore} Pts</strong>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Locked Footer Status */}
          <footer className="w-full pt-2 text-center">
            {isSubmitted || (activeQuestion && activeRemainingSeconds <= 0) ? (
              <div className="w-full bg-ochre/15 border border-ochre/40 text-ochre font-mono text-xs font-extrabold py-3.5 rounded-2xl shadow-sm tracking-widest uppercase">
                [ LOCKED AND SUBMITTED ]
              </div>
            ) : (
              <Link href="/challenges" className="text-xs font-mono text-ink-soft hover:text-ochre transition-colors">
                Exit to Challenge Hub
              </Link>
            )}
          </footer>
        </div>

        {/* Right Column: Live Topic Leaderboard */}
        <div className="bg-white text-ink rounded-3xl p-5 border border-zinc-200/80 shadow-xl space-y-4 font-mono text-xs sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <span className="text-[10px] text-ochre font-bold uppercase tracking-wider block">
                LIVE TOPIC RANKINGS
              </span>
              <h4 className="font-extrabold text-ink text-sm font-display">
                Topic Leaderboard
              </h4>
            </div>
            <button
              onClick={fetchLeaderboard}
              className="text-[10px] bg-ivory hover:bg-zinc-200 text-ink px-2.5 py-1 rounded-lg border border-zinc-300 transition-colors font-bold"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {leaderboard.length === 0 ? (
              <div className="p-4 text-center text-ink-soft text-xs">
                No entries yet for this topic. Be the first to answer!
              </div>
            ) : (
              leaderboard.map((item, idx) => {
                const rank = idx + 1;
                const isMe = item.participantName === playerName || item.participantHandle === playerHandle;

                return (
                  <div
                    key={item._id || idx}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isMe
                        ? "bg-ochre/15 border-ochre shadow-sm"
                        : rank === 1
                        ? "bg-amber-500/10 border-amber-500/40"
                        : "bg-ivory border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                        rank === 1
                          ? "bg-amber-400 text-black"
                          : rank === 2
                          ? "bg-zinc-300 text-black"
                          : rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-zinc-200 text-ink"
                      }`}>
                        #{rank}
                      </span>

                      <div>
                        <strong className="text-ink block font-sans text-xs truncate max-w-[110px]">
                          {item.participantName}
                        </strong>
                        <span className="text-[9px] text-ink-soft block truncate max-w-[110px]">
                          {item.participantHandle || "@student"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <strong className="text-ochre font-extrabold text-xs block">
                        {item.score} Pts
                      </strong>
                      <span className="text-[9px] text-ink-soft block">
                        {Math.round(((item.correctCount || 1) / (item.totalQuestions || 1)) * 100)}% Acc
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
