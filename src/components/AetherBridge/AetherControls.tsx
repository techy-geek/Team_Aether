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
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm font-sans">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-cyan-700" />
          <h3 className="text-xs font-bold text-slate-800">
            RF Transmission & Bearer Controls
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Hardware Simulation Controls
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
        
        {/* PTT Trigger Button */}
        <button
          onClick={onTogglePtt}
          className={`p-3 rounded-lg border font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer ${
            data.pttActive
              ? 'bg-red-600 hover:bg-red-700 text-white border-red-700 ring-2 ring-red-400/50 animate-pulse'
              : 'bg-cyan-700 hover:bg-cyan-800 text-white border-cyan-800'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{data.pttActive ? 'Release PTT (Keyed)' : 'PTT Transmit'}</span>
        </button>

        {/* Inject Noise Button */}
        <button
          onClick={onToggleNoise}
          className={`p-3 rounded-lg border font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer ${
            data.noiseInjected
              ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
          }`}
        >
          <ZapOff className="w-4 h-4" />
          <span>{data.noiseInjected ? 'Clear Interference' : 'Inject RF Interference'}</span>
        </button>

        {/* Drop 5G Link Button */}
        <button
          onClick={onDrop5gLink}
          className="p-3 rounded-lg border border-slate-300 bg-slate-100 hover:bg-amber-50 hover:border-amber-300 text-slate-800 hover:text-amber-900 font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
        >
          <ArrowDownRight className="w-4 h-4 text-amber-600" />
          <span>Trigger Bearer Drop</span>
        </button>

        {/* Restore Link Button */}
        <button
          onClick={onRestoreLink}
          className="p-3 rounded-lg border border-cyan-300 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-cyan-700" />
          <span>Restore Primary 5G NR</span>
        </button>

      </div>

    </div>
  );
};
