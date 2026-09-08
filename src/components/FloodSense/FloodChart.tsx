import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
    <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs flex flex-col gap-3 font-sans">
      
      {/* Primary Operational Metric Blocks (Clean 4-column 20-24px figures) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">CURRENT STAGE</span>
          <span className="text-2xl font-bold font-mono text-slate-900">{currentStage.toFixed(2)} m</span>
        </div>
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">PREDICTED PEAK</span>
          <span className="text-2xl font-bold font-mono text-cyan-800">{predictedPeak.toFixed(2)} m</span>
        </div>
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">TIME TO PEAK</span>
          <span className="text-2xl font-bold font-mono text-slate-900">{timeToPeak}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">RAINFALL (6H ACCUM.)</span>
          <span className="text-2xl font-bold font-mono text-slate-900">{rainfall6h} mm</span>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="w-full h-[320px] relative bg-white rounded border border-slate-200 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="rainfallBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            
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
              tick={{ fill: '#334155', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              label={{ value: 'Stage (m)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
            />
            
            {/* Secondary Y Axis - Rainfall (mm) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 200]}
              tick={{ fill: '#0284c7', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              label={{ value: 'Rain (mm)', angle: 90, position: 'insideRight', fill: '#0284c7', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '4px',
                color: '#0f172a',
                fontSize: '11px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
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
              label={{ value: 'WARNING THRESHOLD (3.5m)', fill: '#b45309', fontSize: 10, position: 'top', fontFamily: 'Inter, sans-serif' }}
            />
            <ReferenceLine
              yAxisId="left"
              y={4.8}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: 'DANGER THRESHOLD (4.8m)', fill: '#b91c1c', fontSize: 10, position: 'top', fontFamily: 'Inter, sans-serif' }}
            />
            
            {/* NOW Reference Line */}
            <ReferenceLine
              yAxisId="left"
              x="NOW"
              stroke="#0ea5e9"
              strokeWidth={2}
              label={{ value: 'NOW', fill: '#0284c7', fontSize: 10, fontWeight: 'bold', position: 'top', fontFamily: 'Inter, sans-serif' }}
            />

            {/* Rainfall Bars */}
            <Bar
              yAxisId="right"
              dataKey="rainfall"
              name="Rainfall (mm)"
              fill="url(#rainfallBar)"
              barSize={14}
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
              fill="#ffffff"
              isAnimationActive={false}
            />

            {/* Historical River Stage Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="historicalStage"
              name="Historical Stage"
              stroke="#0f172a"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#0f172a' }}
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
