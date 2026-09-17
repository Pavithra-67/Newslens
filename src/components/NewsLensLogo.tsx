import React from 'react';
import { Sparkles } from 'lucide-react';

export interface NewsLensLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  editionBadge?: boolean;
}

export const NewsLensLogo: React.FC<NewsLensLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  editionBadge = false
}) => {
  const sizeMap = {
    xs: {
      box: 'w-6 h-6 rounded-lg',
      icon: 'w-3.5 h-3.5',
      text: 'text-sm'
    },
    sm: {
      box: 'w-7 h-7 sm:w-8 sm:h-8 rounded-xl',
      icon: 'w-4 h-4',
      text: 'text-base'
    },
    md: {
      box: 'w-10 h-10 rounded-xl',
      icon: 'w-5 h-5',
      text: 'text-lg'
    },
    lg: {
      box: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl',
      icon: 'w-7 h-7 sm:w-8 sm:h-8',
      text: 'text-2xl'
    },
    xl: {
      box: 'w-20 h-20 rounded-3xl',
      icon: 'w-10 h-10',
      text: 'text-3xl'
    }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Signature NewsLens Indigo Gradient Sparkle Box */}
      <div
        className={`${currentSize.box} bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0`}
        aria-label="NewsLens Logo"
      >
        <Sparkles className={currentSize.icon} />
      </div>

      {showText && (
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent ${currentSize.text}`}>
            NewsLens
          </span>
          {editionBadge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              Student Edition
            </span>
          )}
        </div>
      )}
    </div>
  );
};
