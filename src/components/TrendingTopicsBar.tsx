import React from 'react';
import { TrendingUp, Cpu, Rocket, Banknote, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TrendingTopicsBar: React.FC = () => {
  const { openTopic, topics } = useApp();

  const trendingItems = [
    { id: 'topic-semiconductors', label: 'Semiconductor Fabs', icon: Cpu, count: '₹1.26L Cr' },
    { id: 'topic-space-stations', label: 'Bharatiya Antariksh Station', icon: Rocket, count: 'BAS 2028' },
    { id: 'topic-inflation-interest-rates', label: 'Repo Rate 6.50%', icon: Banknote, count: 'RBI Policy' },
    { id: 'topic-climate-resilience', label: 'Himalayan GLOF AI', icon: ShieldAlert, count: '50 Sensors' }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
        <span>Trending Concepts to Understand</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {trendingItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => openTopic(item.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all shrink-0 group cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {item.count}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
