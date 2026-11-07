import React, { useState } from 'react';
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
import type { District, ScenarioResult } from '../types';
import { SectionHeader } from './SectionHeader';
import { Card, Metric } from './UI';
import { ResearchBadge } from './ResearchBadge';
import { TrendIndicator } from './TrendIndicator';

interface ScenarioLabProps {
  districts: District[];
  selectedDistrict: District;
  onSelectDistrict?: (d: District) => void;
}

export function ScenarioLab({
  districts,
  selectedDistrict,
  onSelectDistrict,
}: ScenarioLabProps) {
  const [district, setDistrict] = useState(selectedDistrict?.name || 'Chennai');
  const [scenario, setScenario] = useState('Large Mass Gathering');
  const [intensity, setIntensity] = useState(60);
  const [duration, setDuration] = useState(36);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const scenarioTypes = [
    { name: 'Large Mass Gathering', desc: 'Civic festival or congregation with transit inflow concentration' },
    { name: 'Heavy Rainfall', desc: 'Precipitation surge and localized transit disruption' },
    { name: 'Heatwave', desc: 'Extreme thermal index elevating dehydration and cardiovascular admissions' },
    { name: 'Disease Surge', desc: 'Syndromic cluster with acute viral fever presentation' },
    { name: 'Major Accident', desc: 'Multi-vehicle collision or transit corridor incident' },
    { name: 'Industrial Incident', desc: 'Chemical or manufacturing hazard requiring trauma and respiratory surge' },
  ];

  const handleDistrictChange = (name: string) => {
    setDistrict(name);
    const found = districts.find((d) => d.name === name);
    if (found && onSelectDistrict) {
      onSelectDistrict(found);
    }
  };

  const runScenario = async () => {
    setLoading(true);
    try {
      const res = await api.scenario({
        district,
        scenario,
        intensity,
        duration,
      });
      setResult(res);
    } catch (err) {
      console.error('Failed to run scenario', err);
    } finally {
      setLoading(false);
    }
  };

  // Build combined chart points if result exists
  const chartData = result
    ? result.baseline.map((b, idx) => {
        const scenPt = result.scenario[idx];
        return {
          label: b.label,
          actual: b.actual,
          baseline: b.predicted,
          scenarioPredicted: scenPt ? scenPt.predicted : b.predicted,
          low: scenPt ? scenPt.low : b.low,
          high: scenPt ? scenPt.high : b.high,
        };
      })
    : [];

  const baselineLast = result?.baseline ? result.baseline[result.baseline.length - 1] : null;
  const scenarioLast = result?.scenario ? result.scenario[result.scenario.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        screenIndex="Screen 06 · Scenario Lab"
        title="Research What-If Scenario Stress Testing"
        description="Evaluate prospective surge shocks against baseline capacity to test hospital preparedness and threshold resilient buffers."
        badge="Research Scenario"
      />

      {/* Interactive Scenario Controls */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* District selector */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Target District
            </label>
            <select
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
            >
              {districts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Scenario type */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Scenario Archetype
            </label>
            <select
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            >
              {scenarioTypes.map((x) => (
                <option key={x.name} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* Intensity slider */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Shock Intensity
              </label>
              <span className="text-xs font-black text-blue-600">{intensity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="mt-3 w-full accent-blue-600"
            />
            <div className="mt-1 flex justify-between text-[9px] text-slate-400">
              <span>Moderate</span>
              <span>Severe</span>
              <span>Extreme</span>
            </div>
          </div>

          {/* Duration slider */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Shock Duration
              </label>
              <span className="text-xs font-black text-blue-600">{duration} Hours</span>
            </div>
            <input
              type="range"
              min="6"
              max="72"
              step="6"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-3 w-full accent-blue-600"
            />
            <div className="mt-1 flex justify-between text-[9px] text-slate-400">
              <span>6h</span>
              <span>24h</span>
              <span>48h</span>
              <span>72h</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="text-xs text-slate-500">
            {scenarioTypes.find((s) => s.name === scenario)?.desc}
          </div>
          <button
            onClick={runScenario}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50"
          >
            {loading ? 'Evaluating Scenario…' : 'RUN RESEARCH SCENARIO'}
          </button>
        </div>
      </div>

      {/* Main Results Display */}
      {result ? (
        <div className="space-y-6">
          {/* Delta Metrics Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card title="Baseline +72h Peak">
              <Metric
                label="Unadjusted Occupancy"
                value={baselineLast?.predicted.toFixed(1) || '0'}
                unit="%"
              />
            </Card>
            <Card title="Scenario +72h Peak">
              <div className="flex items-baseline gap-2">
                <Metric
                  label="Adjusted Occupancy"
                  value={scenarioLast?.predicted.toFixed(1) || '0'}
                  unit="%"
                />
              </div>
            </Card>
            <Card title="Occupancy Surge Delta">
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-red-600">
                  +{result.delta}
                </span>
                <span className="text-xs font-bold text-slate-500">percentage points</span>
              </div>
              <div className="mt-2">
                <TrendIndicator value={result.delta} prefix="+" isPositivePressure={true} />
              </div>
            </Card>
            <Card title="Capacity Gap Impact">
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  {result.gapDelta}
                </span>
                <span className="text-xs font-bold text-slate-500">beds deficit</span>
              </div>
              <div className="mt-2 text-[10px] text-slate-400">
                Risk Prob Delta: +{result.riskDelta}%
              </div>
            </Card>
          </div>

          {/* Comparison Chart */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900">
                    Baseline vs Scenario Trajectory ({scenario})
                  </h2>
                  <ResearchBadge label="Research Output" variant="blue" />
                </div>
                <p className="text-xs text-slate-500">
                  Comparing baseline capacity with stress-tested forecast trajectory over 72 hours.
                </p>
              </div>
              <div className="text-xs font-black text-red-600">
                Peak Lift: +{result.delta} pp
              </div>
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

                  {/* Uncertainty Upper Bound for Scenario */}
                  <Area
                    type="monotone"
                    dataKey="high"
                    name="Scenario Upper Band"
                    stroke="none"
                    fill="#fed7aa"
                    fillOpacity={0.3}
                  />

                  {/* Baseline Line */}
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Baseline Forecast"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#94a3b8' }}
                  />

                  {/* Scenario Adjusted Line */}
                  <Line
                    type="monotone"
                    dataKey="scenarioPredicted"
                    name="Scenario-Adjusted Forecast"
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
          </div>

          {/* Scenario Assumptions Box */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Scenario Assumptions & Parameters
            </h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="font-bold text-slate-700">Scaling Factor:</span>
                <p className="mt-1 text-slate-500">
                  {scenario} applies a calibrated multiplier of {intensity}% over {duration} hours duration.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="font-bold text-slate-700">Temporal Lead Dynamics:</span>
                <p className="mt-1 text-slate-500">
                  Shock impacts admissions non-linearly with peak arrival concentration concentrated at +{Math.min(duration, 36)}h.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="font-bold text-slate-700">Threshold Crossing Probability:</span>
                <p className="mt-1 text-slate-500">
                  Projected probability of exceeding 90% bed capacity increases by {result.riskDelta} percentage points.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-12 text-center">
          <div className="text-3xl">🧪</div>
          <h3 className="mt-2 text-base font-black text-slate-900">No Scenario Evaluated Yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            Configure target district, scenario archetype, intensity and duration above, then click <b>RUN RESEARCH SCENARIO</b> to compute the shock trajectory.
          </p>
        </div>
      )}
    </div>
  );
}
