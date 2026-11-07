import React, { useEffect, useState } from 'react';
import type { District, Screen } from '../types';
import { Badge } from './UI';

interface HeaderProps {
  screen?: Screen;
  setScreen?: (s: Screen) => void;
  districts: District[];
  selectedDistrict: District | null;
  onSelectDistrict: (d: District) => void;
  warningCount?: number;
  onToggleMobileNav?: () => void;
  onOpenWarnings?: () => void;
}

export function Header({
  screen,
  setScreen,
  districts,
  selectedDistrict,
  onSelectDistrict,
  warningCount = 0,
  onToggleMobileNav,
  onOpenWarnings,
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Left: Mobile hamburger & title */}
        <div className="flex items-center gap-3">
          {onToggleMobileNav && (
            <button
              onClick={onToggleMobileNav}
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle navigation"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
                REGIONAL<span className="text-blue-600">PULSE</span>
              </span>
              <span className="hidden rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 sm:inline-block">
                RESEARCH
              </span>
            </div>
            <div className="hidden text-[11px] font-medium text-slate-400 md:block">
              Tamil Nadu Regional Healthcare Intelligence · Time-Series Capacity Forecasting
            </div>
          </div>
        </div>

        {/* Center / legacy quick nav if setScreen is used directly */}
        {setScreen && screen && (
          <div className="hidden items-center rounded-xl bg-slate-100 p-1 md:flex">
            <button
              onClick={() => setScreen('command')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                screen === 'command'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              COMMAND
            </button>
            <button
              onClick={() => setScreen('map')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                screen === 'map'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MAP
            </button>
            <button
              onClick={() => setScreen('forecast')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                screen === 'forecast'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FORECAST
            </button>
            <button
              onClick={() => setScreen('alert')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                screen === 'alert'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              WHY ALERT
            </button>
          </div>
        )}

        {/* Right: District Selector, Clock & Alerts button */}
        <div className="flex items-center gap-3">
          {/* District selector */}
          {selectedDistrict && districts.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="header-district-select" className="hidden text-xs font-semibold text-slate-500 sm:inline">
                District:
              </label>
              <select
                id="header-district-select"
                value={selectedDistrict.name}
                onChange={(e) => {
                  const d = districts.find((x) => x.name === e.target.value);
                  if (d) onSelectDistrict(d);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
              >
                {districts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.pressure.toFixed(0)}%)
                  </option>
                ))}
              </select>
              <div className="hidden sm:block">
                <Badge risk={selectedDistrict.risk} />
              </div>
            </div>
          )}

          {/* Clock */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-bold text-slate-600 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{timeStr || '00:00:00'} IST</span>
          </div>

          {/* Notification bell / warning count */}
          <button
            onClick={onOpenWarnings}
            type="button"
            className="relative flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
            title="Active Warnings"
          >
            <span className="text-sm">🔔</span>
            {warningCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white">
                {warningCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
