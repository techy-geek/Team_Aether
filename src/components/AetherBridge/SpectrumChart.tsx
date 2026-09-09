import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
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
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col gap-3.5 font-sans transition-colors duration-200">

      {/* Spectrum Top Status Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">

        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              RF Spectrum Analyzer & Carrier Detect
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              VHF Emergency Band: 155.700 MHz &bull; 2.0 MSPS IQ Sample Rate
            </span>
          </div>
        </div>

        {/* Telemetry Status Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">

          <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1 rounded-full flex items-center space-x-1.5 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Carrier Detected</span>
          </div>

          <div className={`px-3 py-1 rounded-full border flex items-center space-x-1.5 font-semibold text-[11px] ${aetherData.squelchOpen
              ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/50'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
            }`}>
            {aetherData.squelchOpen ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Squelch: {aetherData.squelchOpen ? 'Open' : 'Closed'}</span>
          </div>

          <div className={`px-3 py-1 rounded-full border flex items-center space-x-1.5 font-semibold text-[11px] ${aetherData.pttActive
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-700 animate-pulse shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}>
            <Mic className="w-3.5 h-3.5" />
            <span>PTT: {aetherData.pttActive ? 'Active' : 'Standby'}</span>
          </div>

        </div>

      </div>

      {/* Spectrum Chart Container */}
      <div className="w-full h-[220px] sm:h-[260px] lg:h-[290px] xl:h-[320px] bg-slate-50/50 dark:bg-slate-950/60 rounded-xl p-2 sm:p-2.5 relative border border-slate-200/80 dark:border-slate-800 shadow-inner">

        {/* PTT Active Visual Overlay */}
        {aetherData.pttActive && (
          <div className="absolute top-4 right-4 bg-red-50/95 dark:bg-red-950/90 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-2 z-10 animate-pulse shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Transmitting Emergency Voice Stream</span>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="spectrumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={aetherData.noiseInjected ? "#ea580c" : "#0d9488"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={aetherData.noiseInjected ? "#ef4444" : "#0284c7"} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />

            <XAxis
              dataKey="frequency"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              domain={['dataMin', 'dataMax']}
              label={{ value: 'Frequency (MHz)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
            />

            <YAxis
              domain={[-120, -10]}
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              label={{ value: 'Power (dBFS)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
            />



            {/* Squelch Threshold Line */}
            <ReferenceLine
              y={aetherData.squelchThreshold}
              stroke="#d97706"
              strokeDasharray="3 3"
              label={{ value: `Squelch Threshold (${aetherData.squelchThreshold} dBFS)`, fill: '#f59e0b', fontSize: 9, position: 'top', fontFamily: 'Inter, sans-serif' }}
            />

            {/* Carrier Center Frequency Marker Line */}
            <ReferenceLine
              x={155.700}
              stroke="#0d9488"
              strokeWidth={2}
              label={{ value: '155.700 MHz (Carrier)', fill: '#2dd4bf', fontSize: 10, fontWeight: 'bold', position: 'top', fontFamily: 'Inter, sans-serif' }}
            />

            <Area
              type="monotone"
              dataKey="power"
              name="Power (dBFS)"
              stroke={aetherData.noiseInjected ? '#ea580c' : '#0d9488'}
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

