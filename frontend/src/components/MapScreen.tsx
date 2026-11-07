import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Badge, Metric } from './UI';
import { ResearchBadge } from './ResearchBadge';
import { DetailDrawer } from './DetailDrawer';
import type { District, ForecastResponse, Signal, Screen } from '../types';

export type MapLayer =
  | 'Pressure'
  | 'Occupancy'
  | 'Demand'
  | 'Capacity Gap'
  | 'Risk Probability'
  | 'Event Exposure'
  | 'Weather'
  | 'Healthcare Demand';

interface MapScreenProps {
  districts: District[];
  selected: District;
  setSelected: (d: District) => void;
  onForecast: () => void;
  onAlert?: () => void;
  onScenario?: () => void;
  forecastData?: ForecastResponse | null;
  onNavigate?: (s: Screen) => void;
}

function FocusMap({ d }: { d: District }) {
  const map = useMap();
  React.useEffect(() => {
    if (d) {
      map.setView([d.lat, d.lng], 7, { animate: true });
    }
  }, [d, map]);
  return null;
}

export function MapScreen({
  districts,
  selected,
  setSelected,
  onForecast,
  onAlert,
  onScenario,
  forecastData,
  onNavigate,
}: MapScreenProps) {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('Pressure');
  const [drawerSignal, setDrawerSignal] = useState<Signal | null>(null);

  const layers: MapLayer[] = [
    'Pressure',
    'Occupancy',
    'Demand',
    'Capacity Gap',
    'Risk Probability',
    'Event Exposure',
    'Weather',
    'Healthcare Demand',
  ];

  // Helper for marker colors & radii based on selected layer
  const getMarkerVisuals = (d: District) => {
    switch (activeLayer) {
      case 'Occupancy': {
        const occ = d.current;
        const color = occ >= 85 ? '#dc2626' : occ >= 75 ? '#f97316' : occ >= 65 ? '#eab308' : '#16a34a';
        return { color, radius: Math.max(8, occ / 7), label: `${occ}% census occupancy` };
      }
      case 'Demand':
      case 'Healthcare Demand': {
        const dem = Math.max(0, d.demand);
        const color = dem > 60 ? '#dc2626' : dem > 30 ? '#f97316' : dem > 10 ? '#eab308' : '#2563eb';
        return { color, radius: Math.max(8, Math.min(22, 9 + dem / 6)), label: `${dem} bed demand` };
      }
      case 'Capacity Gap': {
        const gap = d.gap;
        const color = gap < 0 ? '#dc2626' : gap < 20 ? '#f97316' : '#16a34a';
        return { color, radius: Math.max(8, Math.min(22, 16 - gap / 15)), label: `Gap: ${gap > 0 ? '+' : ''}${gap} beds` };
      }
      case 'Risk Probability': {
        const rp = d.riskProbability;
        const color = rp >= 80 ? '#dc2626' : rp >= 60 ? '#f97316' : rp >= 40 ? '#eab308' : '#16a34a';
        return { color, radius: Math.max(8, rp / 5), label: `${rp}% risk probability` };
      }
      case 'Event Exposure': {
        const isUrban = d.name === 'Chennai' || d.name === 'Coimbatore' || d.name === 'Madurai';
        const color = isUrban ? '#7c3aed' : '#3b82f6';
        return { color, radius: isUrban ? 18 : 10, label: isUrban ? 'High event density corridor' : 'Baseline public exposure' };
      }
      case 'Weather': {
        const isCoastal = d.name === 'Chennai' || d.name === 'Thoothukudi' || d.name === 'Kanyakumari';
        const color = isCoastal ? '#0284c7' : '#64748b';
        return { color, radius: isCoastal ? 17 : 10, label: isCoastal ? 'Precipitation watch zone' : 'Normal meteorological index' };
      }
      case 'Pressure':
      default: {
        const color =
          d.risk === 'VERY HIGH'
            ? '#dc2626'
            : d.risk === 'HIGH'
            ? '#f97316'
            : d.risk === 'MODERATE'
            ? '#eab308'
            : d.risk === 'LOW'
            ? '#84cc16'
            : '#16a34a';
        return { color, radius: Math.max(9, d.pressure / 8), label: `${d.risk} · ${d.pressure.toFixed(0)}% pressure` };
      }
    }
  };

  const signalsList = forecastData?.signals || [
    {
      name: 'Admission trend',
      source: 'Hospital feed',
      timestamp: 'Today',
      region: selected.name,
      severity: 'Elevated',
      value: '+5.2% 24h intake',
      contribution: 28,
    },
    {
      name: 'Weather severity',
      source: 'Weather connector',
      timestamp: 'Today',
      region: selected.name,
      severity: 'Moderate',
      value: '35 mm rainfall forecast',
      contribution: 20,
    },
    {
      name: 'Public event exposure',
      source: 'Event feed',
      timestamp: 'Today',
      region: selected.name,
      severity: 'Elevated',
      value: 'Congregation signal index',
      contribution: 24,
    },
    {
      name: 'Regional mobility',
      source: 'Mobility connector',
      timestamp: 'Today',
      region: selected.name,
      severity: 'Moderate',
      value: '+4.8% corridor flow',
      contribution: 15,
    },
  ];

  return (
    <div className="grid min-h-[calc(100vh-130px)] grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
      {/* Left Map View */}
      <section className="relative min-h-[550px] rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm flex flex-col">
        {/* Layer Selector Bar */}
        <div className="z-10 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-sm flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-1">
            Map Layer:
          </span>
          {layers.map((layer) => {
            const isActive = activeLayer === layer;
            return (
              <button
                key={layer}
                type="button"
                onClick={() => setActiveLayer(layer)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {layer}
              </button>
            );
          })}
        </div>

        {/* Map Canvas */}
        <div className="relative flex-1 min-h-[500px]">
          <MapContainer
            center={[11.1271, 78.6569]}
            zoom={7}
            scrollWheelZoom
            className="h-full min-h-[500px] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FocusMap d={selected} />

            {districts.map((d) => {
              const { color, radius, label } = getMarkerVisuals(d);
              const isDistrictSelected = d.name === selected.name;

              return (
                <CircleMarker
                  key={d.name}
                  center={[d.lat, d.lng]}
                  radius={radius}
                  pathOptions={{
                    color: isDistrictSelected ? '#1e3a8a' : color,
                    fillColor: color,
                    fillOpacity: isDistrictSelected ? 0.85 : 0.6,
                    weight: isDistrictSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => setSelected(d),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -5]}>
                    <div className="p-1">
                      <div className="font-black text-slate-900">{d.name}</div>
                      <div className="text-xs text-slate-600">{label}</div>
                      <div className="mt-1 text-[10px] text-blue-600 font-bold">
                        Click to select district
                      </div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Floating Map Legend & Stats Overlay */}
          <div className="absolute left-4 top-4 z-[400] max-w-xs rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-slate-900">
                Tamil Nadu · {activeLayer}
              </span>
              <ResearchBadge label="Research Layer" variant="blue" />
            </div>
            <div className="mt-1 text-[10px] text-slate-500">
              Prototype Geospatial Telemetry · {districts.length} Regions Active
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-bold border-t border-slate-100 pt-2.5">
              <div className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
                <span className="text-slate-600">NORMAL (&lt;65%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-[#eab308]" />
                <span className="text-slate-600">MODERATE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                <span className="text-slate-600">HIGH (85-95%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
                <span className="text-slate-600">VERY HIGH (&gt;95%)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right-Side Selected District Panel */}
      <aside className="flex flex-col gap-4 overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        {/* District Title */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-blue-600">
              Selected District
            </div>
            <h1 className="mt-1 text-2xl font-black text-slate-900">
              {selected.name}
            </h1>
            <div className="mt-0.5 text-xs text-slate-400">
              Coordinates: {selected.lat.toFixed(2)}°N, {selected.lng.toFixed(2)}°E
            </div>
          </div>
          <Badge risk={selected.risk} />
        </div>

        {/* 4 Core Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card title="Current Occupancy">
            <Metric label="Census" value={selected.current} unit="%" />
          </Card>
          <Card title="72h Pressure">
            <Metric label="Forecast" value={selected.pressure.toFixed(0)} unit="%" />
          </Card>
          <Card title="Available Capacity">
            <Metric label="Beds" value={selected.available} />
          </Card>
          <Card title="Capacity Gap">
            <Metric
              label="Surplus / Deficit"
              value={selected.gap > 0 ? `+${selected.gap}` : selected.gap}
              unit="beds"
            />
          </Card>
        </div>

        {/* 72-Hour Outlook Cards */}
        <Card title="72-Hour Trajectory" sub="Lead time outlook">
          <div className="mt-1 grid grid-cols-3 gap-2 text-center">
            {selected.forecast.map((val, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"
              >
                <div className="text-[10px] font-extrabold uppercase text-slate-400">
                  +{(idx + 1) * 24}H
                </div>
                <div className="mt-1 text-lg font-black text-slate-900">{val}%</div>
                <div className="text-[9px] font-medium text-slate-400">
                  {val >= 90 ? 'Threshold alert' : 'Sub-critical'}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Regional Signals Panel */}
        <Card title="Regional Context Signals" sub="Click to inspect provenance">
          <div className="space-y-2">
            {signalsList.map((s) => (
              <div
                key={s.name}
                onClick={() => setDrawerSignal(s)}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800">{s.name}</div>
                  <div className="text-[10px] text-slate-400">{s.value}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-600">
                    {s.contribution}%
                  </span>
                  <span className="text-slate-300">›</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Navigation Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onForecast}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            VIEW 72-HOUR FORECAST →
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => (onAlert ? onAlert() : onNavigate?.('alert'))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              VIEW ALERT WHY
            </button>
            <button
              onClick={() => (onScenario ? onScenario() : onNavigate?.('scenario'))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              RUN SCENARIO
            </button>
          </div>
        </div>

        {/* Medical disclaimer */}
        <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
          RegionalPulse is a research decision-support prototype and does not provide medical diagnosis, treatment or autonomous clinical decisions.
        </p>
      </aside>

      {/* Signal Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(drawerSignal)}
        onClose={() => setDrawerSignal(null)}
        signal={drawerSignal}
      />
    </div>
  );
}
