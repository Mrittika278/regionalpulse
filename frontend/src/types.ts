export type Risk = 'NORMAL' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';

export type Screen =
  | 'command'
  | 'map'
  | 'forecast'
  | 'warning'
  | 'alert'
  | 'scenario'
  | 'signal'
  | 'analytics'
  | 'intelligence'
  | 'experiment'
  | 'error';

export interface District {
  name: string;
  lat: number;
  lng: number;
  pressure: number;
  risk: Risk;
  current: number;
  demand: number;
  available: number;
  gap: number;
  riskProbability: number;
  forecast: number[];
}

export interface ForecastPoint {
  label: string;
  actual?: number;
  predicted: number;
  low: number;
  high: number;
}

export interface Signal {
  name: string;
  source: string;
  timestamp: string;
  region: string;
  severity: string;
  value: string;
  contribution: number;
}

export interface ForecastResponse {
  district: string;
  points: ForecastPoint[];
  current: number;
  demand: number;
  available: number;
  gap: number;
  riskProbability: number;
  trend: number;
  pressure: number;
  threshold: number;
  signals: Signal[];
  modelStatus: string;
  dataStatus: string;
}

export interface ScenarioResult {
  baseline: ForecastPoint[];
  scenario: ForecastPoint[];
  delta: number;
  gapDelta: number;
  riskDelta: number;
}

export interface Warning {
  district: string;
  risk: Risk;
  current: number;
  pressure: number;
  projected_occupancy: number;
  threshold_crossing_h: number;
  lead_time_h: number;
  riskProbability: number;
  uncertainty: string;
  status: string;
  timestamp: string;
  top_signal: string;
}

export interface SignalObservation {
  signal_key: string;
  name: string;
  expected: number;
  observed: number;
  unit: string;
  deviation_percent: number;
  threshold_status: string;
  source: string;
  timestamp: string;
  weight: number;
}

export interface RecalculateObservationInput {
  signal_key: string;
  expected: number;
  observed: number;
  weight?: number;
}

export interface RecalculateRequest {
  district: string;
  observations: RecalculateObservationInput[];
}

export interface RecalculateResponse {
  district: string;
  baseline: ForecastResponse;
  updated_points: ForecastPoint[];
  deviations: {
    signal_key: string;
    expected: number;
    observed: number;
    deviation_percent: number;
    threshold_status: string;
  }[];
  aggregate_signal_adjustment: number;
  pressure_change: number;
  gap_change: number;
  risk_change: number;
  warning_lead_time_change: number;
  new_pressure: number;
  new_risk: Risk;
  new_risk_probability: number;
  alert_summary: string;
}

export interface ModelMetric {
  metric: string;
  unit: string;
  baseline: number;
  temporal: number;
  temporal_contextual: number;
  measured_difference: string;
}

export interface DataSource {
  id: string;
  category: string;
  name: string;
  source: string;
  timestamp: string;
  region: string;
  data_type: string;
  availability: string;
  last_update: string;
  completeness: number;
  freshness_min: number;
  outliers_pct: number;
  provenance: string;
}

export interface DataQuality {
  completeness_overall: number;
  freshness_score: number;
  missing_values_pct: number;
  outliers_pct: number;
  timestamp_consistency: number;
}

export interface ExperimentConfig {
  target: string;
  horizon: string;
  feature_groups: string[];
  model_type: string;
  district: string;
}

export interface ExperimentResult {
  config: ExperimentConfig;
  mae: number;
  rmse: number;
  warning_lead_time_h: number;
  uncertainty_coverage_pct: number;
  curve: {
    label: string;
    actual?: number;
    baseline?: number;
    experiment_forecast: number;
    low: number;
    high: number;
  }[];
  feature_importance: {
    feature: string;
    importance: number;
  }[];
  execution_timestamp: string;
  provenance: string;
}

export interface ErrorObservation {
  category: string;
  frequency_pct: number;
  expected: number;
  observed: number;
  predicted: number;
  abs_error: number;
  data_limitation: string;
  severity: string;
}

export interface ErrorAnalysisResponse {
  district: string;
  categories: ErrorObservation[];
  timeline: {
    time: string;
    actual: number;
    predicted: number;
    residual: number;
  }[];
  summary: string;
}
