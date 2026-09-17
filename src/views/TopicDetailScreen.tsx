import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Layers, Lightbulb, HelpCircle, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';
import { TopicInfo } from '../types';
import { useApp } from '../context/AppContext';

interface TopicDetailScreenProps {
  topic: TopicInfo;
  onBack: () => void;
}

export const TopicDetailScreen: React.FC<TopicDetailScreenProps> = ({ topic, onBack }) => {
  const { openArticle, submitQuizAnswer, showNotification, articles } = useApp();
  const [activeConceptIdx, setActiveConceptIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<Record<string, { isCorrect: boolean; explanation: string }>>({});

  const title = topic.name || topic.title || 'Topic Overview';
  const description = topic.tagline || topic.description || '';
  const summary = topic.summary || topic.fundamentalConcept || '';
  const keyConcepts = topic.keyConcepts || [];
  const quizQuestions = topic.quickQuiz || topic.quizQuestions || [];
  const articleIds = topic.articleIds || topic.relatedArticleIds || [];

  const handleSelectAnswer = async (qId: string, optIdx: number, correctIdx: number, explanation: string) => {
    if (selectedAnswers[qId] !== undefined) return;

    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
    const isCorrect = optIdx === correctIdx;
    setQuizResults(prev => ({
      ...prev,
      [qId]: { isCorrect, explanation }
    }));

    await submitQuizAnswer(qId, optIdx, topic.category);
    showNotification(isCorrect ? 'Correct! +20 XP earned 🎓' : 'Good try! Keep learning +5 XP');
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top bar */}
      <div className="flex items-center justify-between py-2 sticky top-16 z-20 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
          id="topic-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
          {topic.category}
        </span>
      </div>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Student Concept Guide</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
          {title}
        </h1>

        {description && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {description}
          </p>
        )}
      </header>

      {/* Fundamental Concept / Summary */}
      {summary && (
        <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>The Big Picture</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {/* Interactive Core Concepts */}
      {keyConcepts.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Core Concepts ({keyConcepts.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {keyConcepts.map((kc, idx) => {
              const termName = kc.term || kc.concept || `Concept ${idx + 1}`;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveConceptIdx(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activeConceptIdx === idx
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs truncate">{termName}</div>
                </button>
              );
            })}
          </div>

          {keyConcepts[activeConceptIdx] && (
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5 animate-in fade-in">
              <h4 className="text-sm font-extrabold text-indigo-900 dark:text-indigo-200">
                {keyConcepts[activeConceptIdx]?.term || keyConcepts[activeConceptIdx]?.concept}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {keyConcepts[activeConceptIdx]?.explanation}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Why It Matters for Students */}
      {topic.whyItMattersForStudents && (
        <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Why Should Students Understand This?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {topic.whyItMattersForStudents}
          </p>
        </section>
      )}

      {/* Comprehension Check Quiz */}
      {quizQuestions.length > 0 && (
        <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                Comprehension Check • Earn XP
              </span>
            </div>
            <span className="text-[11px] text-indigo-200">
              {quizQuestions.length} Questions
            </span>
          </div>

          <div className="space-y-4">
            {quizQuestions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              const result = quizResults[q.id];

              return (
                <div key={q.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {qIdx + 1}. {q.question}
                  </div>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      let btnClasses = 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200';

                      if (selectedOpt !== undefined) {
                        if (isCorrect) {
                          btnClasses = 'border-emerald-500 bg-emerald-950/80 text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnClasses = 'border-rose-500 bg-rose-950/80 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={selectedOpt !== undefined}
                          onClick={() => handleSelectAnswer(q.id, optIdx, q.correctIndex, q.explanation)}
                          className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnClasses}`}
                        >
                          <span>{opt}</span>
                          {selectedOpt !== undefined && isCorrect && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {result && (
                    <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800 text-[11px] text-indigo-200">
                      <span className="font-bold">{result.isCorrect ? '✅ Well done!' : 'ℹ️ Keep in mind:'} </span>
                      {result.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related News Articles */}
      {articleIds.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Read News Stories About This Topic
          </h3>
          <div className="space-y-2">
            {articleIds.map(artId => {
              const matchedArt = articles.find(a => a.id === artId);
              return (
                <button
                  key={artId}
                  onClick={() => openArticle(artId)}
                  className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="space-y-1 pr-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {matchedArt?.category || topic.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {matchedArt ? matchedArt.title : artId.replace(/-/g, ' ')}
                    </h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
