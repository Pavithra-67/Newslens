import React from 'react';
import { X, Moon, Sun, ShieldCheck, RefreshCw, BookOpen, Brain } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExplanationStyle } from '../types';

export const SettingsModal: React.FC = () => {
  const {
    showSettingsModal,
    setShowSettingsModal,
    darkMode,
    toggleDarkMode,
    userProgress,
    updatePreferences,
    setShowOnboarding
  } = useApp();

  if (!showSettingsModal) return null;

  const handleStyleChange = (style: ExplanationStyle) => {
    updatePreferences(userProgress.interests, style);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Preferences & Settings
          </h2>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-2.5">
            {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</div>
              <div className="text-[11px] text-slate-400">Eye-comfortable theme</div>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200"
          >
            {darkMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Explanation Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-indigo-500" />
            <span>Default Reading Level</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['simple', 'student', 'detailed'] as const).map(style => (
              <button
                key={style}
                onClick={() => handleStyleChange(style)}
                className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                  userProgress.explanationStyle === style
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Educational safety seal */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold">Student Safety Promise:</strong> NewsLens never shows sensational clickbait, graphic violence, or unverified claims. All articles are fact-grounded and age-appropriate.
          </p>
        </div>

        {/* Re-run onboarding */}
        <button
          onClick={() => {
            setShowSettingsModal(false);
            setShowOnboarding(true);
          }}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Change Topic Interests</span>
        </button>
      </div>
    </div>
  );
};
