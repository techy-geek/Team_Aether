import React from 'react';
import type { FloodSenseData, AetherBridgeData } from '../types/simulation';

interface BottomStatusBarProps {
  floodData: FloodSenseData;
  aetherData: AetherBridgeData;
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({
  floodData,
  aetherData,
}) => {
  return (
    <footer className="mt-4 flex flex-col gap-2 font-sans">
      {/* Telemetry Cards Strip */}
      <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
        
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col justify-center">
          <span className="text-xs text-slate-500 font-medium">System Health</span>
          <span className="text-sm font-bold text-emerald-700">99.9%</span>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col justify-center">
          <span className="text-xs text-slate-500 font-medium">FloodSense</span>
          <span className={`text-sm font-bold ${
            floodData.riskLevel === 'SAFE' ? 'text-emerald-700' :
            floodData.riskLevel === 'WATCH' ? 'text-amber-700' :
            floodData.riskLevel === 'WARNING' ? 'text-orange-700' : 'text-red-700'
          }`}>
            {floodData.riskLevel}
          </span>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col justify-center">
          <span className="text-xs text-slate-500 font-medium">AetherBridge</span>
          <span className="text-sm font-bold text-cyan-700">
            {aetherData.linkHealthy ? 'Connected' : 'Failover'}
          </span>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col justify-center">
          <span className="text-xs text-slate-500 font-medium">Active Subsystems</span>
          <span className="text-sm font-bold text-slate-800">2</span>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col justify-center">
          <span className="text-xs text-slate-500 font-medium">Avg Latency</span>
          <span className="text-sm font-bold text-cyan-700">{aetherData.totalLatency} ms</span>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col justify-center">
          <span className="text-xs text-slate-500 font-medium">Model Confidence</span>
          <span className="text-sm font-bold text-slate-800">{floodData.ensembleConfidence}%</span>
        </div>

      </div>

      {/* Mission Footer Attribution Bar */}
      <div className="bg-white text-slate-700 px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-cyan-700">SentinelBridge</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-600">Smart India Hackathon 2026</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500">NIT Silchar</span>
        </div>

        <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
};
