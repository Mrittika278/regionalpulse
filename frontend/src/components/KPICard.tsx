import React from 'react';
import { TrendIndicator } from './TrendIndicator';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number | string;
  trendLabel?: string;
  isPressureTrend?: boolean;
  subtitle?: string;
  badge?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function KPICard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  isPressureTrend = true,
  subtitle,
  badge,
  highlight = false,
  icon,
  onClick,
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : 'hover:border-slate-300'
      } ${
        highlight
          ? 'border-blue-300 bg-gradient-to-b from-blue-50/40 via-white to-white shadow-sm'
          : 'border-slate-200/90 bg-white shadow-sm'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </span>
          {badge && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
              {badge}
            </span>
          )}
          {icon && <div className="text-slate-400 group-hover:text-blue-600">{icon}</div>}
        </div>

        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            {value}
          </span>
          {unit && (
            <span className="text-base font-bold text-slate-500 md:text-lg">{unit}</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        {trend !== undefined ? (
          <div className="flex items-center gap-1.5">
            <TrendIndicator value={trend} isPositivePressure={isPressureTrend} />
            {trendLabel && (
              <span className="text-[11px] font-medium text-slate-500">{trendLabel}</span>
            )}
          </div>
        ) : (
          <div className="text-[11px] font-medium text-slate-500">
            {subtitle || 'Regional aggregate'}
          </div>
        )}

        {subtitle && trend !== undefined && (
          <span className="text-[10px] font-medium text-slate-400">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
