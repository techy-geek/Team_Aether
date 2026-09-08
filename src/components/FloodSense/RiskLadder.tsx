import React from 'react';
import type { RiskLevel } from '../../types/simulation';

interface RiskLadderProps {
  currentRisk: RiskLevel;
}

export const RiskLadder: React.FC<RiskLadderProps> = ({ currentRisk }) => {
  const levels: { level: RiskLevel; label: string; range: string; style: string; activeStyle: string }[] = [
    {
      level: 'SAFE',
      label: 'Safe',
      range: '< 3.2m',
      style: 'bg-emerald-50 text-emerald-800 border-slate-200',
      activeStyle: 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400/30',
    },
    {
      level: 'WATCH',
      label: 'Watch',
      range: '3.2m - 4.0m',
      style: 'bg-amber-50 text-amber-900 border-slate-200',
      activeStyle: 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30',
    },
    {
      level: 'WARNING',
      label: 'Warning',
      range: '4.0m - 4.8m',
      style: 'bg-orange-50 text-orange-900 border-slate-200',
      activeStyle: 'bg-orange-600 text-white border-orange-700 shadow-md ring-2 ring-orange-400/30',
    },
    {
      level: 'CRITICAL',
      label: 'Critical',
      range: '> 4.8m',
      style: 'bg-red-50 text-red-900 border-slate-200',
      activeStyle: 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-400/30 animate-pulse',
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-3 font-sans">
      
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800">
          River Stage Escalation Thresholds
        </h4>
        <span className="text-xs text-slate-500 font-medium">
          Physics-Gated
        </span>
      </div>

      {/* Risk Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {levels.map((item) => {
          const isCurrent = item.level === currentRisk;
          return (
            <div
              key={item.level}
              className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                isCurrent ? item.activeStyle : `${item.style} opacity-70`
              }`}
            >
              <div className="flex items-center space-x-1.5 font-bold text-sm">
                <span>{item.label}</span>
                {isCurrent && <span className="text-xs font-semibold">● Current</span>}
              </div>
              <span className="text-xs mt-1 opacity-90">
                Stage: {item.range}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-600 font-sans bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center leading-relaxed">
        Escalation to WARNING or CRITICAL requires both model ensemble consensus and physical river stage threshold breach.
      </p>

    </div>
  );
};
