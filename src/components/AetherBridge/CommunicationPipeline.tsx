import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { AetherBridgeData } from '../../types/simulation';

interface CommunicationPipelineProps {
  data: AetherBridgeData;
}

export const CommunicationPipeline: React.FC<CommunicationPipelineProps> = ({ data }) => {
  const stages = [
    { id: '1', name: 'VHF', value: '155.700 MHz', status: 'healthy' },
    { id: '2', name: 'SDR', value: '2 MSPS IQ', status: 'healthy' },
    { id: '3', name: 'DSP', value: 'NBFM Demod', status: 'healthy' },
    { id: '4', name: 'SQUELCH', value: data.noiseInjected ? 'Closed' : '-72 dBFS', status: data.squelchOpen ? 'healthy' : 'warning' },
    { id: '5', name: 'SIP/RTP', value: 'G.711 A-Law', status: 'healthy' },
    { id: '6', name: '5G NR', value: data.activeBearer, status: data.linkHealthy ? 'healthy' : 'warning' },
    { id: '7', name: 'EOC', value: 'Connected', status: 'healthy' },
  ];

  return (
    <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs flex flex-col gap-3 font-sans">
      
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          TACTICAL SIGNAL PROCESSING PIPELINE
        </h3>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
          7 STAGES CONNECTED
        </span>
      </div>

      {/* Connected Processing Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stages.map((stg, index) => {
          const isLast = index === stages.length - 1;
          const isWarning = stg.status === 'warning';

          return (
            <div key={stg.id} className="relative flex flex-col items-center">
              
              {/* Stage Box */}
              <div className={`w-full p-2.5 rounded border flex flex-col items-center justify-between text-center transition-all ${
                isWarning
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-white'
              }`}>
                
                <div className="flex items-center justify-between w-full mb-1 text-[10px]">
                  <span className="font-mono text-slate-400">#0{stg.id}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isWarning ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                </div>

                <h4 className="font-bold text-xs font-mono tracking-tight text-slate-900 mb-1">
                  {stg.name}
                </h4>

                <span className="text-[10px] font-mono text-cyan-800 bg-cyan-50 px-1 rounded border border-cyan-100 truncate max-w-full">
                  {stg.value}
                </span>
              </div>

              {/* Connector Arrow */}
              {!isLast && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Pipeline Status Indicator */}
      <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden relative border border-slate-200">
        <div className={`h-full bg-cyan-600 transition-all duration-300 ${
          data.pttActive ? 'animate-pulse' : 'w-full'
        }`} />
      </div>

    </div>
  );
};
