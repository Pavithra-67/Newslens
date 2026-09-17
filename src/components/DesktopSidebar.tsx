import React from 'react';
import {
  Home,
  Compass,
  Trophy,
  Bookmark,
  User,
  Sparkles,
  Flame,
  ShieldCheck,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DesktopSidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    savedArticles,
    userProgress,
    setShowSettingsModal,
    setShowAdminModal
  } = useApp();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home, desc: "Today's important stories" },
    { id: 'explore' as const, label: 'Explore', icon: Compass, desc: 'Topics, search & timelines' },
    { id: 'challenge' as const, label: 'Challenge', icon: Trophy, desc: 'Daily quiz & predictions' },
    { id: 'saved' as const, label: 'Saved Stories', icon: Bookmark, badge: savedArticles.length, desc: 'Your learning queue' },
    { id: 'profile' as const, label: 'My Progress', icon: User, desc: 'XP, streak & achievements' }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-4 justify-between">
      <div className="space-y-6">
        {/* Navigation links */}
        <nav className="space-y-1.5" id="desktop-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs border border-indigo-200/60 dark:border-indigo-800/60'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 font-medium'
                }`}
                id={`desktop-nav-${item.id}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-sm">{item.label}</div>
                    <div className="text-[11px] text-slate-400 font-normal hidden lg:block">{item.desc}</div>
                  </div>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/80 dark:text-indigo-300 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Daily Habit Mini-Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/60 dark:border-amber-800/40">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{userProgress.streakDays} Day Habit Streak</span>
            </div>
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">🔥 Active</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Keep understanding 1 story every day to maintain your learning streak.
          </p>
        </div>

        {/* Level Progress */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <span>Level {userProgress.level}: {userProgress.levelTitle}</span>
            <span className="text-indigo-600 dark:text-indigo-400">{userProgress.xp} XP</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((userProgress.xp % 200) / 200) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>{userProgress.xp % 200} XP in level</span>
            <span>{200 - (userProgress.xp % 200)} XP to next level</span>
          </div>
        </div>
      </div>

      {/* Footer info & quick toggles */}
      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
          <button
            onClick={() => setShowAdminModal(true)}
            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Admin Panel
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          NewsLens is built for verified student comprehension. Non-partisan and fact-grounded.
        </p>
      </div>
    </aside>
  );
};
