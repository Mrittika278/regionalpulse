import React from 'react';
import type { Signal } from '../types';

interface SignalCardProps {
  signal: Signal;
  onClick?: () => void;
  selected?: boolean;
}

export function SignalCard({ signal, onClick, selected }: SignalCardProps) {
  const severityBadge = {
    Elevated: 'bg-orange-50 text-orange-700 border-orange-200',
    Moderate: 'bg-amber-50 text-amber-800 border-amber-200',
    High: 'bg-red-50 text-red-700 border-red-200',
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
  }[signal.severity] || 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <div
      onClick={onClick}
      className={`group rounded-xl border p-3.5 transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-blue-400 hover:shadow-sm' : ''
      } ${
        selected
          ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
          : 'border-slate-200/90 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
            {signal.name}
          </div>
          <div className="mt-0.5 text-[10px] font-medium text-slate-400">
            {signal.source} · {signal.region}
          </div>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${severityBadge}`}
        >
          {signal.severity}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-700">{signal.value}</span>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
          <span>Attribution:</span>
          <span className="font-black text-blue-600">{signal.contribution}%</span>
        </div>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${Math.min(100, signal.contribution * 2.5)}%` }}
        />
      </div>
    </div>
  );
}
