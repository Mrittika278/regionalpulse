import React from 'react';
import type { Signal } from '../types';
import { ResearchBadge } from './ResearchBadge';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  signal: Signal | null;
}

export function DetailDrawer({ isOpen, onClose, signal }: DetailDrawerProps) {
  if (!isOpen || !signal) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              Signal Provenance
            </span>
            <ResearchBadge label="Research Input" variant="blue" />
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <span className="text-lg font-bold leading-none">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">{signal.name}</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>{signal.region}</span>
              <span>•</span>
              <span>{signal.timestamp}</span>
            </div>
          </div>

          {/* Model contribution card */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Model-Attributed Contribution
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-900">
                {signal.contribution}%
              </span>
              <span className="text-xs text-blue-700">of total multimodal attribution weight</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-blue-800/80">
              This factor is an <b>associated model-attributed signal</b> identified through time-series feature weighting. It does not represent autonomous proof of causality.
            </p>
          </div>

          {/* Detailed attributes table */}
          <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
            <div className="flex justify-between p-3.5">
              <span className="font-semibold text-slate-500">Signal Source</span>
              <span className="font-bold text-slate-800">{signal.source}</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="font-semibold text-slate-500">Observed Value</span>
              <span className="font-bold text-slate-900">{signal.value}</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="font-semibold text-slate-500">Signal Severity</span>
              <span className="font-bold text-orange-600 uppercase">{signal.severity}</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="font-semibold text-slate-500">Target District</span>
              <span className="font-bold text-slate-800">{signal.region}</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="font-semibold text-slate-500">Ingestion Timestamp</span>
              <span className="font-mono text-slate-600">{signal.timestamp}</span>
            </div>
          </div>

          {/* Research Interpretation */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Research Interpretation
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              In the prototype multimodal architecture, {signal.name.toLowerCase()} serves as an external contextual signal. When acute healthcare demand increases concurrently with {signal.name.toLowerCase()} elevation, the predictive model adjusts capacity pressure curves ahead of standard historical autoregression.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-[10px] text-slate-400">
          RegionalPulse Prototype Research Layer · Model-attributed factor
        </div>
      </div>
    </div>
  );
}
