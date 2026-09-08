import React from 'react';
import { Waves, Radio, Terminal } from 'lucide-react';
import type { ActiveTab, FloodSenseData, AetherBridgeData, SystemEvent } from '../types/simulation';

interface SidebarLeftProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  floodData: FloodSenseData;
  aetherData: AetherBridgeData;
  events: SystemEvent[];
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  activeTab,
  onSelectTab,
  floodData,
  aetherData,
  events,
}) => {
  const getSeverityDot = (severity: SystemEvent['severity']) => {
    switch (severity) {
      case 'success':
        return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />;
      case 'warning':
        return <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1" />;
      case 'critical':
        return <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1 animate-pulse" />;
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0 mt-1" />;
    }
  };

  return (
    <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-3 font-sans">
      
      {/* Subsystems Header */}
      <div className="bg-white px-3 py-2 rounded border border-slate-200 shadow-2xs flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
          OPERATIONAL SUBSYSTEMS
        </span>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
          2/2 ONLINE
        </span>
      </div>

      {/* Module Cards Container */}
      <div className="flex flex-col gap-2.5">
        
        {/* FLOODSENSE Card */}
        <div
          onClick={() => onSelectTab('FLOODSENSE')}
          className={`p-3 rounded border transition-all cursor-pointer ${
            activeTab === 'FLOODSENSE'
              ? 'border-slate-200 border-l-4 border-l-cyan-600 bg-white shadow-2xs'
              : 'border-slate-200 bg-slate-50/60 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5">
              <Waves className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-xs text-slate-900 tracking-tight">
                FLOODSENSE
              </h3>
            </div>
            <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>ACTIVE</span>
            </span>
          </div>

          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">
            Flood Forecast Engine &bull; Catchment Hydrology
          </div>

          <p className="text-[11px] text-slate-600 leading-snug mb-2.5">
            Telemetered gauge routing & runoff forecast via LSTM + Random Forest ensemble.
          </p>

          <div className="bg-slate-50 p-2 rounded border border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Prediction</span>
              <span className={`font-bold ${
                floodData.riskLevel === 'SAFE' ? 'text-emerald-700' :
                floodData.riskLevel === 'WATCH' ? 'text-amber-700' :
                floodData.riskLevel === 'WARNING' ? 'text-orange-700' : 'text-red-700'
              }`}>
                {floodData.riskLevel}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Confidence</span>
              <span className="font-bold text-slate-800">{floodData.ensembleConfidence}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Peak Forecast</span>
              <span className="font-bold text-slate-800">{floodData.predictedPeak} m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Time to Peak</span>
              <span className="font-bold text-slate-800">{floodData.timeToPeak}</span>
            </div>
          </div>
        </div>

        {/* AETHERBRIDGE Card */}
        <div
          onClick={() => onSelectTab('AETHERBRIDGE')}
          className={`p-3 rounded border transition-all cursor-pointer ${
            activeTab === 'AETHERBRIDGE'
              ? 'border-slate-200 border-l-4 border-l-cyan-600 bg-white shadow-2xs'
              : 'border-slate-200 bg-slate-50/60 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-xs text-slate-900 tracking-tight">
                AETHERBRIDGE
              </h3>
            </div>
            <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>CONNECTED</span>
            </span>
          </div>

          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">
            Tactical Voice Bridge &bull; RF Communications
          </div>

          <p className="text-[11px] text-slate-600 leading-snug mb-2.5">
            VHF-to-5G emergency voice link with HackRF SDR & NBFM demodulation.
          </p>

          <div className="bg-slate-50 p-2 rounded border border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Link State</span>
              <span className={`font-bold ${aetherData.linkHealthy ? 'text-emerald-700' : 'text-amber-700'}`}>
                {aetherData.linkHealthy ? 'HEALTHY' : 'DEGRADED'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Latency</span>
              <span className="font-bold text-slate-800">{aetherData.totalLatency} ms</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Active Bearer</span>
              <span className="font-bold text-slate-800 truncate">{aetherData.activeBearer}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Signal</span>
              <span className="font-bold text-slate-800">{aetherData.signalStrength} dBm</span>
            </div>
          </div>
        </div>

      </div>

      {/* System Telemetry Log */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs flex-1 flex flex-col min-h-[300px] overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              TELEMETRY LOG
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {events.length} LOGGED
          </span>
        </div>

        <div className="p-2 overflow-y-auto max-h-[380px] space-y-1.5 text-xs">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-1.5 rounded bg-slate-50/70 border border-slate-150 flex items-start space-x-2 text-[11px] leading-snug hover:bg-slate-100 transition-colors"
            >
              {getSeverityDot(evt.severity)}
              <div className="flex-1 min-w-0 font-mono">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                  <span className="font-semibold text-slate-600">{evt.timestamp}</span>
                  <span className="text-[9px] uppercase px-1 rounded bg-slate-200 text-slate-700 font-sans">
                    {evt.module}
                  </span>
                </div>
                <p className="text-slate-800 font-sans text-[11px] break-words">
                  {evt.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};
