import React, { useState } from 'react';
import { Search, Compass, BookOpen, Layers, X, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryPills } from '../components/CategoryPills';
import { matchesCategory } from '../data/categories';

export const ExploreScreen: React.FC = () => {
  const {
    articles,
    topics,
    openTopic,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = useApp();

  const [activeExploreTab, setActiveExploreTab] = useState<'all' | 'topics' | 'stories'>('all');
  const [visibleStoriesCount, setVisibleStoriesCount] = useState<number>(12);

  React.useEffect(() => {
    setVisibleStoriesCount(12);
  }, [selectedCategory, searchQuery]);

  const filteredArticles = articles.filter(a => {
    const isCatMatch = matchesCategory(a.category, selectedCategory);
    const q = searchQuery.toLowerCase().trim();
    if (!q) return isCatMatch;

    const matchesSearch =
      a.title.toLowerCase().includes(q) ||
      a.headline.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.keyTerms.some(k => k.term.toLowerCase().includes(q)) ||
      a.whatHappened.toLowerCase().includes(q);

    return isCatMatch && matchesSearch;
  });

  const filteredTopics = topics.filter(t => {
    const isCatMatch = matchesCategory(t.category, selectedCategory);
    const q = searchQuery.toLowerCase().trim();
    if (!q) return isCatMatch;

    const name = (t.name || t.title || '').toLowerCase();
    const tagline = (t.tagline || t.description || '').toLowerCase();
    const summary = (t.summary || t.fundamentalConcept || '').toLowerCase();
    const concepts = (t.keyConcepts || []).some(c => (c.term || c.concept || '').toLowerCase().includes(q));

    return isCatMatch && (name.includes(q) || tagline.includes(q) || summary.includes(q) || concepts);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Explore & Learn
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Search across news, timelines, core concepts, and key terms
        </p>
      </div>

      {/* Global Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by topic, keyword (e.g. semiconductor, inflation, dock)..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          id="explore-search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills Filter */}
      <CategoryPills />

      {/* Section Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveExploreTab('all')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeExploreTab === 'all'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          All Results ({filteredArticles.length + filteredTopics.length})
        </button>
        <button
          onClick={() => setActiveExploreTab('stories')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeExploreTab === 'stories'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          News Stories ({filteredArticles.length})
        </button>
        <button
          onClick={() => setActiveExploreTab('topics')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeExploreTab === 'topics'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Educational Topic Guides ({filteredTopics.length})
        </button>
      </div>

      {/* TOPIC GUIDES SECTION */}
      {(activeExploreTab === 'all' || activeExploreTab === 'topics') && (
        <section className="space-y-3" aria-labelledby="topic-guides-heading">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <h2 id="topic-guides-heading" className="text-base font-extrabold text-slate-900 dark:text-white">
                Learn a Topic
              </h2>
            </div>
            <span className="text-xs text-slate-400">Foundational Knowledge ({filteredTopics.length})</span>
          </div>

          {filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredTopics.map(topic => (
                <div
                  key={topic.id}
                  onClick={() => openTopic(topic.id)}
                  className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
                  id={`explore-topic-${topic.id}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                        {topic.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {topic.keyConcepts.length} concepts
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {topic.name || topic.title}
                    </h3>

                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {topic.tagline || topic.description || topic.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                    <span>Explore Guide & Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                No foundational topic guides found matching {selectedCategory !== 'All' ? `"${selectedCategory}"` : 'your query'}.
              </p>
            </div>
          )}
        </section>
      )}

      {/* NEWS STORIES SECTION */}
      {(activeExploreTab === 'all' || activeExploreTab === 'stories') && (
        <section className="space-y-3" aria-labelledby="explore-stories-heading">
          <div className="flex items-center justify-between">
            <h2 id="explore-stories-heading" className="text-base font-extrabold text-slate-900 dark:text-white">
              News Stories
            </h2>
            <span className="text-xs text-slate-400">
              Showing {Math.min(visibleStoriesCount, filteredArticles.length)} of {filteredArticles.length} found
            </span>
          </div>

          {filteredArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredArticles.slice(0, visibleStoriesCount).map(art => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>

              {filteredArticles.length > visibleStoriesCount && (
                <div className="flex justify-center pt-3">
                  <button
                    onClick={() => setVisibleStoriesCount(prev => prev + 12)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    id="explore-load-more-btn"
                  >
                    Load More Stories ({filteredArticles.length - visibleStoriesCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {searchQuery
                  ? `No matching stories found for "${searchQuery}". Try searching for another keyword.`
                  : `No stories currently in "${selectedCategory}". Select "All" to browse all categories.`}
              </p>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="mt-3 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  View All Stories
                </button>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
