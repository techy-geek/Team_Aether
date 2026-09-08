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
    { label: 'VHF → SDR', val: latencyBreakdown.vhfToSdr, color: 'bg-cyan-500' },
    { label: 'GNU Radio', val: latencyBreakdown.gnuRadio, color: 'bg-cyan-600' },
    { label: 'Squelch/VOX', val: latencyBreakdown.squelchVox, color: 'bg-teal-500' },
    { label: 'SIP/RTP', val: latencyBreakdown.sipRtp, color: 'bg-emerald-500' },
    { label: '5G / Bearer', val: latencyBreakdown.fiveGUplink, color: 'bg-sky-500' },
    { label: 'EOC Dispatch', val: latencyBreakdown.eoc, color: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-3 font-sans">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Timer className="w-4 h-4 text-cyan-700" />
          <h3 className="text-xs font-bold text-slate-800">
            Latency Budget Allocation
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          ITU-T P.800 Spec (&lt; 150 ms)
        </span>
      </div>

      {/* Latency Top Telemetry Cards */}
      <div className="grid grid-cols-3 gap-3 text-center">
        
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500 block">Total Latency</span>
          <span className={`text-base font-bold ${isOverBudget ? 'text-red-600' : 'text-cyan-700'}`}>
            {totalLatency} ms
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500 block">Budget Limit</span>
          <span className="text-base font-bold text-slate-800">{latencyLimit} ms</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500 block">Headroom</span>
          <span className={`text-base font-bold ${latencyHeadroom < 20 ? 'text-amber-600' : 'text-emerald-700'}`}>
            {latencyHeadroom} ms
          </span>
        </div>

      </div>

      {/* Stacked Horizontal Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Latency Utilization</span>
          <span className="font-semibold">{usedPercent}% of 150 ms budget</span>
        </div>

        <div className="w-full h-4 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex">
          {items.map((item, i) => {
            const widthPct = (item.val / latencyLimit) * 100;
            return (
              <div
                key={i}
                className={`${item.color} h-full transition-all duration-500 relative group`}
                style={{ width: `${widthPct}%` }}
                title={`${item.label}: ${item.val} ms`}
              />
            );
          })}
        </div>
      </div>

      {/* Breakdown Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs pt-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center space-x-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <span className={`w-2.5 h-2.5 rounded-sm ${item.color} shrink-0`} />
            <div className="min-w-0 truncate">
              <span className="text-slate-500 block text-[10px] truncate">{item.label}</span>
              <span className="font-bold text-slate-800">{item.val} ms</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
