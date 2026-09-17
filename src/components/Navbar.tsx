import React from 'react';
import { Flame, Moon, Sun, Search, Sparkles, ShieldCheck, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NewsLensLogo } from './NewsLensLogo';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    userProfile,
    userProgress,
    darkMode,
    toggleDarkMode,
    setActiveTab,
    openAuthModal,
    setShowAdminModal
  } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = currentUser ? currentUser.name.split(' ')[0] : 'Explorer';

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand & Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-left focus:outline-none group cursor-pointer"
            id="brand-logo-btn"
          >
            <NewsLensLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                  NewsLens
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                  Student Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                {getGreeting()}, {displayName} 👋
              </p>
            </div>
          </button>
        </div>

        {/* Right Action Counters & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak Indicator */}
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-semibold cursor-pointer hover:bg-amber-100/70 transition-colors"
            title={`${userProgress.streakDays} day news habit streak!`}
            id="streak-indicator-btn"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{userProgress.streakDays}d</span>
          </div>

          {/* XP Pill */}
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold cursor-pointer hover:bg-indigo-100/70 transition-colors"
            title={`Level ${userProgress.level}: ${userProgress.levelTitle}`}
            id="xp-indicator-btn"
          >
            <span className="text-amber-500 font-black">★</span>
            <span>{userProgress.xp} XP</span>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setActiveTab('explore')}
            aria-label="Search stories"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            id="nav-search-btn"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            id="theme-toggle-btn"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Student Safety badge / Admin */}
          <button
            onClick={() => setShowAdminModal(true)}
            title="Fact Checked & Student Safe • Admin Tools"
            className="hidden md:flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100/50 transition-colors cursor-pointer"
            id="admin-tools-btn"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified</span>
          </button>

          {/* Consistent NewsLens Logo Identity for Account */}
          {currentUser ? (
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 p-1 rounded-xl ring-2 ring-indigo-500/20 hover:ring-indigo-500/60 transition-all cursor-pointer"
              title={`Account: ${currentUser.name}`}
              id="profile-avatar-btn"
            >
              <NewsLensLogo size="xs" />
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              id="nav-signin-btn"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
