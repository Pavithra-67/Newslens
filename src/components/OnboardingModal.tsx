import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, BookOpen, Brain } from 'lucide-react';
import { NewsCategory, ExplanationStyle } from '../types';
import { useApp } from '../context/AppContext';

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, updatePreferences, userProgress } = useApp();

  const [selectedInterests, setSelectedInterests] = useState<NewsCategory[]>([
    'Science & Technology',
    'Space',
    'Business & Economy',
    'Education'
  ]);
  const [selectedStyle, setSelectedStyle] = useState<ExplanationStyle>(userProgress.explanationStyle || 'student');

  if (!showOnboarding) return null;

  const allCategories: NewsCategory[] = [
    'India',
    'World',
    'Science & Technology',
    'Space',
    'Environment',
    'Business & Economy',
    'Education',
    'Sports'
  ];

  const toggleInterest = (cat: NewsCategory) => {
    setSelectedInterests(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleFinish = () => {
    updatePreferences(selectedInterests, selectedStyle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Welcome to NewsLens
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Your personal intelligence companion. Understand current affairs through facts, context, and zero sensationalism.
          </p>
        </div>

        {/* Step 1: Select topics */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>1. What topics are you curious about?</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(cat => {
              const isSelected = selectedInterests.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleInterest(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Explanation Style */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-indigo-500" />
            <span>2. How do you prefer news explained?</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'simple' as const, label: '🐣 Simple', desc: 'No jargon, friendly language' },
              { id: 'student' as const, label: '🎓 Student', desc: 'Balanced context & definitions' },
              { id: 'detailed' as const, label: '🔬 Detailed', desc: 'Analytical policy & data' }
            ].map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedStyle === style.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">{style.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleFinish}
          className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
          <span>Start Exploring News</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
