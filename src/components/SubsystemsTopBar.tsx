import React from 'react';
import { Waves, Radio } from 'lucide-react';
import type { ActiveTab, FloodSenseData, AetherBridgeData } from '../types/simulation';

interface SubsystemsTopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  floodData: FloodSenseData;
  aetherData: AetherBridgeData;
}

export const SubsystemsTopBar: React.FC<SubsystemsTopBarProps> = ({
  activeTab,
  onSelectTab,
  floodData,
  aetherData,
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">

      {/* FLOODSENSE Horizontal Subsystem Card */}
      <div
        onClick={() => onSelectTab('FLOODSENSE')}
        className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${activeTab === 'FLOODSENSE'
            ? 'bg-gradient-to-br from-sky-50/90 via-white to-blue-50/50 dark:from-sky-950/40 dark:via-slate-900 dark:to-blue-950/30 border-sky-300 dark:border-sky-600/70 shadow-sm ring-2 ring-sky-500/20'
            : 'border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl ${activeTab === 'FLOODSENSE' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight">
                  FLOODSENSE
                </h3>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">&bull;</span>
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                  Catchment Hydrology
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Telemetered gauge routing & runoff forecast via LSTM + Random Forest ensemble.
              </p>
            </div>
          </div>

          <span className="flex items-center space-x-1.5 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ACTIVE</span>
          </span>
        </div>

        {/* 4 Stats Grid in Horizontal Row */}
        <div className="bg-slate-100/70 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
          <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Prediction</span>
            <span className={`font-bold text-[11.5px] ${floodData.riskLevel === 'SAFE' ? 'text-emerald-700 dark:text-emerald-400' :
                floodData.riskLevel === 'WATCH' ? 'text-amber-700 dark:text-amber-400' :
                  floodData.riskLevel === 'WARNING' ? 'text-orange-700 dark:text-orange-400' : 'text-red-700 dark:text-red-400'
              }`}>
              {floodData.riskLevel}
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Confidence</span>
            <span className="font-bold text-[11.5px] font-mono text-slate-800 dark:text-slate-200">{floodData.ensembleConfidence}%</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Peak Forecast</span>
            <span className="font-bold text-[11.5px] font-mono text-slate-800 dark:text-slate-200">{floodData.predictedPeak} m</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Time to Peak</span>
            <span className="font-bold text-[11.5px] font-mono text-slate-800 dark:text-slate-200">{floodData.timeToPeak}</span>
          </div>
        </div>
      </div>

      {/* AETHERBRIDGE Horizontal Subsystem Card */}
      <div
        onClick={() => onSelectTab('AETHERBRIDGE')}
        className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${activeTab === 'AETHERBRIDGE'
            ? 'bg-gradient-to-br from-teal-50/90 via-white to-cyan-50/50 dark:from-teal-950/40 dark:via-slate-900 dark:to-cyan-950/30 border-teal-300 dark:border-teal-600/70 shadow-sm ring-2 ring-teal-500/20'
            : 'border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl ${activeTab === 'AETHERBRIDGE' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight">
                  AETHERBRIDGE
                </h3>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">&bull;</span>
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                  Tactical Voice Bridge
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                VHF-to-5G emergency voice link with HackRF SDR & NBFM demodulation.
              </p>
            </div>
          </div>

          <span className="flex items-center space-x-1.5 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CONNECTED</span>
          </span>
        </div>

        {/* 4 Stats Grid in Horizontal Row */}
        <div className="bg-slate-100/70 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
          <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Link State</span>
            <span className={`font-bold text-[11.5px] ${aetherData.linkHealthy ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {aetherData.linkHealthy ? 'HEALTHY' : 'DEGRADED'}
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Latency</span>
            <span className="font-bold text-[11.5px] font-mono text-slate-800 dark:text-slate-200">{aetherData.totalLatency} ms</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Active Bearer</span>
            <span className="font-bold text-[11.5px] text-slate-800 dark:text-slate-200 truncate block">{aetherData.activeBearer}</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Signal</span>
            <span className="font-bold text-[11.5px] font-mono text-slate-800 dark:text-slate-200">{aetherData.signalStrength} dBm</span>
          </div>
        </div>
      </div>

    </div>
  );
};
