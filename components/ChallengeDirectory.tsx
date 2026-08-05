"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const CATEGORIES = [
  {
    id: "Live Timed Quiz",
    title: "⚡ LIVE TIMED QUIZ",
    subtitle: "Topic: Web Dev, AI & Cyber",
    description: "Real-time synchronized battle with live countdowns & instant scoring.",
    icon: "⚡",
    locked: false,
    active: true,
  },
  {
    id: "Timed Q&A",
    title: "⏱️ TIMED Q&A",
    subtitle: "Rapid-fire questions",
    description: "Solo time-bound technical challenges.",
    icon: "⏱️",
    locked: true,
    badge: "Locked - Coming Soon",
  },
  {
    id: "Mini CTF",
    title: "🚩 MINI CTF",
    subtitle: "Cybersecurity & Logic",
    description: "Capture the flag security puzzles and exploit challenges.",
    icon: "🚩",
    locked: true,
    badge: "Locked - Coming Soon",
  },
  {
    id: "Hometake Assignment",
    title: "🏠 HOMETAKE ASSIGNMENT",
    subtitle: "Deep-dive coding",
    description: "Take-home engineering tasks and portfolio builds.",
    icon: "🏠",
    locked: true,
    badge: "Locked - Coming Soon",
  },
  {
    id: "Modern Challenges",
    title: "🚀 MODERN CHALLENGES",
    subtitle: "Innovation sprint",
    description: "Hackathon sprints and emerging AI architecture challenges.",
    icon: "🚀",
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
  const [activeCategory, setActiveCategory] = useState("Live Timed Quiz");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard || []);
  const [selectedQuiz, setSelectedQuiz] = useState<ChallengeQuiz | null>(null);

  // Registration & Active Quiz State
  const [playerName, setPlayerName] = useState("");
  const [playerHandle, setPlayerHandle] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(20);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Quiz Results State
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRank, setLastRank] = useState<number | null>(null);

  // Leaderboard & Solo Play State
  const [leaderboardFilter, setLeaderboardFilter] = useState("all");
  const [allowSoloPlay, setAllowSoloPlay] = useState<boolean>(true);

  // Fetch updated leaderboard & solo play mode status
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/challenges/leaderboard");
      const data = await res.json();
      if (data.ok && Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetch("/api/quiz/live/state")
      .then((res) => res.json())
      .then((data) => {
        if (data.allowSoloPlay !== undefined) setAllowSoloPlay(data.allowSoloPlay);
      })
      .catch(() => {});
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
    setIsRegistering(true);
  };

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsRegistering(false);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setCorrectCount(0);
    setTotalTimeSpent(0);
    setQuizCompleted(false);
    setSelectedOption(null);
  };

  const handleNextQuestion = (chosenIndex: number | null, secondsRemaining: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!selectedQuiz) return;

    const currentQ = selectedQuiz.questions[currentQuestionIndex];
    const isCorrect = chosenIndex === currentQ.correctOptionIndex;

    let pointsEarned = 0;
    if (isCorrect) {
      const basePoints = currentQ.points || 100;
      const speedBonus = secondsRemaining * 5;
      pointsEarned = basePoints + speedBonus;
      setScore((s) => s + pointsEarned);
      setCorrectCount((c) => c + 1);
    }

    const updatedAnswers = [...userAnswers, chosenIndex !== null ? chosenIndex : -1];
    setUserAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
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

  // Logged-in user matching entry for sticky row
  const currentUserEntry = leaderboard.find(
    (item) => item.participantName === playerName || item.participantHandle === playerHandle
  ) || {
    participantName: playerName || "You (Guest)",
    participantHandle: playerHandle || "@you",
    score: score || 450,
    correctCount: correctCount || 12,
    totalQuestions: selectedQuiz?.questions.length || 20,
    timeSpentSeconds: totalTimeSpent || 42,
  };

  return (
    <div className="min-h-screen bg-navy text-white pb-24 selection:bg-ochre selection:text-white">
      {/* 1. Hero Header - Dynamic CMS Theme Theme Tokens (ochre / navy) */}
      <section className="relative bg-gradient-to-b from-navy-dark via-navy to-navy-light text-white pt-14 pb-14 px-4 sm:px-6 border-b border-zinc-800/80">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ochre/15 border border-ochre/40 text-ochre text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
            <span>(ሸጋ አሬና) SHEGA ARENA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-3">
            {customTitle || "(ሸጋ አሬና) SHEGA ARENA: SELECT YOUR CHALLENGE"}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 font-sans leading-relaxed mb-8">
            {customSubtitle || "Test your skills, represent Ethiopia, and rise the leaderboard."}
          </p>

          {/* View Switcher: Challenges vs Leaderboard */}
          <div className="inline-flex p-1.5 rounded-2xl bg-navy-dark/90 border border-zinc-800 gap-2">
            <button
              onClick={() => setMainView("challenges")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
                mainView === "challenges"
                  ? "bg-ochre text-white shadow-md font-extrabold"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              ⚡ Challenge Hub
            </button>
            <button
              onClick={() => setMainView("leaderboard")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
                mainView === "leaderboard"
                  ? "bg-ochre text-white shadow-md font-extrabold"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              🏆 Hall of Fame
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
                        ? "bg-navy-light border-ochre shadow-[0_0_25px_var(--color-primary)] ring-1 ring-ochre/50 hover:scale-[1.02]"
                        : "bg-navy-dark/60 border-zinc-800 opacity-65 grayscale hover:grayscale-0"
                    }`}
                  >
                    <div>
                      {/* Badge / Status */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ochre/20 border border-ochre/40 text-ochre text-[11px] font-mono font-extrabold uppercase animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-ochre" />
                            <span>LIVE ARENA ACTIVE</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-400 text-[11px] font-mono font-bold uppercase">
                            <span>🔒 {cat.badge}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white mb-2">
                        {cat.title}
                      </h3>

                      <p className="text-xs font-mono text-ochre font-bold mb-3">
                        {cat.subtitle}
                      </p>

                      <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-6">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                      {isLive ? (
                        <>
                          <a
                            href="/challenges/quiz/web-dev-algorithms"
                            className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-extrabold text-xs py-3 rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2"
                          >
                            <span>[Enter Arena]</span>
                            <span>⚡</span>
                          </a>
                        </>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-zinc-800/60 text-zinc-500 font-mono font-bold text-xs py-3 rounded-xl cursor-not-allowed border border-zinc-700/50"
                        >
                          [Locked - Coming Soon] 🔒
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Quizzes List Section */}
            <section className="bg-navy-light rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-xs font-mono font-bold text-ochre uppercase tracking-wider block mb-1">
                    ⚡ Live Broadcast Topics
                  </span>
                  <h2 className="text-2xl font-bold font-display text-white">
                    Available Live Challenge Rooms
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="bg-navy-dark rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between hover:border-ochre transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-ochre/15 border border-ochre/30 text-ochre text-xs font-mono font-bold uppercase">
                          {quiz.category || "Live Timed Quiz"}
                        </span>
                        <span className="text-xs font-mono font-bold text-zinc-400">
                          ⏱️ {quiz.timePerQuestion || 45}s / question
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-display text-white mb-2">
                        {quiz.title}
                      </h3>

                      <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-6">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                      <div className="text-xs font-mono text-zinc-400">
                        Difficulty: <strong className="text-white">{quiz.difficulty || "MEDIUM"}</strong> ({quiz.questions?.length || 4} Qs)
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`/challenges/quiz/${quiz.slug?.current || quiz._id}`}
                          className="bg-ochre hover:bg-ochre-dark text-white font-mono font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all"
                        >
                          Join Live Arena ⚡
                        </a>
                        {allowSoloPlay ? (
                          <button
                            onClick={() => startQuizRegistration(quiz)}
                            className="bg-black/60 hover:bg-black/90 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-700 transition-all"
                          >
                            Play Solo
                          </button>
                        ) : (
                          <span className="bg-zinc-800/80 text-zinc-500 font-mono font-bold text-[11px] px-3 py-2 rounded-xl border border-zinc-700/50 cursor-not-allowed">
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
          /* PAGE 2: Global & Quiz-Specific Leaderboard (🏆 THE ሸጋ HALL OF FAME) */
          <div className="space-y-8">
            <div className="bg-navy-light rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 pb-6 border-b border-zinc-800">
                <span className="text-xs font-mono font-bold text-ochre uppercase tracking-wider block mb-2">
                  OFFICIAL RANKINGS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-2">
                  🏆 THE ሸጋ HALL OF FAME (ሸጋ ክብር አዳራሽ)
                </h2>
                <p className="text-xs font-mono text-zinc-400">
                  Dynamic difficulty weighting: EASY (100 Pts), MEDIUM (200 Pts), HARD (400 Pts) + Speed Bonus
                </p>
              </div>

              {/* Segmented Filtering Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-navy-dark p-2 rounded-2xl border border-zinc-800">
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
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      [ {label} ]
                    </button>
                  );
                })}
              </div>

              {/* Top 3 Podium (Gold, Silver, Bronze Glows) */}
              {filteredLeaderboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* Rank 2 - Silver */}
                  <div className="bg-navy-dark rounded-2xl p-5 border border-zinc-400/40 text-center order-2 md:order-1 flex flex-col justify-between shadow-[0_0_15px_rgba(203,213,225,0.1)]">
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1">
                        🥈 RANK #2
                      </span>
                      <div className="w-12 h-12 mx-auto rounded-full bg-zinc-300 text-black font-mono font-bold text-base flex items-center justify-center mb-2 shadow-sm">
                        {filteredLeaderboard[1].participantName.slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-extrabold text-white font-display text-base">
                        {filteredLeaderboard[1].participantName}
                      </h4>
                      <p className="text-xs font-mono text-ochre font-semibold">
                        {filteredLeaderboard[1].participantHandle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-around text-xs font-mono">
                      <div>
                        <span className="text-zinc-400 block text-[10px]">SCORE</span>
                        <strong className="text-white font-bold">{filteredLeaderboard[1].score} Pts</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px]">ACCURACY</span>
                        <strong className="text-ochre font-bold">
                          {Math.round(((filteredLeaderboard[1].correctCount || 18) / (filteredLeaderboard[1].totalQuestions || 20)) * 100)}% ({filteredLeaderboard[1].correctCount || 18}/20)
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Rank 1 - Gold Champion */}
                  <div className="bg-navy-dark rounded-2xl p-6 border-2 border-amber-400 text-center order-1 md:order-2 flex flex-col justify-between shadow-[0_0_30px_rgba(251,191,36,0.25)] md:-translate-y-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase block mb-1">
                        🥇 CHAMPION #1
                      </span>
                      <div className="w-14 h-14 mx-auto rounded-full bg-amber-400 text-black font-mono font-bold text-xl flex items-center justify-center mb-2 shadow-md ring-4 ring-amber-400/30">
                        {filteredLeaderboard[0].participantName.slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-black text-white font-display text-lg">
                        {filteredLeaderboard[0].participantName}
                      </h4>
                      <p className="text-xs font-mono text-amber-400 font-bold">
                        {filteredLeaderboard[0].participantHandle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-around text-xs font-mono">
                      <div>
                        <span className="text-amber-300 block text-[10px]">SCORE</span>
                        <strong className="text-white font-bold text-base">{filteredLeaderboard[0].score} Pts</strong>
                      </div>
                      <div>
                        <span className="text-amber-300 block text-[10px]">ACCURACY</span>
                        <strong className="text-amber-400 font-bold text-sm">
                          {Math.round(((filteredLeaderboard[0].correctCount || 19) / (filteredLeaderboard[0].totalQuestions || 20)) * 100)}% ({filteredLeaderboard[0].correctCount || 19}/20)
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Rank 3 - Bronze */}
                  <div className="bg-navy-dark rounded-2xl p-5 border border-amber-700/50 text-center order-3 flex flex-col justify-between shadow-[0_0_15px_rgba(180,83,9,0.15)]">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-600 uppercase block mb-1">
                        🥉 RANK #3
                      </span>
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-700 text-white font-mono font-bold text-base flex items-center justify-center mb-2">
                        {filteredLeaderboard[2].participantName.slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-extrabold text-white font-display text-base">
                        {filteredLeaderboard[2].participantName}
                      </h4>
                      <p className="text-xs font-mono text-ochre font-semibold">
                        {filteredLeaderboard[2].participantHandle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-around text-xs font-mono">
                      <div>
                        <span className="text-zinc-400 block text-[10px]">SCORE</span>
                        <strong className="text-white font-bold">{filteredLeaderboard[2].score} Pts</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px]">ACCURACY</span>
                        <strong className="text-ochre font-bold">
                          {Math.round(((filteredLeaderboard[2].correctCount || 17) / (filteredLeaderboard[2].totalQuestions || 20)) * 100)}% ({filteredLeaderboard[2].correctCount || 17}/20)
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Leaderboard Table with Accuracy Metric */}
              <div className="overflow-x-auto rounded-2xl border border-zinc-800 mb-4">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-navy-dark text-zinc-300 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-4 px-4 font-bold">Rank</th>
                      <th className="py-4 px-4 font-bold">Participant</th>
                      <th className="py-4 px-4 font-bold text-right">Total Score (Pts)</th>
                      <th className="py-4 px-4 font-bold text-right">Accuracy (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-navy-dark">
                    {filteredLeaderboard.map((item, idx) => {
                      const rank = idx + 1;
                      const accuracyPct = Math.round(
                        ((item.correctCount || 15) / (item.totalQuestions || 20)) * 100
                      );
                      return (
                        <tr key={item._id || idx} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-4 px-4 font-bold text-white">
                            {rank === 1 ? "🥇 #1" : rank === 2 ? "🥈 #2" : rank === 3 ? "🥉 #3" : `#${rank}`}
                          </td>
                          <td className="py-4 px-4 font-sans font-bold text-white">
                            <div>{item.participantName}</div>
                            {item.participantHandle && (
                              <span className="text-[10px] font-mono text-ochre font-semibold">
                                {item.participantHandle}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right font-extrabold text-white text-sm">
                            {item.score}
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-ochre">
                            {accuracyPct}% ({item.correctCount || 15}/{item.totalQuestions || 20})
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Sticky "YOU" Rank Fixed Row at Bottom */}
              <div className="bg-ochre/15 border-2 border-ochre rounded-2xl p-4 flex items-center justify-between font-mono text-xs shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-ochre text-white font-extrabold">
                    YOU
                  </span>
                  <div>
                    <strong className="text-white font-sans text-sm block">
                      {currentUserEntry.participantName}
                    </strong>
                    <span className="text-ochre text-[10px]">
                      {currentUserEntry.participantHandle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-zinc-400 block text-[10px] text-right">SCORE</span>
                    <strong className="text-white font-extrabold text-sm">
                      {currentUserEntry.score} Pts
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] text-right">ACCURACY</span>
                    <strong className="text-ochre font-bold">
                      {Math.round(((currentUserEntry.correctCount || 12) / (currentUserEntry.totalQuestions || 20)) * 100)}% ({currentUserEntry.correctCount || 12}/{currentUserEntry.totalQuestions || 20})
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. MODAL: Player Registration */}
      <AnimatePresence>
        {isRegistering && selectedQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-light rounded-3xl p-6 sm:p-8 max-w-md w-full border border-ochre shadow-2xl relative"
            >
              <button
                onClick={() => setIsRegistering(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <span className="w-12 h-12 mx-auto rounded-2xl bg-ochre/20 text-ochre text-2xl flex items-center justify-center mb-3">
                  ⚡
                </span>
                <h3 className="text-2xl font-bold font-display text-white mb-1">Enter Arena</h3>
                <p className="text-xs font-mono text-zinc-300">{selectedQuiz.title}</p>
              </div>

              <form onSubmit={handleStartQuiz} className="space-y-4 font-sans">
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
                    className="w-full px-4 py-3.5 rounded-xl bg-navy-dark border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ochre"
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
                    className="w-full px-4 py-3.5 rounded-xl bg-navy-dark border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ochre"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-md mt-2"
                >
                  Enter Arena Now 🔥
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MODAL: Active Solo Quiz Player */}
      <AnimatePresence>
        {quizStarted && selectedQuiz && !quizCompleted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/90">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-navy-light text-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-zinc-800 relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-xs font-mono text-ochre uppercase font-bold tracking-wider">
                    Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                  </span>
                  <h4 className="text-sm font-sans text-zinc-300 font-medium truncate max-w-xs sm:max-w-sm">
                    {selectedQuiz.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 bg-ochre/20 border border-ochre/40 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold text-ochre">
                  <span>⏱️</span>
                  <span className="text-sm font-extrabold text-white">{timeLeft}s</span>
                </div>
              </div>

              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-6">
                <motion.div
                  key={`timer-bar-${currentQuestionIndex}`}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: selectedQuiz.timePerQuestion || 20, ease: "linear" }}
                  className="h-full bg-ochre"
                />
              </div>

              <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-4 leading-snug">
                {selectedQuiz.questions[currentQuestionIndex].questionText}
              </h3>

              {selectedQuiz.questions[currentQuestionIndex].codeSnippet && (
                <pre className="mb-6 bg-navy-dark rounded-xl p-4 border border-zinc-800 font-mono text-xs text-ochre overflow-x-auto whitespace-pre">
                  {selectedQuiz.questions[currentQuestionIndex].codeSnippet}
                </pre>
              )}

              <div className="space-y-3 mb-8">
                {selectedQuiz.questions[currentQuestionIndex].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedOption(idx);
                        handleNextQuestion(idx, timeLeft);
                      }}
                      className={`w-full text-left p-4 rounded-xl font-sans text-sm font-medium transition-all flex items-center justify-between border ${
                        isSelected
                          ? "bg-ochre text-white border-ochre font-bold"
                          : "bg-navy-dark/40 hover:bg-zinc-800 text-zinc-200 border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white/10 font-mono text-xs font-bold flex items-center justify-center">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-right text-xs font-mono text-zinc-400">
                Score: <strong className="text-ochre font-bold">{score} Pts</strong>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
