import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  AlertCircle,
  Lightbulb,
  Zap,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { ExplanationStyle, NewsCategory } from '../types';

interface ExplanationCardProps {
  articleId: string;
  articleTitle: string;
  category: NewsCategory;
  initialModes: {
    simple?: string;
    student?: string;
    detailed?: string;
  };
}

interface ModeMetadata {
  label: string;
  emoji: string;
  tagline: string;
  badge: string;
  readingLevel: string;
}

const MODE_CONFIG: Record<ExplanationStyle, ModeMetadata> = {
  simple: {
    label: 'Simple',
    emoji: '🐣',
    tagline: 'Plain language, everyday analogies, short punchy sentences',
    badge: '5th Grade Level',
    readingLevel: '1-2 min read'
  },
  student: {
    label: 'Student',
    emoji: '🎓',
    tagline: 'Academic context, key curriculum terms, critical reflection',
    badge: 'Secondary & College',
    readingLevel: '2-3 min read'
  },
  detailed: {
    label: 'Detailed',
    emoji: '🔬',
    tagline: 'In-depth journalism, stakeholders, timeline & perspectives',
    badge: 'Analytical / In-Depth',
    readingLevel: '4-5 min read'
  }
};

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  articleId,
  articleTitle,
  category,
  initialModes
}) => {
  const [currentMode, setCurrentMode] = useState<ExplanationStyle>('student');
  const [explanations, setExplanations] = useState<Record<ExplanationStyle, string>>({
    simple: initialModes?.simple || '',
    student: initialModes?.student || '',
    detailed: initialModes?.detailed || ''
  });
  const [isCachedMap, setIsCachedMap] = useState<Record<ExplanationStyle, boolean>>({
    simple: Boolean(initialModes?.simple && initialModes.simple.length > 100),
    student: Boolean(initialModes?.student && initialModes.student.length > 100),
    detailed: Boolean(initialModes?.detailed && initialModes.detailed.length > 100)
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [simulateErrorActive, setSimulateErrorActive] = useState<boolean>(false);

  // Fetch or regenerate explanation for the selected mode
  const fetchExplanation = useCallback(async (mode: ExplanationStyle, force = false, simulateError = false) => {
    // If we already have a full explanation in memory and not forcing, keep it
    if (!force && explanations[mode] && explanations[mode].length > 150) {
      setErrorMsg(null);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const url = `/api/news/${encodeURIComponent(articleId)}/explanation?mode=${mode}${force ? '&force=true' : ''}${simulateError ? '&simulateError=true' : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch explanation');
      }

      setExplanations(prev => ({
        ...prev,
        [mode]: data.explanation
      }));

      setIsCachedMap(prev => ({
        ...prev,
        [mode]: Boolean(data.cached)
      }));

      if (data.error) {
        setErrorMsg(data.error);
      } else {
        setErrorMsg(null);
      }
    } catch (err: any) {
      console.error(`[ExplanationCard] Failed to fetch ${mode} mode:`, err);
      setErrorMsg(err.message || 'Unable to connect to AI explanation engine. Showing offline summary.');
    } finally {
      setLoading(false);
    }
  }, [articleId, explanations]);

  // When switching modes, check if we need to fetch
  useEffect(() => {
    if (!explanations[currentMode] || explanations[currentMode].length < 150) {
      fetchExplanation(currentMode, false, simulateErrorActive);
    }
  }, [currentMode, fetchExplanation, explanations, simulateErrorActive]);

  // Audio Speech Playback
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = explanations[currentMode];
    if (!textToRead) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead.replace(/[#*•]/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech when unmounting or changing modes
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentMode]);

  // Copy to clipboard
  const handleCopy = () => {
    const text = explanations[currentMode];
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger regeneration
  const handleRegenerate = () => {
    fetchExplanation(currentMode, true, simulateErrorActive);
  };

  // Toggle simulate error state
  const handleToggleSimulateError = () => {
    const next = !simulateErrorActive;
    setSimulateErrorActive(next);
    fetchExplanation(currentMode, true, next);
  };

  const rawText = explanations[currentMode] || '';

  // Render structured text
  const renderStructuredExplanation = (text: string) => {
    if (!text) return null;

    // Split into sections by known uppercase headings
    const sectionHeadingRegex = /^(WHAT HAPPENED\?|WHO IS INVOLVED\?|WHY DOES IT MATTER\?|IN ONE LINE|THE BACKGROUND|KEY TERMS|WHY IT MATTERS|STUDENT TAKEAWAY|THINK ABOUT IT|OVERVIEW|BACKGROUND|KEY PLAYERS \/ STAKEHOLDERS|HOW IT WORKS \/ WHY IT HAPPENED|TIMELINE|IMPACT|DIFFERENT VIEWS|WHAT IS STILL UNKNOWN\?|KEY TAKEAWAYS)$/im;

    const lines = text.split('\n');
    const sections: { heading?: string; lines: string[] }[] = [];
    let currentSection: { heading?: string; lines: string[] } = { lines: [] };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (sectionHeadingRegex.test(line)) {
        if (currentSection.heading || currentSection.lines.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { heading: line, lines: [] };
      } else {
        currentSection.lines.push(line);
      }
    }
    if (currentSection.heading || currentSection.lines.length > 0) {
      sections.push(currentSection);
    }

    // Fallback if no recognizable section headings
    if (sections.length === 1 && !sections[0].heading) {
      return (
        <div className="space-y-3">
          {sections[0].lines.map((p, idx) => (
            <p key={idx} className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {sections.map((sec, idx) => {
          const h = sec.heading?.toUpperCase() || '';

          // Special styling for "THINK ABOUT IT"
          if (h === 'THINK ABOUT IT') {
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 space-y-2 text-purple-950 dark:text-purple-100 shadow-2xs"
              >
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Think About It • Class Discussion</span>
                </div>
                {sec.lines.map((l, lIdx) => (
                  <p key={lIdx} className="text-sm font-medium leading-relaxed italic">
                    "{l.replace(/^["']|["']$/g, '')}"
                  </p>
                ))}
              </div>
            );
          }

          // Special styling for "IN ONE LINE"
          if (h === 'IN ONE LINE') {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 space-y-1 text-indigo-950 dark:text-indigo-100 shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>In One Line</span>
                </div>
                {sec.lines.map((l, lIdx) => (
                  <p key={lIdx} className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {l}
                  </p>
                ))}
              </div>
            );
          }

          // Special styling for "STUDENT TAKEAWAY" or "KEY TAKEAWAYS"
          if (h === 'STUDENT TAKEAWAY' || h === 'KEY TAKEAWAYS') {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2 text-emerald-950 dark:text-emerald-100 shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{h}</span>
                </div>
                <div className="space-y-1.5">
                  {sec.lines.map((l, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{l.replace(/^[•\-\*]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Special styling for "KEY TERMS"
          if (h === 'KEY TERMS') {
            return (
              <div key={idx} className="space-y-2.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Key Terms to Know
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sec.lines.map((l, lIdx) => {
                    const cleanLine = l.replace(/^[•\-\*]\s*/, '');
                    const parts = cleanLine.split(/\s*[-—–]\s*/);
                    const term = parts[0];
                    const def = parts.slice(1).join(' — ');

                    return (
                      <div
                        key={lIdx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                      >
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 block">
                          {term}
                        </span>
                        {def && (
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-normal">
                            {def}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // Standard section layout
          return (
            <div key={idx} className="space-y-1.5">
              {sec.heading && (
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {sec.heading}
                </h4>
              )}
              <div className="space-y-2">
                {sec.lines.map((l, lIdx) => {
                  const isBullet = /^[•\-\*]/.test(l);
                  if (isBullet) {
                    return (
                      <div key={lIdx} className="flex items-start gap-2 text-sm sm:text-base text-slate-800 dark:text-slate-200 pl-1">
                        <span className="text-indigo-500 font-bold mt-0.5">•</span>
                        <span>{l.replace(/^[•\-\*]\s*/, '')}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={lIdx} className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                      {l}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="space-y-3" id="explanation-modes-container">
      {/* Top Header & Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/70 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Explanation Mode</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {MODE_CONFIG[currentMode].tagline}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
          {(['simple', 'student', 'detailed'] as const).map(mode => {
            const isSelected = currentMode === mode;
            return (
              <button
                key={mode}
                id={`explanation-tab-${mode}`}
                onClick={() => setCurrentMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <span>{MODE_CONFIG[mode].emoji}</span>
                <span>{MODE_CONFIG[mode].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Sub-Bar & Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
            {MODE_CONFIG[currentMode].badge}
          </span>
          <span className="text-[11px] text-slate-400">
            {MODE_CONFIG[currentMode].readingLevel}
          </span>

          {isCachedMap[currentMode] ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
              <Zap className="w-2.5 h-2.5" />
              Cached
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50">
              <Sparkles className="w-2.5 h-2.5" />
              AI Generated
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Audio Read-aloud */}
          <button
            onClick={handleToggleSpeech}
            title={isSpeaking ? 'Stop reading' : 'Read aloud'}
            aria-label="Read explanation aloud"
            className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1 ${
              isSpeaking
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-600" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy explanation"
            aria-label="Copy explanation text"
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-[11px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Regenerate with Gemini */}
          <button
            onClick={handleRegenerate}
            disabled={loading}
            title="Regenerate with Gemini"
            aria-label="Regenerate explanation with Gemini AI"
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-[11px] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          {/* Simulate Offline/Error Test Button */}
          <button
            onClick={handleToggleSimulateError}
            title="Test offline fallback and error handling"
            className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${
              simulateErrorActive
                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {simulateErrorActive ? '⚠️ Offline Test ON' : 'Test Offline'}
          </button>
        </div>
      </div>

      {/* Error / Offline Banner if present */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">{errorMsg}</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                A verified offline explanation for {MODE_CONFIG[currentMode].label} mode is shown below.
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchExplanation(currentMode, true, false)}
            className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shrink-0"
          >
            Retry AI
          </button>
        </div>
      )}

      {/* Main Content Box */}
      <div className="relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs min-h-[160px]">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400 animate-in fade-in duration-200">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Generating {MODE_CONFIG[currentMode].label} Explanation...
              </p>
              <p className="text-xs text-slate-400">
                Calibrating depth, vocabulary, and educational structure with Gemini AI.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            {renderStructuredExplanation(rawText)}
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 flex items-center justify-between">
        <span>* Grounded in reported facts. Calibrated for {MODE_CONFIG[currentMode].label} reading level.</span>
        <span className="font-mono text-[10px] text-slate-400">Mode: {currentMode}</span>
      </p>
    </section>
  );
};
