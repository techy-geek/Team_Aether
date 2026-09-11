import React from 'react';
import type { RiskLevel } from '../../types/simulation';

interface RiskLadderProps {
  currentRisk: RiskLevel;
}

export const RiskLadder: React.FC<RiskLadderProps> = ({ currentRisk }) => {
  const containerGlowMap: Record<RiskLevel, string> = {
    SAFE: 'border-emerald-500/50 dark:border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.2)]',
    WATCH: 'border-amber-500/50 dark:border-amber-500/60 shadow-[0_0_24px_rgba(245,158,11,0.2)]',
    WARNING: 'border-orange-500/50 dark:border-orange-500/60 shadow-[0_0_24px_rgba(249,115,22,0.2)]',
    CRITICAL: 'border-red-500/60 dark:border-red-500/70 shadow-[0_0_30px_rgba(239,68,68,0.35)]',
  };

  const levels: { level: RiskLevel; label: string; range: string; style: string; activeStyle: string }[] = [
    {
      level: 'SAFE',
      label: 'Safe',
      range: '< 3.2m',
      style: 'bg-emerald-50/60 dark:bg-slate-950/60 text-emerald-800 dark:text-emerald-400 border-emerald-200/80 dark:border-slate-800 hover:border-emerald-400/50',
      activeStyle: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-[2px] border-emerald-300 dark:border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400/40',
    },
    {
      level: 'WATCH',
      label: 'Watch',
      range: '3.2m - 4.0m',
      style: 'bg-amber-50/60 dark:bg-slate-950/60 text-amber-800 dark:text-amber-400 border-amber-200/80 dark:border-slate-800 hover:border-amber-400/50',
      activeStyle: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-[2px] border-amber-300 dark:border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/40',
    },
    {
      level: 'WARNING',
      label: 'Warning',
      range: '4.0m - 4.8m',
      style: 'bg-orange-50/60 dark:bg-slate-950/60 text-orange-800 dark:text-orange-400 border-orange-200/80 dark:border-slate-800 hover:border-orange-400/50',
      activeStyle: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-[2px] border-orange-300 dark:border-orange-400 shadow-[0_0_24px_rgba(249,115,22,0.5)] ring-2 ring-orange-400/40',
    },
    {
      level: 'CRITICAL',
      label: 'Critical',
      range: '> 4.8m',
      style: 'bg-red-50/60 dark:bg-slate-950/60 text-red-800 dark:text-red-400 border-red-200/80 dark:border-slate-800 hover:border-red-400/50',
      activeStyle: 'bg-gradient-to-br from-red-500 to-red-600 text-white border-[2px] border-red-300 dark:border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.7)] ring-2 ring-red-400/50 animate-pulse',
    },
  ];

  return (
    <div className={`bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-2.5 font-sans ${containerGlowMap[currentRisk]}`}>

      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          STAGE THRESHOLDS
        </h4>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-full font-medium border border-slate-200 dark:border-slate-800">
          Physics-Gated
        </span>
      </div>

      {/* Risk Blocks: 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2">
        {levels.map((item) => {
          const isCurrent = item.level === currentRisk;
          return (
            <div
              key={item.level}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${isCurrent ? item.activeStyle : `${item.style} opacity-85`
                }`}
            >
              <div className="flex items-center space-x-1 font-bold text-xs">
                <span>{item.label}</span>
                {isCurrent && <span className="text-[9px] font-semibold bg-white/20 px-1 py-0.2 rounded-full">● Active</span>}
              </div>
              <span className="text-[10.5px] mt-0.5 font-mono font-medium opacity-90">
                {item.range}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans bg-slate-50/80 dark:bg-slate-950/70 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-center leading-relaxed">
        Escalation requires both ensemble consensus &amp; river stage threshold breach.
      </p>

    </div>
  );
};

