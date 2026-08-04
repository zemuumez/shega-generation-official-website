"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypewriterTitle from "@/components/TypewriterTitle";

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
  { id: "Timed Q&A", label: "Timed Q&A / Quiz", icon: "⚡", active: true },
  { id: "Modern Challenges", label: "Modern Challenges", icon: "🚀", active: false, badge: "Coming Soon" },
  { id: "Take-Home Assignment", label: "Take-Home Assignment", icon: "🏠", active: false, badge: "Coming Soon" },
  { id: "Mini CTF", label: "Mini CTF", icon: "🛡️", active: false, badge: "Coming Soon" },
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
  const [activeCategory, setActiveCategory] = useState("Timed Q&A");
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

  // Leaderboard Filter
  const [leaderboardFilter, setLeaderboardFilter] = useState("all");

  // Fetch updated leaderboard
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
  }, []);

  // Handle Question Countdown Timer
  useEffect(() => {
    if (!quizStarted || quizCompleted || !selectedQuiz) return;

    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const timeLimit = selectedQuiz.timePerQuestion || 20;

    // Reset countdown for new question
    setTimeLeft(timeLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleNextQuestion(null, 0); // Timeout, force next question
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
      const speedBonus = secondsRemaining * 5; // 5 bonus pts per second saved
      pointsEarned = basePoints + speedBonus;
      setScore((s) => s + pointsEarned);
      setCorrectCount((c) => c + 1);
    }

    const updatedAnswers = [...userAnswers, chosenIndex !== null ? chosenIndex : -1];
    setUserAnswers(updatedAnswers);

    setSelectedOption(null);

    // If more questions remain, advance to next question
    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Quiz Finished!
      finishQuiz(updatedAnswers, isCorrect ? score + pointsEarned : score, isCorrect ? correctCount + 1 : correctCount);
    }
  };

  const finishQuiz = async (finalAnswers: number[], finalScore: number, finalCorrectCount: number) => {
    setQuizCompleted(true);
    setIsSubmitting(true);

    const submissionPayload = {
      participantName: playerName,
      participantHandle: playerHandle.startsWith("@") ? playerHandle : playerHandle ? `@${playerHandle}` : `@${playerName.toLowerCase().replace(/\s+/g, "_")}`,
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
        // Prepend entry locally to leaderboard
        const newLeaderboard = [data.entry, ...leaderboard].sort((a, b) => b.score - a.score);
        setLeaderboard(newLeaderboard);

        // Find user rank
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

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-navy pb-24 selection:bg-ochre selection:text-white">
      {/* 1. Hero Banner - Clean Solid Deep Navy */}
      <section className="relative bg-[#0A192F] text-white pt-14 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-ochre/20 border border-ochre/40 text-ochre text-xs font-mono font-bold uppercase tracking-wider mb-4">
            Shega Challenge Arena
          </div>

          <TypewriterTitle
            phrases={[
              customTitle || "Shega Tech Challenges & Arena",
              "Timed Code Quizzes & Logic Runs",
              "Climb the Official Shega Leaderboard",
            ]}
            className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4"
          />

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 font-sans leading-relaxed mb-8">
            {customSubtitle ||
              "Test your coding speed, logical problem-solving, and algorithmic mastery. Rise through the ranks on the real-time Shega Leaderboard!"}
          </p>

          {/* Standalone Navigation Bar for Challenges vs Leaderboard */}
          <div className="inline-flex p-1.5 rounded-xl bg-white/10 border border-white/20 gap-2">
            <button
              onClick={() => setMainView("challenges")}
              className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all ${
                mainView === "challenges"
                  ? "bg-ochre text-white shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              🎯 Challenge Types
            </button>
            <button
              onClick={() => setMainView("leaderboard")}
              className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all ${
                mainView === "leaderboard"
                  ? "bg-ochre text-white shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              🏆 Standalone Leaderboard
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        {mainView === "challenges" ? (
          <div className="space-y-10">
            {/* Category Navigation Tabs */}
            <div className="bg-white rounded-2xl p-3 border border-zinc-200 flex flex-wrap gap-2 justify-center shadow-xs">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#0A192F] text-white shadow-sm"
                        : "text-zinc-600 hover:text-navy hover:bg-zinc-100"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    {cat.badge && (
                      <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300 uppercase">
                        {cat.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Timed Q&A View */}
            {activeCategory === "Timed Q&A" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs font-mono font-bold uppercase">
                          {quiz.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-zinc-600">
                          ⏱️ {quiz.timePerQuestion || 20}s / question
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-navy mb-2">
                        {quiz.title}
                      </h3>

                      <p className="text-sm text-zinc-600 font-sans leading-relaxed mb-6">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                      <div className="text-xs font-mono text-zinc-500">
                        Difficulty: <strong className="text-navy font-bold">{quiz.difficulty || "Medium"}</strong> ({quiz.questions?.length || 5} Questions)
                      </div>

                      <button
                        onClick={() => startQuizRegistration(quiz)}
                        className="bg-ochre hover:bg-ochre-dark text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <span>Start Challenge</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coming Soon Categories */}
            {activeCategory !== "Timed Q&A" && (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-zinc-200 text-center max-w-2xl mx-auto my-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 text-3xl flex items-center justify-center mb-4 border border-amber-200">
                  {CATEGORIES.find((c) => c.id === activeCategory)?.icon || "🚀"}
                </div>

                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-bold uppercase mb-3 inline-block border border-amber-200">
                  Coming Soon
                </span>

                <h2 className="text-2xl sm:text-3xl font-bold font-display text-navy mb-3">
                  {activeCategory} Challenge Arena
                </h2>

                <p className="text-zinc-600 font-sans text-sm max-w-lg mx-auto mb-6 leading-relaxed">
                  Interactive modules for {activeCategory} are currently being loaded into Sanity CMS for our upcoming cohort competition!
                </p>

                <a
                  href="/contact"
                  className="inline-block bg-[#0A192F] hover:bg-navy text-white font-mono font-bold text-xs px-5 py-3 rounded-xl transition-colors"
                >
                  Request Early Access →
                </a>
              </div>
            )}

            {/* Button to Jump to Detached Standalone Leaderboard */}
            <div className="pt-8 border-t border-zinc-200/80 text-center">
              <button
                onClick={() => setMainView("leaderboard")}
                className="bg-white hover:bg-zinc-50 border border-zinc-300 text-navy font-mono text-xs font-bold px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <span>🏆 View Detached Official Leaderboard</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ) : (
          /* Standalone Detached Leaderboard View */
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-100">
                <div>
                  <span className="text-xs font-mono font-bold text-ochre uppercase tracking-wider block mb-1">
                    Standalone Section
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-navy">
                    Official Shega Leaderboard
                  </h2>
                </div>

                {/* Quiz Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-zinc-600 font-bold">Filter Quiz:</label>
                  <select
                    value={leaderboardFilter}
                    onChange={(e) => setLeaderboardFilter(e.target.value)}
                    className="bg-[#F4F3EE] border border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-ochre"
                  >
                    <option value="all">All Quizzes & Challenges</option>
                    {quizzes.map((q) => (
                      <option key={q._id} value={q._id}>
                        {q.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Top 3 Performers - Clean Fills */}
              {filteredLeaderboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* 2nd Place */}
                  <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-zinc-200 text-center order-2 md:order-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-500 uppercase block mb-1">
                        🥈 RANK #2
                      </span>
                      <div className="w-12 h-12 mx-auto rounded-full bg-zinc-200 text-zinc-800 font-mono font-bold text-base flex items-center justify-center mb-2">
                        {filteredLeaderboard[1].participantName.slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-bold text-navy font-display text-base">
                        {filteredLeaderboard[1].participantName}
                      </h4>
                      <p className="text-xs font-mono text-ochre font-semibold">
                        {filteredLeaderboard[1].participantHandle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-200 flex justify-around text-xs font-mono">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">SCORE</span>
                        <strong className="text-navy font-bold">{filteredLeaderboard[1].score} pts</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">TIME</span>
                        <strong className="text-zinc-700 font-bold">{filteredLeaderboard[1].timeSpentSeconds}s</strong>
                      </div>
                    </div>
                  </div>

                  {/* 1st Place - Champion */}
                  <div className="bg-[#FEF3C7] rounded-2xl p-6 border-2 border-amber-400 text-center order-1 md:order-2 flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-900 uppercase block mb-1">
                        🥇 CHAMPION #1
                      </span>
                      <div className="w-14 h-14 mx-auto rounded-full bg-amber-400 text-amber-950 font-mono font-bold text-xl flex items-center justify-center mb-2 border-2 border-amber-500">
                        {filteredLeaderboard[0].participantName.slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-extrabold text-navy font-display text-lg">
                        {filteredLeaderboard[0].participantName}
                      </h4>
                      <p className="text-xs font-mono text-amber-900 font-bold">
                        {filteredLeaderboard[0].participantHandle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-amber-300 flex justify-around text-xs font-mono">
                      <div>
                        <span className="text-amber-900 block text-[10px]">SCORE</span>
                        <strong className="text-navy font-bold text-base">{filteredLeaderboard[0].score} pts</strong>
                      </div>
                      <div>
                        <span className="text-amber-900 block text-[10px]">TIME</span>
                        <strong className="text-navy font-bold">{filteredLeaderboard[0].timeSpentSeconds}s</strong>
                      </div>
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="bg-[#FFF7ED] rounded-2xl p-5 border border-orange-200 text-center order-3 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-800 uppercase block mb-1">
                        🥉 RANK #3
                      </span>
                      <div className="w-12 h-12 mx-auto rounded-full bg-orange-200 text-orange-900 font-mono font-bold text-base flex items-center justify-center mb-2">
                        {filteredLeaderboard[2].participantName.slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-bold text-navy font-display text-base">
                        {filteredLeaderboard[2].participantName}
                      </h4>
                      <p className="text-xs font-mono text-ochre font-semibold">
                        {filteredLeaderboard[2].participantHandle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-orange-200 flex justify-around text-xs font-mono">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">SCORE</span>
                        <strong className="text-navy font-bold">{filteredLeaderboard[2].score} pts</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">TIME</span>
                        <strong className="text-zinc-700 font-bold">{filteredLeaderboard[2].timeSpentSeconds}s</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0A192F] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Rank</th>
                      <th className="py-3.5 px-4 font-bold">Participant</th>
                      <th className="py-3.5 px-4 font-bold">Quiz / Challenge</th>
                      <th className="py-3.5 px-4 font-bold text-right">Score</th>
                      <th className="py-3.5 px-4 font-bold text-center">Correct</th>
                      <th className="py-3.5 px-4 font-bold text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 bg-white">
                    {filteredLeaderboard.map((item, idx) => {
                      const rank = idx + 1;
                      return (
                        <tr key={item._id || idx} className="hover:bg-zinc-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-navy">
                            {rank === 1 ? "🥇 #1" : rank === 2 ? "🥈 #2" : rank === 3 ? "🥉 #3" : `#${rank}`}
                          </td>
                          <td className="py-3.5 px-4 font-sans font-bold text-navy">
                            <div>{item.participantName}</div>
                            {item.participantHandle && (
                              <span className="text-[10px] font-mono text-ochre font-semibold">
                                {item.participantHandle}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-600 font-sans max-w-xs truncate">
                            {item.quizTitle || "Shega Quiz"}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-navy text-sm">
                            {item.score} pts
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                            {item.correctCount} / {item.totalQuestions || 5}
                          </td>
                          <td className="py-3.5 px-4 text-right text-zinc-600 font-bold">
                            {item.timeSpentSeconds}s
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setMainView("challenges")}
                className="bg-white hover:bg-zinc-50 border border-zinc-300 text-navy font-mono text-xs font-bold px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <span>← Return to Challenge Types</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. MODAL: Player Registration */}
      <AnimatePresence>
        {isRegistering && selectedQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 shadow-xl relative"
            >
              <button
                onClick={() => setIsRegistering(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-navy text-lg"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <span className="w-12 h-12 mx-auto rounded-2xl bg-ochre/10 text-ochre text-2xl flex items-center justify-center mb-3">
                  ⚡
                </span>
                <h3 className="text-2xl font-bold font-display text-navy mb-1">Enter Challenge Arena</h3>
                <p className="text-xs font-mono text-zinc-500">{selectedQuiz.title}</p>
              </div>

              <form onSubmit={handleStartQuiz} className="space-y-4 font-sans">
                <div>
                  <label className="block text-xs font-mono font-bold text-navy uppercase mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="e.g. Abebe Bikila"
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F3EE] border border-zinc-200 text-navy text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ochre"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-navy uppercase mb-1">
                    Handle / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={playerHandle}
                    onChange={(e) => setPlayerHandle(e.target.value)}
                    placeholder="e.g. @abebe_code"
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F3EE] border border-zinc-200 text-navy text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ochre"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono text-amber-900">
                  Rules: Each question displays for <strong>{selectedQuiz.timePerQuestion || 20}s</strong>. Questions auto-advance when time expires!
                </div>

                <button
                  type="submit"
                  className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-bold text-sm py-3.5 rounded-xl transition-all"
                >
                  Begin Timed Quiz Now
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MODAL: Active Quiz Player (1 Question at a Time) */}
      <AnimatePresence>
        {quizStarted && selectedQuiz && !quizCompleted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/95">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-zinc-800 relative overflow-hidden"
            >
              {/* Header Progress & Timer */}
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

              {/* Solid Progress Bar */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-6">
                <motion.div
                  key={`timer-bar-${currentQuestionIndex}`}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: selectedQuiz.timePerQuestion || 20, ease: "linear" }}
                  className="h-full bg-ochre"
                />
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-4 leading-snug">
                {selectedQuiz.questions[currentQuestionIndex].questionText}
              </h3>

              {/* Optional Code Snippet Block */}
              {selectedQuiz.questions[currentQuestionIndex].codeSnippet && (
                <div className="mb-6 bg-black rounded-xl p-4 border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">
                  {selectedQuiz.questions[currentQuestionIndex].codeSnippet}
                </div>
              )}

              {/* Multiple Choice Options */}
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
                          ? "bg-ochre text-white border-ochre"
                          : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800"
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

              {/* Footer score summary */}
              <div className="text-right text-xs font-mono text-zinc-400">
                Score: <strong className="text-ochre font-bold">{score} pts</strong>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MODAL: Quiz Summary & Victory Results */}
      <AnimatePresence>
        {quizCompleted && selectedQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/90">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-zinc-200 text-center relative"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 text-3xl flex items-center justify-center mb-3">
                🏆
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-navy mb-1">
                Challenge Completed!
              </h3>
              <p className="text-xs font-mono text-zinc-500 mb-6">{selectedQuiz.title}</p>

              <div className="grid grid-cols-3 gap-3 bg-[#F4F3EE] p-4 rounded-2xl border border-zinc-200 mb-6 font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">SCORE</span>
                  <strong className="text-navy font-bold text-lg">{score}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">ACCURACY</span>
                  <strong className="text-emerald-700 font-bold text-lg">
                    {Math.round((correctCount / selectedQuiz.questions.length) * 100)}%
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">TIME</span>
                  <strong className="text-navy font-bold text-lg">{totalTimeSpent}s</strong>
                </div>
              </div>

              {lastRank && (
                <div className="p-3.5 rounded-xl bg-ochre/10 border border-ochre/30 text-xs font-mono font-bold text-navy mb-6">
                  Congratulations <strong>{playerName}</strong>! You achieved Rank <strong className="text-ochre text-sm">#{lastRank}</strong> on the Leaderboard!
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setQuizCompleted(false);
                    setQuizStarted(false);
                    setMainView("leaderboard");
                  }}
                  className="flex-1 bg-[#0A192F] hover:bg-navy text-white font-mono text-xs font-bold py-3 rounded-xl transition-colors"
                >
                  Go to Leaderboard 📊
                </button>
                <button
                  onClick={() => {
                    setQuizCompleted(false);
                    setQuizStarted(true);
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setCorrectCount(0);
                    setTotalTimeSpent(0);
                  }}
                  className="flex-1 bg-ochre hover:bg-ochre-dark text-white font-mono text-xs font-bold py-3 rounded-xl transition-colors"
                >
                  Play Again 🔄
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
