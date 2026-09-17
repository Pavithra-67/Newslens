import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, BookOpen, Clock, ChevronRight, RotateCw, Globe, ArrowDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TopStoryCard } from '../components/TopStoryCard';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryPills } from '../components/CategoryPills';
import { DailyChallengeBanner } from '../components/DailyChallengeBanner';
import { TrendingTopicsBar } from '../components/TrendingTopicsBar';
import { matchesCategory } from '../data/categories';

export const HomeScreen: React.FC = () => {
  const {
    articles,
    selectedCategory,
    openArticle,
    userProgress,
    refreshNews,
    isRefreshingNews
  } = useApp();

  // Pagination: initially show 12 articles, load more from cached pool
  const [visibleCount, setVisibleCount] = useState<number>(12);

  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory]);

  // Find top story (or first featured)
  const topStory = articles.find(a => a.isFeatured) || articles[0];

  // Filtered stories for Today's Picks using normalized category matcher
  const filteredArticles = articles.filter(a => {
    if (selectedCategory === 'All') return a.id !== topStory?.id;
    return matchesCategory(a.category, selectedCategory);
  });

  const displayedArticles = filteredArticles.slice(0, visibleCount);

  // Continue learning stories (from history)
  const continueStories = userProgress.readHistory
    .map(h => articles.find(a => a.id === h.articleId))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Editorial Header Statement with Real News Sync */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Today's News</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live News
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Understand the news. Not just the headline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshNews()}
            disabled={isRefreshingNews}
            title="Fetch current real-world news from NewsAPI"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs transition-all"
            id="refresh-real-news-btn"
          >
            <RotateCw className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${isRefreshingNews ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshingNews ? 'Syncing...' : 'Sync News'}</span>
          </button>

          <div className="text-right hidden md:block">
            <span className="text-xs font-semibold text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION A: Top Story */}
      {topStory && (
        <section aria-labelledby="top-story-heading">
          <TopStoryCard article={topStory} />
        </section>
      )}

      {/* SECTION B: Daily Challenge Callout */}
      <section aria-label="Daily challenge">
        <DailyChallengeBanner />
      </section>

      {/* SECTION C: Trending Concepts Bar */}
      <section aria-label="Trending concepts">
        <TrendingTopicsBar />
      </section>

      {/* SECTION D: Category Filter & Today's Picks */}
      <section className="space-y-3" aria-labelledby="todays-picks-heading">
        <div className="flex items-center justify-between">
          <h2 id="todays-picks-heading" className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            Today's Picks
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Showing {displayedArticles.length} of {filteredArticles.length} stories
          </span>
        </div>

        <CategoryPills />

        {displayedArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mt-3">
              {displayedArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination / Load More from Cached Pool */}
            {filteredArticles.length > visibleCount && (
              <div className="flex justify-center pt-3">
                <button
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-2 group"
                  id="home-load-more-btn"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:translate-y-0.5 transition-transform" />
                  <span>Load More Stories ({filteredArticles.length - visibleCount} remaining)</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Live news is temporarily unavailable or no stories match this category right now.
            </p>
            <button
              onClick={() => refreshNews(selectedCategory !== 'All' ? selectedCategory : undefined)}
              disabled={isRefreshingNews}
              className="mt-3.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
              id="retry-news-btn"
            >
              {isRefreshingNews ? 'Syncing...' : 'Retry Live Sync'}
            </button>
          </div>
        )}
      </section>

      {/* SECTION E: Continue Learning (Previously read stories) */}
      {continueStories.length > 0 && (
        <section className="space-y-3 pt-2" aria-labelledby="continue-learning-heading">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <h2 id="continue-learning-heading" className="text-base font-extrabold text-slate-900 dark:text-white">
                Continue Learning
              </h2>
            </div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Recent Activity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {continueStories.map(story => (
              <div
                key={story.id}
                onClick={() => openArticle(story.id)}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer shadow-2xs group"
              >
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {story.category}
                </span>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {story.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{story.readingTimeMinutes} min read</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
