import React, { useState } from 'react';
import {
  Trophy,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
  Compass,
  Clock,
  BookOpen,
  Lock,
  LogIn,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizQuestion } from '../types';

export const ChallengeScreen: React.FC = () => {
  const {
    dailyChallenge,
    weeklyChallenge,
    submitDailyQuiz,
    dailyQuizStatus,
    weeklyQuizStatus,
    submitWeeklyQuiz,
    currentUser,
    openAuthModal,
    castPredictionVote,
    userProgress,
    articles,
    showNotification,
    setActiveTab: setNavTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'predictions'>('daily');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [explanationText, setExplanationText] = useState<string>('');
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [dailyAnswers, setDailyAnswers] = useState<Record<string, number>>({});
  const [weeklyAnswers, setWeeklyAnswers] = useState<Record<string, number>>({});
  const [submittingDaily, setSubmittingDaily] = useState<boolean>(false);
  const [submittingWeekly, setSubmittingWeekly] = useState<boolean>(false);
  const [showReviewQuestions, setShowReviewQuestions] = useState<boolean>(false);
  const [showWeeklyReview, setShowWeeklyReview] = useState<boolean>(false);
  const [isWeeklyStarted, setIsWeeklyStarted] = useState<boolean>(false);

  const currentQuestions: QuizQuestion[] =
    activeTab === 'daily' ? dailyChallenge.questions : weeklyChallenge.questions;
  const currentQ = currentQuestions[currentQIndex];

  const isDailyAlreadyCompleted = Boolean(dailyQuizStatus?.completed);
  const isWeeklyAlreadyCompleted = Boolean(weeklyQuizStatus?.completed);

  const handleOptionClick = (index: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(index);
  };

  const handleAnswerSubmit = async () => {
    if (selectedOption === null || hasSubmittedAnswer || !currentQ) return;

    setHasSubmittedAnswer(true);

    const correct = currentQ.correctIndex === selectedOption;
    setIsCorrect(correct);
    setExplanationText(currentQ.explanation);

    if (correct) {
      setQuizScore(prev => prev + 1);
      showNotification('Correct answer! 🎯');
    } else {
      showNotification('Good try! Check the explanation below 💡');
    }

    if (activeTab === 'daily') {
      setDailyAnswers(prev => ({ ...prev, [currentQ.id]: selectedOption }));
    } else {
      setWeeklyAnswers(prev => ({ ...prev, [currentQ.id]: selectedOption }));
    }
  };

  const handleNextQuestion = async () => {
    if (currentQIndex < currentQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasSubmittedAnswer(false);
      setExplanationText('');
    } else {
      // Final question reached
      if (activeTab === 'daily') {
        if (currentUser) {
          setSubmittingDaily(true);
          const finalAnswers = {
            ...dailyAnswers,
            ...(currentQ && selectedOption !== null ? { [currentQ.id]: selectedOption } : {})
          };
          const res = await submitDailyQuiz(finalAnswers);
          setSubmittingDaily(false);
          if (res.success && res.score !== undefined) {
            setQuizScore(res.score);
          }
        }
      } else if (activeTab === 'weekly') {
        const finalWeeklyAnswers = {
          ...weeklyAnswers,
          ...(currentQ && selectedOption !== null ? { [currentQ.id]: selectedOption } : {})
        };
        if (currentUser) {
          setSubmittingWeekly(true);
          const res = await submitWeeklyQuiz(finalWeeklyAnswers);
          setSubmittingWeekly(false);
          if (res.success && res.score !== undefined) {
            setQuizScore(res.score);
          }
        }
      }
      setIsQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setExplanationText('');
    setQuizScore(0);
    setIsQuizFinished(false);
    setDailyAnswers({});
    setWeeklyAnswers({});
    setIsWeeklyStarted(false);
  };

  // Collect all predictions from all articles
  const allPredictions = articles.flatMap(a =>
    (a.predictions || []).map(p => ({ ...p, articleTitle: a.title, articleCategory: a.category }))
  );

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          News Challenges & Forecasting
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Test your comprehension, complete weekly practice cycles, and earn verified XP
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start">
        <button
          onClick={() => {
            setActiveTab('daily');
            handleRestartQuiz();
          }}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'daily'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          id="tab-daily-challenge"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Daily 5-Q Challenge</span>
          {isDailyAlreadyCompleted && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Completed today" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('weekly');
            handleRestartQuiz();
          }}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'weekly'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          id="tab-weekly-challenge"
        >
          <Trophy className="w-3.5 h-3.5 text-indigo-500" />
          <span>Weekly Practice</span>
          {isWeeklyAlreadyCompleted ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Completed this week" />
          ) : (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              Ready
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'predictions'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          id="tab-forecasting"
        >
          <Compass className="w-3.5 h-3.5 text-violet-500" />
          <span>Forecasting ({allPredictions.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. DAILY CHALLENGE: ALREADY COMPLETED STATE */}
      {/* ======================================================== */}
      {activeTab === 'daily' && isDailyAlreadyCompleted && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <span>Today's Daily Challenge Completed</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Streak Preserved for Today! 🔥
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              You've completed your daily quiz for today. Your progress and points have been saved to your account.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                {dailyQuizStatus?.completion?.score ?? 5}/{dailyQuizStatus?.completion?.totalQuestions ?? 5}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Score</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-lg font-black text-amber-500">
                +{dailyQuizStatus?.completion?.xpAwarded ?? 100}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">XP Awarded</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-lg font-black text-emerald-500">
                {userProgress.streakDays}d
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Streak</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowReviewQuestions(!showReviewQuestions)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              id="review-daily-questions-btn"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showReviewQuestions ? 'Hide Questions' : "Review Today's Questions"}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('weekly');
                handleRestartQuiz();
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Go to Weekly Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Daily Review Drawer */}
          {showReviewQuestions && (
            <div className="text-left space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today's 5 Questions & Key Takeaways
              </h3>
              <div className="space-y-3">
                {dailyChallenge.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        Q{idx + 1}. {q.category}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {q.question}
                    </p>
                    <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200">
                      <span className="font-bold">Correct Answer:</span> {q.options[q.correctIndex]}
                      <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. WEEKLY PRACTICE: ALREADY COMPLETED IN 7-DAY CYCLE     */}
      {/* ======================================================== */}
      {activeTab === 'weekly' && isWeeklyAlreadyCompleted && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-center animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{weeklyQuizStatus?.cycleLabel || "This Week's Practice Completed"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              You have already completed this week's practice!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Your score and XP for this 7-day cycle are safely recorded. Weekly Practice is limited to one completion per week to encourage structured learning.
            </p>
          </div>

          {/* Weekly Score Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {weeklyQuizStatus?.completion?.score ?? 0}/{weeklyQuizStatus?.completion?.totalQuestions ?? weeklyChallenge.questions.length}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your Score</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-2xl font-black text-amber-500">
                +{weeklyQuizStatus?.completion?.xpAwarded ?? 0}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">XP Earned</div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-2xl font-black text-emerald-500">
                1 / 1
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Weekly Limit</div>
            </div>
          </div>

          {/* Countdown & Unlock Information */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/50 max-w-md mx-auto flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 text-xs">
              <p className="font-black text-amber-900 dark:text-amber-200">
                Next Weekly Practice unlocks in {weeklyQuizStatus?.daysRemaining ?? 7} {(weeklyQuizStatus?.daysRemaining ?? 7) === 1 ? 'day' : 'days'}
              </p>
              <p className="text-amber-700/90 dark:text-amber-300/80">
                Available on Monday, {weeklyQuizStatus?.nextCycleDate || 'next week'}. Fresh questions will be generated from real current news stories!
              </p>
            </div>
          </div>

          {/* Read-Only Review & Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowWeeklyReview(!showWeeklyReview)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              id="review-weekly-questions-btn"
            >
              <BookOpen className="w-4 h-4" />
              <span>{showWeeklyReview ? 'Hide Questions' : "Review this week's questions"}</span>
            </button>
            <button
              onClick={() => setNavTab('home')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore Current News</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Read-Only Review of Weekly Questions */}
          {showWeeklyReview && (
            <div className="text-left space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  This Week's 10 Questions (Read-Only Review)
                </h3>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                  Scoring Disabled
                </span>
              </div>
              <div className="space-y-3.5">
                {weeklyChallenge.questions.map((q, idx) => {
                  const userChoice = weeklyQuizStatus?.completion?.answers?.[q.id];
                  const hasUserAnswer = userChoice !== undefined;
                  const isUserCorrect = userChoice === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          Question {idx + 1} • {q.category}
                        </span>
                        {hasUserAnswer && (
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              isUserCorrect
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {isUserCorrect ? 'Correct (+25 XP)' : 'Attempted (+10 XP)'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                        {q.question}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isKey = oIdx === q.correctIndex;
                          const wasChosen = userChoice === oIdx;

                          let style =
                            'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400';
                          if (isKey) {
                            style =
                              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (wasChosen && !isKey) {
                            style =
                              'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 line-through';
                          }

                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${style}`}
                            >
                              <span>{opt}</span>
                              {isKey && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                              {wasChosen && !isKey && <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />}
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Explanation:</span> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. WEEKLY PRACTICE: READY STATE (FIRST TIME THIS WEEK)   */}
      {/* ======================================================== */}
      {activeTab === 'weekly' && !isWeeklyAlreadyCompleted && !isWeeklyStarted && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-center animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{weeklyQuizStatus?.cycleLabel || 'Current 7-Day Cycle'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Your Weekly Practice is ready!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Test your comprehensive understanding of this week's top stories from NewsLens. Questions are based on current events from India, World affairs, Science, and more.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">10</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Questions</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-xl font-black text-amber-500">+250</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max XP</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-xl font-black text-emerald-500">1 / Week</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">7-Day Cycle</div>
            </div>
          </div>

          {/* Notice about 1 attempt per 7-day cycle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0" />
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">One attempt allowed:</strong> Once submitted, your score is locked in the database until the next cycle begins.
            </p>
          </div>

          {!currentUser && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 max-w-md mx-auto text-left space-y-2">
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Tip: Sign in to save your score and official weekly completion record!
              </p>
              <button
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In Before Starting</span>
              </button>
            </div>
          )}

          {/* Start Practice Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                handleRestartQuiz();
                setIsWeeklyStarted(true);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black transition-all shadow-md hover:shadow-lg cursor-pointer inline-flex items-center justify-center gap-2"
              id="start-weekly-practice-btn"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Start Weekly Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. ACTIVE QUIZ ARENA (DAILY OR STARTED WEEKLY)           */}
      {/* ======================================================== */}
      {((activeTab === 'daily' && !isDailyAlreadyCompleted) ||
        (activeTab === 'weekly' && !isWeeklyAlreadyCompleted && isWeeklyStarted)) && (
        <div>
          {!isQuizFinished && currentQ ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 animate-in fade-in">
              {/* Top Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                    Question {currentQIndex + 1} of {currentQuestions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {currentQ.category}
                  </span>
                </div>

                <span className="text-xs font-bold text-amber-500">
                  {activeTab === 'weekly' ? '+25 XP on correct' : '+20 XP on correct'}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isAnswerKey = currentQ.correctIndex === idx;

                  let optionStyles =
                    'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200';

                  if (hasSubmittedAnswer) {
                    if (isAnswerKey) {
                      optionStyles =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isSelected) {
                      optionStyles =
                        'border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                    } else {
                      optionStyles =
                        'border-slate-200/50 dark:border-slate-800 opacity-60 text-slate-400';
                    }
                  } else if (isSelected) {
                    optionStyles =
                      'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold ring-2 ring-indigo-500/20';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasSubmittedAnswer}
                      onClick={() => handleOptionClick(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyles}`}
                    >
                      <span>{opt}</span>
                      {hasSubmittedAnswer && isAnswerKey && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                      )}
                      {hasSubmittedAnswer && isSelected && !isAnswerKey && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card upon submission */}
              {hasSubmittedAnswer && (
                <div
                  className={`p-4 rounded-xl border space-y-1 animate-in fade-in duration-200 ${
                    isCorrect
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {isCorrect ? (
                      <span className="text-emerald-700 dark:text-emerald-300">
                        ✅ Correct! Great job!
                      </span>
                    ) : (
                      <span className="text-amber-800 dark:text-amber-300">
                        💡 Learning Moment:
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {explanationText || currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {!hasSubmittedAnswer ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleAnswerSubmit}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    disabled={submittingDaily || submittingWeekly}
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <span>
                      {submittingDaily || submittingWeekly
                        ? 'Saving Score...'
                        : currentQIndex < currentQuestions.length - 1
                        ? 'Next Question'
                        : activeTab === 'weekly'
                        ? 'Submit Weekly Practice'
                        : 'Submit & View Results'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* FINISHED CELEBRATION STATE */
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-5 shadow-sm animate-in fade-in">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
                <Trophy className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {activeTab === 'daily'
                    ? 'Daily Challenge Complete! 🎉'
                    : 'Weekly Practice Complete! 🎉'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  You scored <span className="font-bold text-indigo-600 dark:text-indigo-400">{quizScore}</span> out of{' '}
                  {currentQuestions.length} correct!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 max-w-xs mx-auto text-xs font-bold text-indigo-700 dark:text-indigo-300">
                {activeTab === 'weekly'
                  ? `+${(quizScore * 25) + ((currentQuestions.length - quizScore) * 10)} XP Awarded • Cycle Saved`
                  : `+${(quizScore * 20) + ((currentQuestions.length - quizScore) * 5)} XP Added • Streak: ${userProgress.streakDays} Days`}
              </div>

              {activeTab === 'weekly' && (
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 max-w-md mx-auto text-left flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-900 dark:text-amber-200">
                    <strong>Next practice available in {weeklyQuizStatus?.daysRemaining ?? 7} days.</strong> Your score is safely preserved in the database.
                  </p>
                </div>
              )}

              {!currentUser && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 max-w-md mx-auto text-left space-y-2">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Sign in to save this completion to your persistent database profile!
                  </p>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In to Sync</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                {activeTab === 'weekly' ? (
                  <button
                    onClick={() => setNavTab('home')}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Read Latest News</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('predictions')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Try Forecaster Game</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. FORECASTING ARENA TAB                                 */}
      {/* ======================================================== */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-900 text-white space-y-1 shadow-xs">
            <h3 className="text-sm font-black flex items-center gap-1.5">
              <span>Future Forecaster Game</span>
              <span>🔮</span>
            </h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              News isn't just about what happened—it's about anticipating what comes next. Cast your votes on live questions to test your foresight and track your prediction statistics!
            </p>
          </div>

          <div className="space-y-3.5">
            {allPredictions.map(pred => {
              const totalVotes = pred.totalVotes?.reduce((a, b) => a + b, 0) || 0;

              return (
                <div
                  key={pred.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {pred.articleCategory}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {totalVotes} total votes
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {pred.question}
                  </h4>

                  <div className="space-y-2">
                    {pred.options.map((opt, oIdx) => {
                      const isSelected = pred.userChoice === oIdx;
                      const optVotes = pred.totalVotes?.[oIdx] || 0;
                      const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;

                      return (
                        <button
                          key={oIdx}
                          onClick={() => castPredictionVote(pred.id, oIdx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all relative overflow-hidden flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-950 dark:text-indigo-200'
                              : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="relative z-10">{opt}</span>
                          <span className="relative z-10 font-bold text-indigo-600 dark:text-indigo-400">
                            {pct}%
                          </span>

                          <div
                            className="absolute left-0 top-0 bottom-0 bg-indigo-100/60 dark:bg-indigo-900/30 transition-all duration-500 pointer-events-none"
                            style={{ width: `${pct}%` }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
