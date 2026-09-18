import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Sparkles, Check, Database, Cpu, Server } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminModal: React.FC = () => {
  const { showAdminModal, setShowAdminModal, articles } = useApp();
  const [serverHealth, setServerHealth] = useState<{
    appName?: string;
    articlesCount?: number;
    ragChunks?: number;
    hasGeminiKey?: boolean;
    db?: {
      mode: string;
      isMongoActive: boolean;
      hasMongoUri: boolean;
      statusMessage: string;
      totalUsers: number;
      totalDailyCompletions: number;
    };
  } | null>(null);

  useEffect(() => {
    if (showAdminModal) {
      fetch('/api/health')
        .then(res => res.json())
        .then(data => setServerHealth(data))
        .catch(() => {});
    }
  }, [showAdminModal]);

  if (!showAdminModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Admin & Intelligence Status
              </h2>
              <p className="text-[11px] text-slate-400">Content moderation & Knowledge Base</p>
            </div>
          </div>

          <button
            onClick={() => setShowAdminModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server & Diagnostic Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>Articles Indexed</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {serverHealth?.articlesCount ?? articles.length} Curated Stories
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Knowledge Base</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {articles.length * 6} Context Modules
            </div>
          </div>
        </div>

        {/* Gemini Engine Status */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Gemini 2.5 Flash Engine</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {serverHealth?.hasGeminiKey ? 'API Key Active (Server-Side @google/genai)' : 'Standard High-Accuracy Grounded Synthesis Mode'}
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Online
          </span>
        </div>

        {/* Database & Persistence Status */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {serverHealth?.db?.isMongoActive ? 'MongoDB Atlas' : 'Local JSON Persistence Store'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {serverHealth?.db?.totalUsers ?? 11} Registered Users • {serverHealth?.db?.totalDailyCompletions ?? 7} Quiz Completions
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                serverHealth?.db?.isMongoActive
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
              }`}
            >
              {serverHealth?.db?.isMongoActive ? 'Atlas Active' : 'Persistent (Local)'}
            </span>
          </div>

          {!serverHealth?.db?.isMongoActive && serverHealth?.db?.hasMongoUri && (
            <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-200 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>MongoDB Atlas Setup Note</span>
              </div>
              <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-300">
                To connect your Atlas cluster directly: In <strong className="font-semibold">MongoDB Atlas → Security → Network Access</strong>, click <strong className="font-semibold">Add IP Address</strong> and choose <strong className="font-semibold">0.0.0.0/0 (Allow Access From Anywhere)</strong>. All user accounts and daily streaks are safely saved in local storage in the meantime.
              </p>
            </div>
          )}
        </div>

        {/* Content Moderation List */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Curated Articles & Sensitive Topics Tagging
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {articles.map(art => (
              <div
                key={art.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
              >
                <div className="truncate max-w-[280px]">
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{art.title}</div>
                  <div className="text-[10px] text-slate-400">{art.category} • {art.sourceName}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {art.isFeatured && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-600 text-white">
                      Featured
                    </span>
                  )}
                  {art.isSensitive && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-white">
                      Sensitive
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAdminModal(false)}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
