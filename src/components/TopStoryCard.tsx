import React from 'react';
import { Clock, BookOpen, Bookmark, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { useApp } from '../context/AppContext';

interface TopStoryCardProps {
  article: Article;
}

export const TopStoryCard: React.FC<TopStoryCardProps> = ({ article }) => {
  const { openArticle, isArticleSaved, toggleSaveArticle } = useApp();
  const saved = isArticleSaved(article.id);

  const formatTimeAgo = (isoString: string) => {
    const diffHours = Math.round((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <article
      onClick={() => openArticle(article.id)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      id={`top-story-${article.id}`}
    >
      {/* Hero Image Container */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={article.heroImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600/90 backdrop-blur-md text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              TOP STORY
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200">
              {article.category}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveArticle(article.id);
            }}
            aria-label={saved ? 'Remove bookmark' : 'Save article'}
            className="p-2 rounded-xl bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900/80 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-indigo-400 text-indigo-400' : ''}`} />
          </button>
        </div>

        {/* Bottom image overlay metadata */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
          <span className="font-semibold text-white truncate max-w-[200px]">
            {article.sourceName}
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} min read
            </span>
            <span>•</span>
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {article.title}
        </h2>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 sm:line-clamp-3">
          {article.inSimpleWords}
        </p>

        {/* Footer with multi-source coverage and Understand CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Covered by {article.coveredSourcesCount} sources</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openArticle(article.id);
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white text-xs font-bold transition-all"
          >
            <span>Understand this</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
