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
        return <Signal className="w-4 h-4" />;
      case 'LTE FALLBACK':
        return <Wifi className="w-4 h-4" />;
      case 'NTN SATELLITE':
        return <Globe className="w-4 h-4" />;
      default:
        return <Radio className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-3 font-sans">
      
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800">
          Multi-Bearer Link Status Matrix
        </h4>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          Auto Failover Online
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bearers.map((b) => {
          const isActive = b.active;
          return (
            <div
              key={b.name}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                isActive
                  ? 'bg-cyan-50 border-cyan-400 text-cyan-900 shadow-md ring-2 ring-cyan-400/30'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-200 text-slate-600'}`}>
                  {getIcon(b.name)}
                </div>
                <span className="flex items-center space-x-1 text-xs font-semibold">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    b.status === 'HEALTHY' || b.status === 'ACTIVE'
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-slate-400'
                  }`} />
                  <span>{b.status}</span>
                </span>
              </div>

              <div className="mt-2.5">
                <h5 className="font-bold text-xs tracking-tight">{b.name}</h5>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Est. Latency: {b.latency} ms
                </span>
              </div>

              {isActive && (
                <div className="mt-2 pt-1.5 border-t border-cyan-200 text-[11px] font-semibold text-cyan-800 flex items-center justify-between">
                  <span>Active Bearer</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
