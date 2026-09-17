import React from 'react';
import { Bookmark, Clock, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArticleCard } from '../components/ArticleCard';

export const SavedScreen: React.FC = () => {
  const { savedArticles, setActiveTab } = useApp();

  const totalReadingTime = savedArticles.reduce((acc, a) => acc + a.readingTimeMinutes, 0);

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Saved for Later
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Your personalized learning and revision queue
          </p>
        </div>

        {savedArticles.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>~{totalReadingTime} mins total</span>
          </div>
        )}
      </div>

      {savedArticles.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {savedArticles.length} Saved Stories
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {savedArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              No saved stories yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Tap the bookmark icon on any news story to save it for revision or school presentations.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('home')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <span>Browse Today's Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
