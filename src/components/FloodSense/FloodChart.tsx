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
import type { HydrographPoint, RiskLevel } from '../../types/simulation';

interface FloodChartProps {
  data: HydrographPoint[];
  currentStage: number;
  predictedPeak: number;
  timeToPeak: string;
  rainfall6h: number;
  currentRisk?: RiskLevel;
}

export const FloodChart: React.FC<FloodChartProps> = ({
  data,
  currentStage,
  predictedPeak,
  timeToPeak,
  rainfall6h,
  currentRisk = 'SAFE',
}) => {
  const stageLevels: { level: RiskLevel; label: string; range: string; style: string; activeStyle: string }[] = [
    {
      level: 'SAFE',
      label: 'SAFE STAGE',
      range: '< 3.20 m',
      style: 'bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50',
      activeStyle: 'bg-emerald-600 dark:bg-emerald-600 text-white border-emerald-700 dark:border-emerald-500 shadow-xs font-semibold',
    },
    {
      level: 'WATCH',
      label: 'WATCH STAGE',
      range: '3.20 - 4.00 m',
      style: 'bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-amber-500/50',
      activeStyle: 'bg-amber-600 dark:bg-amber-600 text-white border-amber-700 dark:border-amber-500 shadow-xs font-semibold',
    },
    {
      level: 'WARNING',
      label: 'WARNING STAGE',
      range: '4.00 - 4.80 m',
      style: 'bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-orange-500/50',
      activeStyle: 'bg-orange-600 dark:bg-orange-600 text-white border-orange-700 dark:border-orange-500 shadow-xs font-semibold',
    },
    {
      level: 'CRITICAL',
      label: 'CRITICAL STAGE',
      range: '> 4.80 m',
      style: 'bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-red-500/50',
      activeStyle: 'bg-red-600 dark:bg-red-600 text-white border-red-700 dark:border-red-500 shadow-xs font-semibold',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3 font-sans transition-colors duration-200">

      {/* Stage Thresholds 4-Tab Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {stageLevels.map((item) => {
          const isCurrent = item.level === currentRisk;
          return (
            <div
              key={item.level}
              className={`px-3 py-2 rounded-lg border flex flex-col items-center justify-center text-center transition-colors duration-150 ${
                isCurrent ? item.activeStyle : item.style
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider block">
                  {item.label}
                </span>
                {isCurrent && (
                  <span className="text-[8.5px] font-bold bg-black/20 dark:bg-black/30 text-white px-1.5 py-0.2 rounded uppercase">
                    Active
                  </span>
                )}
              </div>
              <span className="text-sm sm:text-base font-bold font-mono">
                {item.range}
              </span>
            </div>
          );
        })}
      </div>

      {/* Primary Operational Metric Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/80 text-center shadow-2xs">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">CURRENT STAGE</span>
          <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">{currentStage.toFixed(2)} m</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/80 text-center shadow-2xs">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">PREDICTED PEAK</span>
          <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">{predictedPeak.toFixed(2)} m</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/80 text-center shadow-2xs">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">TIME TO PEAK</span>
          <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">{timeToPeak}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/80 text-center shadow-2xs">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">RAINFALL (6H ACCUM.)</span>
          <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">{rainfall6h} mm</span>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="w-full h-[260px] sm:h-[300px] lg:h-[340px] xl:h-[380px] relative bg-slate-50/50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 p-2 sm:p-2.5 shadow-inner">
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

