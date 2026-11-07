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
  BarChart,
  Bar,
} from 'recharts';
import { api } from '../api';
import type { District, ExperimentResult } from '../types';
import { SectionHeader } from './SectionHeader';
import { Card, Metric } from './UI';
import { FilterBar } from './FilterBar';
import { ResearchBadge } from './ResearchBadge';

interface ExperimentLabProps {
  districts: District[];
  selectedDistrict: District;
}

export function ExperimentLab({ districts, selectedDistrict }: ExperimentLabProps) {
  const [district, setDistrict] = useState(selectedDistrict?.name || 'Chennai');
  const [target, setTarget] = useState('Bed Occupancy');
  const [horizon, setHorizon] = useState('72h');
  const [modelType, setModelType] = useState('Temporal + contextual model');
  
  const allFeatures = [
    'Historical occupancy',
    'Admissions',
    'Discharges',
    'Emergency visits',
    'Weather',
    'Events',
    'Disease signals',
    'Mobility',
  ];

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Historical occupancy',
    'Admissions',
    'Emergency visits',
    'Weather',
    'Events',
    'Disease signals',
    'Mobility',
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExperimentResult | null>(null);

  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleRunExperiment = async () => {
    setLoading(true);
    try {
      const res = await api.experiment({
        target,
        horizon,
        feature_groups: selectedFeatures,
        model_type: modelType,
        district,
      });
      setResult(res);
    } catch (err) {
      console.error('Failed to run experiment', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        screenIndex="Screen 10 · Experiment Lab"
        title="Interactive Experimentation & Ablation Lab"
        description="Configure target variables, prediction horizons, multimodal feature subsets, and model architectures to observe forecast calibration."
        badge="Research Experiment Layer"
      />

      {/* Configuration Matrix */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Target Variable */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Prediction Target
            </label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
            >
              <option>Bed Occupancy</option>
              <option>Hospital Demand</option>
              <option>Capacity Pressure</option>
            </select>
          </div>

          {/* Horizon */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Forecast Horizon
            </label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
            >
              <option>24h</option>
              <option>48h</option>
              <option>72h</option>
              <option>7 days</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Evaluation District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
            >
              {districts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model Architecture */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Model Architecture
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
            >
              <option>Historical baseline</option>
              <option>Temporal model</option>
              <option>Temporal + contextual model</option>
            </select>
          </div>
        </div>

        {/* Feature Groups Checkboxes */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Feature Groups Selection (Ablation Matrix)
            </span>
            <span className="text-[11px] font-bold text-blue-600">
              {selectedFeatures.length} of {allFeatures.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {allFeatures.map((feat) => {
              const checked = selectedFeatures.includes(feat);
              return (
                <button
                  key={feat}
                  type="button"
                  onClick={() => toggleFeature(feat)}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-bold transition ${
                    checked
                      ? 'border-blue-300 bg-blue-50/60 text-blue-900 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-white'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-black ${
                      checked ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {checked ? '✓' : ''}
                  </span>
                  <span className="truncate">{feat}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-3">
          <button
            onClick={handleRunExperiment}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-black text-white hover:bg-blue-700 shadow-sm active:scale-95 transition disabled:opacity-50"
          >
            {loading ? 'Executing Evaluation Run…' : 'RUN EXPERIMENT'}
          </button>
        </div>
      </div>

      {/* Experiment Results View */}
      {result ? (
        <div className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card title="Evaluated MAE">
              <Metric label="Mean Absolute Error" value={result.mae} unit="%" />
            </Card>
            <Card title="Evaluated RMSE">
              <Metric label="Root Mean Squared" value={result.rmse} unit="%" />
            </Card>
            <Card title="Observed Lead Time">
              <Metric label="Early Notice" value={result.warning_lead_time_h} unit="hours" />
            </Card>
            <Card title="Confidence Coverage">
              <Metric label="Inside 90% Interval" value={result.uncertainty_coverage_pct} unit="%" />
            </Card>
          </div>

          {/* Forecast Trajectory vs Baseline */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Experiment Trajectory vs Reference Baseline
                </h2>
                <p className="text-xs text-slate-500">
                  Target: {result.config.target} · Horizon: {result.config.horizon} · Model: {result.config.model_type}
                </p>
              </div>
              <ResearchBadge label="Deterministic Evaluation" variant="blue" />
            </div>

            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={result.curve} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" stroke="#cbd5e1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

                  <Area
                    type="monotone"
                    dataKey="high"
                    name="90% Upper Bound"
                    stroke="none"
                    fill="#bfdbfe"
                    fillOpacity={0.4}
                  />

                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Reference Baseline"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />

                  <Line
                    type="monotone"
                    dataKey="experiment_forecast"
                    name="Ablation Experiment Forecast"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Importance Attribution Bar */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <h2 className="text-base font-black text-slate-900 mb-2">
              Derived Feature Importance Distribution
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Relative contribution of selected feature groups under the {modelType} configuration.
            </p>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={result.feature_importance}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 40]} unit="%" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="feature" width={180} tick={{ fontSize: 10, fill: '#334155' }} />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Importance']} />
                  <Bar dataKey="importance" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-12 text-center">
          <div className="text-3xl">🔬</div>
          <h3 className="mt-2 text-base font-black text-slate-900">Configure & Run Experiment</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            Choose feature ablation parameters and architecture above, then click <b>RUN EXPERIMENT</b> to observe comparative evaluation curves.
          </p>
        </div>
      )}
    </div>
  );
}
