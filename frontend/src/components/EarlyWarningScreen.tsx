import React, { useState } from 'react';
import type { District, Warning, Screen } from '../types';
import { SectionHeader } from './SectionHeader';
import { Badge } from './UI';
import { KPICard } from './KPICard';
import { ResearchBadge } from './ResearchBadge';

interface EarlyWarningScreenProps {
  warnings: Warning[];
  districts: District[];
  selectedDistrict: District;
  onSelectDistrict: (d: District) => void;
  onNavigate: (s: Screen) => void;
}

export function EarlyWarningScreen({
  warnings,
  districts,
  selectedDistrict,
  onSelectDistrict,
  onNavigate,
}: EarlyWarningScreenProps) {
  const [selectedWarning, setSelectedWarning] = useState<Warning>(
    warnings.find((w) => w.district === selectedDistrict.name) || warnings[0] || {
      district: 'Chennai',
      risk: 'HIGH',
      current: 74,
      pressure: 93,
      projected_occupancy: 93,
      threshold_crossing_h: 37,
      lead_time_h: 34,
      riskProbability: 82,
      uncertainty: 'Moderate',
      status: 'ACTIVE',
      timestamp: 'Today',
      top_signal: 'Admission trend',
    }
  );

  const handleSelect = (w: Warning) => {
    setSelectedWarning(w);
    const matched = districts.find((d) => d.name === w.district);
    if (matched) onSelectDistrict(matched);
  };

  // Timeline signal events for selected district (strictly non-causal terminology)
  const timelineEvents = [
    { time: 'NOW', label: 'Telemetry Ingestion & Baseline Calibration', tag: 'Data Feed', color: 'bg-blue-600' },
    { time: '12h', label: 'Environmental signal elevated (precipitation/heat)', tag: 'Associated Signal', color: 'bg-cyan-600' },
    { time: '24h', label: 'Event exposure indicator increases in corridor', tag: 'Model Input', color: 'bg-indigo-600' },
    { time: '36h', label: 'Acute demand inflow index rises above baseline', tag: 'Contributing Signal', color: 'bg-amber-600' },
    { time: '48h', label: 'Bed occupancy enters higher-risk zone (>85%)', tag: 'Trajectory Phase', color: 'bg-orange-600' },
    { time: '72h', label: 'Projected capacity threshold crossing (>90%)', tag: 'Early Warning', color: 'bg-red-600' },
  ];

  // Historical pressure events for "How early did we know?"
  const historicalEvents = [
    {
      eventId: 'EV-2026-03-TN',
      district: 'Chennai',
      eventDate: '2026-03-14 18:00',
      thresholdCrossing: '92.4% Occupancy',
      firstWarningTime: '2026-03-12 21:00',
      leadTimeHours: 45,
      actualImpact: 'Early regional patient divert protocols initiated',
      status: 'Validated Lead Time',
    },
    {
      eventId: 'EV-2026-02-CBE',
      district: 'Coimbatore',
      eventDate: '2026-02-28 09:00',
      thresholdCrossing: '90.8% Occupancy',
      firstWarningTime: '2026-02-26 15:00',
      leadTimeHours: 42,
      actualImpact: 'Elective scheduling smoothed ahead of peak',
      status: 'Validated Lead Time',
    },
    {
      eventId: 'EV-2026-01-MDU',
      district: 'Madurai',
      eventDate: '2026-01-19 14:00',
      thresholdCrossing: '94.1% Occupancy',
      firstWarningTime: '2026-01-18 02:00',
      leadTimeHours: 36,
      actualImpact: 'Surge staff reallocation supported prior to bottleneck',
      status: 'Validated Lead Time',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        screenIndex="Screen 04 · Early Warning Center"
        title="Predictive Early Warning & Lead Time Monitor"
        description="Providing operational advance notice before hospital bed occupancy approaches critical capacity thresholds."
        badge="Early Warning System"
      >
        <button
          onClick={() => onNavigate('alert')}
          className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition"
        >
          Inspect Why Alert Triggered →
        </button>
      </SectionHeader>

      {/* Top Warning Quality Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Earliest Warning Lead"
          value={selectedWarning.lead_time_h}
          unit="hours"
          trend={-8}
          trendLabel="hours vs baseline"
          isPressureTrend={false}
          subtitle={`For ${selectedWarning.district}`}
          highlight
        />
        <KPICard
          label="Projected Peak Pressure"
          value={selectedWarning.projected_occupancy.toFixed(0)}
          unit="%"
          trend={selectedWarning.projected_occupancy - selectedWarning.current}
          trendLabel="points surge"
          isPressureTrend={true}
          subtitle="Forecast +72h peak"
        />
        <KPICard
          label="Risk Probability"
          value={selectedWarning.riskProbability}
          unit="%"
          subtitle="Probability of threshold crossing"
          badge={selectedWarning.risk}
        />
        <KPICard
          label="Uncertainty Bound"
          value={selectedWarning.uncertainty}
          subtitle="Confidence interval band"
          trend={0}
          trendLabel="90% calibrated coverage"
          isPressureTrend={false}
        />
      </div>

      {/* Active Warnings Grid and Detailed Warning Inspector */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: Active Warnings List */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Active Warnings</h2>
              <p className="text-[11px] text-slate-500">
                Select a zone to inspect lead time trajectory
              </p>
            </div>
            <span className="rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-black text-red-700">
              {warnings.length} Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {warnings.map((w) => {
              const isSelected = selectedWarning?.district === w.district;
              return (
                <div
                  key={w.district}
                  onClick={() => handleSelect(w)}
                  className={`group rounded-xl border p-3.5 transition cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-black text-slate-900 group-hover:text-blue-600">
                        {w.district}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Lead time: <span className="font-bold text-blue-600">{w.lead_time_h}h</span> · Top: {w.top_signal}
                      </div>
                    </div>
                    <Badge risk={w.risk} />
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs border-t border-slate-100 pt-2">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Proj: {w.projected_occupancy.toFixed(0)}%
                    </span>
                    <span className="text-[11px] font-bold text-red-600">
                      Crosses in ~{w.threshold_crossing_h}h
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Warning Analysis & Timeline */}
        <div className="space-y-6">
          {/* Selected Warning Summary Box */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                    Warning Focus
                  </span>
                  <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-800">
                    STATUS: {selectedWarning.status}
                  </span>
                  <ResearchBadge label="Prototype Early Warning" variant="blue" />
                </div>
                <h1 className="mt-1 text-2xl font-black text-slate-900">
                  {selectedWarning.district} · Anticipated Capacity Pressure
                </h1>
                <p className="mt-0.5 text-xs text-slate-500">
                  Projected threshold crossing in {selectedWarning.threshold_crossing_h} hours with {selectedWarning.lead_time_h} hours of operational lead time.
                </p>
              </div>
              <Badge risk={selectedWarning.risk} />
            </div>

            {/* Warning Parameters Table */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[10px] font-bold uppercase text-slate-400">Current State</div>
                <div className="mt-1 text-lg font-black text-slate-900">{selectedWarning.current}%</div>
                <div className="text-[10px] text-slate-500">Census Occupancy</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[10px] font-bold uppercase text-slate-400">Projected Peak</div>
                <div className="mt-1 text-lg font-black text-red-600">{selectedWarning.projected_occupancy.toFixed(0)}%</div>
                <div className="text-[10px] text-slate-500">+72h Horizon</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[10px] font-bold uppercase text-slate-400">Lead Notice</div>
                <div className="mt-1 text-lg font-black text-blue-600">{selectedWarning.lead_time_h}h</div>
                <div className="text-[10px] text-slate-500">Advance Window</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[10px] font-bold uppercase text-slate-400">Uncertainty</div>
                <div className="mt-1 text-lg font-black text-slate-900">{selectedWarning.uncertainty}</div>
                <div className="text-[10px] text-slate-500">90% Confidence</div>
              </div>
            </div>
          </div>

          {/* LARGE HORIZONTAL TIMELINE */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-black text-slate-900">
                Warning Progression & Signal Trajectory Timeline
              </h2>
              <p className="text-xs text-slate-500">
                Chronological progression of contributing signals and model-attributed factors leading to projected capacity exceedance.
              </p>
            </div>

            {/* Horizontal timeline cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {timelineEvents.map((evt) => (
                <div
                  key={evt.time}
                  className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 relative"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-black text-blue-600">
                        {evt.time}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                    </div>
                    <div className="mt-2 text-xs font-bold leading-snug text-slate-800">
                      {evt.label}
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-slate-600">
                      {evt.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-800 leading-relaxed">
              <span className="font-bold">Interpretive note:</span> Signals mapped along this trajectory are <b>associated contributing factors</b> ingested by the multimodal research model. They illustrate how antecedent external and operational signals precede capacity pressure.
            </div>
          </div>

          {/* "HOW EARLY DID WE KNOW?" HISTORICAL BENCHMARK */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  How Early Did We Know? · Historical Lead Time Audits
                </h2>
                <p className="text-xs text-slate-500">
                  Empirical audit of warning lead times during historical surge events in the research dataset.
                </p>
              </div>
              <ResearchBadge label="Research Dataset" variant="slate" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="pb-2.5">Event ID</th>
                    <th className="pb-2.5">District</th>
                    <th className="pb-2.5">Pressure Event Time</th>
                    <th className="pb-2.5">First Warning Dispatched</th>
                    <th className="pb-2.5">Warning Lead Time</th>
                    <th className="pb-2.5">Operational Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historicalEvents.map((row) => (
                    <tr key={row.eventId} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-700">{row.eventId}</td>
                      <td className="py-3 font-black text-slate-900">{row.district}</td>
                      <td className="py-3 text-slate-600">{row.eventDate}</td>
                      <td className="py-3 text-slate-600">{row.firstWarningTime}</td>
                      <td className="py-3">
                        <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 font-black text-blue-700">
                          {row.leadTimeHours} Hours
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 text-[11px]">{row.actualImpact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
