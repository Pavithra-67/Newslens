import React from 'react';
import {
  User,
  Flame,
  Zap,
  Award,
  BookOpen,
  TrendingUp,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Compass,
  AlertCircle,
  LogOut,
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NewsLensLogo } from '../components/NewsLensLogo';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    userProfile,
    userProgress,
    setShowSettingsModal,
    setShowAdminModal,
    openTopic,
    setActiveTab,
    openAuthModal,
    logout
  } = useApp();

  const accuracyPct =
    userProgress.quizStats.attempted > 0
      ? Math.round((userProgress.quizStats.correct / userProgress.quizStats.attempted) * 100)
      : 0;

  // Identify strengths and improvement areas from quiz stats
  const catStats = (Object.entries(userProgress.quizStats.byCategory) as [string, { attempted: number; correct: number }][]).map(([cat, stats]) => ({
    category: cat,
    accuracy: stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0,
    attempted: stats.attempted
  }));

  catStats.sort((a, b) => b.accuracy - a.accuracy);
  const strongestCategory = catStats[0] || { category: 'Science & Technology', accuracy: 100 };
  const improvementCategory = catStats[catStats.length - 1] || { category: 'Business & Economy', accuracy: 60 };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const longestStreak = userProgress.longestStreak ?? Math.max(userProgress.streakDays, 7);

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto animate-in fade-in">
      {/* Unauthenticated State Banner */}
      {!currentUser && (
        <div
          className="p-4 sm:p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
          id="profile-auth-prompt"
        >
          <div>
            <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
              Sign in to save your learning journey
            </h3>
            <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 mt-0.5">
              Sync your streak, preserve quiz XP, and access your achievements across devices.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openAuthModal('login')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              id="profile-prompt-login-btn"
            >
              Log In
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              id="profile-prompt-signup-btn"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <NewsLensLogo size="lg" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-slate-900 shadow-xs">
              ✓
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {currentUser?.name || userProfile.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {currentUser?.role === 'admin' ? 'Educator / Admin' : 'Student'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {currentUser?.email || 'Guest Explorer'}
            </p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-semibold">
              Level {userProgress.level} ({userProgress.levelTitle})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Preferences"
            id="profile-settings-btn"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Primary Logout Button inside Profile */}
          {currentUser ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 border border-rose-200/80 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
              title="Sign out of your account"
              id="profile-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              id="profile-login-btn"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>

      {/* Streak & XP Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Streak Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 dark:border-amber-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Daily Habit Streak
              </span>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                {userProgress.streakDays} Days
              </div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Best: {longestStreak} Days
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            {userProgress.streakDays > 0
              ? `You've engaged with current affairs ${userProgress.streakDays} day${userProgress.streakDays === 1 ? '' : 's'} in a row!`
              : 'Complete today\'s challenge to ignite your streak!'}
          </p>

          <div className="flex items-center justify-between pt-1">
            {daysOfWeek.map((day, idx) => {
              const active = idx < Math.min(7, userProgress.streakDays || 1);
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                      active
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {active ? '✓' : '•'}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-200/80 dark:border-indigo-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                Total Knowledge Points
              </span>
            </div>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {userProgress.xp} XP
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress to Level {userProgress.level + 1}</span>
              <span className="font-bold">{userProgress.xp % 200}/200 XP</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((userProgress.xp % 200) / 200) * 100)}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Next Level Unlock: <span className="font-semibold text-indigo-600 dark:text-indigo-400">Current Affairs Pro</span> (+{200 - (userProgress.xp % 200)} XP needed)
          </p>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-0.5">
          <div className="text-xl font-black text-slate-900 dark:text-white">{userProgress.storiesReadCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Stories Read</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-0.5">
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{userProgress.quizStats.attempted}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Questions Attempted</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-0.5">
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{accuracyPct}%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Quiz Accuracy</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-0.5">
          <div className="text-xl font-black text-violet-600 dark:text-violet-400">{userProgress.predictionStats.total}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Future Forecasts</div>
        </div>
      </div>

      {/* TOPIC STRENGTHS & IMPROVEMENT AREAS */}
      <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Understanding Strengths & Recommendations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Strongest Area */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Strongest Subject
              </span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                {Math.round(strongestCategory.accuracy)}% accuracy
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {strongestCategory.category}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              You demonstrate exceptional comprehension on technical and scientific advancements!
            </p>
          </div>

          {/* Improvement Area */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Needs Reinforcement
              </span>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                {Math.round(improvementCategory.accuracy)}% accuracy
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {improvementCategory.category}
            </h4>
            <button
              onClick={() => openTopic('topic-inflation-interest-rates')}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
            >
              <span>Strengthen your Economy basics →</span>
            </button>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS TROPHY CASE */}
      <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Achievements Trophy Case</span>
          </div>
          <span className="text-xs text-slate-400">
            {userProgress.achievements.filter(a => Boolean(a.unlockedAt)).length}/{userProgress.achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {userProgress.achievements.map(ach => {
            const isUnlocked = Boolean(ach.unlockedAt);
            const pct = Math.min(100, Math.round((ach.currentProgress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/40'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 opacity-80'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isUnlocked
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {ach.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] text-amber-600 font-bold">Unlocked ✓</span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {ach.description}
                  </p>

                  {!isUnlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{ach.currentProgress}/{ach.maxProgress}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
