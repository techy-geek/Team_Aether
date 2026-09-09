import React from 'react';
import type { AetherBridgeData, SpectrumPoint } from '../../types/simulation';
import { AudioOscilloscope } from './AudioOscilloscope';
import { SpectrumChart } from './SpectrumChart';

interface AetherBridgePanelProps {
  aetherData: AetherBridgeData;
  spectrumData: SpectrumPoint[];
}

export const AetherBridgePanel: React.FC<AetherBridgePanelProps> = ({
  aetherData,
  spectrumData,
}) => {
  return (
    <div className="space-y-3.5 font-sans">

      {/* Real-Time Audio Oscilloscope Waveform & Modulation Scope */}
      <AudioOscilloscope data={aetherData} />

      {/* RF Spectrum Chart */}
      <SpectrumChart
        data={spectrumData}
        aetherData={aetherData}
      />

    </div>
  );
};

