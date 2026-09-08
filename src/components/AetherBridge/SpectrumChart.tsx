import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Radio, Volume2, VolumeX, Mic } from 'lucide-react';
import type { SpectrumPoint, AetherBridgeData } from '../../types/simulation';

interface SpectrumChartProps {
  data: SpectrumPoint[];
  aetherData: AetherBridgeData;
}

export const SpectrumChart: React.FC<SpectrumChartProps> = ({
  data,
  aetherData,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-4 font-sans">
      
      {/* Spectrum Top Status Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3">
        
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-cyan-700" />
          <div>
            <h3 className="text-xs font-bold text-slate-800">
              RF Spectrum Analyzer & Carrier Detect
            </h3>
            <span className="text-xs text-slate-500">
              VHF Emergency Band: 155.700 MHz &bull; 2.0 MSPS IQ Sample Rate
            </span>
          </div>
        </div>

        {/* Telemetry Status Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Carrier Detected</span>
          </div>

          <div className={`px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 font-semibold ${
            aetherData.squelchOpen
              ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {aetherData.squelchOpen ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Squelch: {aetherData.squelchOpen ? 'Open' : 'Closed'}</span>
          </div>

          <div className={`px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 font-semibold ${
            aetherData.pttActive
              ? 'bg-red-600 text-white border-red-700 animate-pulse'
              : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}>
            <Mic className="w-3.5 h-3.5" />
            <span>PTT: {aetherData.pttActive ? 'Active' : 'Standby'}</span>
          </div>

        </div>

      </div>

      {/* Spectrum Chart Container (Light Theme) */}
      <div className="w-full h-[280px] bg-slate-50/70 rounded-lg p-2.5 relative border border-slate-200 shadow-inner">
        
        {/* PTT Active Visual Overlay */}
        {aetherData.pttActive && (
          <div className="absolute top-4 right-4 bg-red-100 border border-red-300 text-red-800 px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-2 z-10 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Transmitting Emergency Voice Stream</span>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="spectrumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={aetherData.noiseInjected ? "#ea580c" : "#0284c7"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={aetherData.noiseInjected ? "#ef4444" : "#0369a1"} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            <XAxis
              dataKey="frequency"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
              domain={['dataMin', 'dataMax']}
              label={{ value: 'Frequency (MHz)', position: 'insideBottom', offset: -5, fill: '#475569', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
            />

            <YAxis
              domain={[-120, -10]}
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
              label={{ value: 'Power (dBFS)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                color: '#0284c7',
                fontSize: '11px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
            />

            {/* Squelch Threshold Line */}
            <ReferenceLine
              y={aetherData.squelchThreshold}
              stroke="#d97706"
              strokeDasharray="3 3"
              label={{ value: `Squelch Threshold (${aetherData.squelchThreshold} dBFS)`, fill: '#b45309', fontSize: 9, position: 'top', fontFamily: 'Inter, sans-serif' }}
            />

            {/* Carrier Center Frequency Marker Line */}
            <ReferenceLine
              x={155.700}
              stroke="#0284c7"
              strokeWidth={2}
              label={{ value: '155.700 MHz (Carrier)', fill: '#0369a1', fontSize: 10, fontWeight: 'bold', position: 'top', fontFamily: 'Inter, sans-serif' }}
            />

            <Area
              type="monotone"
              dataKey="power"
              name="Power (dBFS)"
              stroke={aetherData.noiseInjected ? '#ea580c' : '#0284c7'}
              strokeWidth={2}
              fill="url(#spectrumGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
