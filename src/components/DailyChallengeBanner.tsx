import React from 'react';
import { Trophy, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DailyChallengeBanner: React.FC = () => {
  const { setActiveTab, dailyChallenge, userProgress } = useApp();

  return (
    <div
      onClick={() => setActiveTab('challenge')}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
      id="daily-challenge-banner"
    >
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              Daily Challenge
            </span>
            <span className="text-xs text-indigo-200 font-medium">5 Questions • ~2 mins</span>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            Can you answer today's 5 news questions?
          </h3>

          <p className="text-xs text-indigo-100 max-w-xl">
            Test your understanding on chips, space docking, and economics. Earn +100 XP towards Level {userProgress.level + 1}!
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end mt-1 sm:mt-0">
          <div className="flex items-center gap-1 text-amber-300 font-extrabold text-sm">
            <span>+100 XP</span>
          </div>

          <button
            className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs flex items-center gap-1.5 shadow-sm group-hover:bg-indigo-50 transition-colors"
          >
            <span>Start Challenge</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Subtle background graphics */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 top-0 w-24 h-24 bg-violet-400/20 rounded-full blur-xl pointer-events-none" />
    </div>
  );
};
