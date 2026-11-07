import React from 'react';
import { ResearchBadge } from './ResearchBadge';

interface SectionHeaderProps {
  screenIndex?: string;
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
}

export function SectionHeader({
  screenIndex,
  title,
  description,
  badge = 'Research Prototype',
  children,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-end">
      <div>
        <div className="flex items-center gap-2.5">
          {screenIndex && (
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">
              {screenIndex}
            </span>
          )}
          {badge && <ResearchBadge label={badge} variant="blue" />}
        </div>
        <h1 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        )}
      </div>

      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}
