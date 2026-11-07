import { useEffect, useState } from 'react';
import { api } from './api';
import type { District, ForecastResponse, Screen, Warning } from './types';

// Global Shell Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// 11 Research Screens
import { CommandCenter } from './components/CommandCenter';
import { MapScreen } from './components/MapScreen';
import { ForecastScreen } from './components/ForecastScreen';
import { EarlyWarningScreen } from './components/EarlyWarningScreen';
import { AlertScreen } from './components/AlertScreen';
import { ScenarioLab } from './components/ScenarioLab';
import { SignalMonitor } from './components/SignalMonitor';
import { ModelAnalytics } from './components/ModelAnalytics';
import { DataIntelligence } from './components/DataIntelligence';
import { ExperimentLab } from './components/ExperimentLab';
import { ErrorAnalysis } from './components/ErrorAnalysis';

export default function App() {
  const [screen, setScreen] = useState<Screen>('command');
  const [districts, setDistricts] = useState<District[]>([]);
  const [selected, setSelected] = useState<District | null>(null);
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [status, setStatus] = useState<{
    data_updated?: string;
    model_updated?: string;
    forecast_generated?: string;
    mode?: string;
  } | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Initialize districts, warnings, status
  useEffect(() => {
    api.districts()
      .then((ds) => {
        setDistricts(ds);
        setSelected(ds[0] || null);
      })
      .catch((err) => console.error('Failed to load districts', err));

    api.warnings()
      .then(setWarnings)
      .catch((err) => console.error('Failed to load warnings', err));

    api.status()
      .then(setStatus)
      .catch((err) => console.error('Failed to load status', err));
  }, []);

  // Update forecast when selected district changes
  useEffect(() => {
    if (selected) {
      api.forecast(selected.name)
        .then(setData)
        .catch((err) => console.error('Failed to load forecast', err));
    }
  }, [selected]);

  const selectDistrict = (d: District) => {
    setSelected(d);
  };

  if (!selected || districts.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <div className="mt-3 text-sm font-black tracking-tight text-slate-900">
            Initializing RegionalPulse Research Environment…
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Connecting regional telemetry feeds & model inference engines
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentScreen={screen}
        onSelectScreen={(s) => setScreen(s)}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        warningCount={warnings.length}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <Header
          screen={screen}
          setScreen={setScreen}
          districts={districts}
          selectedDistrict={selected}
          onSelectDistrict={selectDistrict}
          warningCount={warnings.length}
          onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
          onOpenWarnings={() => setScreen('warning')}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {screen === 'command' && (
            <CommandCenter
              districts={districts}
              selectedDistrict={selected}
              onSelectDistrict={selectDistrict}
              forecastData={data}
              warnings={warnings}
              systemStatus={status}
              onNavigate={(s) => setScreen(s)}
            />
          )}

          {screen === 'map' && (
            <MapScreen
              districts={districts}
              selected={selected}
              setSelected={selectDistrict}
              onForecast={() => setScreen('forecast')}
              onAlert={() => setScreen('alert')}
              onScenario={() => setScreen('scenario')}
              forecastData={data}
              onNavigate={(s) => setScreen(s)}
            />
          )}

          {screen === 'forecast' && (
            <ForecastScreen
              districts={districts}
              selected={selected}
              setSelected={selectDistrict}
              data={data}
              onAlert={() => setScreen('alert')}
            />
          )}

          {screen === 'warning' && (
            <EarlyWarningScreen
              warnings={warnings}
              districts={districts}
              selectedDistrict={selected}
              onSelectDistrict={selectDistrict}
              onNavigate={(s) => setScreen(s)}
            />
          )}

          {screen === 'alert' && (
            <AlertScreen selected={selected} data={data} />
          )}

          {screen === 'scenario' && (
            <ScenarioLab
              districts={districts}
              selectedDistrict={selected}
              onSelectDistrict={selectDistrict}
            />
          )}

          {screen === 'signal' && (
            <SignalMonitor
              districts={districts}
              selectedDistrict={selected}
              onSelectDistrict={selectDistrict}
              onNavigate={(s) => setScreen(s)}
            />
          )}

          {screen === 'analytics' && <ModelAnalytics />}

          {screen === 'intelligence' && <DataIntelligence />}

          {screen === 'experiment' && (
            <ExperimentLab
              districts={districts}
              selectedDistrict={selected}
            />
          )}

          {screen === 'error' && (
            <ErrorAnalysis
              districts={districts}
              selectedDistrict={selected}
              onSelectDistrict={selectDistrict}
            />
          )}
        </main>

        {/* Standardized Research Footer */}
        <footer className="mt-auto border-t border-slate-200/90 bg-white py-4 px-6 text-xs text-slate-500">
          <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="font-black text-slate-900">
                REGIONAL<span className="text-blue-600">PULSE</span>
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400">
                Research decision-support prototype for regional healthcare capacity forecasting.
              </div>
            </div>

            <div className="text-[11px] text-slate-400 max-w-xl text-center sm:text-right">
              RegionalPulse is a research decision-support prototype and does not provide medical diagnosis, treatment or autonomous clinical decisions.
            </div>
          </div>

          <div className="mx-auto mt-3 flex max-w-[1600px] flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>Data Updated: {status?.data_updated || '—'}</span>
              <span>•</span>
              <span>Model Updated: {status?.model_updated || '—'}</span>
              <span>•</span>
              <span>Forecast Generated: {status?.forecast_generated || '—'}</span>
            </div>
            <div>Tamil Nadu Regional Healthcare Intelligence · Problem ID: ML-T2-021</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
