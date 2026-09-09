import React from 'react';
import type { FloodSenseData, HydrographPoint } from '../../types/simulation';
import { FloodChart } from './FloodChart';

interface FloodSensePanelProps {
  floodData: FloodSenseData;
  hydrographData: HydrographPoint[];
}

export const FloodSensePanel: React.FC<FloodSensePanelProps> = ({
  floodData,
  hydrographData,
}) => {
  return (
    <div className="space-y-3.5 font-sans">

      {/* Main Catchment Hydrograph Chart */}
      <FloodChart
        data={hydrographData}
        currentStage={floodData.currentStage}
        predictedPeak={floodData.predictedPeak}
        timeToPeak={floodData.timeToPeak}
        rainfall6h={floodData.rainfall6h}
        currentRisk={floodData.riskLevel}
      />

    </div>
  );
};

