import React from 'react';
import { Cpu, GitBranch, Layers } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
      
      {/* LSTM Model Card */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-700" />
              <h4 className="font-bold text-xs text-slate-800">
                Catchment Routing LSTM
              </h4>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded">
              Weight: {lstmModel.weight}%
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Recurrent Hydrograph Sequence Model
          </p>

          <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-center">
            <div>
              <span className="text-xs text-slate-500 block">Prediction</span>
              <span className="text-xs font-bold text-amber-700">{lstmModel.prediction}</span>
            </div>
            <div className="border-l border-slate-200">
              <span className="text-xs text-slate-500 block">Confidence</span>
              <span className="text-xs font-bold text-cyan-700">{lstmModel.confidence}%</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
          <span>Status: <strong className="text-emerald-600 font-semibold">Active</strong></span>
          <span>Latency: 14 ms</span>
        </div>
      </div>

      {/* Random Forest Card */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-cyan-700" />
              <h4 className="font-bold text-xs text-slate-800">
                Runoff Classifier (RF)
              </h4>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded">
              Weight: {randomForestModel.weight}%
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Multi-Feature Decision Tree Ensemble
          </p>

          <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-center">
            <div>
              <span className="text-xs text-slate-500 block">Prediction</span>
              <span className="text-xs font-bold text-amber-700">{randomForestModel.prediction}</span>
            </div>
            <div className="border-l border-slate-200">
              <span className="text-xs text-slate-500 block">Confidence</span>
              <span className="text-xs font-bold text-cyan-700">{randomForestModel.confidence}%</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
          <span>Status: <strong className="text-emerald-600 font-semibold">Active</strong></span>
          <span>Trees: 500</span>
        </div>
      </div>

      {/* Ensemble Decision Light Theme Card */}
      <div className="bg-gradient-to-br from-cyan-50/80 to-white text-slate-900 p-4 rounded-lg border border-cyan-300 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-cyan-200 pb-2">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-700" />
              <h4 className="font-bold text-xs text-cyan-900">
                Ensemble Forecast
              </h4>
            </div>
            <span className="bg-cyan-100 text-cyan-800 border border-cyan-300 text-xs font-semibold px-2 py-0.5 rounded">
              Confidence {ensembleConfidence}%
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Forecast Level:</span>
            <span className={`text-base font-bold px-2.5 py-0.5 rounded ${
              ensembleRisk === 'SAFE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              ensembleRisk === 'WATCH' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
              ensembleRisk === 'WARNING' ? 'bg-orange-100 text-orange-900 border border-orange-300' :
              'bg-red-100 text-red-900 border border-red-400 animate-pulse'
            }`}>
              {ensembleRisk}
            </span>
          </div>

          {/* Horizontal progress bar */}
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Weighted Model Consensus</span>
              <span className="font-semibold text-cyan-900">{ensembleConfidence}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
              <div
                className="bg-cyan-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${ensembleConfidence}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500 border-t border-cyan-200 pt-2 flex justify-between">
          <span>Physics Backstop: <strong className="text-emerald-700 font-semibold">Active</strong></span>
          <span>Discharge Gated</span>
        </div>
      </div>

    </div>
  );
};
