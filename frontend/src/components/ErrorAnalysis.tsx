import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { api } from '../api';
import type { District, ErrorAnalysisResponse, ErrorObservation } from '../types';
import { SectionHeader } from './SectionHeader';
import { Card, Metric } from './UI';
import { ResearchBadge } from './ResearchBadge';
import { FilterBar } from './FilterBar';

interface ErrorAnalysisProps {
  districts: District[];
  selectedDistrict: District;
  onSelectDistrict?: (d: District) => void;
}

export function ErrorAnalysis({
  districts,
  selectedDistrict,
  onSelectDistrict,
}: ErrorAnalysisProps) {
  const [district, setDistrict] = useState(selectedDistrict?.name || 'Chennai');
  const [horizonFilter, setHorizonFilter] = useState('72h');
  const [data, setData] = useState<ErrorAnalysisResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ErrorObservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.errorAnalysis(district).then((res) => {
      setData(res);
      setSelectedCategory(res.categories[0]);
      setLoading(false);
    });
  }, [district]);

  const handleDistrictChange = (dName: string) => {
    setDistrict(dName);
    const found = districts.find((d) => d.name === dName);
    if (found && onSelectDistrict) {
      onSelectDistrict(found);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        screenIndex="Screen 11 · Error Analysis"
        title="Residual Taxonomy & Model Error Auditing"
        description="Systematic investigation into prediction error categories, telemetry delays, and variance limitations across regional healthcare facilities."
        badge="Model Error Taxonomy"
      />

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
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

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Horizon:</span>
            <FilterBar
              options={['24h', '48h', '72h']}
              active={horizonFilter}
              onChange={(h) => setHorizonFilter(h)}
              size="sm"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing evaluated residuals for <b>{district}</b>
        </div>
      </div>

      {/* Actual vs Predicted Timeline Chart */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
                Actual vs Predicted Occupancy & Residual Curve
              </h2>
              <ResearchBadge label="Audit Trajectory" variant="blue" />
            </div>
            <p className="text-xs text-slate-500">
              Evaluated performance over the preceding 7-day operational cycle.
            </p>
          </div>
          <div className="text-xs font-bold text-slate-500">
            {data?.summary}
          </div>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data?.timeline || []}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis domain={[65, 95]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

              <Line
                type="monotone"
                dataKey="actual"
                name="Historical Actual Census"
                stroke="#0f172a"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="predicted"
                name="Model Prediction"
                stroke="#2563eb"
                strokeWidth={2.5}
                strokeDasharray="5 3"
                dot={{ r: 3 }}
              />

              <Bar dataKey="residual" name="Residual (Actual − Predicted)" fill="#cbd5e1" />
              <ReferenceLine y={90} stroke="#dc2626" strokeDasharray="4 4" label={{ value: 'Threshold', fill: '#dc2626', fontSize: 10 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Error Taxonomy Breakdown Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: Error Categories Cards */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Residual Source Categories
              </h2>
              <p className="text-[11px] text-slate-500">
                Click any error category to inspect specific failure modes and data limitations
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {data?.categories.length || 0} Taxonomies
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data?.categories.map((cat) => {
              const isSelected = selectedCategory?.category === cat.category;
              return (
                <div
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat)}
                  className={`group rounded-xl border p-4 cursor-pointer transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-black text-slate-900 group-hover:text-blue-600">
                      {cat.category}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                        cat.severity === 'High'
                          ? 'bg-red-100 text-red-800'
                          : cat.severity === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.severity}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">Frequency:</span>
                    <span className="font-bold text-slate-800">{cat.frequency_pct}% of cases</span>
                  </div>

                  <div className="mt-1 flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">Mean Abs Error:</span>
                    <span className="font-black text-blue-600">±{cat.abs_error}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Category Deep Dive Panel */}
        {selectedCategory ? (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                  Category Deep Dive
                </span>
                <h3 className="mt-1 text-lg font-black text-slate-900">
                  {selectedCategory.category}
                </h3>
                <div className="mt-0.5 text-xs text-slate-400">
                  Accounts for {selectedCategory.frequency_pct}% of measured residuals
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Expected</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">{selectedCategory.expected}%</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Observed</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">{selectedCategory.observed}%</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Prediction</div>
                  <div className="text-base font-black text-blue-600 mt-0.5">{selectedCategory.predicted}%</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Abs Error</div>
                  <div className="text-base font-black text-red-600 mt-0.5">{selectedCategory.abs_error} pp</div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs leading-relaxed text-slate-600">
                <div className="font-bold text-slate-800 mb-1">
                  Contributing Data Limitation:
                </div>
                <p>{selectedCategory.data_limitation}</p>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
              RegionalPulse Research Error Auditing Engine
            </div>
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-400">
            Select an error category to view limitation analysis
          </div>
        )}
      </div>
    </div>
  );
}
