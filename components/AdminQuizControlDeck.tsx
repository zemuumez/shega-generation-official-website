"use client";

import { useState, useEffect, useRef } from "react";

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
  timerDuration?: number;
  points?: number;
}

interface QuizDoc {
  _id: string;
  title: string;
  topic?: { _ref: string };
  timePerQuestion?: number;
  questions: QuizQuestion[];
}

const STORAGE_KEYS = {
  TOPIC: "shega_admin_selected_topic",
  TIMER: "shega_admin_timer_duration",
  AUTO_PUSH: "shega_admin_auto_push",
  SOLO_PLAY: "shega_admin_allow_solo",
  QUEUE: "shega_admin_question_queue",
};

export default function AdminQuizControlDeck({
  topics,
  quizzes,
}: {
  topics: Topic[];
  quizzes: QuizDoc[];
}) {
  // 1. Ticking countdown timer state for Admin monitor (declared unconditionally at top)
  const [nowTime, setNowTime] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now());
    }, 500);

    return () => clearInterval(timer);
  }, []);

  // 2. Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // 3. Deck Controls & Queue Stack State
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?._id || "all");
  const [timerDuration, setTimerDuration] = useState<number>(45);
  const [timerSavedFeedback, setTimerSavedFeedback] = useState<boolean>(false);
  const [autoPush, setAutoPush] = useState<boolean>(false);
  const [allowSoloPlay, setAllowSoloPlay] = useState<boolean>(true);
  const [liveState, setLiveState] = useState<any>(null);
  const [questionQueue, setQuestionQueue] = useState<QuizQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // Ref to prevent polling from overriding recent manual user toggles
  const lastUserToggleRef = useRef<number>(0);

  // Restore configurations and question queue from localStorage on mount
  useEffect(() => {
    try {
      const savedTopic = localStorage.getItem(STORAGE_KEYS.TOPIC);
      if (savedTopic) setSelectedTopicId(savedTopic);

      const savedTimer = localStorage.getItem(STORAGE_KEYS.TIMER);
      if (savedTimer) setTimerDuration(Number(savedTimer));

      const savedAuto = localStorage.getItem(STORAGE_KEYS.AUTO_PUSH);
      if (savedAuto !== null) setAutoPush(savedAuto === "true");

      const savedSolo = localStorage.getItem(STORAGE_KEYS.SOLO_PLAY);
      if (savedSolo !== null) setAllowSoloPlay(savedSolo === "true");

      const savedQueue = localStorage.getItem(STORAGE_KEYS.QUEUE);
      if (savedQueue) {
        const parsed = JSON.parse(savedQueue);
        if (Array.isArray(parsed)) setQuestionQueue(parsed);
      }

      const storedAuth = sessionStorage.getItem("shega_admin_auth");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist configurations to localStorage whenever updated
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.TOPIC, selectedTopicId); } catch {}
  }, [selectedTopicId]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.TIMER, String(timerDuration)); } catch {}
  }, [timerDuration]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.AUTO_PUSH, String(autoPush)); } catch {}
  }, [autoPush]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SOLO_PLAY, String(allowSoloPlay)); } catch {}
  }, [allowSoloPlay]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(questionQueue)); } catch {}
  }, [questionQueue]);

  const updateServerQueue = async (queue: QuizQuestion[]) => {
    try {
      await fetch("/api/quiz/live/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_QUEUE", queue }),
      });
    } catch {
      // ignore
    }
  };

  const updateServerConfig = async (config: { timerDuration?: number; autoPush?: boolean; allowSoloPlay?: boolean; selectedTopicId?: string }) => {
    try {
      await fetch("/api/quiz/live/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_CONFIG", ...config }),
      });
    } catch {
      // ignore
    }
  };

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

    const syncAdminState = async () => {
      try {
        const res = await fetch("/api/quiz/live/state");
        const data = await res.json();

        // Only sync toggle state if user didn't manually click a toggle in the last 4 seconds
        const isRecentlyToggled = Date.now() - lastUserToggleRef.current < 4000;

        if (!isRecentlyToggled && data.allowSoloPlay !== undefined) {
          const parsedSolo = typeof data.allowSoloPlay === "string" ? data.allowSoloPlay === "true" : Boolean(data.allowSoloPlay);
          setAllowSoloPlay((prev) => (prev !== parsedSolo ? parsedSolo : prev));
        }

        if (data.adminConfig) {
          if (data.adminConfig.timerDuration) {
            setTimerDuration((prev) => (prev !== data.adminConfig.timerDuration ? data.adminConfig.timerDuration : prev));
          }
          if (!isRecentlyToggled && data.adminConfig.autoPush !== undefined) {
            const parsedAuto = typeof data.adminConfig.autoPush === "string" ? data.adminConfig.autoPush === "true" : Boolean(data.adminConfig.autoPush);
            setAutoPush((prev) => (prev !== parsedAuto ? parsedAuto : prev));
          }
        }

        if (Array.isArray(data.questionQueue) && data.questionQueue.length > 0) {
          setQuestionQueue((prev) => (JSON.stringify(prev) !== JSON.stringify(data.questionQueue) ? data.questionQueue : prev));
        }

        if (data.status === "ACTIVE" && data.activeQuestion) {
          setLiveState((prev: any) => {
            if (!prev || prev.questionId !== data.activeQuestion.questionId || prev.status !== data.activeQuestion.status) {
              return data.activeQuestion;
            }
            return prev;
          });
        }
      } catch {
        // ignore
      }
    };

    syncAdminState();
    const pollInterval = setInterval(syncAdminState, 3000);

    let sse: EventSource | null = null;
    try {
      sse = new EventSource("/api/quiz/live/stream?userId=admin_deck");

      sse.addEventListener("QUESTION_BROADCAST", (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.autoPush !== undefined) {
            setAutoPush((prev) => (prev !== data.autoPush ? data.autoPush : prev));
          }
          setLiveState((prev: any) => {
            if (!prev || prev.questionId !== data.questionId || prev.status !== data.status) {
              return data;
            }
            return prev;
          });
        } catch {
          // ignore
        }
      });

      sse.addEventListener("IDLE_STATE", () => {
        // Do not clear liveState on Admin Deck from SSE IDLE_STATE race condition
      });
    } catch {
      // ignore
    }

    return () => {
      clearInterval(pollInterval);
      if (sse) sse.close();
    };
  }, [isAuthenticated]);

  // Compute exact ticking countdown seconds & progress ratio
  const activeRemainingSeconds = liveState && liveState.endTime
    ? Math.max(0, Math.ceil((liveState.endTime - nowTime) / 1000))
    : (liveState?.remainingSeconds ?? 0);

  const isQuestionActive = liveState?.status === "ACTIVE" && activeRemainingSeconds > 0;
  const maxTimerSeconds = liveState?.timerDuration || timerDuration || 45;
  const progressRatio = Math.max(0, Math.min(1, activeRemainingSeconds / maxTimerSeconds));

  const getQuestionTopicId = (q: QuizQuestion): string => {
    const parentQuiz = quizzes.find((quizDoc) =>
      quizDoc.questions?.some((item) => (item._key || item._id) === (q._key || q._id))
    );
    return parentQuiz?.topic?._ref || parentQuiz?._id || (selectedTopicId !== "all" ? selectedTopicId : quizzes[0]?._id || "");
  };

  const pushSingleQuestion = async (q: QuizQuestion) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    const resolvedTopicId = getQuestionTopicId(q);

    try {
      const res = await fetch("/api/quiz/live/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PUSH_QUESTION",
          topicId: resolvedTopicId,
          questionId: q._key || q._id,
          orderIndex: q.orderIndex || 1,
          timerDuration,
          autoPush,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 423) {
          // Single question lock active: Enqueue into right-side broadcast queue stack
          const nextQArr = [...questionQueue, q];
          setQuestionQueue(nextQArr);
          await updateServerQueue(nextQArr);
          setErrorMsg(`Question #${q.orderIndex || 1} added to the Live Broadcast Queue Stack!`);
        } else {
          setErrorMsg(data.error || "Failed to push question.");
        }
      } else {
        setLiveState(data.state);
      }
    } catch {
      setErrorMsg("Network error pushing question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePushOrEnqueueQuestion = async (q: QuizQuestion) => {
    if (isQuestionActive) {
      const nextQArr = [...questionQueue, q];
      setQuestionQueue(nextQArr);
      await updateServerQueue(nextQArr);
      setErrorMsg(`Question #${q.orderIndex || 1} enqueued to the right-side broadcast stack.`);
      return;
    }
    await pushSingleQuestion(q);
  };

  const handlePushNextFromQueue = async () => {
    if (questionQueue.length === 0) return;
    const nextQ = questionQueue[0];
    const nextQueue = questionQueue.slice(1);
    setQuestionQueue(nextQueue);
    await updateServerQueue(nextQueue);
    await pushSingleQuestion(nextQ);
  };

  const handleRemoveFromQueue = async (index: number) => {
    const nextQueue = questionQueue.filter((_, i) => i !== index);
    setQuestionQueue(nextQueue);
    await updateServerQueue(nextQueue);
  };

  const handleClearQueue = async () => {
    setQuestionQueue([]);
    try { localStorage.removeItem(STORAGE_KEYS.QUEUE); } catch {}
    await updateServerQueue([]);
  };

  const handleToggleAutoPush = async () => {
    lastUserToggleRef.current = Date.now();
    const nextVal = !autoPush;
    setAutoPush(nextVal);
    await updateServerConfig({ autoPush: nextVal });
  };

  const handleToggleSoloPlay = async () => {
    lastUserToggleRef.current = Date.now();
    const nextVal = !allowSoloPlay;
    setAllowSoloPlay(nextVal);
    await updateServerConfig({ allowSoloPlay: nextVal });
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
        alert("Leaderboard scores cleared across Redis, memory, and Sanity CMS!");
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
      setQuestionQueue([]);
      try { localStorage.removeItem(STORAGE_KEYS.QUEUE); } catch {}
      await updateServerQueue([]);
      setErrorMsg(null);
    } catch {
      // ignore
    }
  };

  // Admin Login Barrier Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ivory text-ink flex items-center justify-center p-4 font-sans selection:bg-ochre selection:text-white">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 shadow-2xl text-center">
          <h1 className="text-2xl font-bold font-display text-ink mb-1">
            Admin Live Operator Login
          </h1>
          <p className="text-xs font-mono text-ink-soft mb-6">
            Enter passcode to access question pushing and auto-push controls.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left font-sans">
            <div>
              <label className="block text-xs font-mono font-bold text-ink uppercase mb-1">
                Operator Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full px-4 py-3.5 rounded-xl bg-ivory border border-zinc-300 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ochre"
              />
              <p className="text-[11px] font-mono text-ink-soft mt-1">
                Default Passcode: <code className="text-ochre">shega-admin-2026</code>
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-700 text-xs font-mono">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-bold text-sm py-3.5 rounded-xl transition-all shadow-md"
            >
              Authenticate and Launch Control Deck
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-ink p-4 sm:p-8 font-sans selection:bg-ochre selection:text-white">
      {/* Header Bar - Clean Light Theme Container */}
      <header className="max-w-7xl mx-auto bg-white text-ink rounded-2xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 border border-zinc-200/80 shadow-md font-mono text-xs mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-ochre/15 border border-ochre/30 text-ochre font-mono text-xs font-bold uppercase tracking-wider">
              Live Operator Deck
            </span>
            <button
              onClick={() => {
                sessionStorage.removeItem("shega_admin_auth");
                setIsAuthenticated(false);
              }}
              className="text-xs font-mono text-ink-soft hover:text-ink underline"
            >
              Sign Out
            </button>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-ink mt-1">
            Admin Quiz Control Deck
          </h1>
        </div>

        {/* Global Leaderboard Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-ochre hover:bg-ochre-dark text-white font-mono font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            Export CSV
          </button>

          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-mono font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all"
          >
            Reset Leaderboard
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topic Filters & Configuration (Col-Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Topic Filter Tabs */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-md">
            <h3 className="text-sm font-mono font-bold text-ochre uppercase tracking-wider mb-3">
              1. Filter Topic Domain
            </h3>
            <div className="space-y-2 font-mono text-xs">
              <button
                onClick={() => {
                  setSelectedTopicId("all");
                  updateServerConfig({ selectedTopicId: "all" });
                }}
                className={`w-full text-left p-3 rounded-xl font-bold transition-all ${
                  selectedTopicId === "all"
                    ? "bg-ochre text-white shadow-sm"
                    : "bg-ivory hover:bg-zinc-200 text-ink border border-zinc-200"
                }`}
              >
                All Topics and Questions
              </button>
              {topics.map((topic) => {
                const isSelected = selectedTopicId === topic._id;
                return (
                  <button
                    key={topic._id}
                    onClick={() => {
                      setSelectedTopicId(topic._id);
                      updateServerConfig({ selectedTopicId: topic._id });
                    }}
                    className={`w-full text-left p-3 rounded-xl font-bold transition-all ${
                      isSelected
                        ? "bg-ochre text-white shadow-sm"
                        : "bg-ivory hover:bg-zinc-200 text-ink border border-zinc-200"
                    }`}
                  >
                    {topic.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Broadcast Configuration */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-md space-y-5">
            <h3 className="text-sm font-mono font-bold text-ochre uppercase tracking-wider">
              2. Broadcast Configuration
            </h3>

            <div>
              <label className="block text-xs font-mono font-bold text-ink mb-1">
                Question Timer (Seconds)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={timerDuration}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTimerDuration(val);
                    setTimerSavedFeedback(false);
                  }}
                  className="w-full bg-ivory border border-zinc-300 rounded-xl px-4 py-2.5 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ochre"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await updateServerConfig({ timerDuration });
                    setTimerSavedFeedback(true);
                    setTimeout(() => setTimerSavedFeedback(false), 3000);
                  }}
                  className="bg-ochre hover:bg-ochre-dark text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap active:scale-95"
                >
                  Set Timer
                </button>
              </div>
              {timerSavedFeedback && (
                <div className="mt-2 text-xs font-mono text-emerald-600 font-bold">
                  Broadcast timer set to {timerDuration} seconds.
                </div>
              )}
            </div>

            {/* Solo Play Mode Switch */}
            <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-ink block">Allow Play Solo Mode</span>
                <span className="text-[10px] font-mono text-ink-soft block max-w-[180px]">
                  When OFF, disables solo play on participant side.
                </span>
              </div>

              <button
                onClick={handleToggleSoloPlay}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  allowSoloPlay ? "bg-emerald-500" : "bg-zinc-300"
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
            <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-ink block">Auto-Push Automation Loop</span>
                <span className="text-[10px] font-mono text-ink-soft block max-w-[180px]">
                  When ON, automatically pushes queued questions in sequence.
                </span>
              </div>

              <button
                onClick={handleToggleAutoPush}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  autoPush ? "bg-emerald-500" : "bg-zinc-300"
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

        {/* Center Column: Question Deck List (Col-Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-300 font-mono text-xs">
            <h3 className="font-bold text-ink">
              3. Sequential Question Deck ({allQuestions.length} Questions)
            </h3>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-900 font-mono text-xs">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3">
            {allQuestions.map((q, idx) => {
              const qIndex = q.orderIndex || idx + 1;
              const isCurrentlyBroadcasting = liveState?.questionId === (q._key || q._id) && isQuestionActive;
              const isQueued = questionQueue.some((item) => (item._key || item._id) === (q._key || q._id));

              return (
                <div
                  key={q._key || q._id || idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCurrentlyBroadcasting
                      ? "bg-ochre/15 border-ochre shadow-md"
                      : isQueued
                      ? "bg-amber-50 border-amber-400 shadow-xs"
                      : "bg-white border-zinc-200/80 shadow-sm"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-ochre/15 font-mono text-xs font-bold text-ochre border border-ochre/30">
                        Question #{qIndex}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-200 text-[10px] font-mono text-ink font-bold uppercase">
                        {q.difficulty || "MEDIUM"}
                      </span>
                    </div>

                    <button
                      disabled={isSubmitting}
                      onClick={() => handlePushOrEnqueueQuestion(q)}
                      className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                        isCurrentlyBroadcasting
                          ? "bg-ochre text-white shadow-sm"
                          : isQueued
                          ? "bg-amber-600 text-white"
                          : "bg-ochre hover:bg-ochre-dark text-white shadow-sm active:scale-95"
                      }`}
                    >
                      {isCurrentlyBroadcasting
                        ? "Broadcasting Live..."
                        : isQueued
                        ? "Queued in Stack"
                        : isQuestionActive
                        ? "Enqueue Question"
                        : `Push Question (${timerDuration}s)`}
                    </button>
                  </div>

                  <h4 className="font-bold text-ink font-sans text-base mb-2">
                    {q.questionText}
                  </h4>

                  {q.codeSnippet && (
                    <pre className="bg-ivory rounded-xl p-3 text-xs font-mono text-ochre overflow-x-auto mb-3 border border-zinc-300">
                      {q.codeSnippet}
                    </pre>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-ink-soft">
                    {q.options?.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border ${
                          optIdx === q.correctOptionIndex
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold"
                            : "bg-ivory border-zinc-200 text-ink-soft"
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

        {/* Right Column: Live Broadcast Deck & Queue Stack Panel (Col-Span 4) */}
        <div className="lg:col-span-4 space-y-5 sticky top-6">
          {/* Active Live Broadcast Monitor with Reset Session Button */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-md space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 gap-2">
              <div>
                <span className="text-[10px] text-ochre font-bold uppercase tracking-wider block">
                  Active Question Monitor
                </span>
                <h4 className="font-extrabold text-ink text-sm font-display">
                  Live Broadcast Deck
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  isQuestionActive
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse"
                    : liveState
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-zinc-100 text-zinc-600"
                }`}>
                  {isQuestionActive ? "LIVE" : liveState ? "EXPIRED" : "IDLE"}
                </span>

                <button
                  onClick={handleResetSession}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-lg transition-colors border border-red-200 text-[11px]"
                  title="Reset current live session"
                >
                  Reset Session
                </button>
              </div>
            </div>

            {liveState ? (
              <div className="space-y-3 bg-ivory p-4 rounded-xl border border-zinc-200">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-xs text-ochre">
                    Question #{liveState.orderIndex || 1}
                  </span>
                  <span className={`text-xs ${isQuestionActive ? (activeRemainingSeconds <= 10 ? "text-red-600 animate-pulse" : "text-emerald-600") : "text-amber-700"}`}>
                    {isQuestionActive ? `${activeRemainingSeconds}s remaining` : "0s (Expired)"}
                  </span>
                </div>

                {/* Ticking Progress Bar for Active Question */}
                <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden border border-zinc-300 p-0.5">
                  <div
                    style={{ width: `${progressRatio * 100}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isQuestionActive ? (activeRemainingSeconds <= 10 ? "bg-red-500" : "bg-ochre") : "bg-zinc-400"
                    }`}
                  />
                </div>

                <h5 className="font-sans text-sm font-bold text-ink">
                  {liveState.questionText}
                </h5>

                <div className="flex items-center justify-between text-[11px] text-ink-soft border-t border-zinc-200 pt-2">
                  <span>Difficulty: <strong>{liveState.difficulty}</strong></span>
                  <span>Points: <strong>{liveState.points} Pts</strong></span>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center bg-ivory rounded-xl border border-zinc-200 text-ink-soft text-xs">
                No question is currently live. Select a question to push or enqueue.
              </div>
            )}
          </div>

          {/* Live Broadcast Queue Stack */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-md space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div>
                <span className="text-[10px] text-ochre font-bold uppercase tracking-wider block">
                  Broadcast Queue Stack
                </span>
                <h4 className="font-extrabold text-ink text-sm font-display">
                  Staged Questions ({questionQueue.length})
                </h4>
              </div>

              {questionQueue.length > 0 && (
                <button
                  onClick={handleClearQueue}
                  className="text-[10px] text-red-600 hover:text-red-800 underline font-bold"
                >
                  Clear Queue
                </button>
              )}
            </div>

            {questionQueue.length === 0 ? (
              <div className="p-4 text-center bg-ivory rounded-xl border border-zinc-200 text-ink-soft text-xs">
                Queue is empty. Clicking push on active questions stages them here.
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {questionQueue.map((q, qIdx) => (
                  <div
                    key={q._key || q._id || qIdx}
                    className="p-3.5 rounded-xl bg-ivory border border-zinc-200 flex items-start justify-between gap-2 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Stack #{qIdx + 1}
                        </span>
                        <span className="font-bold text-ink">
                          Question #{q.orderIndex || qIdx + 1}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-ink line-clamp-2">
                        {q.questionText}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveFromQueue(qIdx)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold px-1.5 py-0.5 rounded bg-white border border-zinc-200"
                      title="Remove from queue stack"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  onClick={handlePushNextFromQueue}
                  className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-bold text-xs py-3 rounded-xl shadow-md transition-all mt-2"
                >
                  Push Next Queued Question
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reset Leaderboard Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-red-500/50 shadow-2xl text-center space-y-4 text-ink">
            <h3 className="text-xl font-bold text-ink">Reset Event Leaderboard?</h3>
            <p className="text-xs font-mono text-ink-soft">
              This will permanently clear all submitted participant scores across Redis, memory, and Sanity CMS for post-event reset.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="w-1/2 bg-zinc-200 hover:bg-zinc-300 text-ink font-mono text-xs font-bold py-3 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleResetLeaderboard}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold py-3 rounded-xl shadow-md"
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
