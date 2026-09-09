import React, { useEffect, useRef, useState } from 'react';
import { Layers, MapPin, Satellite, Map as MapIcon, Compass } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RiskLevel } from '../../types/simulation';

interface BasinMapProps {
  currentStage: number;
  riskLevel: RiskLevel;
}

interface StationInfo {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  offset: number;
  discharge: number;
}

export const BasinMap: React.FC<BasinMapProps> = ({ currentStage, riskLevel }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedStation, setSelectedStation] = useState<string>('SIL-CATCH-03');
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showInundation, setShowInundation] = useState<boolean>(true);
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showVhfCoverage, setShowVhfCoverage] = useState<boolean>(true);
  const [tileMode, setTileMode] = useState<'satellite' | 'topo' | 'light'>('satellite');

  const stations: StationInfo[] = [
    { id: 'SIL-CATCH-01', name: 'Annapurna Ghat Main Gauge', location: 'Silchar Main Reach (24.835°N, 92.795°E)', lat: 24.835, lng: 92.795, offset: 0.35, discharge: Math.round(currentStage * 280) },
    { id: 'SIL-CATCH-02', name: 'Madhura Confluence Hub', location: 'North Cachar Reach (24.865°N, 92.835°E)', lat: 24.865, lng: 92.835, offset: -0.20, discharge: Math.round(currentStage * 220) },
    { id: 'SIL-CATCH-03', name: 'NIT Silchar Hydrological Observatory', location: 'Ghunghoor Campus (24.755°N, 92.788°E)', lat: 24.755, lng: 92.788, offset: 0.0, discharge: Math.round(currentStage * 340) },
    { id: 'SIL-CATCH-04', name: 'Lakhipur Flood Sluice Lock', location: 'East Cachar Control (24.890°N, 92.920°E)', lat: 24.890, lng: 92.920, offset: -0.45, discharge: Math.round(currentStage * 310) },
  ];

  const tileUrls = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    topo: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{y}/{x}{r}.png',
  };

  const getStationStage = (offset: number) => Math.max(0.5, Number((currentStage + offset).toFixed(2)));

  const getStageStatus = (stage: number): { label: RiskLevel; color: string; bgHex: string } => {
    if (stage >= 4.8) return { label: 'CRITICAL', color: '#dc2626', bgHex: '#ef4444' };
    if (stage >= 4.0) return { label: 'WARNING', color: '#ea580c', bgHex: '#f97316' };
    if (stage >= 3.2) return { label: 'WATCH', color: '#d97706', bgHex: '#f59e0b' };
    return { label: 'SAFE', color: '#16a34a', bgHex: '#10b981' };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Silchar City / Barak Catchment (24.830°N, 92.795°E)
    const map = L.map(mapContainerRef.current, {
      center: [24.830, 92.795],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const initialTiles = L.tileLayer(tileUrls[tileMode], {
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = initialTiles;
    layersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Ensure Leaflet resizes to container accurately
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTiles = L.tileLayer(tileUrls[tileMode], { maxZoom: 18 }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTiles;
  }, [tileMode]);

  // Redraw Vector Layers & Markers whenever telemetry or toggles update
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    const layerGroup = layersGroupRef.current;
    layerGroup.clearLayers();

    // 1. Barak River & Tributary Polylines
    if (showRivers) {
      // Main Barak River Trunk
      const barakTrunk: L.LatLngExpression[] = [
        [24.895, 92.935],
        [24.885, 92.890],
        [24.860, 92.850],
        [24.835, 92.795],
        [24.820, 92.775],
        [24.780, 92.745],
        [24.740, 92.700],
        [24.710, 92.640],
      ];
      L.polyline(barakTrunk, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);

      // Madhura River Tributary
      const madhuraRiver: L.LatLngExpression[] = [
        [24.960, 92.845],
        [24.910, 92.840],
        [24.860, 92.850],
      ];
      L.polyline(madhuraRiver, {
        color: '#38bdf8',
        weight: 3.5,
        opacity: 0.9,
      }).addTo(layerGroup);

      // Ghagra Stream
      const ghagraStream: L.LatLngExpression[] = [
        [24.835, 92.795],
        [24.790, 92.830],
        [24.740, 92.870],
      ];
      L.polyline(ghagraStream, {
        color: '#0369a1',
        weight: 3,
        opacity: 0.85,
      }).addTo(layerGroup);
    }

    // 2. Dynamic Inundation Hazard Polygon
    if (showInundation) {
      // Scale polygon outward based on river stage (0.5m to 6.0m)
      const stageFactor = Math.min(2.0, Math.max(0.2, (currentStage - 0.5) / 2.5));
      const basePoints: [number, number][] = [
        [24.845, 92.765],
        [24.865, 92.810],
        [24.840, 92.855],
        [24.805, 92.830],
        [24.775, 92.765],
        [24.810, 92.740],
      ];

      const centerLat = 24.823;
      const centerLng = 92.793;

      const expandedPoints: L.LatLngExpression[] = basePoints.map(([lat, lng]) => [
        centerLat + (lat - centerLat) * (1 + stageFactor * 0.45),
        centerLng + (lng - centerLng) * (1 + stageFactor * 0.45),
      ]);

      const polygonColor = riskLevel === 'CRITICAL' ? '#dc2626' : riskLevel === 'WARNING' ? '#ea580c' : '#d97706';
      const fillColor = riskLevel === 'CRITICAL' ? '#ef4444' : riskLevel === 'WARNING' ? '#f97316' : '#f59e0b';

      L.polygon(expandedPoints, {
        color: polygonColor,
        weight: 2,
        fillColor: fillColor,
        fillOpacity: riskLevel === 'CRITICAL' ? 0.45 : riskLevel === 'WARNING' ? 0.35 : 0.25,
        dashArray: '5, 5',
      }).addTo(layerGroup);
    }

    // 3. VHF Tower Radii & Light Badges
    if (showVhfCoverage) {
      // VHF Tower Alpha (Silchar EOC Command)
      L.circle([24.818, 92.755], {
        radius: 7500,
        color: '#0d9488',
        weight: 1.5,
        fillColor: '#14b8a6',
        fillOpacity: 0.08,
        dashArray: '4, 4',
      }).addTo(layerGroup);

      // VHF Tower Beta (NIT Silchar Relay)
      L.circle([24.765, 92.825], {
        radius: 10000,
        color: '#0d9488',
        weight: 1.5,
        fillColor: '#14b8a6',
        fillOpacity: 0.06,
        dashArray: '4, 4',
      }).addTo(layerGroup);

      // Clean Light-Themed VHF Tower Icon Markers
      const createTowerIcon = (label: string) =>
        L.divIcon({
          className: 'custom-vhf-badge',
          html: `<div style="
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #ffffff;
            color: #0f766e;
            border: 1.5px solid #5eead4;
            padding: 2.5px 7px;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
            font-family: 'Inter', system-ui, sans-serif;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
          ">
            <span>📻</span>
            <span>${label}</span>
          </div>`,
          iconAnchor: [40, 12],
        });

      L.marker([24.818, 92.755], { icon: createTowerIcon('VHF-TOWER-ALPHA (12 km)') }).addTo(layerGroup);
      L.marker([24.765, 92.825], { icon: createTowerIcon('VHF-TOWER-BETA (18 km)') }).addTo(layerGroup);
    }

    // 4. Telemetry Sensor Station Markers (Light Theme, Clean Badges)
    if (showStations) {
      stations.forEach((stg) => {
        const stgStage = getStationStage(stg.offset);
        const status = getStageStatus(stgStage);
        const isSelected = stg.id === selectedStation;

        const customIcon = L.divIcon({
          className: 'custom-station-badge',
          html: `
            <div style="
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: #ffffff;
              color: #0f172a;
              border: 1.5px solid ${isSelected ? '#0284c7' : '#cbd5e1'};
              padding: 3px 8px;
              border-radius: 6px;
              box-shadow: ${isSelected ? '0 0 0 2px #0284c7, 0 2px 6px rgba(0,0,0,0.2)' : '0 2px 5px rgba(0,0,0,0.14)'};
              font-family: 'Inter', system-ui, sans-serif;
              font-size: 11px;
              font-weight: 600;
              white-space: nowrap;
              cursor: pointer;
            ">
              <span style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${status.bgHex};
                box-shadow: 0 0 0 1.5px rgba(255,255,255,0.9), 0 0 4px ${status.bgHex};
                display: inline-block;
                flex-shrink: 0;
              "></span>
              <span>${stg.id}</span>
              <span style="
                color: #64748b;
                font-family: ui-monospace, monospace;
                font-size: 10.5px;
                font-weight: 500;
                background: #f1f5f9;
                padding: 1px 4px;
                border-radius: 3px;
              ">${stgStage.toFixed(2)}m</span>
            </div>
          `,
          iconAnchor: [50, 14],
        });

        const marker = L.marker([stg.lat, stg.lng], { icon: customIcon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedStation(stg.id);
        });
      });
    }
  }, [currentStage, riskLevel, showRivers, showInundation, showStations, showVhfCoverage, selectedStation]);

  const activeStationObj = stations.find(s => s.id === selectedStation) || stations[2];
  const activeStage = getStationStage(activeStationObj.offset);
  const activeStatus = getStageStatus(activeStage);

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col gap-3.5 font-sans transition-colors duration-200">
      
      {/* GIS Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              GIS CATCHMENT & INUNDATION MAP — SILCHAR / CACHAR DISTRICT
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
            Barak River Basin Telemetry &bull; Assam India (24.8333° N, 92.7789° E)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Base Tile Mode Selector */}
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-[11px]">
            <button
              onClick={() => setTileMode('satellite')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all ${
                tileMode === 'satellite' ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Satellite className="w-3 h-3" />
              <span>Satellite</span>
            </button>
            <button
              onClick={() => setTileMode('topo')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all ${
                tileMode === 'topo' ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Topo</span>
            </button>
            <button
              onClick={() => setTileMode('light')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all ${
                tileMode === 'light' ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3 h-3" />
              <span>SCADA</span>
            </button>
          </div>

          {/* Layer Checkboxes */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <label className="flex items-center space-x-1 cursor-pointer bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700">
              <input
                type="checkbox"
                checked={showRivers}
                onChange={e => setShowRivers(e.target.checked)}
                className="accent-sky-600 rounded"
              />
              <span className="text-slate-700 dark:text-slate-300">Rivers</span>
            </label>

            <label className="flex items-center space-x-1 cursor-pointer bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700">
              <input
                type="checkbox"
                checked={showInundation}
                onChange={e => setShowInundation(e.target.checked)}
                className="accent-sky-600 rounded"
              />
              <span className="text-slate-700 dark:text-slate-300">Hazard Area</span>
            </label>

            <label className="flex items-center space-x-1 cursor-pointer bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700">
              <input
                type="checkbox"
                checked={showStations}
                onChange={e => setShowStations(e.target.checked)}
                className="accent-sky-600 rounded"
              />
              <span className="text-slate-700 dark:text-slate-300">Sensors</span>
            </label>

            <label className="flex items-center space-x-1 cursor-pointer bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700">
              <input
                type="checkbox"
                checked={showVhfCoverage}
                onChange={e => setShowVhfCoverage(e.target.checked)}
                className="accent-sky-600 rounded"
              />
              <span className="text-slate-700 dark:text-slate-300">VHF Radii</span>
            </label>
          </div>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="w-full h-[400px] rounded-xl border border-slate-300/80 relative overflow-hidden shadow-inner">
        
        {/* Clean Light-Themed Coordinates Badge (Top-Left) */}
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200/90 text-[11px] font-sans text-slate-700 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span className="font-semibold text-slate-800">SILCHAR (CACHAR)</span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-[10.5px] text-slate-600">24.833° N, 92.778° E</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-mono text-[10.5px]">ELEV: 21m</span>
        </div>

        {/* Clean Light-Themed Map Legend (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200/90 text-[11px] font-sans text-slate-700 space-y-2 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-1">
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-900">Map Legend</span>
            <span className="text-[9px] text-slate-400 font-mono">SCADA GIS</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-1 bg-sky-500 inline-block rounded" />
            <span className="text-slate-700 text-[10.5px]">Barak River Trunk</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-xs bg-amber-500/30 border border-amber-500 inline-block" />
            <span className="text-slate-700 text-[10.5px]">Inundation Hazard Zone</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full border border-teal-500 inline-block bg-teal-50" />
            <span className="text-slate-700 text-[10.5px]">VHF Coverage Radii</span>
          </div>
        </div>

        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Selected Telemetry Station SCADA Diagnostic Bar */}
      <div className="bg-slate-50/90 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/70 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
            <MapPin className="w-4 h-4 shrink-0" />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{activeStationObj.name}</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
              ID: {activeStationObj.id} &bull; Location: {activeStationObj.location}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3.5 font-mono text-xs">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium block">Gauged Stage</span>
            <span className="font-bold text-slate-900 dark:text-white">{activeStage.toFixed(2)} m</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium block">Discharge Flow</span>
            <span className="font-bold text-slate-900 dark:text-white">{activeStationObj.discharge} m³/s</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium block">Station State</span>
            <span className="font-bold px-2 py-0.5 rounded-full text-[11px] border" style={{ color: activeStatus.color, borderColor: activeStatus.bgHex }}>
              {activeStatus.label}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
