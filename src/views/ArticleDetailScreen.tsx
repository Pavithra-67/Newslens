import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Bookmark,
  Share2,
  ExternalLink,
  Sparkles,
  Info,
  HelpCircle,
  TrendingUp,
  Layers,
  Users,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Scale,
  Brain
} from 'lucide-react';
import { Article, ExplanationStyle, KeyTerm, Stakeholder } from '../types';
import { useApp } from '../context/AppContext';

interface ArticleDetailScreenProps {
  article: Article;
  onBack: () => void;
}

export const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ article, onBack }) => {
  const {
    isArticleSaved,
    toggleSaveArticle,
    openArticle,
    castPredictionVote,
    showNotification,
    articles
  } = useApp();

  const saved = isArticleSaved(article.id);
  const [explanationMode, setExplanationMode] = useState<ExplanationStyle>('student');
  const [selectedTerm, setSelectedTerm] = useState<KeyTerm | null>(article.keyTerms[0] || null);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(article.stakeholders[0] || null);
  const [revealSensitive, setRevealSensitive] = useState<boolean>(!article.isSensitive);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.headline,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Story link copied to clipboard! 🔗');
    }
  };

  const relatedArticles = article.relatedArticleIds
    ? articles.filter(a => article.relatedArticleIds?.includes(a.id))
    : [];

  return (
    <article className="max-w-3xl mx-auto pb-20 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Sticky Header Nav */}
      <div className="flex items-center justify-between gap-2 py-2 sticky top-16 z-20 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          id="article-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            aria-label="Share article"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleSaveArticle(article.id)}
            aria-label={saved ? 'Remove bookmark' : 'Save article'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Sensitive Content Warning (If Applicable) */}
      {article.isSensitive && !revealSensitive && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Sensitive Topic Notice</span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300">
            This article covers events that may be distressing. Content has been curated strictly for non-graphic factual education.
          </p>
          <button
            onClick={() => setRevealSensitive(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors"
          >
            Reveal Content
          </button>
        </div>
      )}

      {/* Article Header & Hero */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-2.5 py-1 rounded-md font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
            {article.category}
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{article.sourceName}</span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {article.readingTimeMinutes} min read
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 dark:text-slate-400">{formatTime(article.publishedAt)}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          {article.headline}
        </p>

        {article.heroImage && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-sm mt-3">
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/60 backdrop-blur-md text-[10px] text-white">
              Photo via verified news coverage
            </div>
          </div>
        )}
      </header>

      {/* SECTION 1: WHAT HAPPENED? */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <Info className="w-4 h-4" />
          <span>What Happened?</span>
        </div>
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
          {article.whatHappened}
        </p>
      </section>

      {/* SECTION 2: UNDERSTAND THIS (EXPLANATION MODES) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/60 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            <Brain className="w-4 h-4 text-indigo-500" />
            <span>Understand This</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
            {(['simple', 'student', 'detailed'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setExplanationMode(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all capitalize ${
                  explanationMode === mode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {mode === 'simple' ? '🐣 Simple' : mode === 'student' ? '🎓 Student' : '🔬 Detailed'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-indigo-100/80 dark:border-slate-700/80">
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
            {article.explanationModes[explanationMode]}
          </p>
        </div>

        <p className="text-[11px] text-slate-400">
          * Factually grounded explanation calibrated for {explanationMode} reading level.
        </p>
      </section>

      {/* SECTION 3: WHY SHOULD I CARE? */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Why Should I Care?</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {article.whyShouldICare.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                  For {item.target}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  item.isCertain
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                }`}>
                  {item.isCertain ? 'Confirmed Impact' : 'Projected Impact'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.impact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: KEY TERMS */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Key Terms to Know</span>
          </div>
          <span className="text-[11px] text-slate-400">Tap a term to inspect</span>
        </div>

        {/* Term Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {article.keyTerms.map((item, idx) => {
            const isSelected = selectedTerm?.term === item.term;
            return (
              <button
                key={idx}
                onClick={() => setSelectedTerm(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {item.term}
              </button>
            );
          })}
        </div>

        {/* Selected Term Detail Card */}
        {selectedTerm && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {selectedTerm.term}
              </h4>
              {selectedTerm.category && (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  {selectedTerm.category}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {selectedTerm.definition}
            </p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium italic">
              Context: {selectedTerm.context}
            </p>
          </div>
        )}
      </section>

      {/* SECTION 5: WHAT CHANGED? (PREVIOUSLY VS NOW) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>What Changed?</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <span className="text-[11px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Previously
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {article.whatChanged.previously}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
            <span className="text-[11px] font-black tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
              Now
            </span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
              {article.whatChanged.now}
            </p>
          </div>
        </div>

        {article.whatChanged.highlights.length > 0 && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Key Shifts:</div>
            <ul className="space-y-1">
              {article.whatChanged.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* SECTION 6: WHAT HAPPENED BEFORE? (TIMELINE) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <GitCommit className="w-4 h-4 text-indigo-500" />
          <span>Story Timeline: What Happened Before?</span>
        </div>

        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {article.timeline.map((event, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-400 group-hover:scale-125 transition-transform" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                    {event.date}
                  </span>
                  {event.source && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({event.source})
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {event.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: WHO IS AFFECTED? (STAKEHOLDERS) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Who Is Affected?</span>
          </div>
          <span className="text-[11px] text-slate-400">Interactive Stakeholder Map</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {article.stakeholders.map((sh, idx) => {
            const isSelected = selectedStakeholder?.name === sh.name;
            return (
              <button
                key={idx}
                onClick={() => setSelectedStakeholder(sh)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold truncate">{sh.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{sh.role}</div>
              </button>
            );
          })}
        </div>

        {selectedStakeholder && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedStakeholder.name} ({selectedStakeholder.role})
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                {selectedStakeholder.impactLevel} impact
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {selectedStakeholder.relation}
            </p>
          </div>
        )}
      </section>

      {/* SECTION 8: DIFFERENT VIEWS (FOR DEBATED TOPICS) */}
      {article.viewpoints && (
        <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Scale className="w-4 h-4 text-violet-500" />
            <span>Different Views & Arguments</span>
          </div>

          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Topic: {article.viewpoints.topic}
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-200">Confirmed Facts:</div>
            {article.viewpoints.confirmedFacts.map((fact, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{fact}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                Viewpoint A: {article.viewpoints.viewpointA.title}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {article.viewpoints.viewpointA.argument}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-50/50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/60 space-y-1.5">
              <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300">
                Viewpoint B: {article.viewpoints.viewpointB.title}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {article.viewpoints.viewpointB.argument}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 9: WHAT HAPPENS NEXT? & PREDICTIONS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>What Happens Next? & Forecasting</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {article.whatHappensNext.map((next, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  {next.scenario}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {next.probability} Probability
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {next.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* Prediction Game Card */}
        {article.predictions && article.predictions.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200">
                🔮 Forecaster Game • +10 XP
              </span>
              <span className="text-xs text-indigo-300">
                {article.predictions[0].totalVotes?.reduce((a, b) => a + b, 0) || 0} students predicted
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-white">
              {article.predictions[0].question}
            </h4>

            <div className="space-y-2">
              {article.predictions[0].options.map((opt, oIdx) => {
                const isSelected = article.predictions?.[0].userChoice === oIdx;
                const totalVotes = article.predictions?.[0].totalVotes?.reduce((a, b) => a + b, 0) || 1;
                const optVotes = article.predictions?.[0].totalVotes?.[oIdx] || 0;
                const percentage = Math.round((optVotes / Math.max(totalVotes, 1)) * 100);

                return (
                  <button
                    key={oIdx}
                    onClick={() => castPredictionVote(article.predictions![0].id, oIdx)}
                    className={`w-full p-3 rounded-xl border text-left transition-all relative overflow-hidden flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-800/80 font-bold'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-10">{opt}</span>
                    <span className="relative z-10 font-bold text-indigo-200">{percentage}%</span>
                    {/* Progress Fill */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-indigo-600/30 transition-all duration-500 pointer-events-none"
                      style={{ width: `${percentage}%` }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 10: SOURCE TRANSPARENCY & COVERAGE */}
      <section className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Source Transparency & Multi-Source Coverage
          </span>
          <span className="text-slate-400">Covered by {article.coveredSourcesCount} outlets</span>
        </div>

        <p className="text-slate-600 dark:text-slate-400">
          NewsLens is an educational intelligence interface. AI summaries are strictly synthesized from authorized reporting.
        </p>

        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Primary: {article.sourceName}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {article.otherSources?.map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:underline"
            >
              <span>{src.name}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </section>

      {/* SECTION 12: RELATED STORIES */}
      {relatedArticles.length > 0 && (
        <section className="space-y-3 pt-2">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Related Stories to Explore
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedArticles.map(rel => (
              <div
                key={rel.id}
                onClick={() => openArticle(rel.id)}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer shadow-2xs"
              >
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  {rel.category}
                </span>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-1">
                  {rel.title}
                </h4>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
