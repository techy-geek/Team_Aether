import React from 'react';
import { Radio } from 'lucide-react';
import type { AetherBridgeData, SpectrumPoint } from '../../types/simulation';
import { CommunicationPipeline } from './CommunicationPipeline';
import { SpectrumChart } from './SpectrumChart';
import { AudioOscilloscope } from './AudioOscilloscope';
import { LatencyBudget } from './LatencyBudget';
import { LinkHealth } from './LinkHealth';
import { AetherControls } from './AetherControls';

interface AetherBridgePanelProps {
  aetherData: AetherBridgeData;
  spectrumData: SpectrumPoint[];
  onTogglePtt: () => void;
  onToggleNoise: () => void;
  onDrop5gLink: () => void;
  onRestoreLink: () => void;
}

export const AetherBridgePanel: React.FC<AetherBridgePanelProps> = ({
  aetherData,
  spectrumData,
  onTogglePtt,
  onToggleNoise,
  onDrop5gLink,
  onRestoreLink,
}) => {
  return (
    <div className="space-y-4 font-sans">
      
      {/* Top Status Header Banner */}
      <div className={`p-3.5 rounded-lg border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 ${
        aetherData.linkHealthy
          ? 'bg-cyan-50 text-cyan-900 border-cyan-300'
          : 'bg-amber-50 text-amber-900 border-amber-300'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/80 rounded-lg border border-current">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm tracking-tight text-slate-900 font-sans">
                AetherBridge — Emergency Tactical Voice Relay
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-white/80 font-semibold border border-current text-slate-800 font-mono">
                155.700 MHz
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5 text-slate-700">
              End-to-end tactical voice bridge connecting field VHF transceivers to 5G EOC dispatch.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs shrink-0 font-sans">
          <div className="bg-white/80 px-3 py-1.5 rounded-lg border border-current text-center">
            <span className="text-xs text-slate-500 block">Bearer Link</span>
            <span className="font-bold text-sm text-cyan-900">{aetherData.activeBearer}</span>
          </div>
          <div className="bg-white/80 px-3 py-1.5 rounded-lg border border-current text-center">
            <span className="text-xs text-slate-500 block">Link State</span>
            <span className="font-bold text-sm text-emerald-800">
              {aetherData.linkHealthy ? 'Healthy' : 'Degraded'}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Pipeline */}
      <CommunicationPipeline data={aetherData} />

      {/* RF Spectrum Chart */}
      <SpectrumChart
        data={spectrumData}
        aetherData={aetherData}
      />

      {/* Real-Time Audio Oscilloscope Waveform & Modulation Scope */}
      <AudioOscilloscope data={aetherData} />

      {/* Interactive Controls */}
      <AetherControls
        data={aetherData}
        onTogglePtt={onTogglePtt}
        onToggleNoise={onToggleNoise}
        onDrop5gLink={onDrop5gLink}
        onRestoreLink={onRestoreLink}
      />

      {/* Latency Budget */}
      <LatencyBudget data={aetherData} />

      {/* Multi-Bearer Link Health */}
      <LinkHealth bearers={aetherData.bearers} />

    </div>
  );
};
