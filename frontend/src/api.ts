import type {
  District,
  ForecastResponse,
  ScenarioResult,
  Signal,
  Warning,
  SignalObservation,
  RecalculateRequest,
  RecalculateResponse,
  ModelMetric,
  DataSource,
  DataQuality,
  ExperimentConfig,
  ExperimentResult,
  ErrorAnalysisResponse,
} from './types';

// Deployed FastAPI backend
const API_BASE_URL = 'https://regionalpulse.onrender.com';

const get = async <T>(url: string): Promise<T> => {
  const r = await fetch(`${API_BASE_URL}${url}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
};

const post = async <T>(url: string, body: unknown): Promise<T> => {
  const r = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
};

export const api = {
  districts: () => get<District[]>('/api/regions'),
  region: (d: string) => get<District>(`/api/regions/${encodeURIComponent(d)}`),
  forecast: (d: string) => get<ForecastResponse>(`/api/forecast/${encodeURIComponent(d)}`),
  signals: (d: string) => get<Signal[]>(`/api/signals/${encodeURIComponent(d)}`),
  scenario: (body: unknown) => post<ScenarioResult>('/api/scenario', body),
  status: () =>
    get<{
      data_updated: string;
      model_updated: string;
      forecast_generated: string;
      mode: string;
    }>('/api/data-status'),
  warnings: () => get<Warning[]>('/api/warnings'),
  signalObservations: (d: string) =>
    get<SignalObservation[]>(`/api/signal-observations/${encodeURIComponent(d)}`),
  recalculate: (body: RecalculateRequest) =>
    post<RecalculateResponse>('/api/recalculate', body),
  modelMetrics: () => get<ModelMetric[]>('/api/model-metrics'),
  dataSources: () =>
    get<{ sources: DataSource[]; quality: DataQuality }>('/api/data-sources'),
  experiment: (config: ExperimentConfig) =>
    post<ExperimentResult>('/api/experiment', config),
  errorAnalysis: (d: string) =>
    get<ErrorAnalysisResponse>(`/api/error-analysis/${encodeURIComponent(d)}`),
};
