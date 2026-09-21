import React from 'react';
import { Play, Pause, RotateCcw, Sliders, CloudRain, Waves, Database, History } from 'lucide-react';
import type { StormScenario } from '../../models/floodMlEngine';

interface FloodControlsProps {
  rainfall: number;
  riverStage: number;
  simulationRunning: boolean;
  simulationSpeed: number;
  selectedScenarioId?: string;
  stormScenarios?: StormScenario[];
  onRainfallChange: (val: number) => void;
  onRiverStageChange: (val: number) => void;
  onSelectScenario?: (id: string) => void;
  onToggleSimulation: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export const FloodControls: React.FC<FloodControlsProps> = ({
  rainfall,
  riverStage,
  simulationRunning,
  simulationSpeed,
  selectedScenarioId = 'SCENARIO_DRY_BASELINE',
  stormScenarios = [],
  onRainfallChange,
  onRiverStageChange,
  onSelectScenario,
  onToggleSimulation,
  onSpeedChange,
  onReset,
}) => {
  return (
    <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] font-sans transition-colors duration-200 space-y-3.5">

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-sky-700 dark:text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Hydrological ML Controls
          </h3>
        </div>
        <span className="text-[10px] text-sky-700 dark:text-cyan-300 bg-sky-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full font-semibold border border-sky-200 dark:border-cyan-800 flex items-center gap-1">
          <Database className="w-2.5 h-2.5" />
          <span>CWC Trained</span>
        </span>
      </div>

      {/* Historical CWC Storm Preset Selector */}
      {stormScenarios.length > 0 && onSelectScenario && (
        <div className="space-y-1.5 bg-sky-50/50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-sky-200/60 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200">
              <History className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
              <span>Historical Storm Event</span>
            </span>
            <span className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">
              2021-2025 CWC Data
            </span>
          </div>
          <select
            value={selectedScenarioId}
            onChange={(e) => onSelectScenario(e.target.value)}
            className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value="CUSTOM">-- Custom Parameter Tuning --</option>
            {stormScenarios.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name} ({sc.rainfall6h} mm)
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">

        {/* Rainfall Intensity Slider */}
        <div className="space-y-2 bg-slate-50/70 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center space-x-1.5 font-semibold text-slate-700 dark:text-slate-200">
              <CloudRain className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Rainfall Intensity</span>
            </span>
            <span className="font-bold font-mono text-sky-800 dark:text-cyan-300 bg-sky-50 dark:bg-cyan-950/50 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-cyan-500/40 dark:shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              {rainfall} mm / 6h
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="1"
            value={rainfall}
            onChange={(e) => onRainfallChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-600 dark:accent-cyan-400"
          />
          <div className="flex justify-between text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">
            <span>0 mm (Dry)</span>
            <span>100 mm (Heavy)</span>
            <span>200 mm (Extreme)</span>
          </div>
        </div>

        {/* River Stage Slider */}
        <div className="space-y-2 bg-slate-50/70 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center space-x-1.5 font-semibold text-slate-700 dark:text-slate-200">
              <Waves className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Base River Stage</span>
            </span>
            <span className="font-bold font-mono text-sky-800 dark:text-cyan-300 bg-sky-50 dark:bg-cyan-950/50 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-cyan-500/40 dark:shadow-[0_0_10px_rgba(6,182,212,0.15)]">
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
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-600 dark:accent-cyan-400"
          />
          <div className="flex justify-between text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">
            <span>0.5 m (Baseline)</span>
            <span>3.5 m (Warning)</span>
            <span>6.0 m (Severe)</span>
          </div>
        </div>

        {/* Controls & Speed */}
        <div className="flex flex-col justify-between gap-2.5 bg-slate-50/70 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Engine Controls
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleSimulation}
              className={`flex-1 flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${simulationRunning
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                }`}
            >
              {simulationRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Engine</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Engine</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 justify-end pt-1 font-sans">
            <span className="text-[11px]">Speed:</span>
            <div className="flex bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
              {[1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`px-2 py-0.5 rounded-md text-xs font-mono font-medium transition-all ${simulationSpeed === s
                      ? 'bg-sky-600 text-white font-bold shadow-2xs dark:bg-cyan-600 dark:shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
