import React from 'react';

interface ResearchBadgeProps {
  label?: string;
  variant?: 'blue' | 'slate' | 'emerald' | 'amber' | 'purple';
  size?: 'sm' | 'xs';
}

export function ResearchBadge({
  label = 'Research Prototype',
  variant = 'blue',
  size = 'xs',
}: ResearchBadgeProps) {
  const variantStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
  }[variant];

  const sizeStyles = size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider ${sizeStyles} ${variantStyles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {label}
    </span>
  );
}
