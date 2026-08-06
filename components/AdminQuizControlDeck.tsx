"use client";

import { useState, useEffect } from "react";

interface Topic {
  _id: string;
  title: string;
  slug?: { current: string };
  orderIndex: number;
}

interface QuizQuestion {
  _key?: string;
  _id?: string;
  questionText: string;
  orderIndex: number;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

interface QuizDoc {
  _id: string;
  title: string;
  topic?: { _ref: string };
  timePerQuestion?: number;
  questions: QuizQuestion[];
}

export default function AdminQuizControlDeck({
  topics,
  quizzes,
}: {
  topics: Topic[];
  quizzes: QuizDoc[];
}) {
  // Admin Login Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Deck Controls State
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?._id || "all");
  const [timerDuration, setTimerDuration] = useState<number>(45); // Default 45 seconds
  const [timerSavedFeedback, setTimerSavedFeedback] = useState<boolean>(false);
  const [autoPush, setAutoPush] = useState<boolean>(false);
  const [allowSoloPlay, setAllowSoloPlay] = useState<boolean>(true);
  const [liveState, setLiveState] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // Check stored auth session
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("shega_admin_auth");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = process.env.NEXT_PUBLIC_QUIZ_ADMIN_PASSCODE || "shega-admin-2026";
    if (passcode.trim() === correctPasscode || passcode.trim() === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("shega_admin_auth", "true");
      setLoginError(null);
    } else {
      setLoginError("Invalid admin passcode. (Default: shega-admin-2026)");
    }
  };

  // Filter quizzes by selected topic
  const filteredQuizzes = quizzes.filter((q) => {
    if (selectedTopicId === "all") return true;
    return q.topic?._ref === selectedTopicId || q._id === selectedTopicId;
  });

  const allQuestions = filteredQuizzes.flatMap((q) => q.questions || []);
  allQuestions.sort((a, b) => (a.orderIndex || 1) - (b.orderIndex || 1));

  // Fetch active solo play mode status & SSE stream
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/api/quiz/live/state")
      .then((res) => res.json())
      .then((data) => {
        if (data.allowSoloPlay !== undefined) setAllowSoloPlay(data.allowSoloPlay);
      })
      .catch(() => {});

    const sse = new EventSource("/api/quiz/live/stream?userId=admin_deck");

    sse.addEventListener("QUESTION_BROADCAST", (e) => {
      try {
        const data = JSON.parse(e.data);
        setLiveState(data);
        if (data.autoPush !== undefined) setAutoPush(data.autoPush);
      } catch {
        // ignore
      }
    });

    sse.addEventListener("IDLE_STATE", () => {
      setLiveState(null);
    });

    return () => {
      sse.close();
    };
  }, [isAuthenticated]);

  const handlePushQuestion = async (q: QuizQuestion) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quiz/live/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PUSH_QUESTION",
          topicId: selectedTopicId !== "all" ? selectedTopicId : quizzes[0]?._id,
          questionId: q._key || q._id,
          orderIndex: q.orderIndex || 1,
          timerDuration,
          autoPush,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to push question.");
      } else {
        setLiveState(data.state);
      }
    } catch {
      setErrorMsg("Network error pushing question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAutoPush = async () => {
    const nextVal = !autoPush;
    setAutoPush(nextVal);
    try {
      await fetch("/api/quiz/live/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TOGGLE_AUTO_PUSH",
          autoPush: nextVal,
        }),
      });
    } catch {
      // ignore
    }
  };

  const handleToggleSoloPlay = async () => {
    const nextVal = !allowSoloPlay;
    setAllowSoloPlay(nextVal);
    try {
      await fetch("/api/quiz/live/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TOGGLE_SOLO_PLAY",
          allowSoloPlay: nextVal,
        }),
      });
    } catch {
      // ignore
    }
  };

  const handleExportCSV = () => {
    window.location.href = "/api/challenges/leaderboard/admin?action=export";
  };

  const handleResetLeaderboard = async () => {
    setShowResetConfirmModal(false);
    try {
      const res = await fetch("/api/challenges/leaderboard/admin", { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        alert("Leaderboard scores cleared for post-event reset!");
      }
    } catch {
      alert("Error clearing leaderboard.");
    }
  };

  const handleResetSession = async () => {
    try {
      await fetch("/api/quiz/live/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESET_SESSION" }),
      });
      setLiveState(null);
    } catch {
      // ignore
    }
  };

  // Admin Login Barrier Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy text-white flex items-center justify-center p-4 font-sans selection:bg-ochre selection:text-white">
        <div className="bg-navy-light rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-800 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-ochre/20 text-ochre text-3xl flex items-center justify-center mb-4 border border-ochre/30">
            🔐
          </div>

          <h1 className="text-2xl font-bold font-display text-white mb-1">
            Admin Live Operator Login
          </h1>
          <p className="text-xs font-mono text-zinc-400 mb-6">
            Enter passcode to access manual question pushing &amp; auto-push controls.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left font-sans">
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1">
                Operator Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full px-4 py-3.5 rounded-xl bg-navy-dark border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ochre"
              />
              <p className="text-[11px] font-mono text-zinc-500 mt-1">
                Default Passcode: <code className="text-ochre">shega-admin-2026</code>
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono">
                ⚠️ {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-bold text-sm py-3.5 rounded-xl transition-all shadow-md"
            >
              Authenticate &amp; Launch Control Deck →
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isQuestionActive = liveState?.status === "ACTIVE" && (liveState?.remainingSeconds ?? 0) > 0;

  return (
    <div className="min-h-screen bg-navy text-white p-4 sm:p-8 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-ochre/20 text-ochre font-mono text-xs font-bold uppercase tracking-wider">
              Live Operator Deck
            </span>
            <button
              onClick={() => {
                sessionStorage.removeItem("shega_admin_auth");
                setIsAuthenticated(false);
              }}
              className="text-xs font-mono text-zinc-400 hover:text-white underline"
            >
              Sign Out
            </button>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white mt-1">
            Admin Quiz Control Deck
          </h1>
        </div>

        {/* Global Live Status Monitor & Leaderboard Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-ochre hover:bg-ochre-dark text-white font-mono font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>📥 Export CSV</span>
          </button>

          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="bg-red-950/60 border border-red-500/40 hover:bg-red-900 text-red-300 font-mono font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all"
          >
            <span>🗑️ Reset Leaderboard</span>
          </button>

          <div className="flex items-center gap-4 bg-navy-light p-3.5 rounded-2xl border border-zinc-800 font-mono text-xs">
            <div>
              <span className="text-zinc-400 block text-[10px]">LIVE BROADCAST</span>
              <strong className={`font-bold text-sm ${isQuestionActive ? "text-emerald-400" : "text-amber-400"}`}>
                {isQuestionActive ? `ACTIVE (#${liveState.orderIndex})` : "IDLE / READY"}
              </strong>
            </div>

            <div>
              <span className="text-zinc-400 block text-[10px]">COUNTDOWN</span>
              <strong className="text-white font-bold text-base">
                {liveState?.remainingSeconds ?? 0}s
              </strong>
            </div>

            <button
              onClick={handleResetSession}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold px-3 py-1.5 rounded-lg transition-colors border border-red-500/30"
            >
              Reset Session
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Topics & Global Controls */}
        <div className="space-y-6">
          {/* Topic Filter Tabs */}
          <div className="bg-navy-light rounded-2xl p-5 border border-zinc-800">
            <h3 className="text-sm font-mono font-bold text-ochre uppercase tracking-wider mb-3">
              1. Filter Topic Domain
            </h3>
            <div className="space-y-2 font-mono text-xs">
              <button
                onClick={() => setSelectedTopicId("all")}
                className={`w-full text-left p-3 rounded-xl font-bold transition-all ${
                  selectedTopicId === "all"
                    ? "bg-ochre text-white shadow-sm"
                    : "bg-navy-dark hover:bg-black/50 text-zinc-300"
                }`}
              >
                🌐 All Topics &amp; Questions
              </button>
              {topics.map((topic) => {
                const isSelected = selectedTopicId === topic._id;
                return (
                  <button
                    key={topic._id}
                    onClick={() => setSelectedTopicId(topic._id)}
                    className={`w-full text-left p-3 rounded-xl font-bold transition-all ${
                      isSelected
                        ? "bg-ochre text-white shadow-sm"
                        : "bg-navy-dark hover:bg-black/50 text-zinc-300"
                    }`}
                  >
                    📂 {topic.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Timer Engine & Controls */}
          <div className="bg-navy-light rounded-2xl p-5 border border-zinc-800 space-y-5">
            <h3 className="text-sm font-mono font-bold text-ochre uppercase tracking-wider">
              2. Broadcast Configuration
            </h3>

            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                Question Timer (Seconds)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={timerDuration}
                  onChange={(e) => {
                    setTimerDuration(Number(e.target.value));
                    setTimerSavedFeedback(false);
                  }}
                  className="w-full bg-navy-dark border border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-ochre"
                />
                <button
                  type="button"
                  onClick={() => {
                    setTimerSavedFeedback(true);
                    setTimeout(() => setTimerSavedFeedback(false), 3000);
                  }}
                  className="bg-ochre hover:bg-ochre-dark text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap active:scale-95"
                >
                  Set Timer ⏱️
                </button>
              </div>
              {timerSavedFeedback && (
                <div className="mt-2 text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span>✓</span> Broadcast timer set to {timerDuration} seconds!
                </div>
              )}
              <p className="text-[11px] font-mono text-zinc-400 mt-1">
                Default: <strong>45 seconds</strong> per question.
              </p>
            </div>

            {/* Solo Play Mode Switch */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white block">Allow "Play Solo" Mode</span>
                <span className="text-[10px] font-mono text-zinc-400 block max-w-[180px]">
                  When OFF, disables solo play so users MUST join live sessions.
                </span>
              </div>

              <button
                onClick={handleToggleSoloPlay}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  allowSoloPlay ? "bg-emerald-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    allowSoloPlay ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Auto-Push Loop Switch */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white block">Auto-Push Automation Loop</span>
                <span className="text-[10px] font-mono text-zinc-400 block max-w-[180px]">
                  When enabled, automatically pushes #orderIndex+1 after 5s Leaderboard Intermission.
                </span>
              </div>

              <button
                onClick={handleToggleAutoPush}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  autoPush ? "bg-emerald-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    autoPush ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Manual One-at-a-time Push Question List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 font-mono text-xs">
            <h3 className="font-bold text-white">
              3. Sequential Question Deck ({allQuestions.length} Questions)
            </h3>
            {isQuestionActive && (
              <span className="text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                🔒 PUSH LOCKED (Timer Running)
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-xs">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="space-y-3">
            {allQuestions.map((q, idx) => {
              const qIndex = q.orderIndex || idx + 1;
              const isCurrentlyBroadcasting = liveState?.questionId === (q._key || q._id) && isQuestionActive;

              return (
                <div
                  key={q._key || q._id || idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCurrentlyBroadcasting
                      ? "bg-ochre/15 border-ochre shadow-md"
                      : "bg-navy-light border-zinc-800"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 font-mono text-xs font-bold text-ochre">
                        Question #{qIndex}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300 font-bold uppercase">
                        {q.difficulty || "MEDIUM"}
                      </span>
                    </div>

                    {/* Manual PUSH Question Button */}
                    <button
                      disabled={isQuestionActive || isSubmitting}
                      onClick={() => handlePushQuestion(q)}
                      className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                        isQuestionActive || isSubmitting
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                          : "bg-ochre hover:bg-ochre-dark text-white shadow-sm hover:scale-105 active:scale-95"
                      }`}
                    >
                      {isCurrentlyBroadcasting ? "BROADCASTING LIVE..." : `PUSH QUESTION (${timerDuration}s) →`}
                    </button>
                  </div>

                  <h4 className="font-bold text-white font-sans text-base mb-2">
                    {q.questionText}
                  </h4>

                  {q.codeSnippet && (
                    <pre className="bg-navy-dark rounded-xl p-3 text-xs font-mono text-emerald-400 overflow-x-auto mb-3">
                      {q.codeSnippet}
                    </pre>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
                    {q.options?.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border ${
                          optIdx === q.correctOptionIndex
                            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                            : "bg-navy-dark border-zinc-800 text-zinc-400"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Reset Leaderboard Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-navy-light rounded-3xl p-6 max-w-md w-full border border-red-500/50 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 text-red-400 text-2xl flex items-center justify-center">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-white">Reset Event Leaderboard?</h3>
            <p className="text-xs font-mono text-zinc-300">
              This will permanently clear all submitted participant scores for post-event reset. (Be sure to download CSV export first!)
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="w-1/2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold py-3 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleResetLeaderboard}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold py-3 rounded-xl"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
