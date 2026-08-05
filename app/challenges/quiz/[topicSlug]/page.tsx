"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  token: string;
  tokenExpiry: number;
  status: "IDLE" | "ACTIVE" | "INTERMISSION" | "EXPIRED" | "COMPLETED";
}

export default function LiveQuizParticipantPage({ params }: { params: { topicSlug: string } }) {
  const [userId] = useState<string>(() => `user_${Math.random().toString(36).substring(2, 9)}`);
  const [playerName, setPlayerName] = useState<string>("");
  const [playerHandle, setPlayerHandle] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const [activeQuestion, setActiveQuestion] = useState<BroadcastQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [userScore, setUserScore] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Fetch updated leaderboard
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

  // Connect to SSE stream
  useEffect(() => {
    if (!isRegistered) return;

    fetchLeaderboard();

    const sse = new EventSource(`/api/quiz/live/stream?userId=${userId}`);

    sse.addEventListener("QUESTION_BROADCAST", (e) => {
      try {
        const data: BroadcastQuestion = JSON.parse(e.data);
        
        // Reset option selection if new question launched
        if (activeQuestion?.questionId !== data.questionId) {
          setSelectedOption(null);
          setIsSubmitted(false);
          setSubmissionResult(null);
        }

        setActiveQuestion(data);
      } catch (err) {
        console.error("Failed to parse SSE payload:", err);
      }
    });

    sse.addEventListener("IDLE_STATE", () => {
      setActiveQuestion(null);
    });

    return () => {
      sse.close();
    };
  }, [isRegistered, userId, activeQuestion?.questionId]);

  const handleSelectOption = async (optionIdx: number) => {
    if (isSubmitted || !activeQuestion || activeQuestion.remainingSeconds <= 0) return;

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
      <div className="min-h-screen bg-[#0A192F] text-white flex items-center justify-center p-4 font-sans selection:bg-ochre selection:text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0F172A] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-800 shadow-2xl text-center"
        >
          <span className="w-14 h-14 mx-auto rounded-2xl bg-ochre/20 text-ochre text-3xl flex items-center justify-center mb-4 border border-ochre/30">
            ⚡
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-2">
            Join Live Challenge Session
          </h1>
          <p className="text-xs font-mono text-zinc-400 mb-6">
            Topic: <span className="text-ochre uppercase font-bold">{params.topicSlug.replace(/-/g, " ")}</span>
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (playerName.trim()) setIsRegistered(true);
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. Abebe Bikila"
                className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ochre"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1">
                Handle / Tag (Optional)
              </label>
              <input
                type="text"
                value={playerHandle}
                onChange={(e) => setPlayerHandle(e.target.value)}
                placeholder="e.g. @abebe_code"
                className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ochre"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-bold text-sm py-4 rounded-xl shadow-md transition-all mt-2"
            >
              Enter Live Arena Now 🔥
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Timer Bar Color Calculation: Green -> Yellow -> Red
  const timerRatio = activeQuestion
    ? activeQuestion.remainingSeconds / (activeQuestion.timerDuration || 45)
    : 1;

  let timerColorClass = "bg-emerald-500";
  if (timerRatio < 0.25) {
    timerColorClass = "bg-red-500 animate-pulse";
  } else if (timerRatio < 0.5) {
    timerColorClass = "bg-amber-400";
  }

  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-ochre selection:text-white">
      {/* Mobile Header Bar */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-mono text-ochre font-bold uppercase tracking-wider block">
            {playerName} ({playerHandle || `@${playerName.toLowerCase().replace(/\s+/g, "_")}`})
          </span>
          <h2 className="text-sm font-bold font-display text-white truncate max-w-[200px]">
            {params.topicSlug.replace(/-/g, " ")}
          </h2>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] font-bold text-zinc-400 block uppercase">SCORE</span>
          <strong className="text-ochre font-extrabold text-lg">{userScore} pts</strong>
        </div>
      </header>

      {/* Main Single Question Display */}
      <main className="max-w-md mx-auto w-full my-auto py-6">
        <AnimatePresence mode="wait">
          {/* State 1: Active Live Question */}
          {activeQuestion && activeQuestion.status === "ACTIVE" && (
            <motion.div
              key={activeQuestion.questionId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-[#0F172A] rounded-3xl p-6 border border-zinc-800 shadow-2xl relative overflow-hidden"
            >
              {/* Question Header & Countdown Badge */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/10 font-mono text-xs font-bold text-ochre">
                  Question #{activeQuestion.orderIndex || 1}
                </span>

                <div className="flex items-center gap-2 bg-ochre/20 border border-ochre/40 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold text-ochre">
                  <span>⏱️</span>
                  <span className="text-sm font-extrabold text-white">
                    {activeQuestion.remainingSeconds}s
                  </span>
                </div>
              </div>

              {/* Visual Countdown Bar: Green -> Yellow -> Red */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-6">
                <div
                  style={{ width: `${Math.max(0, timerRatio * 100)}%` }}
                  className={`h-full transition-all duration-1000 ${timerColorClass}`}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-4 leading-snug">
                {activeQuestion.questionText}
              </h3>

              {/* Optional Code Snippet Block */}
              {activeQuestion.codeSnippet && (
                <pre className="mb-6 bg-black/60 rounded-xl p-4 border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">
                  {activeQuestion.codeSnippet}
                </pre>
              )}

              {/* Large Touch Target Multiple Choice Options */}
              <div className="space-y-3.5 mb-6">
                {activeQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isLocked = isSubmitted || activeQuestion.remainingSeconds <= 0;

                  return (
                    <button
                      key={idx}
                      disabled={isLocked}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl font-sans text-sm font-semibold transition-all flex items-center justify-between border min-h-[60px] ${
                        isSelected
                          ? "bg-ochre text-white border-ochre scale-[1.02] shadow-md"
                          : isLocked
                          ? "bg-zinc-900/60 border-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "bg-black/40 hover:bg-zinc-900 text-zinc-100 border-zinc-800 hover:border-zinc-700 active:scale-[0.99]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-white/10 font-mono text-xs font-bold flex items-center justify-center">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Submission Feedback */}
              {submissionResult && (
                <div
                  className={`p-4 rounded-2xl font-mono text-xs font-bold border ${
                    submissionResult.isCorrect
                      ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                      : "bg-red-950/60 border-red-500/50 text-red-300"
                  }`}
                >
                  {submissionResult.isCorrect
                    ? `🎉 Correct! +${submissionResult.pointsEarned} Points`
                    : "❌ Incorrect Option."}
                </div>
              )}
            </motion.div>
          )}

          {/* State 2: 5-Second Leaderboard Intermission Phase */}
          {activeQuestion && activeQuestion.status === "INTERMISSION" && (
            <motion.div
              key="intermission-phase"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-2xl text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-400/20 border border-amber-400 text-amber-400 text-2xl flex items-center justify-center mb-3">
                🏆
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase mb-3 inline-block">
                5s Intermission • Live Ranking
              </span>

              <h3 className="text-xl font-bold font-display text-white mb-4">
                Question Completed!
              </h3>

              {/* Intermission Rankings List */}
              <div className="space-y-2 text-left font-mono text-xs mb-4 max-h-48 overflow-y-auto">
                {leaderboard.slice(0, 5).map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="p-3 rounded-xl bg-black/40 border border-zinc-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400">#{idx + 1}</span>
                      <span className="font-bold text-white">{item.participantName}</span>
                    </div>
                    <strong className="text-ochre font-extrabold">{item.score} pts</strong>
                  </div>
                ))}
              </div>

              <p className="text-xs font-mono text-zinc-400">
                Next question auto-pushing shortly...
              </p>
            </motion.div>
          )}

          {/* State 3: Waiting / Idle */}
          {(!activeQuestion || activeQuestion.status === "IDLE") && (
            <motion.div
              key="idle-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0F172A] rounded-3xl p-8 border border-zinc-800 text-center shadow-xl"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-ochre/10 text-ochre text-3xl flex items-center justify-center mb-4 border border-ochre/20">
                ⏳
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-2">
                Waiting for Operator...
              </h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-6">
                The live quiz operator will broadcast the next question to all connected screens momentarily.
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 text-xs font-mono text-zinc-400">
                Connected Device ID: <strong className="text-white">{userId.slice(0, 10)}</strong>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="max-w-md mx-auto w-full pt-4 border-t border-zinc-800 text-center text-xs font-mono text-zinc-500">
        <Link href="/challenges" className="hover:text-white transition-colors">
          ← Exit to Challenge Hub
        </Link>
      </footer>
    </div>
  );
}
