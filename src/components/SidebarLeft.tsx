import React, { useState } from 'react';
import { Waves, Radio, Terminal, ChevronDown } from 'lucide-react';
import type { ActiveTab, FloodSenseData, AetherBridgeData, SystemEvent } from '../types/simulation';
import type { StormScenario } from '../models/floodMlEngine';
import { FloodControls } from './FloodSense/FloodControls';
import { AetherControls } from './AetherBridge/AetherControls';
import { LatencyBudget } from './AetherBridge/LatencyBudget';

interface SidebarLeftProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  floodData: FloodSenseData;
  aetherData: AetherBridgeData;
  events: SystemEvent[];
  selectedScenarioId?: string;
  stormScenarios?: StormScenario[];
  onSelectScenario?: (id: string) => void;
  onRainfallChange: (val: number) => void;
  onRiverStageChange: (val: number) => void;
  onToggleSimulation: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onTogglePtt: () => void;
  onToggleNoise: () => void;
  onDrop5gLink: () => void;
  onRestoreLink: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  activeTab,
  onSelectTab,
  floodData,
  aetherData,
  events,
  selectedScenarioId,
  stormScenarios,
  onSelectScenario,
  onRainfallChange,
  onRiverStageChange,
  onToggleSimulation,
  onSpeedChange,
  onReset,
  onTogglePtt,
  onToggleNoise,
  onDrop5gLink,
  onRestoreLink,
}) => {
  const [showTelemetry, setShowTelemetry] = useState<boolean>(false);

  const getSeverityDot = (severity: SystemEvent['severity']) => {
    switch (severity) {
      case 'success':
        return <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />;
      case 'warning':
        return <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />;
      case 'critical':
        return <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" />;
      default:
        return <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1 shadow-[0_0_6px_rgba(14,165,233,0.8)]" />;
    }
  };

  return (
    <aside className="w-full lg:w-[280px] xl:w-[320px] 2xl:w-[340px] shrink-0 flex flex-col gap-3 font-sans">

      {/* Subsystems Header */}
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-between transition-colors duration-200">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          OPERATIONAL SUBSYSTEMS
        </span>
        <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/40 dark:shadow-[0_0_8px_rgba(16,185,129,0.15)]">
          2/2 ONLINE
        </span>
      </div>

      {/* Subsystem Quick Selector Badges */}
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-2 transition-colors duration-200">
        <span className="text-[10.5px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          QUICK NAVIGATION
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSelectTab('FLOODSENSE')}
            className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${activeTab === 'FLOODSENSE'
                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-500/60 text-sky-900 dark:text-cyan-300 ring-2 ring-sky-400/30 dark:shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 dark:hover:border-slate-700'
              }`}
          >
            <div className="flex items-center space-x-1.5 mb-0.5">
              <Waves className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
              <span className="font-bold text-xs">FloodSense</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">Stage: {floodData.currentStage.toFixed(2)}m</span>
          </button>

          <button
            onClick={() => onSelectTab('AETHERBRIDGE')}
            className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${activeTab === 'AETHERBRIDGE'
                ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-500/60 text-teal-900 dark:text-teal-300 ring-2 ring-teal-400/30 dark:shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 dark:hover:border-slate-700'
              }`}
          >
            <div className="flex items-center space-x-1.5 mb-0.5">
              <Radio className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="font-bold text-xs">AetherBridge</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block truncate">{aetherData.activeBearer}</span>
          </button>
        </div>
      </div>

      {/* Active Hardware / Hydrological Controls in Left Sidebar */}
      {activeTab === 'FLOODSENSE' ? (
        <FloodControls
          rainfall={floodData.rainfallOverride}
          riverStage={floodData.riverStageOverride}
          simulationRunning={floodData.simulationRunning}
          simulationSpeed={floodData.simulationSpeed}
          selectedScenarioId={selectedScenarioId}
          stormScenarios={stormScenarios}
          onSelectScenario={onSelectScenario}
          onRainfallChange={onRainfallChange}
          onRiverStageChange={onRiverStageChange}
          onToggleSimulation={onToggleSimulation}
          onSpeedChange={onSpeedChange}
          onReset={onReset}
        />
      ) : (
        <>
          <AetherControls
            data={aetherData}
            onTogglePtt={onTogglePtt}
            onToggleNoise={onToggleNoise}
            onDrop5gLink={onDrop5gLink}
            onRestoreLink={onRestoreLink}
          />
          <LatencyBudget data={aetherData} />
        </>
      )}

      {/* System Telemetry Log */}
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-200">
        <div
          onClick={() => setShowTelemetry(!showTelemetry)}
          className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-950/70 flex items-center justify-between border-b border-slate-200/90 dark:border-slate-800 cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-slate-600 dark:text-cyan-400" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              TELEMETRY LOG
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-transparent dark:border-slate-700">
              {events.length} LOGGED
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showTelemetry ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Collapsible Log Stream */}
        {showTelemetry ? (
          <div className="p-2.5 overflow-y-auto max-h-[360px] space-y-2 text-xs transition-all">
            {events.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No telemetry events logged yet.
              </div>
            ) : (
              events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/80 flex items-start space-x-2.5 text-[11px] leading-snug hover:bg-blue-50/30 dark:hover:bg-slate-900 transition-colors"
                >
                  {getSeverityDot(evt.severity)}
                  <div className="flex-1 min-w-0 font-mono">
                    <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-[10px] mb-1">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">{evt.timestamp}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-sans font-medium border border-transparent dark:border-slate-700">
                        {evt.module}
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-sans text-[11px] break-words">
                      {evt.message}
                    </p>
                  </div>
                </div>
              ))
            )}
            <button
              onClick={() => setShowTelemetry(false)}
              className="w-full py-1.5 text-center text-[10.5px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Click to collapse
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowTelemetry(true)}
            className="w-full p-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyan-400 bg-slate-50/40 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 cursor-pointer transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Click to expand</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </aside>
  );
};
