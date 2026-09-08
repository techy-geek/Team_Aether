import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import type { RiskLevel } from '../types/simulation';

interface HeaderProps {
  threatLevel: RiskLevel;
  currentTime: string;
  currentDate: string;
  simulationRunning: boolean;
  onToggleSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  threatLevel,
  currentTime,
  currentDate,
  simulationRunning,
  onToggleSimulation,
}) => {
  const getThreatBadge = (level: RiskLevel) => {
    switch (level) {
      case 'SAFE':
        return 'text-emerald-700 font-bold';
      case 'WATCH':
        return 'text-amber-700 font-bold';
      case 'WARNING':
        return 'text-orange-700 font-bold';
      case 'CRITICAL':
        return 'text-red-700 font-bold animate-pulse';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-2 text-xs font-sans sticky top-0 z-50 shadow-2xs">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        
        {/* Left Console Title */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
            <Shield className="w-4 h-4 text-slate-700 shrink-0" />
            <span className="tracking-tight uppercase font-mono text-sm">SENTINELBRIDGE</span>
          </div>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-slate-700 font-semibold tracking-wide uppercase text-[11px]">
            OPERATIONS CONSOLE
          </span>
          <span className="hidden sm:inline text-slate-300 font-normal">|</span>
          <span className="hidden sm:inline text-slate-500 text-[11px]">
            FloodSense + AetherBridge &bull; Disaster Response (NIT Silchar)
          </span>
        </div>

        {/* Right Status Indicators */}
        <div className="flex items-center space-x-3 font-sans text-xs w-full md:w-auto justify-end">
          
          <div className="flex items-center space-x-1.5 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-[11px] uppercase tracking-wider text-slate-600">SYSTEM ONLINE</span>
          </div>

          <span className="text-slate-300">|</span>

          <div className="flex items-center space-x-1 text-[11px] uppercase tracking-wider">
            <span className="text-slate-500">RISK STATE:</span>
            <span className={getThreatBadge(threatLevel)}>{threatLevel}</span>
          </div>

          <span className="text-slate-300">|</span>

          <div className="font-mono text-slate-800 text-[11px] tracking-tight">
            <span>{currentDate}</span>
            <span className="ml-1.5 font-semibold text-slate-900">{currentTime}</span>
          </div>

          <span className="text-slate-300">|</span>

          <button
            onClick={onToggleSimulation}
            className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-2.5 py-1 rounded border border-slate-300 transition-colors cursor-pointer text-[11px]"
          >
            <span>{simulationRunning ? 'TELEMETRY ACTIVE' : 'TELEMETRY PAUSED'}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
        </div>

      </div>
    </header>
  );
};
