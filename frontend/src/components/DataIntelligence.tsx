import React, { useState, useEffect } from 'react';
import { api } from '../api';
import type { DataSource, DataQuality } from '../types';
import { SectionHeader } from './SectionHeader';
import { ProgressBar } from './ProgressBar';
import { ResearchBadge } from './ResearchBadge';

export function DataIntelligence() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [quality, setQuality] = useState<DataQuality | null>(null);
  const [activeModalSource, setActiveModalSource] = useState<DataSource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dataSources().then((res) => {
      setSources(res.sources);
      setQuality(res.quality);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        screenIndex="Screen 09 · Data Intelligence"
        title="Multimodal Ingestion Pipelines & Data Provenance"
        description="Comprehensive audit of operational feeds, meteorological rasters, transit corridors and syndromic surveillance telemetry."
        badge="Data Provenance Layer"
      />

      {/* Data Quality Panel with Progress Indicators */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Regional Telemetry Quality & Pipeline Health
            </h2>
            <p className="text-xs text-slate-500">
              Continuous validation metrics monitoring completeness, ingestion latency, and outlier bounds.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Pipelines Healthy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <ProgressBar
              value={quality?.completeness_overall || 96.8}
              label="Completeness"
              sublabel="Overall Feed"
              color="emerald"
            />
          </div>
          <div>
            <ProgressBar
              value={quality?.freshness_score || 95.2}
              label="Freshness Index"
              sublabel="Latency Score"
              color="blue"
            />
          </div>
          <div>
            <ProgressBar
              value={100 - (quality?.missing_values_pct || 2.4)}
              label="Valid Records"
              sublabel="Non-null Rate"
              color="emerald"
            />
          </div>
          <div>
            <ProgressBar
              value={100 - (quality?.outliers_pct || 0.7)}
              label="In-Bounds Signal"
              sublabel="Low Outlier Pct"
              color="purple"
            />
          </div>
          <div>
            <ProgressBar
              value={quality?.timestamp_consistency || 99.1}
              label="Clock Sync"
              sublabel="Sync Score"
              color="emerald"
            />
          </div>
        </div>
      </div>

      {/* 6 Data Stream Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sources.map((src) => (
          <div
            key={src.id}
            onClick={() => setActiveModalSource(src)}
            className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-700">
                  {src.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {src.availability} uptime
                </span>
              </div>

              <h3 className="mt-2.5 text-sm font-black text-slate-900 group-hover:text-blue-600">
                {src.name}
              </h3>
              <div className="mt-1 text-xs text-slate-500">{src.source}</div>

              <div className="mt-4 space-y-1.5 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Region:</span>
                  <span className="font-semibold text-slate-700">{src.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Type:</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                    {src.data_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Update:</span>
                  <span className="font-bold text-blue-600">{src.last_update}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px]">
              <span className="text-slate-400">Completeness: {src.completeness}%</span>
              <span className="font-bold text-blue-600 group-hover:underline">
                Inspect Source →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Source Detail Modal */}
      {activeModalSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setActiveModalSource(null)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-700">
                  {activeModalSource.category}
                </span>
                <h3 className="mt-1.5 text-lg font-black text-slate-900">
                  {activeModalSource.name}
                </h3>
                <div className="text-xs text-slate-500">
                  Source: {activeModalSource.source}
                </div>
              </div>
              <button
                onClick={() => setActiveModalSource(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="font-bold text-slate-700">Research Provenance:</span>
                <p className="mt-1 text-slate-600">{activeModalSource.provenance}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="rounded-lg border border-slate-100 p-2.5">
                  <div className="text-[10px] text-slate-400">Coverage Region</div>
                  <div className="font-bold mt-0.5">{activeModalSource.region}</div>
                </div>
                <div className="rounded-lg border border-slate-100 p-2.5">
                  <div className="text-[10px] text-slate-400">Telemetry Ingestion Latency</div>
                  <div className="font-bold mt-0.5">{activeModalSource.freshness_min} minutes</div>
                </div>
                <div className="rounded-lg border border-slate-100 p-2.5">
                  <div className="text-[10px] text-slate-400">Stream Completeness</div>
                  <div className="font-bold mt-0.5">{activeModalSource.completeness}%</div>
                </div>
                <div className="rounded-lg border border-slate-100 p-2.5">
                  <div className="text-[10px] text-slate-400">Historical Availability</div>
                  <div className="font-bold mt-0.5">{activeModalSource.availability}</div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-3">
                <div className="text-[10px] text-slate-400">Payload Attributes</div>
                <div className="font-semibold text-slate-800 mt-1">
                  {activeModalSource.data_type}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setActiveModalSource(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
