import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  sublabel?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'orange' | 'red' | 'purple' | 'auto';
  showPercent?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  sublabel,
  color = 'auto',
  showPercent = true,
  height = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  let barColor = 'bg-blue-600';
  if (color === 'auto') {
    if (percentage >= 90) barColor = 'bg-red-600';
    else if (percentage >= 75) barColor = 'bg-orange-500';
    else if (percentage >= 60) barColor = 'bg-amber-500';
    else barColor = 'bg-emerald-600';
  } else {
    barColor = {
      blue: 'bg-blue-600',
      emerald: 'bg-emerald-600',
      amber: 'bg-amber-500',
      orange: 'bg-orange-500',
      red: 'bg-red-600',
      purple: 'bg-purple-600',
    }[color];
  }

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[height];

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {label && <span className="font-semibold text-slate-700">{label}</span>}
            {sublabel && <span className="text-[10px] text-slate-400">({sublabel})</span>}
          </div>
          {showPercent && (
            <span className="font-bold text-slate-800">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-100 ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
