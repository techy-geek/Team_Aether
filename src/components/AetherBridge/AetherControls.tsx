import React from 'react';
import { Mic, ZapOff, ArrowDownRight, RefreshCw, Sliders } from 'lucide-react';
import type { AetherBridgeData } from '../../types/simulation';

interface AetherControlsProps {
  data: AetherBridgeData;
  onTogglePtt: () => void;
  onToggleNoise: () => void;
  onDrop5gLink: () => void;
  onRestoreLink: () => void;
}

export const AetherControls: React.FC<AetherControlsProps> = ({
  data,
  onTogglePtt,
  onToggleNoise,
  onDrop5gLink,
  onRestoreLink,
}) => {
  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs font-sans transition-colors duration-200">

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            RF Transmission & Bearer Controls
          </h3>
        </div>
        <span className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full font-medium border border-slate-200/80 dark:border-slate-700/80">
          Hardware Simulation Controls
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 font-sans">

        {/* PTT Trigger Button */}
        <button
          onClick={onTogglePtt}
          className={`p-3.5 rounded-xl border font-bold text-xs flex items-center justify-center space-x-2.5 transition-all shadow-xs cursor-pointer ${data.pttActive
              ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-red-700 ring-2 ring-red-400/40 animate-pulse'
              : 'bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white border-teal-700 shadow-2xs'
            }`}
        >
          <Mic className="w-4 h-4" />
          <span>{data.pttActive ? 'Release PTT (Keyed)' : 'PTT Transmit'}</span>
        </button>

        {/* Inject Noise Button */}
        <button
          onClick={onToggleNoise}
          className={`p-3.5 rounded-xl border font-semibold text-xs flex items-center justify-center space-x-2.5 transition-all shadow-xs cursor-pointer ${data.noiseInjected
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-amber-600'
              : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-2xs'
            }`}
        >
          <ZapOff className="w-4 h-4" />
          <span>{data.noiseInjected ? 'Clear Interference' : 'Inject RF Interference'}</span>
        </button>

        {/* Drop 5G Link Button */}
        <button
          onClick={onDrop5gLink}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-amber-50/80 dark:hover:bg-amber-950/40 hover:border-amber-300 dark:hover:border-amber-700 text-slate-700 dark:text-slate-200 hover:text-amber-900 dark:hover:text-amber-300 font-semibold text-xs flex items-center justify-center space-x-2.5 transition-all shadow-2xs cursor-pointer"
        >
          <ArrowDownRight className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Trigger Bearer Drop</span>
        </button>

        {/* Restore Link Button */}
        <button
          onClick={onRestoreLink}
          className="p-3.5 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/80 dark:bg-teal-950/50 hover:bg-teal-100/90 dark:hover:bg-teal-900/60 text-teal-950 dark:text-teal-200 font-bold text-xs flex items-center justify-center space-x-2.5 transition-all shadow-2xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          <span>Restore Primary 5G NR</span>
        </button>

      </div>

    </div>
  );
};

