import React from 'react';
import { useApp } from '../context/AppContext';

export const CategoryPills: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useApp();

  const allItems = [
    { name: 'All', count: categories.reduce((sum, c) => sum + c.count, 0) },
    ...categories
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      {allItems.map(cat => {
        const isSelected = selectedCategory === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            id={`category-pill-${cat.name.toLowerCase().replace(/[^\w]/g, '-')}`}
          >
            <span>{cat.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected
                  ? 'bg-indigo-700/60 text-indigo-100'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
