import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { api } from '../api';
import type { District, RecalculateResponse, Screen } from '../types';
import { SectionHeader } from './SectionHeader';
import { Card, Metric, Badge } from './UI';
import { ResearchBadge } from './ResearchBadge';
import { TrendIndicator } from './TrendIndicator';

interface SignalMonitorProps {
  districts: District[];
  selectedDistrict: District;
  onSelectDistrict: (d: District) => void;
  onNavigate: (s: Screen) => void;
}

interface SignalItem {
  key: string;
  name: string;
  expected: number;
  observed: number;
  unit: string;
  source: string;
  timestamp: string;
  weight: number;
}

export function SignalMonitor({
  districts,
  selectedDistrict,
  onSelectDistrict,
  onNavigate,
}: SignalMonitorProps) {
  const [district, setDistrict] = useState(selectedDistrict?.name || 'Chennai');
  
  // Interactive signals state with pre-configured Chennai demonstration defaults
  const [signals, setSignals] = useState<SignalItem[]>([
    {
      key: 'event_exposure',
      name: 'Public Event Exposure',
      expected: 100,
      observed: 200, // Chennai demonstration default
      unit: 'index',
      source: 'Civic & Event Connector',
      timestamp: 'Just now',
      weight: 0.32,
    },
    {
      key: 'mobility_index',
      name: 'Corridor Mobility Index',
      expected: 120,
      observed: 144,
      unit: 'flow pts',
      source: 'Mobility Telemetry Feed',
      timestamp: '5 mins ago',
      weight: 0.18,
    },
    {
      key: 'emergency_visits',
      name: 'Emergency Department Inflow',
      expected: 310,
      observed: 365,
      unit: 'visits/day',
      source: 'Hospital Intake Feed',
      timestamp: '12 mins ago',
      weight: 0.28,
    },
    {
      key: 'admissions_trend',
      name: 'Acute Medical Admissions',
      expected: 85,
      observed: 98,
      unit: 'admissions/day',
      source: 'Bed Management Feed',
      timestamp: '15 mins ago',
      weight: 0.22,
    },
    {
      key: 'weather_severity',
      name: 'Precipitation & Weather Index',
      expected: 18,
      observed: 26,
      unit: 'mm rain',
      source: 'Meteorological Connector',
      timestamp: '30 mins ago',
      weight: 0.15,
    },
    {
      key: 'disease_surveillance',
      name: 'Syndromic Fever Index',
      expected: 45,
      observed: 52,
      unit: 'syndromic pts',
      source: 'Surveillance Connector',
      timestamp: '1 hour ago',
      weight: 0.20,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [recalcResult, setRecalcResult] = useState<RecalculateResponse | null>(null);

  // Sync when district changes
  const handleDistrictChange = (dName: string) => {
    setDistrict(dName);
    const d = districts.find((x) => x.name === dName);
    if (d) onSelectDistrict(d);
    setRecalcResult(null);
  };

  // Update specific signal observation value
  const handleObservedChange = (key: string, val: number) => {
    setSignals((prev) =>
      prev.map((s) => (s.key === key ? { ...s, observed: val } : s))
    );
  };

  const handleExpectedChange = (key: string, val: number) => {
    setSignals((prev) =>
      prev.map((s) => (s.key === key ? { ...s, expected: val } : s))
    );
  };

  // Calculate deviation percent for a signal
  const getDeviation = (s: SignalItem) => {
    const exp = Math.max(1, s.expected);
    return Number((((s.observed - exp) / exp) * 100).toFixed(1));
  };

  // Check if any signal has significant deviation (>25%)
  const hasSignificantDeviation = signals.some((s) => Math.abs(getDeviation(s)) >= 25);
  const eventSignal = signals.find((s) => s.key === 'event_exposure');
  const eventDev = eventSignal ? getDeviation(eventSignal) : 0;

  // Perform deterministic recalculation via API
  const handleRecalculate = async () => {
    setLoading(true);
    try {
      const payload = {
        district,
        observations: signals.map((s) => ({
          signal_key: s.key,
          expected: s.expected,
          observed: s.observed,
          weight: s.weight,
        })),
      };
      const res = await api.recalculate(payload);
      setRecalcResult(res);
    } catch (err) {
      console.error('Failed to recalculate forecast', err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart comparison data if recalculation exists
  const chartData = recalcResult
    ? recalcResult.baseline.points.map((b, idx) => {
        const u = recalcResult.updated_points[idx];
        return {
          label: b.label,
          actual: b.actual,
          baseline: b.predicted,
          updated: u ? u.predicted : b.predicted,
          low: u ? u.low : b.low,
          high: u ? u.high : b.high,
        };
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        screenIndex="Screen 07 · Signal Monitor"
        title="Expected vs Observed Regional Signals Monitor"
        description="Monitor antecedent conditions when real-time observed regional signals deviate from anticipated baselines, propagating updates through the forecast layer."
        badge="Real-Time Signal Ingestion"
      >
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">District:</label>
          <select
            value={district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm"
          >
            {districts.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </SectionHeader>

      {/* DEVIATION ALERT BANNER */}
      {hasSignificantDeviation && (
        <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 shadow-sm animate-pulse">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
              </span>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-red-900">
                  REGIONAL SIGNAL DEVIATION DETECTED
                </div>
                <div className="text-xs text-red-700">
                  Observed event exposure ({eventSignal?.observed}) deviates by{' '}
                  <b>+{eventDev}%</b> from expected baseline ({eventSignal?.expected}). Multi-signal telemetry indicates potential acute healthcare demand pressure.
                </div>
              </div>
            </div>

            <button
              onClick={handleRecalculate}
              disabled={loading}
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white hover:bg-red-700 shadow-sm transition disabled:opacity-50"
            >
              {loading ? 'Recalculating…' : 'RECALCULATE FORECAST NOW'}
            </button>
          </div>
        </div>
      )}

      {/* Propagating Workflow Diagram */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
          Model Feature Propagation Pipeline
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-2.5">
            <div className="text-[10px] font-bold text-blue-600">STEP 1</div>
            <div className="text-xs font-black text-slate-900">Signal Update</div>
            <div className="text-[10px] text-slate-500">Ingest raw telemetry</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <div className="text-[10px] font-bold text-slate-400">STEP 2</div>
            <div className="text-xs font-black text-slate-900">Feature Update</div>
            <div className="text-[10px] text-slate-500">Normalize deviations</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <div className="text-[10px] font-bold text-slate-400">STEP 3</div>
            <div className="text-xs font-black text-slate-900">Forecast Recalculation</div>
            <div className="text-[10px] text-slate-500">Multimodal path shift</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <div className="text-[10px] font-bold text-slate-400">STEP 4</div>
            <div className="text-xs font-black text-slate-900">Risk & Lead Notice</div>
            <div className="text-[10px] text-slate-500">Advance threshold alert</div>
          </div>
        </div>
      </div>

      {/* EXPECTED vs OBSERVED Interactive Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
                Interactive Regional Signal Calibration · {district}
              </h2>
              <ResearchBadge label="Configured Signal" variant="blue" />
            </div>
            <p className="text-xs text-slate-500">
              Edit the observed or expected inputs below to simulate how unexpected deviations immediately update model forecasting.
            </p>
          </div>

          <button
            onClick={handleRecalculate}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 shadow-sm active:scale-95 transition disabled:opacity-50"
          >
            {loading ? 'Evaluating Model…' : 'RECALCULATE FORECAST'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="pb-3">Signal Name</th>
                <th className="pb-3">Source & Feed</th>
                <th className="pb-3 text-center">Expected</th>
                <th className="pb-3 text-center">Observed Input</th>
                <th className="pb-3 text-center">Deviation</th>
                <th className="pb-3 text-center">Deviation Status</th>
                <th className="pb-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {signals.map((s) => {
                const dev = getDeviation(s);
                const isMajor = Math.abs(dev) >= 50;
                const isSignificant = Math.abs(dev) >= 25 && Math.abs(dev) < 50;
                const isElevated = Math.abs(dev) >= 10 && Math.abs(dev) < 25;

                return (
                  <tr key={s.key} className="hover:bg-slate-50/80">
                    <td className="py-3">
                      <div className="font-black text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-400">Unit: {s.unit}</div>
                    </td>
                    <td className="py-3 text-slate-600 text-[11px]">{s.source}</td>
                    
                    {/* Expected Input */}
                    <td className="py-3 text-center">
                      <input
                        type="number"
                        value={s.expected}
                        onChange={(e) => handleExpectedChange(s.key, Number(e.target.value))}
                        className="w-20 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
                      />
                    </td>

                    {/* Observed Input */}
                    <td className="py-3 text-center">
                      <input
                        type="number"
                        value={s.observed}
                        onChange={(e) => handleObservedChange(s.key, Number(e.target.value))}
                        className={`w-24 rounded-lg border p-1 text-center font-mono font-black shadow-sm focus:outline-none ${
                          isMajor
                            ? 'border-red-400 bg-red-50 text-red-700'
                            : isSignificant
                            ? 'border-orange-400 bg-orange-50 text-orange-800'
                            : 'border-slate-300 bg-white text-slate-900'
                        }`}
                      />
                    </td>

                    {/* Deviation Badge */}
                    <td className="py-3 text-center">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 font-mono text-[11px] font-black ${
                          dev > 0
                            ? isMajor
                              ? 'bg-red-100 text-red-700'
                              : isSignificant
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-amber-100 text-amber-800'
                            : dev < 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {dev > 0 ? `+${dev}%` : `${dev}%`}
                      </span>
                    </td>

                    {/* Status Category */}
                    <td className="py-3 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                          isMajor
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : isSignificant
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : isElevated
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isMajor
                          ? 'Major Deviation (>50%)'
                          : isSignificant
                          ? 'Significant (25-50%)'
                          : isElevated
                          ? 'Elevated (10-25%)'
                          : 'Within Expected Range'}
                      </span>
                    </td>

                    <td className="py-3 text-right font-mono text-[10px] text-slate-400">
                      {s.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECALCULATION DEMONSTRATION RESULTS */}
      {recalcResult && (
        <div className="space-y-6">
          {/* Delta Metrics Summary */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card title="Pressure Change">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-red-600">
                  +{recalcResult.pressure_change} pp
                </span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">
                New 72h Pressure: <b>{recalcResult.new_pressure}%</b>
              </div>
            </Card>

            <Card title="Capacity Gap Change">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  {recalcResult.gap_change} beds
                </span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">
                Additional capacity required
              </div>
            </Card>

            <Card title="Risk Probability Change">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-orange-600">
                  +{recalcResult.risk_change}%
                </span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">
                Updated: <b>{recalcResult.new_risk_probability}%</b>
              </div>
            </Card>

            <Card title="Warning Lead Time Impact">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-blue-600">
                  {recalcResult.warning_lead_time_change}h earlier
                </span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">
                Threshold crossing accelerated
              </div>
            </Card>
          </div>

          {/* Forecast Chart: Baseline vs Updated */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900">
                    Recalculated Forecast Trajectory · {district}
                  </h2>
                  <Badge risk={recalcResult.new_risk} />
                </div>
                <p className="text-xs text-slate-500">
                  Baseline forecast dynamically updated following signal deviation ingestion.
                </p>
              </div>

              {/* VIEW WHY Explainability Shortcut */}
              <button
                onClick={() => onNavigate('alert')}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition"
              >
                VIEW WHY (Explainability Attribution) →
              </button>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                  <YAxis domain={[50, 105]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" stroke="#cbd5e1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

                  {/* Uncertainty Band for Updated Trajectory */}
                  <Area
                    type="monotone"
                    dataKey="high"
                    name="Updated 90% Upper Bound"
                    stroke="none"
                    fill="#fed7aa"
                    fillOpacity={0.35}
                  />

                  {/* Baseline Curve */}
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Baseline Forecast"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#94a3b8' }}
                  />

                  {/* Updated Forecast Curve */}
                  <Line
                    type="monotone"
                    dataKey="updated"
                    name="Updated Forecast (Recalculated)"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#dc2626' }}
                  />

                  <ReferenceLine
                    y={90}
                    stroke="#dc2626"
                    strokeDasharray="6 4"
                    label={{ value: 'Capacity Threshold (90%)', position: 'insideTopRight', fontSize: 10, fill: '#dc2626' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Dynamic Attribution Summary:</span> {recalcResult.alert_summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
