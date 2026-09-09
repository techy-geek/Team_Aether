import React from 'react';
import { Signal, Radio, Wifi, Globe, ShieldCheck } from 'lucide-react';
import type { BearerStatus } from '../../types/simulation';

interface LinkHealthProps {
  bearers: BearerStatus[];
}

export const LinkHealth: React.FC<LinkHealthProps> = ({ bearers }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case '5G NR SA':
        return <Signal className="w-3.5 h-3.5" />;
      case 'LTE FALLBACK':
        return <Wifi className="w-3.5 h-3.5" />;
      case 'NTN SATELLITE':
        return <Globe className="w-3.5 h-3.5" />;
      default:
        return <Radio className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col gap-2.5 font-sans transition-colors duration-200">

      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          LINK STATUS MATRIX
        </h4>
        <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
          Auto Failover
        </span>
      </div>

      {/* Bearer List in Vertical Format */}
      <div className="flex flex-col gap-2">
        {bearers.map((b) => {
          const isActive = b.active;
          return (
            <div
              key={b.name}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${isActive
                  ? 'bg-gradient-to-r from-teal-50/90 via-white to-cyan-50/60 dark:from-teal-950/50 dark:via-slate-900 dark:to-cyan-950/40 border-teal-300 dark:border-teal-700/60 text-teal-950 dark:text-teal-200 shadow-2xs ring-1 ring-teal-400/30'
                  : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {getIcon(b.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h5 className="font-bold text-xs font-mono tracking-tight text-slate-900 dark:text-white truncate">{b.name}</h5>
                    {isActive && (
                      <span className="text-[9px] font-bold text-teal-700 dark:text-teal-400 bg-teal-100/70 dark:bg-teal-900/50 px-1.5 py-0.2 rounded-full flex items-center space-x-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>ACTIVE</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                    Latency: {b.latency} ms
                  </span>
                </div>
              </div>

              <span className="flex items-center space-x-1 text-[10.5px] font-semibold shrink-0">
                <span className={`w-2 h-2 rounded-full ${b.status === 'HEALTHY' || b.status === 'ACTIVE'
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-slate-400 dark:bg-slate-500'
                  }`} />
                <span className="text-[10px]">{b.status}</span>
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

