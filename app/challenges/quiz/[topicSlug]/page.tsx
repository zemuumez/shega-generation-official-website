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

export default function MobileLiveQuizPage({ params }: { params: { topicSlug: string } }) {
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
        
        // Reset selection if new question launched
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
      <div className="min-h-screen bg-navy text-white flex items-center justify-center p-4 font-sans selection:bg-ochre selection:text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#030A16] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-ochre/50 shadow-[0_0_30px_rgba(234,88,12,0.2)] text-center"
        >
          <span className="w-14 h-14 mx-auto rounded-2xl bg-ochre/20 text-ochre text-3xl flex items-center justify-center mb-4 border border-ochre/30">
            ⚡
          </span>

          <h1 className="text-2xl font-bold font-display text-white mb-2">
            Join Live Challenge Battle
          </h1>
          <p className="text-xs font-mono text-zinc-400 mb-6">
            TOPIC: <span className="text-ochre font-bold uppercase">{params.topicSlug.replace(/-/g, " ")}</span>
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (playerName.trim()) setIsRegistered(true);
            }}
            className="space-y-4 text-left font-sans"
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
                placeholder="e.g. Kidus M."
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ochre"
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
                placeholder="e.g. @kidus_code"
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ochre"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-extrabold text-sm py-4 rounded-xl shadow-md transition-all mt-2"
            >
              Enter Live Arena Now 🔥
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Timer ratio and color calculation (Primary Ochre -> Cyber Amber -> Red)
  const timerRatio = activeQuestion
    ? activeQuestion.remainingSeconds / (activeQuestion.timerDuration || 45)
    : 1;

  let timerColorClass = "bg-ochre"; // Primary Theme Ochre
  if (timerRatio < 0.25) {
    timerColorClass = "bg-[#EF4444] animate-pulse"; // Crimson Red
  } else if (timerRatio < 0.5) {
    timerColorClass = "bg-[#F59E0B]"; // Cyber Amber
  }

  const difficulty = activeQuestion?.difficulty || "MEDIUM";
  const points = activeQuestion?.points || (difficulty === "EASY" ? 100 : difficulty === "HARD" ? 400 : 200);

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-between p-3 sm:p-6 font-sans selection:bg-ochre selection:text-white">
      {/* Mobile Header Bar matching Mockup Page 3: [≡] SG ARENA | TOPIC: ... | 👤 User */}
      <header className="max-w-md mx-auto w-full bg-[#030A16] border border-zinc-800 rounded-2xl p-3.5 flex items-center justify-between gap-2 shadow-md font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-ochre font-bold text-sm">≡</span>
          <span className="font-extrabold text-white">SG ARENA</span>
        </div>

        <div className="text-center truncate max-w-[140px]">
          <span className="text-[10px] text-zinc-400 block">TOPIC</span>
          <span className="text-ochre font-bold uppercase truncate block text-[11px]">
            {params.topicSlug.replace(/-/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-zinc-800">
          <span className="text-zinc-400">👤</span>
          <span className="font-bold text-white text-[11px] truncate max-w-[80px]">
            {playerName}
          </span>
        </div>
      </header>

      {/* Main Single Question Mobile Display */}
      <main className="max-w-md mx-auto w-full my-auto py-4">
        <AnimatePresence mode="wait">
          {/* Active Question State */}
          {activeQuestion && activeQuestion.status === "ACTIVE" && (
            <motion.div
              key={activeQuestion.questionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#030A16] rounded-3xl p-5 sm:p-6 border border-zinc-800 shadow-2xl relative overflow-hidden space-y-4"
            >
              {/* High-Contrast Progress Bar: Ochre -> Yellow -> Red */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-400">
                  <span>COUNTDOWN TIMER</span>
                  <span className={timerRatio < 0.25 ? "text-[#EF4444]" : timerRatio < 0.5 ? "text-[#F59E0B]" : "text-ochre"}>
                    00:{activeQuestion.remainingSeconds < 10 ? `0${activeQuestion.remainingSeconds}` : activeQuestion.remainingSeconds}s
                  </span>
                </div>
                <div className="w-full h-3 bg-black/80 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                  <div
                    style={{ width: `${Math.max(0, timerRatio * 100)}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${timerColorClass}`}
                  />
                </div>
              </div>

              {/* Difficulty Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase border ${
                    difficulty === "EASY"
                      ? "bg-ochre/20 border-ochre/40 text-ochre"
                      : difficulty === "HARD"
                      ? "bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]"
                      : "bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]"
                  }`}
                >
                  [ {difficulty} - {points} Pts ]
                </span>

                <span className="text-xs font-mono text-zinc-400 font-bold">
                  Q{activeQuestion.orderIndex || 1}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold font-display text-white leading-snug">
                {activeQuestion.questionText}
              </h3>

              {activeQuestion.codeSnippet && (
                <pre className="bg-black rounded-xl p-3.5 border border-zinc-800 font-mono text-xs text-ochre overflow-x-auto whitespace-pre">
                  {activeQuestion.codeSnippet}
                </pre>
              )}

              {/* Full-width Touch Target Options with Ochre Primary Glow */}
              <div className="space-y-3 pt-2">
                {activeQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isLocked = isSubmitted || activeQuestion.remainingSeconds <= 0;

                  return (
                    <button
                      key={idx}
                      disabled={isLocked}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl font-sans text-sm font-semibold transition-all flex items-center justify-between border min-h-[58px] ${
                        isSelected
                          ? "bg-ochre/20 text-white border-ochre shadow-[0_0_20px_rgba(234,88,12,0.4)] ring-2 ring-ochre"
                          : isLocked
                          ? "bg-black/30 border-zinc-800 text-zinc-600 cursor-not-allowed"
                          : "bg-black/60 hover:bg-zinc-800 text-zinc-200 border-zinc-800 active:scale-[0.99]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center border ${
                          isSelected
                            ? "bg-ochre text-white border-ochre"
                            : "bg-white/10 text-white border-transparent"
                        }`}>
                          ( {String.fromCharCode(65 + idx)} )
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSelected && (
                        <span className="text-[10px] font-mono text-ochre font-extrabold uppercase px-2 py-0.5 rounded bg-ochre/20 border border-ochre/40">
                          [SELECTED]
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submission Result Feedback */}
              {submissionResult && (
                <div
                  className={`p-3.5 rounded-xl font-mono text-xs font-bold border text-center ${
                    submissionResult.isCorrect
                      ? "bg-ochre/20 border-ochre/40 text-ochre"
                      : "bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]"
                  }`}
                >
                  {submissionResult.isCorrect
                    ? `🎉 Correct Answer! +${submissionResult.pointsEarned} Pts`
                    : "❌ Submitted. Processing leaderboard..."}
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
              className="bg-[#030A16] rounded-3xl p-6 border border-zinc-800 shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-2xl flex items-center justify-center border border-[#F59E0B]/40">
                🏆
              </div>

              <h3 className="text-lg font-bold font-display text-white">
                Question Intermission
              </h3>

              <div className="space-y-2 text-left font-mono text-xs max-h-48 overflow-y-auto">
                {leaderboard.slice(0, 5).map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="p-3 rounded-xl bg-black/40 border border-zinc-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F59E0B]">#{idx + 1}</span>
                      <span className="font-bold text-white">{item.participantName}</span>
                    </div>
                    <strong className="text-ochre font-extrabold">{item.score} Pts</strong>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Idle State */}
          {(!activeQuestion || activeQuestion.status === "IDLE") && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#030A16] rounded-3xl p-8 border border-zinc-800 text-center shadow-xl space-y-4"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-ochre/15 text-ochre text-3xl flex items-center justify-center border border-ochre/30">
                ⏳
              </div>

              <h3 className="text-xl font-bold font-display text-white">
                Waiting for Admin Broadcast...
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                The operator will push the next question to your screen shortly.
              </p>

              <div className="p-3 rounded-xl bg-black/50 border border-zinc-800 text-xs font-mono text-zinc-400">
                Current Arena Points: <strong className="text-ochre font-bold">{userScore} Pts</strong>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Page 3 Locked Footer: [ L O C K E D  &  S U B M I T T E D ] */}
      <footer className="max-w-md mx-auto w-full pt-2 text-center">
        {isSubmitted || (activeQuestion && activeQuestion.remainingSeconds <= 0) ? (
          <div className="w-full bg-ochre/20 border border-ochre/50 text-ochre font-mono text-xs font-extrabold py-3.5 rounded-2xl shadow-md tracking-widest uppercase">
            [ L O C K E D &amp; S U B M I T T E D ]
          </div>
        ) : (
          <Link href="/challenges" className="text-xs font-mono text-zinc-500 hover:text-white transition-colors">
            ← Exit to Challenge Hub
          </Link>
        )}
      </footer>
    </div>
  );
}
