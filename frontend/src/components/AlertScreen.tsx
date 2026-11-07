import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, Badge, Metric } from './UI';
import { SectionHeader } from './SectionHeader';
import { DetailDrawer } from './DetailDrawer';
import { ResearchBadge } from './ResearchBadge';
import type { District, ForecastResponse, Signal } from '../types';

interface AlertScreenProps {
  selected: District;
  data: ForecastResponse | null;
}

export function AlertScreen({ selected, data }: AlertScreenProps) {
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  if (!data) return null;

  // Contributing factors sorted by attribution percentage
  const factors = data.signals
    .map((s) => ({
      name: s.name,
      contribution: s.contribution,
      rawSignal: s,
    }))
    .sort((a, b) => b.contribution - a.contribution);

  // Dynamic non-causal explanation generation
  const dynamicExplanation = `Predicted healthcare pressure for ${
    selected.name
  } is projected at ${data.pressure.toFixed(
    0
  )}% over the 72-hour horizon, exceeding the configured capacity threshold of ${
    data.threshold
  }%. Model-attributed feature weighting indicates demand signals are accelerating alongside ${data.signals
    .slice(0, 3)
    .map((s) => s.name.toLowerCase())
    .join(
      ', '
    )} and regional surveillance indicators. These factors represent associative multimodal inputs utilized by the research architecture for early warning and do not assert single-variable clinical causality.`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        screenIndex="Screen 05 · Why This Alert"
        title={`Explainable Alert Attribution · ${selected.name}`}
        description="Multimodal feature attribution breakdown for transparent early-warning research interpretation."
        badge="Model Explainability Layer"
      >
        <Badge risk={selected.risk} />
      </SectionHeader>

      {/* Top Alert Summary Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card title="+72h Projected Occupancy">
          <Metric
            label="Pressure Forecast"
            value={data.points[data.points.length - 1]?.predicted || data.pressure}
            unit="%"
          />
        </Card>
        <Card title="Threshold Risk Probability">
          <Metric label="Probability" value={data.riskProbability} unit="%" />
        </Card>
        <Card title="Peak Bed Demand">
          <Metric label="Census Intake" value={data.available + data.demand} unit="beds" />
        </Card>
        <Card title="Capacity Gap">
          <Metric
            label="Margin"
            value={data.gap > 0 ? `+${data.gap}` : data.gap}
            unit="beds"
          />
        </Card>
      </div>

      {/* Main Attribution Section */}
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        {/* Left Column: Horizontal Bar Chart & Explanation */}
        <div className="space-y-6">
          {/* Bar Chart Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900">
                    Top Contributing Factors (Multimodal Feature Attribution)
                  </h2>
                  <ResearchBadge label="Illustrative Attribution" variant="blue" />
                </div>
                <p className="text-xs text-slate-500">
                  Click any bar or factor to inspect signal provenance, raw values, and data source.
                </p>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={factors}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 40]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    unit="%"
                    stroke="#cbd5e1"
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={130}
                    tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                    stroke="#cbd5e1"
                  />
                  <Tooltip
                    formatter={(val: any) => [`${val}% Attribution Weight`, 'Contribution']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="contribution"
                    radius={[0, 6, 6, 0]}
                    cursor="pointer"
                    onClick={(entry) => setSelectedSignal(entry.rawSignal)}
                  >
                    {factors.map((f, i) => (
                      <Cell
                        key={f.name}
                        fill={
                          i === 0
                            ? '#2563eb'
                            : i === 1
                            ? '#3b82f6'
                            : i === 2
                            ? '#60a5fa'
                            : '#93c5fd'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
              <span>Weights computed via temporal gradient feature importance</span>
              <span className="font-bold text-blue-600">Click a bar to open signal drawer</span>
            </div>
          </div>

          {/* Dynamic Alert Explanation Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Synthesized Alert Explanation
              </h2>
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                Automated Research Synthesis
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              {dynamicExplanation}
            </p>
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
              <span className="font-bold text-slate-700">Non-causal declaration:</span> RegionalPulse associates multimodal environmental and operational covariates with bed census curves. Feature attribution highlights correlation intensity within the model architecture.
            </div>
          </div>
        </div>

        {/* Right Column: Evidence for Each Signal */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900">Signal Ingestion Evidence</h2>
                <p className="text-[11px] text-slate-500">
                  Telemetry streams ingested for {selected.name}
                </p>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {data.signals.length} Signals
              </span>
            </div>

            <div className="space-y-2.5">
              {data.signals.map((s) => (
                <div
                  key={s.name}
                  onClick={() => setSelectedSignal(s)}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer transition text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-black text-slate-900">{s.name}</span>
                      <div className="mt-0.5 text-[10px] text-slate-500">
                        {s.source} · {s.region}
                      </div>
                    </div>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        s.severity === 'Elevated'
                          ? 'bg-orange-100 text-orange-800'
                          : s.severity === 'High'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {s.severity}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] border-t border-slate-200/50 pt-2">
                    <span className="font-semibold text-slate-700">{s.value}</span>
                    <span className="font-black text-blue-600">
                      {s.contribution}% weight
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Signal Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedSignal)}
        onClose={() => setSelectedSignal(null)}
        signal={selectedSignal}
      />
    </div>
  );
}
