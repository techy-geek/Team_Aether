import React from 'react';
import { Activity, Bell } from 'lucide-react';
import type { FloodSenseData, AetherBridgeData, SystemEvent } from '../types/simulation';

interface SidebarRightProps {
  floodData: FloodSenseData;
  aetherData: AetherBridgeData;
  events: SystemEvent[];
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  floodData,
  aetherData,
  events,
}) => {
  const linkHealthPercent = aetherData.noiseInjected ? 42 : aetherData.activeBearer === 'LOCAL VHF' ? 68 : aetherData.activeBearer === 'NTN SATELLITE' ? 76 : 94;

  return (
    <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-3 font-sans">
      
      {/* Operational Status Header */}
      <div className="bg-white px-3 py-2 rounded border border-slate-200 shadow-2xs flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
          OPERATIONAL DIAGNOSTICS
        </span>
        <Activity className="w-3.5 h-3.5 text-slate-600 animate-pulse" />
      </div>

      {/* Performance Indicators (Compact Linear Bars instead of giant circular gauges) */}
      <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs space-y-3">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
          SUBSYSTEM HEALTH GAUGES
        </span>

        {/* FloodSense Linear Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-medium">FloodSense Confidence</span>
            <span className="font-bold font-mono text-cyan-800">{floodData.ensembleConfidence}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded overflow-hidden border border-slate-200">
            <div
              className="bg-cyan-600 h-full transition-all duration-500"
              style={{ width: `${floodData.ensembleConfidence}%` }}
            />
          </div>
        </div>

        {/* AetherBridge Linear Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-medium">AetherBridge Link Health</span>
            <span className={`font-bold font-mono ${linkHealthPercent > 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {linkHealthPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-500 ${linkHealthPercent > 80 ? 'bg-emerald-600' : 'bg-amber-500'}`}
              style={{ width: `${linkHealthPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* System Metrics Telemetry Data Table */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
            SYSTEM METRICS
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>

        <div className="divide-y divide-slate-150 text-xs">
          
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-slate-500">Flood Risk</span>
            <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
              floodData.riskLevel === 'SAFE' ? 'bg-emerald-100 text-emerald-800' :
              floodData.riskLevel === 'WATCH' ? 'bg-amber-100 text-amber-900' :
              floodData.riskLevel === 'WARNING' ? 'bg-orange-100 text-orange-900' :
              'bg-red-100 text-red-900 animate-pulse'
            }`}>
              {floodData.riskLevel}
            </span>
          </div>

          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-slate-500">Peak Forecast</span>
            <span className="font-bold font-mono text-slate-800">{floodData.predictedPeak} m</span>
          </div>

          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-slate-500">Rainfall (6h Accum.)</span>
            <span className="font-bold font-mono text-slate-800">{floodData.rainfall6h} mm</span>
          </div>

          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-slate-500">Comms Latency</span>
            <span className="font-bold font-mono text-slate-800">{aetherData.totalLatency} ms</span>
          </div>

          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-slate-500">Packet Loss</span>
            <span className={`font-bold font-mono ${aetherData.packetLoss > 1 ? 'text-red-600' : 'text-slate-800'}`}>
              {aetherData.packetLoss}%
            </span>
          </div>

          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-slate-500">Signal Strength</span>
            <span className="font-bold font-mono text-slate-800">{aetherData.signalStrength} dBm</span>
          </div>

          <div className="px-3 py-2 flex items-center justify-between bg-slate-50/50">
            <span className="text-slate-500">System Uptime</span>
            <span className="font-bold font-mono text-emerald-700">99.98%</span>
          </div>

        </div>
      </div>

      {/* Streaming Events List */}
      <div className="bg-white rounded border border-slate-200 shadow-2xs flex-1 flex flex-col min-h-[240px] overflow-hidden">
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Bell className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              LIVE EVENTS
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            STREAMING
          </span>
        </div>

        <div className="p-2 overflow-y-auto max-h-[280px] space-y-1.5 text-xs">
          {events.slice(0, 15).map((evt) => (
            <div
              key={evt.id}
              className="flex items-start space-x-2 p-1.5 rounded bg-slate-50 border border-slate-150 text-[11px]"
            >
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                evt.severity === 'critical' ? 'bg-red-500 animate-ping' :
                evt.severity === 'warning' ? 'bg-amber-500' :
                evt.severity === 'success' ? 'bg-emerald-500' : 'bg-cyan-600'
              }`} />
              <div className="min-w-0 flex-1">
                <p className="text-slate-800 font-sans leading-tight">
                  {evt.message}
                </p>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                  {evt.timestamp} &bull; {evt.module}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};
