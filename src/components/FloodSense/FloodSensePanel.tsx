import React, { useState } from 'react';
import type { FloodSenseData, HydrographPoint } from '../../types/simulation';
import { FloodControls } from './FloodControls';
import { FloodChart } from './FloodChart';
import { BasinMap } from './BasinMap';
import { ModelCards } from './ModelCards';
import { RiskLadder } from './RiskLadder';
import { Activity, Map } from 'lucide-react';

interface FloodSensePanelProps {
  floodData: FloodSenseData;
  hydrographData: HydrographPoint[];
  onRainfallChange: (val: number) => void;
  onRiverStageChange: (val: number) => void;
  onToggleSimulation: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export const FloodSensePanel: React.FC<FloodSensePanelProps> = ({
  floodData,
  hydrographData,
  onRainfallChange,
  onRiverStageChange,
  onToggleSimulation,
  onSpeedChange,
  onReset,
}) => {
  const [activeView, setActiveView] = useState<'CHART' | 'MAP' | 'DUAL'>('DUAL');

  return (
    <div className="space-y-3 font-sans">
      
      {/* Station Header Bar */}
      <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div>
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            FLOODSENSE — BASIN HYDROGRAPH & GIS MAP CONSOLE
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Station: SIL-CATCH-04 &bull; Barometric rain gauge & river stage telemetry stream
          </p>
        </div>

        {/* Console View Switcher */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs bg-slate-100 p-0.5 rounded border border-slate-200">
            <button
              onClick={() => setActiveView('CHART')}
              className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                activeView === 'CHART' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Hydrograph</span>
            </button>

            <button
              onClick={() => setActiveView('MAP')}
              className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                activeView === 'MAP' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>GIS Basin Map</span>
            </button>

            <button
              onClick={() => setActiveView('DUAL')}
              className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                activeView === 'DUAL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Dual View</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-xs font-mono ml-2">
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 font-sans">State:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded ${
              floodData.riskLevel === 'SAFE' ? 'bg-emerald-100 text-emerald-800' :
              floodData.riskLevel === 'WATCH' ? 'bg-amber-100 text-amber-900' :
              floodData.riskLevel === 'WARNING' ? 'bg-orange-100 text-orange-900' :
              'bg-red-100 text-red-900 animate-pulse'
            }`}>
              {floodData.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic View Panels */}
      {activeView === 'CHART' && (
        <FloodChart
          data={hydrographData}
          currentStage={floodData.currentStage}
          predictedPeak={floodData.predictedPeak}
          timeToPeak={floodData.timeToPeak}
          rainfall6h={floodData.rainfall6h}
        />
      )}

      {activeView === 'MAP' && (
        <BasinMap
          currentStage={floodData.currentStage}
          riskLevel={floodData.riskLevel}
        />
      )}

      {activeView === 'DUAL' && (
        <div className="space-y-3">
          <FloodChart
            data={hydrographData}
            currentStage={floodData.currentStage}
            predictedPeak={floodData.predictedPeak}
            timeToPeak={floodData.timeToPeak}
            rainfall6h={floodData.rainfall6h}
          />
          <BasinMap
            currentStage={floodData.currentStage}
            riskLevel={floodData.riskLevel}
          />
        </div>
      )}

      {/* Simulation Parameter Controls */}
      <FloodControls
        rainfall={floodData.rainfallOverride}
        riverStage={floodData.riverStageOverride}
        simulationRunning={floodData.simulationRunning}
        simulationSpeed={floodData.simulationSpeed}
        onRainfallChange={onRainfallChange}
        onRiverStageChange={onRiverStageChange}
        onToggleSimulation={onToggleSimulation}
        onSpeedChange={onSpeedChange}
        onReset={onReset}
      />

      {/* Model Cards */}
      <ModelCards
        lstmModel={floodData.lstmModel}
        randomForestModel={floodData.randomForestModel}
        ensembleConfidence={floodData.ensembleConfidence}
        ensembleRisk={floodData.riskLevel}
      />

      {/* Risk Escalation Ladder */}
      <RiskLadder currentRisk={floodData.riskLevel} />

    </div>
  );
};
