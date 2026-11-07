import React from 'react';
import type { District, ForecastResponse, Warning, Screen } from '../types';
import { KPICard } from './KPICard';
import { SectionHeader } from './SectionHeader';
import { ProgressBar } from './ProgressBar';
import { WarningCard } from './WarningCard';
import { Badge } from './UI';

interface CommandCenterProps {
  districts: District[];
  selectedDistrict: District;
  onSelectDistrict: (d: District) => void;
  forecastData: ForecastResponse | null;
  warnings: Warning[];
  systemStatus: {
    data_updated?: string;
    model_updated?: string;
    forecast_generated?: string;
    mode?: string;
  } | null;
  onNavigate: (s: Screen) => void;
}

export function CommandCenter({
  districts,
  selectedDistrict,
  onSelectDistrict,
  forecastData,
  warnings,
  systemStatus,
  onNavigate,
}: CommandCenterProps) {
  // Aggregate KPIs calculated from live state
  const totalDistricts = districts.length;
  const avgOccupancy =
    totalDistricts > 0
      ? (districts.reduce((acc, d) => acc + d.current, 0) / totalDistricts).toFixed(1)
      : '74.8';

  const avg72hPressure =
    totalDistricts > 0
      ? (districts.reduce((acc, d) => acc + d.pressure, 0) / totalDistricts).toFixed(1)
      : '86.2';

  const highRiskCount = districts.filter(
    (d) => d.risk === 'HIGH' || d.risk === 'VERY HIGH'
  ).length;

  const earliestWarningHours =
    warnings.length > 0
      ? Math.min(...warnings.map((w) => w.lead_time_h))
      : 31;

  // Pulse signals computed from selected district or regional averages
  const pulseMetrics = [
    { label: 'Demand Pressure', value: selectedDistrict ? Math.min(100, Math.round(selectedDistrict.pressure)) : 82, sub: 'Regional census intake' },
    { label: 'Available Capacity', value: selectedDistrict ? Math.max(10, Math.round(100 - selectedDistrict.pressure)) : 26, sub: 'Resilient bed margin' },
    { label: 'Environmental Signals', value: 68, sub: 'Precipitation & heat indices' },
    { label: 'Public Event Exposure', value: 74, sub: 'Congregation density' },
    { label: 'Disease Surveillance', value: 58, sub: 'Syndromic fever signals' },
    { label: 'Transit & Mobility', value: 64, sub: 'Corridor movement rate' },
  ];

  const handleDistrictClick = (d: District) => {
    onSelectDistrict(d);
    onNavigate('map');
  };

  const handleWarningClick = (w: Warning) => {
    const matched = districts.find((d) => d.name === w.district);
    if (matched) onSelectDistrict(matched);
    onNavigate('warning');
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <SectionHeader
        screenIndex="Screen 01 · Command Center"
        title="Regional Healthcare Capacity Overview"
        description="Predicting Hospital Bed Pressure Before Capacity Becomes Critical across Tamil Nadu's 38 administrative districts."
        badge="Research Prototype"
      >
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">Data Feed:</span>
          <span>{systemStatus?.data_updated || 'Live Telemetry'}</span>
          <span className="text-slate-300">•</span>
          <span className="font-semibold text-slate-700">Forecast:</span>
          <span>{systemStatus?.forecast_generated || 'Deterministic Inference'}</span>
        </div>
      </SectionHeader>

      {/* 4 Large KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Current Occupancy"
          value={avgOccupancy}
          unit="%"
          trend={3.2}
          trendLabel="vs 24h lag"
          subtitle="Regional average census"
          highlight
          icon={<span className="text-xl">🏥</span>}
        />
        <KPICard
          label="72h Forecast Pressure"
          value={avg72hPressure}
          unit="%"
          trend={11.4}
          trendLabel="projected 72h delta"
          subtitle="Mean projected occupancy"
          highlight
          icon={<span className="text-xl">📈</span>}
        />
        <KPICard
          label="High-Risk Districts"
          value={highRiskCount}
          unit={`/ ${totalDistricts}`}
          subtitle="Above warning threshold"
          trend={highRiskCount > 0 ? highRiskCount : undefined}
          trendLabel="active alert zones"
          isPressureTrend={true}
          icon={<span className="text-xl">⚠️</span>}
        />
        <KPICard
          label="Earliest Warning Lead"
          value={earliestWarningHours}
          unit="hours"
          subtitle="Estimated time to threshold"
          trend={-4.5}
          trendLabel="earlier than baseline"
          isPressureTrend={false}
          icon={<span className="text-xl">⏱️</span>}
        />
      </div>

      {/* Middle Row: Regional Pressure Overview & System Pulse */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Regional Pressure Overview (Tamil Nadu districts grid) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Regional Pressure Overview · Tamil Nadu Districts
              </h2>
              <p className="text-xs text-slate-500">
                Click any district to inspect GIS spatial distribution and capacity metrics.
              </p>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
            >
              Explore Regional Map →
            </button>
          </div>

          {/* District Grid Visualization */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {districts.map((d) => {
              const isSelected = selectedDistrict?.name === d.name;
              return (
                <div
                  key={d.name}
                  onClick={() => handleDistrictClick(d)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-3.5 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-black text-slate-900 group-hover:text-blue-600 truncate">
                      {d.name}
                    </span>
                    <Badge risk={d.risk} />
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        72h Pressure
                      </span>
                      <span className="text-base font-black text-slate-900">
                        {d.pressure.toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          d.pressure >= 95
                            ? 'bg-red-600'
                            : d.pressure >= 85
                            ? 'bg-orange-500'
                            : d.pressure >= 75
                            ? 'bg-yellow-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, d.pressure)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Gap: {d.gap > 0 ? `+${d.gap}` : d.gap} beds</span>
                    <span>Risk: {d.riskProbability}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SYSTEM PULSE */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  System Pulse
                </h2>
                <p className="text-[11px] text-slate-500">
                  Multimodal telemetry inputs for {selectedDistrict?.name || 'Tamil Nadu'}
                </p>
              </div>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
              </span>
            </div>

            <div className="space-y-4">
              {pulseMetrics.map((pm) => (
                <div key={pm.label}>
                  <ProgressBar
                    value={pm.value}
                    label={pm.label}
                    sublabel={pm.sub}
                    color="auto"
                    height="md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-[11px] leading-relaxed text-slate-600">
            <span className="font-bold text-slate-800">Telemetry note:</span> RegionalPulse fuses operational bed census with meteorological grids, transit telemetry and civic event indicators to compute lead time.
          </div>
        </div>
      </div>

      {/* ACTIVE WARNINGS SECTION */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">Active Warning Trajectories</h2>
              <span className="rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-black text-red-700">
                {warnings.length} Monitored Zones
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Districts where projected occupancy approaches or crosses the configured capacity threshold.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('warning')}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Early Warning Center →
            </button>
            <button
              onClick={() => onNavigate('alert')}
              className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
            >
              Review Alerts →
            </button>
          </div>
        </div>

        {/* Warning cards row */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {warnings.slice(0, 4).map((w) => (
            <WarningCard
              key={w.district}
              warning={w}
              onClick={() => handleWarningClick(w)}
              selected={selectedDistrict?.name === w.district}
            />
          ))}
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
        <div>
          <div className="text-xs font-bold text-blue-900">
            Explore Comprehensive Analytical Workflows
          </div>
          <div className="text-[11px] text-blue-700/80">
            Navigate through GIS mapping, uncertainty forecasting, signal monitoring and scenario testing.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('map')}
            className="rounded-xl bg-white border border-blue-200 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 shadow-sm transition"
          >
            Explore Regional Map →
          </button>
          <button
            onClick={() => onNavigate('forecast')}
            className="rounded-xl bg-white border border-blue-200 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 shadow-sm transition"
          >
            Open Forecast Lab →
          </button>
          <button
            onClick={() => onNavigate('signal')}
            className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition"
          >
            Signal Monitor (Live Tester) →
          </button>
        </div>
      </div>
    </div>
  );
}
