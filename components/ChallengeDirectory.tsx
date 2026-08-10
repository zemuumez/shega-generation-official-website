"use client";

import { useState, useEffect, useRef } from "react";

interface QuizQuestion {
  questionText: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  points?: number;
}

interface ChallengeQuiz {
  _id: string;
  title: string;
  slug?: { current: string };
  category: string;
  difficulty: string;
  description: string;
  timePerQuestion: number;
  isPublished: boolean;
  isFeatured?: boolean;
  questions: QuizQuestion[];
}

interface LeaderboardEntry {
  _id: string;
  participantName: string;
  participantHandle?: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  completedAt: string;
  quizTitle?: string;
  quizId?: string;
}

const STORAGE_KEY = "shega_quiz_participant";

const CATEGORIES = [
  {
    id: "Live Timed Quiz",
    title: "LIVE TIMED QUIZ",
    subtitle: "Topic: Web Dev, AI & Cyber",
    description: "Real-time synchronized battle with live countdowns and instant scoring.",
    locked: false,
    active: true,
  },
  {
    id: "Timed Q&A",
    title: "TIMED Q&A",
    subtitle: "Rapid-fire questions",
    description: "Solo time-bound technical challenges.",
    locked: true,
    badge: "Locked - Coming Soon",
  },
  {
    id: "Mini CTF",
    title: "MINI CTF",
    subtitle: "Cybersecurity & Logic",
    description: "Capture the flag security puzzles and exploit challenges.",
    locked: true,
    badge: "Locked - Coming Soon",
  },
  {
    id: "Hometake Assignment",
    title: "HOMETAKE ASSIGNMENT",
    subtitle: "Deep-dive coding",
    description: "Take-home engineering tasks and portfolio builds.",
    locked: true,
    badge: "Locked - Coming Soon",
  },
  {
    id: "Modern Challenges",
    title: "MODERN CHALLENGES",
    subtitle: "Innovation sprint",
    description: "Hackathon sprints and emerging AI architecture challenges.",
    locked: true,
    badge: "Locked - Coming Soon",
  },
];

