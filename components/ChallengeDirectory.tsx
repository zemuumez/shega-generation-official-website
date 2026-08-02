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
  { id: "Timered Q&A", label: "Timered Q&A / Quiz", icon: "⚡", active: true },
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
  const [activeCategory, setActiveCategory] = useState("Timered Q&A");
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
      {/* 1. Hero Banner */}
      <section className="relative bg-gradient-to-b from-[#0A192F] via-[#0F172A] to-[#1E293B] text-white pt-14 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#EA580C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ochre/20 border border-ochre/40 text-ochre text-xs font-mono font-bold tracking-wider uppercase mb-5"
          >
            <span>ሸጋ አሬና • Shega Challenge Arena</span>
          </motion.div>

          <TypewriterTitle
            phrases={[
              customTitle || "Shega Tech Challenges & Arena",
              "Timered Code Quizzes & Speed Runs",
              "Climb the Leaderboard of Genius Minds",
            ]}
            className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4"
          />

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 font-sans leading-relaxed">
            {customSubtitle ||
              "Test your coding speed, logical problem-solving, and algorithmic mastery. Rise through the ranks on the real-time Shega Leaderboard!"}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-center text-xs font-mono text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Quiz Engine: <strong className="text-white font-bold">Online</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-ochre font-bold text-sm">⏱️</span>
              <span>Question Display: <strong className="text-white font-bold">1 Question / Timer</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm">🏆</span>
              <span>Total Competitors: <strong className="text-white font-bold">{leaderboard.length + 42}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Challenge Category Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-7 relative z-20">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 sm:p-3 shadow-xl border border-zinc-200/80 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  isSelected
                    ? "bg-navy text-white shadow-md scale-[1.02]"
                    : "text-zinc-600 hover:text-navy hover:bg-black/5"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 uppercase tracking-wider">
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Category Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <AnimatePresence mode="wait">
          {/* CATEGORY 1: Timered Q&A / Quiz (ACTIVE) */}
          {activeCategory === "Timered Q&A" && (
            <motion.div
              key="timered-qa"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* Quiz Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ochre/5 rounded-full blur-2xl group-hover:bg-ochre/15 transition-all" />

                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs font-mono font-bold uppercase tracking-wider">
                          {quiz.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-zinc-500 flex items-center gap-1">
                          ⚡ {quiz.timePerQuestion || 20}s / question
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-navy mb-2 group-hover:text-ochre transition-colors">
                        {quiz.title}
                      </h3>

                      <p className="text-sm text-zinc-600 font-sans leading-relaxed mb-6">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                      <div className="text-xs font-mono text-zinc-500">
                        Difficulty: <span className="font-bold text-navy">{quiz.difficulty || "Medium"}</span> •{" "}
                        <span className="text-zinc-700 font-bold">{quiz.questions?.length || 5} Questions</span>
                      </div>

                      <button
                        onClick={() => startQuizRegistration(quiz)}
                        className="bg-ochre hover:bg-ochre-dark text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <span>Start Challenge</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leaderboard Section */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-100">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-ochre uppercase tracking-wider mb-1">
                      <span>🏆 Official Rankings</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-navy">
                      Challenge Leaderboard
                    </h2>
                  </div>

                  {/* Quiz Filter Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-mono text-zinc-500">Filter by Quiz:</label>
                    <select
                      value={leaderboardFilter}
                      onChange={(e) => setLeaderboardFilter(e.target.value)}
                      className="bg-[#F4F3EE] border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-ochre"
                    >
                      <option value="all">All Quizzes</option>
                      {quizzes.map((q) => (
                        <option key={q._id} value={q._id}>
                          {q.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Top 3 Podium Cards */}
                {filteredLeaderboard.length >= 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* 2nd Place */}
                    <div className="bg-gradient-to-b from-zinc-50 to-zinc-100/60 rounded-2xl p-5 border border-zinc-200 text-center relative overflow-hidden order-2 md:order-1 flex flex-col justify-between">
                      <div className="absolute top-3 right-3 text-2xl">🥈</div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                          RANK #2
                        </span>
                        <div className="w-12 h-12 mx-auto rounded-full bg-zinc-300 text-zinc-700 font-mono font-bold text-lg flex items-center justify-center mb-2 shadow-inner">
                          {filteredLeaderboard[1].participantName.slice(0, 2).toUpperCase()}
                        </div>
                        <h4 className="font-bold text-navy font-display text-base">
                          {filteredLeaderboard[1].participantName}
                        </h4>
                        <p className="text-xs font-mono text-ochre font-semibold">
                          {filteredLeaderboard[1].participantHandle}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-zinc-200/80 flex justify-around text-xs font-mono">
                        <div>
                          <span className="text-zinc-400 block text-[10px]">SCORE</span>
                          <strong className="text-navy font-bold text-sm">{filteredLeaderboard[1].score}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px]">TIME</span>
                          <strong className="text-zinc-700 font-bold">{filteredLeaderboard[1].timeSpentSeconds}s</strong>
                        </div>
                      </div>
                    </div>

                    {/* 1st Place (Gold Podium) */}
                    <div className="bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-2xl p-6 border-2 border-amber-400/80 text-center relative overflow-hidden shadow-md order-1 md:order-2 flex flex-col justify-between md:-translate-y-2">
                      <div className="absolute top-3 right-3 text-3xl">🥇</div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest block mb-1">
                          CHAMPION #1
                        </span>
                        <div className="w-14 h-14 mx-auto rounded-full bg-amber-400 text-amber-950 font-mono font-bold text-xl flex items-center justify-center mb-2 shadow-md ring-4 ring-amber-300/50">
                          {filteredLeaderboard[0].participantName.slice(0, 2).toUpperCase()}
                        </div>
                        <h4 className="font-extrabold text-navy font-display text-lg">
                          {filteredLeaderboard[0].participantName}
                        </h4>
                        <p className="text-xs font-mono text-amber-700 font-bold">
                          {filteredLeaderboard[0].participantHandle}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-amber-200 flex justify-around text-xs font-mono">
                        <div>
                          <span className="text-amber-800 block text-[10px]">SCORE</span>
                          <strong className="text-navy font-bold text-base">{filteredLeaderboard[0].score}</strong>
                        </div>
                        <div>
                          <span className="text-amber-800 block text-[10px]">TIME</span>
                          <strong className="text-navy font-bold text-sm">{filteredLeaderboard[0].timeSpentSeconds}s</strong>
                        </div>
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="bg-gradient-to-b from-orange-50/50 to-orange-100/30 rounded-2xl p-5 border border-orange-200/80 text-center relative overflow-hidden order-3 flex flex-col justify-between">
                      <div className="absolute top-3 right-3 text-2xl">🥉</div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest block mb-1">
                          RANK #3
                        </span>
                        <div className="w-12 h-12 mx-auto rounded-full bg-amber-200 text-amber-900 font-mono font-bold text-lg flex items-center justify-center mb-2 shadow-inner">
                          {filteredLeaderboard[2].participantName.slice(0, 2).toUpperCase()}
                        </div>
                        <h4 className="font-bold text-navy font-display text-base">
                          {filteredLeaderboard[2].participantName}
                        </h4>
                        <p className="text-xs font-mono text-ochre font-semibold">
                          {filteredLeaderboard[2].participantHandle}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-orange-200/60 flex justify-around text-xs font-mono">
                        <div>
                          <span className="text-zinc-400 block text-[10px]">SCORE</span>
                          <strong className="text-navy font-bold text-sm">{filteredLeaderboard[2].score}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px]">TIME</span>
                          <strong className="text-zinc-700 font-bold">{filteredLeaderboard[2].timeSpentSeconds}s</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Leaderboard Table */}
                <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-navy text-white uppercase text-[10px] tracking-wider border-b border-navy/20">
                      <tr>
                        <th className="py-3.5 px-4 font-bold">Rank</th>
                        <th className="py-3.5 px-4 font-bold">Participant</th>
                        <th className="py-3.5 px-4 font-bold">Quiz</th>
                        <th className="py-3.5 px-4 font-bold text-right">Score</th>
                        <th className="py-3.5 px-4 font-bold text-center">Correct</th>
                        <th className="py-3.5 px-4 font-bold text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 bg-white">
                      {filteredLeaderboard.map((item, idx) => {
                        const rank = idx + 1;
                        return (
                          <tr key={item._id || idx} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-zinc-900">
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
                            <td className="py-3.5 px-4 text-right font-extrabold text-navy text-sm">
                              {item.score} <span className="text-[10px] font-normal text-zinc-400">pts</span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                              {item.correctCount} / {item.totalQuestions || 5}
                            </td>
                            <td className="py-3.5 px-4 text-right text-zinc-500 font-bold">
                              {item.timeSpentSeconds}s
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </motion.div>
          )}

          {/* CATEGORIES 2, 3, 4: Coming Soon Placeholders */}
          {activeCategory !== "Timered Q&A" && (
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl p-8 sm:p-14 border border-zinc-200 shadow-lg text-center max-w-3xl mx-auto my-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-ochre/10 rounded-full blur-3xl pointer-events-none" />

              <div className="w-16 h-16 mx-auto rounded-2xl bg-ochre/10 text-ochre text-3xl flex items-center justify-center mb-4 border border-ochre/20">
                {CATEGORIES.find((c) => c.id === activeCategory)?.icon || "🚀"}
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-mono font-bold uppercase tracking-wider mb-4 inline-block">
                Coming Soon
              </span>

              <h2 className="text-3xl font-extrabold font-display text-navy mb-3">
                {activeCategory} Challenge Arena
              </h2>

              <p className="text-zinc-600 font-sans max-w-xl mx-auto mb-8 leading-relaxed">
                We are currently building and testing live interactive modules for {activeCategory}. Content and leaderboard rules are uploaded through Sanity CMS and will launch in the next cohort cycle!
              </p>

              <div className="p-4 rounded-2xl bg-[#F4F3EE] border border-zinc-200 text-xs font-mono text-zinc-600 max-w-md mx-auto flex items-center justify-between">
                <span>Want priority access when it goes live?</span>
                <a
                  href="/contact"
                  className="bg-navy hover:bg-navy/90 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  Join Waitlist
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. MODAL: Player Registration */}
      <AnimatePresence>
        {isRegistering && selectedQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 shadow-2xl relative"
            >
              <button
                onClick={() => setIsRegistering(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-navy text-xl"
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

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800">
                  ⚠️ <strong>Rules:</strong> Each question displays for <strong>{selectedQuiz.timePerQuestion || 20}s</strong>. When time runs out, the question advances automatically!
                </div>

                <button
                  type="submit"
                  className="w-full bg-ochre hover:bg-ochre-dark text-white font-mono font-bold text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Begin Timered Quiz Now 🔥
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MODAL: Active Quiz Player (1 Question at a Time) */}
      <AnimatePresence>
        {quizStarted && selectedQuiz && !quizCompleted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/95 backdrop-blur-lg">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-zinc-800 shadow-2xl relative overflow-hidden"
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

                {/* Countdown Timer Circle / Pill */}
                <div className="flex items-center gap-2 bg-ochre/20 border border-ochre/40 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold text-ochre">
                  <span>⏱️</span>
                  <span className="text-sm font-extrabold text-white">{timeLeft}s</span>
                </div>
              </div>

              {/* Countdown Progress Bar */}
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-6">
                <motion.div
                  key={`timer-bar-${currentQuestionIndex}`}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: selectedQuiz.timePerQuestion || 20, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-ochre to-amber-400"
                />
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-4 leading-snug">
                {selectedQuiz.questions[currentQuestionIndex].questionText}
              </h3>

              {/* Optional Code Snippet Block */}
              {selectedQuiz.questions[currentQuestionIndex].codeSnippet && (
                <div className="mb-6 bg-black/60 rounded-xl p-4 border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">
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
                      className={`w-full text-left p-4 rounded-xl font-sans text-sm font-medium transition-all duration-200 flex items-center justify-between border ${
                        isSelected
                          ? "bg-ochre text-white border-ochre scale-[1.01]"
                          : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-800 hover:border-zinc-700"
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

              {/* Footer status */}
              <div className="text-right text-xs font-mono text-zinc-500">
                Score so far: <strong className="text-ochre font-bold">{score} pts</strong>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. MODAL: Quiz Summary & Victory Results */}
      <AnimatePresence>
        {quizCompleted && selectedQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-zinc-200 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mb-3">
                🏆
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-navy mb-1">
                Challenge Completed!
              </h3>
              <p className="text-xs font-mono text-zinc-500 mb-6">{selectedQuiz.title}</p>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 bg-[#F4F3EE] p-4 rounded-2xl border border-zinc-200 mb-6 font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">SCORE</span>
                  <strong className="text-navy font-bold text-lg">{score}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">ACCURACY</span>
                  <strong className="text-emerald-600 font-bold text-lg">
                    {Math.round((correctCount / selectedQuiz.questions.length) * 100)}%
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">TIME</span>
                  <strong className="text-navy font-bold text-lg">{totalTimeSpent}s</strong>
                </div>
              </div>

              {/* Rank Announcement */}
              {lastRank && (
                <div className="p-3.5 rounded-xl bg-ochre/10 border border-ochre/30 text-xs font-mono font-bold text-navy mb-6">
                  🎉 Congratulations <strong>{playerName}</strong>! You achieved Rank <strong className="text-ochre text-sm">#{lastRank}</strong> on the Leaderboard!
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setQuizCompleted(false);
                    setQuizStarted(false);
                  }}
                  className="flex-1 bg-navy hover:bg-navy/90 text-white font-mono text-xs font-bold py-3 rounded-xl transition-colors"
                >
                  View Leaderboard 📊
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
