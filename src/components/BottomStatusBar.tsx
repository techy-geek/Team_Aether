import React from 'react';

export const BottomStatusBar: React.FC = () => {
  return (
    <footer className="mt-2 font-sans">
      {/* Mission Footer Attribution Bar */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between text-xs gap-2 transition-colors duration-200">
        <div className="flex items-center space-x-2">
          <span className="font-bold bg-gradient-to-r from-sky-500 to-teal-400 bg-clip-text text-transparent text-xs">SENTINELBRIDGE</span>
          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium">Smart India Hackathon 2026</span>
          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
          <span className="text-slate-500 dark:text-slate-500">National Institute of Technology Silchar</span>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
};

