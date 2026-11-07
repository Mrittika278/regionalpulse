import React from 'react';
import type { Risk, Screen } from '../types';

export const riskClass = (r: Risk) =>
  ({
    NORMAL: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    LOW: 'bg-lime-50 text-lime-700 border-lime-200',
    MODERATE: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    'VERY HIGH': 'bg-red-50 text-red-700 border-red-200',
  }[r] || 'bg-slate-50 text-slate-700 border-slate-200');

export function Badge({ risk }: { risk: Risk }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${riskClass(
        risk
      )}`}
    >
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {risk}
    </span>
  );
}

export function Card({
  title,
  children,
  sub,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all hover:border-slate-300 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
          {title}
        </div>
        {sub && <span className="text-[10px] font-semibold text-slate-400">{sub}</span>}
      </div>
      {children}
    </div>
  );
}

export function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1 text-2xl font-black text-slate-900">
        <span>{value}</span>
        {unit && <span className="text-xs font-bold text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

export function Header({
  screen,
  setScreen,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-3">
        <div>
          <div className="text-lg font-black tracking-tight text-slate-950">
            REGIONAL<span className="text-blue-600">PULSE</span>
          </div>
          <div className="hidden text-[10px] font-medium text-slate-500 sm:block">
            Tamil Nadu Regional Healthcare Pressure
          </div>
        </div>
        <nav className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setScreen('command')}
            className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${
              screen === 'command'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            COMMAND CENTER
          </button>
          <button
            onClick={() => setScreen('map')}
            className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${
              screen === 'map'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            GIS MAP
          </button>
          <button
            onClick={() => setScreen('forecast')}
            className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${
              screen === 'forecast'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            FORECAST
          </button>
          <button
            onClick={() => setScreen('alert')}
            className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${
              screen === 'alert'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            WHY THIS ALERT
          </button>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-slate-600">RESEARCH LAYER</span>
        </div>
      </div>
    </header>
  );
}
