import React from 'react';

interface TrendIndicatorProps {
  value: number | string;
  unit?: string;
  isPositivePressure?: boolean; // if true, increase means higher capacity pressure (warning)
  direction?: 'up' | 'down' | 'neutral';
  prefix?: string;
}

export function TrendIndicator({
  value,
  unit = '%',
  isPositivePressure = true,
  direction,
  prefix = '',
}: TrendIndicatorProps) {
  const numVal = typeof value === 'number' ? value : parseFloat(value);
  const dir = direction || (numVal > 0 ? 'up' : numVal < 0 ? 'down' : 'neutral');

  let colorClass = 'text-slate-600 bg-slate-50 border-slate-200';
  let arrow = '→';

  if (dir === 'up') {
    arrow = '↑';
    colorClass = isPositivePressure
      ? 'text-orange-700 bg-orange-50 border-orange-200'
      : 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (dir === 'down') {
    arrow = '↓';
    colorClass = isPositivePressure
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : 'text-orange-700 bg-orange-50 border-orange-200';
  }

  const formattedVal =
    typeof value === 'number'
      ? `${numVal > 0 ? '+' : ''}${numVal.toFixed(1)}`
      : value;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold tracking-tight ${colorClass}`}
    >
      <span className="font-extrabold">{arrow}</span>
      <span>
        {prefix}
        {formattedVal}
        {unit}
      </span>
    </span>
  );
}
