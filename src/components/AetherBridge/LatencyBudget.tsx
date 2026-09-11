import React from 'react';
import { Timer } from 'lucide-react';
import type { AetherBridgeData } from '../../types/simulation';

interface LatencyBudgetProps {
  data: AetherBridgeData;
}

export const LatencyBudget: React.FC<LatencyBudgetProps> = ({ data }) => {
  const { totalLatency, latencyLimit, latencyHeadroom, latencyBreakdown } = data;
  const isOverBudget = totalLatency > latencyLimit;
  const usedPercent = Math.min(100, Math.round((totalLatency / latencyLimit) * 100));

  const items = [
    { label: 'VHF → SDR', val: latencyBreakdown.vhfToSdr, color: 'bg-teal-500' },
    { label: 'GNU Radio', val: latencyBreakdown.gnuRadio, color: 'bg-teal-600' },
    { label: 'Squelch/VOX', val: latencyBreakdown.squelchVox, color: 'bg-cyan-500' },
    { label: 'SIP/RTP', val: latencyBreakdown.sipRtp, color: 'bg-sky-500' },
    { label: '5G / Bearer', val: latencyBreakdown.fiveGUplink, color: 'bg-blue-500' },
    { label: 'EOC Dispatch', val: latencyBreakdown.eoc, color: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col gap-2.5 font-sans transition-colors duration-200">

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <div className="p-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30">
            <Timer className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            LATENCY BUDGET
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-500/40 px-2 py-0.5 rounded-full dark:shadow-[0_0_8px_rgba(20,184,166,0.15)]">
          ITU-T &lt; 150ms
        </span>
      </div>

      {/* Latency Top Telemetry Cards */}
      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div className="bg-gradient-to-br from-teal-50/70 to-slate-50 dark:from-teal-950/50 dark:to-slate-950/70 p-2 rounded-xl border border-teal-200/70 dark:border-teal-500/30 shadow-2xs">
          <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Total</span>
          <span className={`text-sm font-bold font-mono ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-teal-800 dark:text-teal-300'}`}>
            {totalLatency}ms
          </span>
        </div>

        <div className="bg-slate-50/80 dark:bg-slate-950/70 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Limit</span>
          <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{latencyLimit}ms</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/70 to-slate-50 dark:from-emerald-950/50 dark:to-slate-950/70 p-2 rounded-xl border border-emerald-200/70 dark:border-emerald-500/30 shadow-2xs">
          <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Headroom</span>
          <span className={`text-sm font-bold font-mono ${latencyHeadroom < 20 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
            {latencyHeadroom}ms
          </span>
        </div>
      </div>

      {/* Stacked Horizontal Progress Bar */}
      <div className="space-y-1.5 bg-slate-50/60 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
        <div className="flex justify-between text-[10.5px] text-slate-600 dark:text-slate-300">
          <span className="font-medium">Utilization</span>
          <span className="font-bold font-mono text-teal-900 dark:text-teal-300">{usedPercent}% of 150ms</span>
        </div>

        <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300/80 dark:border-slate-700 flex p-0.5">
          {items.map((item, i) => {
            const widthPct = (item.val / latencyLimit) * 100;
            return (
              <div
                key={i}
                className={`${item.color} h-full transition-all duration-500 relative`}
                style={{ width: `${widthPct}%` }}
                title={`${item.label}: ${item.val} ms`}
              />
            );
          })}
        </div>
      </div>

      {/* Breakdown Vertical List */}
      <div className="grid grid-cols-2 gap-1.5 text-xs">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/70 px-2 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center space-x-1.5 min-w-0">
              <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
              <span className="text-slate-600 dark:text-slate-300 text-[10px] truncate font-medium">{item.label}</span>
            </div>
            <span className="font-bold font-mono text-slate-800 dark:text-slate-200 text-[10.5px]">{item.val}ms</span>
          </div>
        ))}
      </div>

    </div>
  );
};

