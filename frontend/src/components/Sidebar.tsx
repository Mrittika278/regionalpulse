import React from 'react';
import type { Screen } from '../types';

interface SidebarProps {
  currentScreen: Screen;
  onSelectScreen: (screen: Screen) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  warningCount?: number;
}

interface NavItem {
  id: Screen;
  label: string;
  badge?: string | number;
  icon: string;
}

export function Sidebar({
  currentScreen,
  onSelectScreen,
  isOpenMobile,
  onCloseMobile,
  warningCount = 0,
}: SidebarProps) {
  const items: NavItem[] = [
    { id: 'command', label: 'Command Center', icon: '⚡' },
    { id: 'map', label: 'Regional Map', icon: '🗺️' },
    { id: 'forecast', label: 'Forecast Lab', icon: '📈' },
    {
      id: 'warning',
      label: 'Early Warnings',
      badge: warningCount > 0 ? warningCount : undefined,
      icon: '🚨',
    },
    { id: 'alert', label: 'Why This Alert', icon: '💡' },
    { id: 'scenario', label: 'Scenario Lab', icon: '🧪' },
    { id: 'signal', label: 'Signal Monitor', icon: '📡' },
    { id: 'analytics', label: 'Model Analytics', icon: '📊' },
    { id: 'intelligence', label: 'Data Intelligence', icon: '🗄️' },
    { id: 'experiment', label: 'Experiment Lab', icon: '🔬' },
    { id: 'error', label: 'Error Analysis', icon: '🎯' },
  ];

  const handleSelect = (id: Screen) => {
    onSelectScreen(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-white text-slate-800">
      <div>
        {/* Brand */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black shadow-md shadow-blue-500/20">
              RP
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-slate-900">
                REGIONAL<span className="text-blue-600">PULSE</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tamil Nadu Intelligence
              </div>
            </div>
          </div>
          <div className="mt-3 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
            ML-T2-021 · Time-Series ML
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1 p-3">
          {items.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200/60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm opacity-80">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-100 p-4">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-500">SYSTEM STATUS</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          </div>
          <div className="mt-2 text-[10px] font-medium text-slate-400">
            Research Technical Prototype
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 max-w-[85vw] bg-white shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
