import React from 'react';
import { Cpu, GitBranch, Layers, CheckCircle2, Database } from 'lucide-react';
import type { ModelMetrics, RiskLevel } from '../../types/simulation';

interface ModelCardsProps {
  lstmModel: ModelMetrics;
  randomForestModel: ModelMetrics;
  ensembleConfidence: number;
  ensembleRisk: RiskLevel;
}

export const ModelCards: React.FC<ModelCardsProps> = ({
  lstmModel,
  randomForestModel,
  ensembleConfidence,
  ensembleRisk,
}) => {
  return (
    <div className="space-y-2.5 font-sans">
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
          <span>CWC Trained AI Inference Engine</span>
        </span>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md">
          Dataset: 203,804 Records (2021-2025)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">

        {/* Catchment Sequence Model Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Catchment Routing Regressor
                </h4>
              </div>
              <span className="bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full">
                Weight: {lstmModel.weight}%
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Multi-Horizon Sequence Model &bull; R² = 0.9992
            </p>

            <div className="mt-3 bg-slate-50/80 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium block">Prediction</span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{lstmModel.prediction}</span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium block">Confidence</span>
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300">{lstmModel.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2.5">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Status: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">Trained</strong></span>
            </span>
            <span>RMSE: 0.042m</span>
          </div>
        </div>

        {/* Random Forest Classifier Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
                  <GitBranch className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Runoff Classifier (RF)
                </h4>
              </div>
              <span className="bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full">
                Weight: {randomForestModel.weight}%
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Decision Tree Ensemble &bull; Accuracy: 97.79%
            </p>

            <div className="mt-3 bg-slate-50/80 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium block">Prediction</span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{randomForestModel.prediction}</span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium block">Confidence</span>
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300">{randomForestModel.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2.5">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Status: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">Trained</strong></span>
            </span>
            <span>Trees: 500</span>
          </div>
        </div>

        {/* Ensemble Decision Card with Rich Gradient */}
        <div className="bg-gradient-to-br from-sky-50/90 via-white to-blue-50/50 dark:from-sky-950/50 dark:via-slate-900 dark:to-blue-950/30 text-slate-900 dark:text-slate-100 p-4 rounded-2xl border border-sky-300 dark:border-sky-700/60 shadow-xs flex flex-col justify-between ring-1 ring-sky-400/20 transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between border-b border-sky-200/80 dark:border-sky-800/60 pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-sky-600 text-white shadow-2xs">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-sky-950 dark:text-sky-300">
                  Ensemble Forecast
                </h4>
              </div>
              <span className="bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-700 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
                {ensembleConfidence}% Consensus
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">Forecast Level:</span>
              <span className={`text-sm font-bold px-3 py-0.5 rounded-full border ${ensembleRisk === 'SAFE' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60' :
                  ensembleRisk === 'WATCH' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800/60' :
                    ensembleRisk === 'WARNING' ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-400 border-orange-300 dark:border-orange-800/60' :
                      'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-300 dark:border-red-800/60 animate-pulse'
                }`}>
                {ensembleRisk}
              </span>
            </div>

            {/* Horizontal progress bar */}
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300 text-[11px]">
                <span>Consensus Confidence</span>
                <span className="font-bold font-mono text-sky-900 dark:text-sky-300">{ensembleConfidence}%</span>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden border border-slate-300/80 dark:border-slate-600 p-0.5">
                <div
                  className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${ensembleConfidence}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3.5 text-[11px] text-slate-500 dark:text-slate-400 border-t border-sky-200/80 dark:border-sky-800/60 pt-2.5 flex justify-between">
            <span>95% CI Error: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">±0.088m</strong></span>
            <span>CWC Calibrated</span>
          </div>
        </div>

      </div>
    </div>
  );
};
