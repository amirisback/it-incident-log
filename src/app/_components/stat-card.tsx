import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: ReactNode;
  variant?: 'brand' | 'danger' | 'warning' | 'success';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'brand',
}: StatCardProps): React.JSX.Element {
  const variantStyles = {
    brand: {
      bgIcon: 'bg-blue-50 text-[#196bcd] dark:bg-blue-950/60 dark:text-blue-300',
      borderAccent: 'border-l-4 border-l-[#196bcd]',
      valueColor: 'text-zinc-900 dark:text-zinc-50',
    },
    danger: {
      bgIcon: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300',
      borderAccent: 'border-l-4 border-l-red-600',
      valueColor: 'text-red-700 dark:text-red-400',
    },
    warning: {
      bgIcon: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300',
      borderAccent: 'border-l-4 border-l-amber-500',
      valueColor: 'text-amber-700 dark:text-amber-400',
    },
    success: {
      bgIcon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
      borderAccent: 'border-l-4 border-l-emerald-600',
      valueColor: 'text-emerald-700 dark:text-emerald-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow ${style.borderAccent}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className={`text-2xl sm:text-3xl font-bold tracking-tight font-sans ${style.valueColor}`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.bgIcon}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>{subtitle}</span>
      </div>
    </div>
  );
}
