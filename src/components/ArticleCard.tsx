import React from 'react';
import { Clock, Layers, Bookmark, ArrowRight, ShieldAlert } from 'lucide-react';
import { Article } from '../types';
import { useApp } from '../context/AppContext';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
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
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
      id={`article-card-${article.id}`}
    >
      <div>
        {/* Top bar: Category & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {article.category}
            </span>
            {article.isSensitive && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                Sensitive Topic
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveArticle(article.id);
            }}
            aria-label={saved ? 'Remove bookmark' : 'Save article'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400' : ''}`} />
          </button>
        </div>

        {/* Content Layout with Thumbnail */}
        <div className="flex gap-3 sm:gap-4 items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {article.inSimpleWords}
            </p>
          </div>

          {article.heroImage && (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <img
                src={article.heroImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
            {article.sourceName}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readingTimeMinutes}m
          </span>
          <span>•</span>
          <span>{formatTimeAgo(article.publishedAt)}</span>
        </div>

        <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 ml-2">
          <span className="text-[11px]">Learn</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </article>
  );
};
