import React from 'react';
import { Play, Pause, RotateCcw, Sliders, CloudRain, Waves } from 'lucide-react';

interface FloodControlsProps {
  rainfall: number;
  riverStage: number;
  simulationRunning: boolean;
  simulationSpeed: number;
  onRainfallChange: (val: number) => void;
  onRiverStageChange: (val: number) => void;
  onToggleSimulation: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export const FloodControls: React.FC<FloodControlsProps> = ({
  rainfall,
  riverStage,
  simulationRunning,
  simulationSpeed,
  onRainfallChange,
  onRiverStageChange,
  onToggleSimulation,
  onSpeedChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm font-sans">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-cyan-700" />
          <h3 className="text-xs font-bold text-slate-800">
            Hydrological Forcing Controls
          </h3>
        </div>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
          Manual Telemetry Overrides
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Rainfall Intensity Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center space-x-1.5 font-semibold text-slate-700">
              <CloudRain className="w-4 h-4 text-cyan-600" />
              <span>Rainfall Intensity</span>
            </span>
            <span className="font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              {rainfall} mm / 6h
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="2"
            value={rainfall}
            onChange={(e) => onRainfallChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0 mm (Normal)</span>
            <span>100 mm (Heavy)</span>
            <span>200 mm (Extreme)</span>
          </div>
        </div>

        {/* River Stage Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center space-x-1.5 font-semibold text-slate-700">
              <Waves className="w-4 h-4 text-cyan-600" />
              <span>Base River Stage</span>
            </span>
            <span className="font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              {riverStage} m
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="6.0"
            step="0.05"
            value={riverStage}
            onChange={(e) => onRiverStageChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0.5 m (Baseline)</span>
            <span>3.5 m (Warning)</span>
            <span>6.0 m (Severe)</span>
          </div>
        </div>

        {/* Controls & Speed */}
        <div className="flex flex-col justify-between gap-2">
          <span className="text-xs font-semibold text-slate-700">
            Engine Controls
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleSimulation}
              className={`flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer ${
                simulationRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {simulationRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Start</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              className="flex items-center justify-center space-x-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center space-x-1 text-xs text-slate-500 justify-end pt-1 font-sans">
            <span>Speed:</span>
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  simulationSpeed === s
                    ? 'bg-cyan-700 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
