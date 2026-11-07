import { useState } from 'react';
import { api } from '../api';
import type { District, ScenarioResult } from '../types';
import { Card, Metric } from './UI';

export function Scenario({ districts }: { districts: District[] }) {
  const [district, setDistrict] = useState(districts[0]?.name || 'Chennai');
  const [scenario, setScenario] = useState('Heavy Rainfall');
  const [intensity, setIntensity] = useState(50);
  const [duration, setDuration] = useState(24);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const run = async () => {
    const res = await api.scenario({ district, scenario, intensity, duration });
    setResult(res);
  };

  const baseLast = result && result.baseline.length > 0 ? result.baseline[result.baseline.length - 1] : null;
  const scenLast = result && result.scenario.length > 0 ? result.scenario[result.scenario.length - 1] : null;

  return (
    <Card title="Research What-If Scenario" sub="Illustrative Research Input — capacity stress test">
      <div className="grid gap-3 md:grid-cols-4">
        <select
          className="rounded-lg border p-2 text-xs"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          {districts.map((d) => (
            <option key={d.name}>{d.name}</option>
          ))}
        </select>
        <select
          className="rounded-lg border p-2 text-xs"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        >
          {[
            'Large Mass Gathering',
            'Heavy Rainfall',
            'Heatwave',
            'Disease Surge',
            'Major Accident',
            'Industrial Incident',
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <label className="text-xs">
          Intensity {intensity}%
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="text-xs">
          Duration {duration}h
          <input
            type="range"
            min="6"
            max="72"
            step="6"
            value={duration}
            onChange={(e) => setDuration(+e.target.value)}
            className="w-full"
          />
        </label>
      </div>
      <button
        onClick={run}
        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
      >
        Run research scenario
      </button>
      {result && baseLast && scenLast && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Metric label="Baseline +72h" value={baseLast.predicted} unit="%" />
          <Metric label="Scenario +72h" value={scenLast.predicted} unit="%" />
          <Metric label="Occupancy delta" value={`+${result.delta}`} unit="pp" />
        </div>
      )}
    </Card>
  );
}
