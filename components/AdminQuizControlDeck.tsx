"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?._id || "all");
  const [timerDuration, setTimerDuration] = useState<number>(45); // Default 45 seconds per question
  const [autoPush, setAutoPush] = useState<boolean>(false);
  const [liveState, setLiveState] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter quizzes by selected topic
  const filteredQuizzes = quizzes.filter((q) => {
    if (selectedTopicId === "all") return true;
    return q.topic?._ref === selectedTopicId || q._id === selectedTopicId;
  });

  const allQuestions = filteredQuizzes.flatMap((q) => q.questions || []);
  allQuestions.sort((a, b) => (a.orderIndex || 1) - (b.orderIndex || 1));

  // Connect to live SSE stream for real-time deck status
  useEffect(() => {
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
  }, []);

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

  const isQuestionActive = liveState?.status === "ACTIVE" && (liveState?.remainingSeconds ?? 0) > 0;

  return (
    <div className="min-h-screen bg-[#0A192F] text-white p-4 sm:p-8 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="px-3 py-1 rounded-full bg-ochre/20 text-ochre font-mono text-xs font-bold uppercase tracking-wider">
            Live Operator Deck
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white mt-1">
            Admin Live Control Deck
          </h1>
        </div>

        {/* Global Live Status Monitor */}
        <div className="flex items-center gap-4 bg-[#0F172A] p-4 rounded-2xl border border-zinc-800 font-mono text-xs">
          <div>
            <span className="text-zinc-400 block text-[10px]">LIVE STATUS</span>
            <strong className={`font-bold text-sm ${isQuestionActive ? "text-emerald-400" : "text-amber-400"}`}>
              {isQuestionActive ? `BROADCASTING (#${liveState.orderIndex})` : "IDLE / READY"}
            </strong>
          </div>

          <div>
            <span className="text-zinc-400 block text-[10px]">TIMER REMAINING</span>
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
      </header>

      <main className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Topics & Global Controls */}
        <div className="space-y-6">
          {/* Topic Filter Tabs */}
          <div className="bg-[#0F172A] rounded-2xl p-5 border border-zinc-800">
            <h3 className="text-sm font-mono font-bold text-ochre uppercase tracking-wider mb-3">
              1. Topic Filter
            </h3>
            <div className="space-y-2 font-mono text-xs">
              <button
                onClick={() => setSelectedTopicId("all")}
                className={`w-full text-left p-3 rounded-xl font-bold transition-all ${
                  selectedTopicId === "all"
                    ? "bg-ochre text-white shadow-sm"
                    : "bg-black/30 hover:bg-black/50 text-zinc-300"
                }`}
              >
                🌐 All Topics
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
                        : "bg-black/30 hover:bg-black/50 text-zinc-300"
                    }`}
                  >
                    📂 {topic.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Timer Engine & Auto-Push Toggle */}
          <div className="bg-[#0F172A] rounded-2xl p-5 border border-zinc-800 space-y-5">
            <h3 className="text-sm font-mono font-bold text-ochre uppercase tracking-wider">
              2. Broadcast Controls
            </h3>

            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                Default Question Timer (Seconds)
              </label>
              <input
                type="number"
                min={5}
                max={300}
                value={timerDuration}
                onChange={(e) => setTimerDuration(Number(e.target.value))}
                className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-ochre"
              />
              <p className="text-[11px] font-mono text-zinc-400 mt-1">
                Default set to <strong>45s</strong>. Customizable per question before push.
              </p>
            </div>

            {/* Auto-Push Loop Switch */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white block">Auto-Push Automation Loop</span>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  Automatically launches question #orderIndex+1 after 5s Leaderboard Intermission.
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

        {/* Right Column: Sequential Question Control List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 font-mono text-xs">
            <h3 className="font-bold text-white">
              Question Deck ({allQuestions.length} Questions)
            </h3>
            {isQuestionActive && (
              <span className="text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                🔒 PUSH LOCKED (Timer Active)
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
                      : "bg-[#0F172A] border-zinc-800"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 font-mono text-xs font-bold text-ochre">
                        #{qIndex}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300 font-bold uppercase">
                        {q.difficulty || "MEDIUM"}
                      </span>
                    </div>

                    {/* Push Question Action Button */}
                    <button
                      disabled={isQuestionActive || isSubmitting}
                      onClick={() => handlePushQuestion(q)}
                      className={`px-5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                        isQuestionActive || isSubmitting
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                          : "bg-ochre hover:bg-ochre-dark text-white shadow-sm hover:scale-105 active:scale-95"
                      }`}
                    >
                      {isCurrentlyBroadcasting ? "BROADCASTING LIVE..." : "PUSH QUESTION →"}
                    </button>
                  </div>

                  <h4 className="font-bold text-white font-sans text-base mb-2">
                    {q.questionText}
                  </h4>

                  {q.codeSnippet && (
                    <pre className="bg-black/60 rounded-xl p-3 text-xs font-mono text-emerald-400 overflow-x-auto mb-3">
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
                            : "bg-black/20 border-zinc-800 text-zinc-400"
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
    </div>
  );
}
