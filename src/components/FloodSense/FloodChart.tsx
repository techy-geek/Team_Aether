import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { HydrographPoint } from '../../types/simulation';

interface FloodChartProps {
  data: HydrographPoint[];
  currentStage: number;
  predictedPeak: number;
  timeToPeak: string;
  rainfall6h: number;
}

export const FloodChart: React.FC<FloodChartProps> = ({
  data,
  currentStage,
  predictedPeak,
  timeToPeak,
  rainfall6h,
}) => {
  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col gap-3.5 font-sans transition-colors duration-200">

      {/* Primary Operational Metric Blocks with subtle gradient depth */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-blue-950/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/70 text-center shadow-2xs">
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">CURRENT STAGE</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{currentStage.toFixed(2)} m</span>
        </div>
        <div className="bg-gradient-to-br from-sky-50/80 to-blue-50/50 dark:from-sky-950/50 dark:to-blue-950/40 p-3.5 rounded-xl border border-sky-200/80 dark:border-sky-800/60 text-center shadow-2xs">
          <span className="text-[10.5px] text-sky-700 dark:text-sky-400 font-semibold uppercase tracking-wider block mb-0.5">PREDICTED PEAK</span>
          <span className="text-2xl font-bold font-mono text-sky-900 dark:text-sky-300">{predictedPeak.toFixed(2)} m</span>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-blue-950/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/70 text-center shadow-2xs">
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">TIME TO PEAK</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{timeToPeak}</span>
        </div>
        <div className="bg-gradient-to-br from-cyan-50/70 to-slate-50 dark:from-cyan-950/50 dark:to-slate-800/60 p-3.5 rounded-xl border border-cyan-200/80 dark:border-cyan-800/60 text-center shadow-2xs">
          <span className="text-[10.5px] text-cyan-800 dark:text-cyan-400 font-semibold uppercase tracking-wider block mb-0.5">RAINFALL (6H ACCUM.)</span>
          <span className="text-2xl font-bold font-mono text-cyan-950 dark:text-cyan-200">{rainfall6h} mm</span>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="w-full h-[320px] relative bg-slate-50/50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 p-2.5 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="rainfallBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />

            <XAxis
              dataKey="time"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            />

            {/* Primary Y Axis - River Stage (m) */}
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={[0, 6.0]}
              tickCount={7}
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              label={{ value: 'Stage (m)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
            />

            {/* Secondary Y Axis - Rainfall (mm) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 200]}
              tick={{ fill: '#0284c7', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              label={{ value: 'Rain (mm)', angle: 90, position: 'insideRight', fill: '#0284c7', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
            />

            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', paddingTop: '6px' }}
            />

            {/* Threshold Reference Lines */}
            <ReferenceLine
              yAxisId="left"
              y={3.5}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{ value: 'WARNING THRESHOLD (3.5m)', fill: '#f59e0b', fontSize: 10, position: 'top', fontFamily: 'Inter, sans-serif' }}
            />
            <ReferenceLine
              yAxisId="left"
              y={4.8}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: 'DANGER THRESHOLD (4.8m)', fill: '#ef4444', fontSize: 10, position: 'top', fontFamily: 'Inter, sans-serif' }}
            />

            {/* NOW Reference Line */}
            <ReferenceLine
              yAxisId="left"
              x="NOW"
              stroke="#0ea5e9"
              strokeWidth={2}
              label={{ value: 'NOW', fill: '#38bdf8', fontSize: 10, fontWeight: 'bold', position: 'top', fontFamily: 'Inter, sans-serif' }}
            />

            {/* Rainfall Bars */}
            <Bar
              yAxisId="right"
              dataKey="rainfall"
              name="Rainfall (mm)"
              fill="url(#rainfallBar)"
              barSize={14}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />

            {/* Confidence Envelope Bounds */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="upperConfidence"
              name="Upper 95% CI"
              stroke="transparent"
              fill="url(#confidenceBand)"
              isAnimationActive={false}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="lowerConfidence"
              name="Lower 95% CI"
              stroke="transparent"
              fill="transparent"
              isAnimationActive={false}
            />

            {/* Historical River Stage Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="historicalStage"
              name="Historical Stage"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#38bdf8' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />

            {/* Predicted River Stage Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="predictedStage"
              name="LSTM + RF Ensemble Forecast"
              stroke="#0284c7"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#0284c7' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

