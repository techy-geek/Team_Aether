import React, { useState } from 'react';
import { Activity, Bell, ChevronDown } from 'lucide-react';
import type { ActiveTab, FloodSenseData, AetherBridgeData, SystemEvent } from '../types/simulation';
import { RiskLadder } from './FloodSense/RiskLadder';
import { LinkHealth } from './AetherBridge/LinkHealth';

interface SidebarRightProps {
  activeTab?: ActiveTab;
  floodData: FloodSenseData;
  aetherData: AetherBridgeData;
  events: SystemEvent[];
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  activeTab = 'FLOODSENSE',
  floodData,
  aetherData,
  events,
}) => {
  const [showLiveEvents, setShowLiveEvents] = useState<boolean>(false);
  const linkHealthPercent = aetherData.noiseInjected ? 42 : aetherData.activeBearer === 'LOCAL VHF' ? 68 : aetherData.activeBearer === 'NTN SATELLITE' ? 76 : 94;

  return (
    <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-3 font-sans">

      {/* Operational Status Header */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3.5 py-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          OPERATIONAL DIAGNOSTICS
        </span>
        <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
      </div>

      {/* Performance Indicators */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5 transition-colors duration-200">
        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          SUBSYSTEM HEALTH GAUGES
        </span>

        {/* FloodSense Linear Bar */}
        <div className="space-y-1.5 bg-slate-50/80 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">FloodSense Confidence</span>
            <span className="font-bold font-mono text-sky-800 dark:text-sky-300">{floodData.ensembleConfidence}%</span>
          </div>
          <div className="w-full bg-slate-200/80 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${floodData.ensembleConfidence}%` }}
            />
          </div>
        </div>

        {/* AetherBridge Linear Bar */}
        <div className="space-y-1.5 bg-slate-50/80 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">AetherBridge Link Health</span>
            <span className={`font-bold font-mono ${linkHealthPercent > 80 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {linkHealthPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200/80 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${linkHealthPercent > 80
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600'
                : 'bg-gradient-to-r from-amber-500 to-orange-600'
                }`}
              style={{ width: `${linkHealthPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* System Metrics Telemetry Data Table */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
        <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            SYSTEM METRICS
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">

          <div className="px-3.5 py-2 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Flood Risk</span>
            <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] border ${floodData.riskLevel === 'SAFE' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60' :
              floodData.riskLevel === 'WATCH' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60' :
                floodData.riskLevel === 'WARNING' ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/60' :
                  'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800/60 animate-pulse'
              }`}>
              {floodData.riskLevel}
            </span>
          </div>

          <div className="px-3.5 py-2 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Peak Forecast</span>
            <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{floodData.predictedPeak} m</span>
          </div>

          <div className="px-3.5 py-2 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Rainfall (6h Accum.)</span>
            <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{floodData.rainfall6h} mm</span>
          </div>

          <div className="px-3.5 py-2 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Comms Latency</span>
            <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{aetherData.totalLatency} ms</span>
          </div>

          <div className="px-3.5 py-2 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Packet Loss</span>
            <span className={`font-bold font-mono ${aetherData.packetLoss > 1 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
              {aetherData.packetLoss}%
            </span>
          </div>

          <div className="px-3.5 py-2 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Signal Strength</span>
            <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{aetherData.signalStrength} dBm</span>
          </div>

          <div className="px-3.5 py-2 flex items-center justify-between bg-emerald-50/30 dark:bg-emerald-950/20">
            <span className="text-slate-600 dark:text-slate-300 font-medium">System Uptime</span>
            <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">99.98%</span>
          </div>

        </div>
      </div>

      {/* Dynamic Subsystem Card: RiskLadder (FloodSense) or LinkHealth (AetherBridge) */}
      {activeTab === 'FLOODSENSE' ? (
        <RiskLadder currentRisk={floodData.riskLevel} />
      ) : (
        <LinkHealth bearers={aetherData.bearers} />
      )}

      {/* Streaming Events List */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200">
        <div
          onClick={() => setShowLiveEvents(!showLiveEvents)}
          className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Bell className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              LIVE EVENTS
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-700/70 px-2 py-0.5 rounded-full">
              STREAMING
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showLiveEvents ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Collapsible Live Events List */}
        {showLiveEvents ? (
          <div className="p-2.5 overflow-y-auto max-h-[280px] space-y-2 text-xs transition-all">
            {events.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No streaming events available.
              </div>
            ) : (
              events.slice(0, 15).map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-start space-x-2.5 p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-[11px]"
                >
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${evt.severity === 'critical' ? 'bg-red-500 animate-ping' :
                      evt.severity === 'warning' ? 'bg-amber-500' :
                        evt.severity === 'success' ? 'bg-emerald-500' : 'bg-sky-500'
                    }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-800 dark:text-slate-200 font-sans leading-tight">
                      {evt.message}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1 block">
                      {evt.timestamp} &bull; {evt.module}
                    </span>
                  </div>
                </div>
              ))
            )}
            <button
              onClick={() => setShowLiveEvents(false)}
              className="w-full py-1.5 text-center text-[10.5px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Click to collapse
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLiveEvents(true)}
            className="w-full p-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 bg-slate-50/40 dark:bg-slate-900/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 cursor-pointer transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Click to expand</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </aside>
  );
};