export default function ChallengeDirectory({
  quizzes,
  leaderboard: initialLeaderboard,
  customTitle,
  customSubtitle,
}: {
  quizzes: ChallengeQuiz[];
  leaderboard: LeaderboardEntry[];
  customTitle?: string;
  customSubtitle?: string;
}) {
  const [mainView, setMainView] = useState<"challenges" | "leaderboard">("challenges");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard || []);
  const [selectedQuiz, setSelectedQuiz] = useState<ChallengeQuiz | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Registered Participant State
  const [playerName, setPlayerName] = useState("");
  const [playerHandle, setPlayerHandle] = useState("");

  // Restore real participant profile from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Date.now() < parsed.expiryTimestamp) {
          setPlayerName(parsed.playerName || "");
          setPlayerHandle(parsed.playerHandle || "");
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Quiz Engine State
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Quiz Results State
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRank, setLastRank] = useState<number | null>(null);

  // Leaderboard & Solo Play State
  const [leaderboardFilter, setLeaderboardFilter] = useState("all");
  const [allowSoloPlay, setAllowSoloPlay] = useState<boolean>(true);

  // Fetch updated leaderboard & live state
  const fetchLeaderboardAndLiveState = async () => {
    try {
      const res = await fetch("/api/challenges/leaderboard");
      const data = await res.json();
      if (data.ok && Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
    } catch {
      // ignore
    }

    try {
      const stateRes = await fetch("/api/quiz/live/state");
      const stateData = await stateRes.json();
      if (stateData.allowSoloPlay !== undefined) {
        const parsedSolo = typeof stateData.allowSoloPlay === "string" ? stateData.allowSoloPlay === "true" : Boolean(stateData.allowSoloPlay);
        setAllowSoloPlay(parsedSolo);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchLeaderboardAndLiveState();

    const sse = new EventSource("/api/quiz/live/stream?userId=hub_directory");

    const handleStreamMsg = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.allowSoloPlay !== undefined) {
          const parsedSolo = typeof data.allowSoloPlay === "string" ? data.allowSoloPlay === "true" : Boolean(data.allowSoloPlay);
          setAllowSoloPlay(parsedSolo);
        }
      } catch {
        // ignore
      }
    };

    sse.addEventListener("QUESTION_BROADCAST", handleStreamMsg);
    sse.addEventListener("CONNECTED", handleStreamMsg);

    const interval = setInterval(fetchLeaderboardAndLiveState, 2000);

    return () => {
      clearInterval(interval);
      sse.close();
    };
  }, []);

  // Handle Question Countdown Timer
  useEffect(() => {
    if (!quizStarted || quizCompleted || !selectedQuiz) return;

    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const timeLimit = selectedQuiz.timePerQuestion || 20;
    setTimeLeft(timeLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleNextQuestion(null, 0);
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent((t) => t + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizStarted, currentQuestionIndex, quizCompleted, selectedQuiz]);

  const startQuizRegistration = (quiz: ChallengeQuiz) => {
    setSelectedQuiz(quiz);
    setShowRegistrationModal(true);
  };

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setShowRegistrationModal(false);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setCorrectCount(0);
    setTotalTimeSpent(0);
    setQuizCompleted(false);
  };

  const handleNextQuestion = (optionIndex: number | null, pointsEarned: number = 0) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const updatedAnswers = [...userAnswers, optionIndex ?? -1];
    setUserAnswers(updatedAnswers);

    const isCorrect = optionIndex !== null && selectedQuiz?.questions[currentQuestionIndex]?.correctOptionIndex === optionIndex;

    if (isCorrect) {
      setScore((s) => s + pointsEarned);
      setCorrectCount((c) => c + 1);
    }

    if (selectedQuiz && currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz(updatedAnswers, isCorrect ? score + pointsEarned : score, isCorrect ? correctCount + 1 : correctCount);
    }
  };

  const finishQuiz = async (finalAnswers: number[], finalScore: number, finalCorrectCount: number) => {
    setQuizCompleted(true);
    setIsSubmitting(true);

    const handleTag = playerHandle.startsWith("@")
      ? playerHandle
      : playerHandle
      ? `@${playerHandle}`
      : `@${playerName.toLowerCase().replace(/\s+/g, "_")}`;

    const submissionPayload = {
      participantName: playerName,
      participantHandle: handleTag,
      quizId: selectedQuiz?._id || "demo-quiz-1",
      score: finalScore,
      totalQuestions: selectedQuiz?.questions.length || 5,
      correctCount: finalCorrectCount,
      timeSpentSeconds: totalTimeSpent,
    };

    try {
      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionPayload),
      });

      const data = await res.json();
      if (data.ok && data.entry) {
        const newLeaderboard = [data.entry, ...leaderboard].sort((a, b) => b.score - a.score);
        setLeaderboard(newLeaderboard);
        const rank = newLeaderboard.findIndex((item) => item._id === data.entry._id) + 1;
        setLastRank(rank > 0 ? rank : 1);
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter((item) => {
    if (leaderboardFilter === "all") return true;
    return item.quizId === leaderboardFilter || item.quizTitle === leaderboardFilter;
  });

  // Logged-in user matching entry for sticky row - dynamically synced with real data
  const currentUserEntry = leaderboard.find(
    (item) => (playerName && item.participantName === playerName) || (playerHandle && item.participantHandle === playerHandle)
  ) || {
    participantName: playerName || "Guest Participant",
    participantHandle: playerHandle || "@guest",
    score: score || 0,
    correctCount: correctCount || 0,
    totalQuestions: userAnswers.length || 0,
    timeSpentSeconds: totalTimeSpent || 0,
  };

  const calculatedAccuracy = currentUserEntry.totalQuestions > 0
    ? Math.round((currentUserEntry.correctCount / currentUserEntry.totalQuestions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-ivory text-ink pb-24 selection:bg-ochre selection:text-white">
      {/* 1. Hero Header - Clean English Design System */}
      <section className="relative bg-white text-ink pt-14 pb-14 px-4 sm:px-6 border-b border-zinc-200/80 shadow-xs">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ochre/15 border border-ochre/40 text-ochre text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
            <span>SHEGA ARENA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-ink mb-3">
            {customTitle ? customTitle.replace(/\(ሸጋ አሬና\)\s*/g, "") : "SHEGA ARENA: SELECT YOUR CHALLENGE"}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ink-soft font-sans leading-relaxed mb-8">
            {customSubtitle || "Test your skills, represent Ethiopia, and rise the leaderboard."}
          </p>

          {/* View Switcher: Challenges vs Leaderboard */}
          <div className="inline-flex p-1.5 rounded-2xl bg-ivory border border-zinc-300 gap-2">
            <button
              onClick={() => setMainView("challenges")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
                mainView === "challenges"
                  ? "bg-ochre text-white shadow-md font-extrabold"
                  : "text-ink-soft hover:text-ink hover:bg-zinc-200"
              }`}
            >
              Challenge Hub
            </button>
            <button
              onClick={() => setMainView("leaderboard")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
                mainView === "leaderboard"
                  ? "bg-ochre text-white shadow-md font-extrabold"
                  : "text-ink-soft hover:text-ink hover:bg-zinc-200"
              }`}
            >
              Hall of Fame
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Content View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        {mainView === "challenges" ? (
          <div className="space-y-12">
            {/* Challenge Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map((cat) => {
                const isLive = !cat.locked;

                return (
                  <div
                    key={cat.id}
                    className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                      isLive
                        ? "bg-white border-ochre shadow-md ring-1 ring-ochre/40 hover:scale-[1.02]"
                        : "bg-ivory/80 border-zinc-300 opacity-75 grayscale hover:grayscale-0"
                    }`}
                  >
                    <div>
                      {/* Badge / Status */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ochre/15 border border-ochre/40 text-ochre text-[11px] font-mono font-extrabold uppercase animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-ochre" />
                            <span>LIVE ARENA ACTIVE</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200 border border-zinc-300 text-zinc-600 text-[11px] font-mono font-bold uppercase">
                            <span>{cat.badge}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold font-display text-ink mb-2">
                        {cat.title}
                      </h3>

                      <p className="text-xs font-mono text-ochre font-bold mb-3">
                        {cat.subtitle}
                      </p>

                      <p className="text-xs text-ink-soft font-sans leading-relaxed mb-6">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
                      {isLive ? (
                        <>
                          <a
                            href="/challenges/quiz/web-dev-algorithms"
                            className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-extrabold text-xs py-3 rounded-xl shadow-md transition-all text-center"
                          >
                            Enter Arena
                          </a>
                        </>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-zinc-200 text-zinc-500 font-mono font-bold text-xs py-3 rounded-xl cursor-not-allowed border border-zinc-300"
                        >
                          Locked - Coming Soon
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Quizzes List Section */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
                <div>
                  <span className="text-xs font-mono font-bold text-ochre uppercase tracking-wider block mb-1">
                    Live Broadcast Topics
                  </span>
                  <h2 className="text-2xl font-bold font-display text-ink">
                    Available Live Challenge Rooms
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="bg-ivory rounded-2xl p-6 border border-zinc-200/80 flex flex-col justify-between hover:border-ochre transition-all shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-ochre/15 border border-ochre/30 text-ochre text-xs font-mono font-bold uppercase">
                          {quiz.category || "Live Timed Quiz"}
                        </span>
                        <span className="text-xs font-mono font-bold text-ink-soft">
                          {quiz.timePerQuestion || 45}s / question
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-display text-ink mb-2">
                        {quiz.title}
                      </h3>

                      <p className="text-xs text-ink-soft font-sans leading-relaxed mb-6">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-3">
                      <div className="text-xs font-mono text-ink-soft">
                        Difficulty: <strong className="text-ink">{quiz.difficulty || "MEDIUM"}</strong> ({quiz.questions?.length || 4} Qs)
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`/challenges/quiz/${quiz.slug?.current || quiz._id}`}
                          className="bg-ochre hover:bg-ochre-dark text-white font-mono font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
                        >
                          Join Live Arena
                        </a>
                        {allowSoloPlay ? (
                          <button
                            onClick={() => startQuizRegistration(quiz)}
                            className="bg-zinc-800 hover:bg-black text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-700 transition-all shadow-xs"
                          >
                            Play Solo
                          </button>
                        ) : (
                          <span className="bg-zinc-200 text-zinc-500 font-mono font-bold text-[11px] px-3 py-2 rounded-xl border border-zinc-300 cursor-not-allowed">
                            Solo Disabled for Live Event
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* PAGE 2: Leaderboard View */
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-2xl relative overflow-hidden text-ink">
              <div className="text-center mb-8 pb-6 border-b border-zinc-200">
                <span className="text-xs font-mono font-bold text-ochre uppercase tracking-wider block mb-2">
                  OFFICIAL RANKINGS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-ink mb-2">
                  THE SHEGA HALL OF FAME
                </h2>
                <p className="text-xs font-mono text-ink-soft">
                  Dynamic difficulty weighting: EASY (100 Pts), MEDIUM (200 Pts), HARD (400 Pts) + Speed Bonus
                </p>
              </div>

              {/* Segmented Filtering Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-ivory p-2 rounded-2xl border border-zinc-200">
                {["all", ...quizzes.map((q) => q._id)].map((id) => {
                  const label = id === "all" ? "Live Quiz" : quizzes.find((q) => q._id === id)?.title || id;
                  const isSelected = leaderboardFilter === id;

                  return (
                    <button
                      key={id}
                      onClick={() => setLeaderboardFilter(id)}
                      className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-ochre text-white shadow-sm"
                          : "text-ink-soft hover:text-ink hover:bg-zinc-200"
                      }`}
                    >
                      [ {label} ]
                    </button>
                  );
                })}
              </div>

              {/* Top 3 Podium */}
              {filteredLeaderboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* Rank 2 */}
                  <div className="bg-ivory rounded-2xl p-5 border border-zinc-300 text-center order-2 md:order-1 flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-600 uppercase block mb-1">
                        RANK #2
                      </span>
                      <div className="w-12 h-12 mx-auto rounded-full bg-zinc-300 text-black font-mono font-bold text-base flex items-center justify-center mb-2 shadow-sm">
                        {filteredLeaderboard[1].participantName.slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-extrabold text-ink font-display text-base">
                        {filteredLeaderboard[1].participantName}
                      </h4>
                      <p className="text-xs font-mono text-ochre font-semibold">
                        {filteredLeaderboard[1].participantHandle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-300 flex justify-around text-xs font-mono">
                      <div>
                        <span className="text-ink-soft block text-[10px]">SCORE</span>
                        <strong className="text-ink font-bold">{filteredLeaderboard[1].score} Pts</strong>
                      </div>
                      <div>
                        <span className="text-ink-soft block text-[10px]">ACCURACY</span>
                        <strong className="text-ochre font-bold">
                          {Math.round(((filteredLeaderboard[1].correctCount || 18) / (filteredLeaderboard[1].totalQuestions || 20)) * 100)}%
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Rank 1 - Champion */}
                  <div className="bg-ivory rounded-2xl p-6 border-2 border-amber-400 text-center order-1 md:order-2 flex flex-col justify-between shadow-md md:-translate-y-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-600 uppercase block mb-1">
                        CHAMPION #1
                      </span>
                      <div className="w-14 h-14 mx-auto rounded-full bg-amber-400 text-black font-mono font-bold text-xl flex items-center justify-center mb-2 shadow-md ring-4 ring-amber-400/30">
                        {filteredLeaderboard[0].participantName.slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-black text-ink font-display text-lg">
                        {filteredLeaderboard[0].participantName}
                      </h4>
                      <p className="text-xs font-mono text-amber-600 font-bold">
                        {filteredLeaderboard[0].participantHandle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-300 flex justify-around text-xs font-mono">
                      <div>
                        <span className="text-ink-soft block text-[10px]">SCORE</span>
                        <strong className="text-ink font-bold text-base">{filteredLeaderboard[0].score} Pts</strong>
                      </div>
                      <div>
                        <span className="text-ink-soft block text-[10px]">ACCURACY</span>
                        <strong className="text-amber-600 font-bold text-sm">
                          {Math.round(((filteredLeaderboard[0].correctCount || 19) / (filteredLeaderboard[0].totalQuestions || 20)) * 100)}%
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Rank 3 */}
                  <div className="bg-ivory rounded-2xl p-5 border border-amber-700/40 text-center order-3 flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-700 uppercase block mb-1">
                        RANK #3
                      </span>
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-700 text-white font-mono font-bold text-base flex items-center justify-center mb-2 shadow-sm">
                        {filteredLeaderboard[2].participantName.slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-extrabold text-ink font-display text-base">
                        {filteredLeaderboard[2].participantName}
                      </h4>
                      <p className="text-xs font-mono text-ochre font-semibold">
                        {filteredLeaderboard[2].participantHandle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-300 flex justify-around text-xs font-mono">
                      <div>
                        <span className="text-ink-soft block text-[10px]">SCORE</span>
                        <strong className="text-ink font-bold">{filteredLeaderboard[2].score} Pts</strong>
                      </div>
                      <div>
                        <span className="text-ink-soft block text-[10px]">ACCURACY</span>
                        <strong className="text-ochre font-bold">
                          {Math.round(((filteredLeaderboard[2].correctCount || 16) / (filteredLeaderboard[2].totalQuestions || 20)) * 100)}%
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Leaderboard Table */}
              <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-ivory border-b border-zinc-200 text-ink-soft font-bold">
                      <th className="p-4 text-center">RANK</th>
                      <th className="p-4">PARTICIPANT</th>
                      <th className="p-4 text-center">SCORE</th>
                      <th className="p-4 text-center">ACCURACY</th>
                      <th className="p-4 text-center">TIME (S)</th>
                      <th className="p-4 text-right">DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredLeaderboard.map((item, idx) => {
                      const rank = idx + 1;
                      const isMe = (playerName && item.participantName === playerName) || (playerHandle && item.participantHandle === playerHandle);

                      return (
                        <tr
                          key={item._id || idx}
                          className={`transition-colors ${
                            isMe
                              ? "bg-ochre/15 font-bold text-ink"
                              : rank === 1
                              ? "bg-amber-500/10 font-bold"
                              : "hover:bg-ivory"
                          }`}
                        >
                          <td className="p-4 text-center font-bold">
                            #{rank}
                          </td>
                          <td className="p-4">
                            <strong className="block text-ink font-sans text-sm">{item.participantName}</strong>
                            <span className="text-ink-soft text-[11px]">{item.participantHandle || "@student"}</span>
                          </td>
                          <td className="p-4 text-center">
                            <strong className="text-ochre font-extrabold text-sm">{item.score} Pts</strong>
                          </td>
                          <td className="p-4 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-zinc-200 text-ink text-[11px] font-bold">
                              {Math.round(((item.correctCount || 1) / (item.totalQuestions || 1)) * 100)}% ({item.correctCount}/{item.totalQuestions})
                            </span>
                          </td>
                          <td className="p-4 text-center text-ink-soft">
                            {item.timeSpentSeconds || 30}s
                          </td>
                          <td className="p-4 text-right text-ink-soft text-[11px]">
                            {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : "Today"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* STICKY "YOU" RANK FOOTER BAR - Real Data Sync */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white text-ink border-t border-zinc-200/80 p-3.5 shadow-2xl font-mono text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-ochre text-white font-bold flex items-center justify-center text-xs">
              YOU
            </span>
            <div>
              <strong className="text-ink block font-sans text-sm">{currentUserEntry.participantName}</strong>
              <span className="text-ink-soft text-[10px]">{currentUserEntry.participantHandle}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-ink-soft block text-[9px]">YOUR SCORE</span>
              <strong className="text-ochre font-extrabold text-sm">{currentUserEntry.score} Pts</strong>
            </div>

            <div className="text-center hidden sm:block">
              <span className="text-ink-soft block text-[9px]">ACCURACY</span>
              <strong className="text-ink font-bold">
                {calculatedAccuracy}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Participant Registration Modal */}
      {showRegistrationModal && selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 shadow-2xl text-ink space-y-4">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-ochre/15 text-ochre font-mono text-xs font-bold uppercase">
                Solo Challenge Registration
              </span>
              <h3 className="text-2xl font-extrabold font-display text-ink mt-2">
                {selectedQuiz.title}
              </h3>
              <p className="text-xs text-ink-soft mt-1">
                Enter your name to record your score on the Shega Hall of Fame.
              </p>
            </div>

            <form onSubmit={handleStartQuiz} className="space-y-4 text-left font-mono text-xs">
              <div>
                <label className="block text-ink font-bold uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="e.g. Samuel Bekele"
                  className="w-full px-4 py-3 rounded-xl bg-ivory border border-zinc-300 text-ink focus:outline-none focus:ring-2 focus:ring-ochre text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-ink font-bold uppercase mb-1">
                  Handle / Tag (Optional)
                </label>
                <input
                  type="text"
                  value={playerHandle}
                  onChange={(e) => setPlayerHandle(e.target.value)}
                  placeholder="e.g. @samuel_dev"
                  className="w-full px-4 py-3 rounded-xl bg-ivory border border-zinc-300 text-ink focus:outline-none focus:ring-2 focus:ring-ochre text-sm font-sans"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="w-1/2 bg-zinc-200 hover:bg-zinc-300 text-ink font-bold py-3.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-ochre hover:bg-ochre-dark text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md"
                >
                  Start Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
