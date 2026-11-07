import React from 'react';
import type { Warning } from '../types';
import { Badge } from './UI';

interface WarningCardProps {
  warning: Warning;
  onClick?: () => void;
  selected?: boolean;
}

export function WarningCard({ warning, onClick, selected }: WarningCardProps) {
  const isHighRisk = warning.risk === 'VERY HIGH' || warning.risk === 'HIGH';

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl border p-4 transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''
      } ${
        selected
          ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
          : isHighRisk
          ? 'border-orange-200/90 bg-white hover:border-orange-300'
          : 'border-slate-200/90 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900 group-hover:text-blue-600">
              {warning.district}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                warning.status === 'ACTIVE'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {warning.status}
            </span>
          </div>
          <div className="mt-0.5 text-[10px] font-medium text-slate-400">
            Top signal: {warning.top_signal}
          </div>
        </div>
        <Badge risk={warning.risk} />
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50/80 p-2.5 text-center">
        <div>
          <div className="text-[9px] font-bold uppercase text-slate-400">Projected</div>
          <div className="mt-0.5 text-sm font-black text-slate-900">
            {warning.projected_occupancy.toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase text-slate-400">Lead Time</div>
          <div className="mt-0.5 text-sm font-black text-blue-600">
            {warning.lead_time_h}h
          </div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase text-slate-400">Risk Prob</div>
          <div className="mt-0.5 text-sm font-black text-slate-900">
            {warning.riskProbability}%
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
        <span>Crossing est: {warning.threshold_crossing_h}h</span>
        <span className="font-semibold text-blue-600 group-hover:underline">
          Investigate warning →
        </span>
      </div>
    </div>
  );
}
