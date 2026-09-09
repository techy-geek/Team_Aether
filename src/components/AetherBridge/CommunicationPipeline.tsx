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
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col gap-3.5 font-sans transition-colors duration-200">
      
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          TACTICAL SIGNAL PROCESSING PIPELINE
        </h3>
        <span className="text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 font-semibold">
          7 STAGES CONNECTED
        </span>
      </div>

      {/* Connected Processing Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {stages.map((stg, index) => {
          const isLast = index === stages.length - 1;
          const isWarning = stg.status === 'warning';

          return (
            <div key={stg.id} className="relative flex flex-col items-center">
              
              {/* Stage Box */}
              <div className={`w-full p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                isWarning
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 shadow-2xs ring-1 ring-amber-400/20'
                  : 'bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900/80 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-2xs'
              }`}>
                
                <div className="flex items-center justify-between w-full mb-1.5 text-[10px]">
                  <span className="font-mono text-slate-400 dark:text-slate-500 font-semibold">#0{stg.id}</span>
                  <span className={`w-2 h-2 rounded-full ${isWarning ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                </div>

                <h4 className="font-bold text-xs font-mono tracking-tight text-slate-900 dark:text-white mb-1.5">
                  {stg.name}
                </h4>

                <span className="text-[10px] font-mono text-teal-900 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200/70 dark:border-teal-800/60 truncate max-w-full font-semibold">
                  {stg.value}
                </span>
              </div>

              {/* Connector Arrow */}
              {!isLast && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-600">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Pipeline Status Indicator */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative border border-slate-200 dark:border-slate-700 p-0.5">
        <div className={`h-full bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full transition-all duration-300 ${
          data.pttActive ? 'animate-pulse' : 'w-full'
        }`} />
      </div>

    </div>
  );
};

