import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { api } from '../api';
import type { ModelMetric } from '../types';
import { SectionHeader } from './SectionHeader';
import { FilterBar } from './FilterBar';
import { ResearchBadge } from './ResearchBadge';

export function ModelAnalytics() {
  const [metrics, setMetrics] = useState<ModelMetric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('Warning Lead Time');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.modelMetrics().then((data) => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  const metricOptions = [
    'Warning Lead Time',
    'Mean Absolute Error (MAE)',
    'Root Mean Squared Error (RMSE)',
    'False Alert Rate',
    'Missed Pressure Events',
    'Uncertainty Interval Coverage',
  ];

  const currentMetricObj = metrics.find((m) => m.metric === selectedMetric);

  const chartData = [
    {
      model: 'Baseline (ARIMA)',
      value: currentMetricObj ? currentMetricObj.baseline : 14.2,
      desc: 'Univariate autoregression on census lags',
    },
    {
      model: 'Temporal Model (TFT)',
      value: currentMetricObj ? currentMetricObj.temporal : 28.6,
      desc: 'Multi-horizon self-attention on admissions & occupancy',
    },
    {
      model: 'Temporal + Contextual Model',
      value: currentMetricObj ? currentMetricObj.temporal_contextual : 38.4,
      desc: 'Multimodal spatial-temporal fusion (RegionalPulse)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        screenIndex="Screen 08 · Model Analytics"
        title="Research Model Architecture Evaluation"
        description="Comparative empirical evaluation of baseline autoregression versus temporal deep learning and multimodal graph fusion architectures."
        badge="Evaluation Benchmark"
      />

      {/* 5 Core Evaluated Performance Cards (Neutral terminology strictly adhered to) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">
            Measured Lead Time
          </div>
          <div className="mt-2 text-3xl font-black text-blue-950">38.4h</div>
          <div className="mt-1 text-[10px] text-blue-800">
            +24.2h advance notice vs baseline
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Measured Error (MAE)
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">2.18%</div>
          <div className="mt-1 text-[10px] text-slate-500">
            -3.64 pp lower absolute error
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Measured Error (RMSE)
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">2.94%</div>
          <div className="mt-1 text-[10px] text-slate-500">
            Robust to non-linear peak surges
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Warning Event Coverage
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600">95.9%</div>
          <div className="mt-1 text-[10px] text-slate-500">
            4.1% missed warning rate
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Uncertainty Coverage
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">92.6%</div>
          <div className="mt-1 text-[10px] text-slate-500">
            Calibrated inside 90% confidence band
          </div>
        </div>
      </div>

      {/* Metric Selector & Comparative Bar Chart */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
                Comparative Observed Performance: {selectedMetric}
              </h2>
              <ResearchBadge label="Observed Performance" variant="blue" />
            </div>
            <p className="text-xs text-slate-500">
              Evaluated across 38 administrative districts on 72-hour test intervals.
            </p>
          </div>

          <FilterBar
            options={metricOptions}
            active={selectedMetric}
            onChange={(m) => setSelectedMetric(m)}
            size="sm"
          />
        </div>

        {/* Chart Canvas */}
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="model" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit={currentMetricObj ? ` ${currentMetricObj.unit}` : ''} stroke="#cbd5e1" />
              <Tooltip
                formatter={(v: any) => [`${v} ${currentMetricObj?.unit || ''}`, selectedMetric]}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.model}
                    fill={index === 2 ? '#2563eb' : index === 1 ? '#60a5fa' : '#94a3b8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparative Architecture Note */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-800">Measured delta:</span>{' '}
          {currentMetricObj?.measured_difference}. Multimodal fusion integrates inter-district transit flow, environmental risk and syndromic indicators to produce sharper lead-time separation before acute demand peaks.
        </div>
      </div>

      {/* Detailed Architecture Comparison Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <h2 className="text-base font-black text-slate-900 mb-3">
          Research Architecture Benchmark Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="pb-3">Evaluated Metric</th>
                <th className="pb-3">Unit</th>
                <th className="pb-3 text-center">Baseline (ARIMA)</th>
                <th className="pb-3 text-center">Temporal Model (TFT)</th>
                <th className="pb-3 text-center">Temporal + Contextual</th>
                <th className="pb-3 text-right">Measured Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.map((m) => (
                <tr key={m.metric} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">{m.metric}</td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">{m.unit}</td>
                  <td className="py-3 text-center text-slate-600 font-mono">{m.baseline}</td>
                  <td className="py-3 text-center text-slate-800 font-mono font-bold">{m.temporal}</td>
                  <td className="py-3 text-center text-blue-600 font-mono font-black">{m.temporal_contextual}</td>
                  <td className="py-3 text-right">
                    <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-700 text-[11px]">
                      {m.measured_difference}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
