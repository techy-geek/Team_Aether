import React from 'react';
import { Shield, Sun, Moon, Volume2, VolumeX, BellOff } from 'lucide-react';
import type { RiskLevel } from '../types/simulation';

interface HeaderProps {
  threatLevel: RiskLevel;
  currentTime: string;
  currentDate: string;
  simulationRunning: boolean;
  onToggleSimulation: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  alarmActive?: boolean;
  onSilenceAlarm?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  threatLevel,
  currentTime,
  currentDate,
  simulationRunning,
  onToggleSimulation,
  darkMode,
  onToggleDarkMode,
  soundEnabled = true,
  onToggleSound,
  alarmActive = false,
  onSilenceAlarm,
}) => {
  const getThreatBadge = (level: RiskLevel) => {
    switch (level) {
      case 'SAFE':
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60';
      case 'WATCH':
        return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60';
      case 'WARNING':
        return 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/60';
      case 'CRITICAL':
        return 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800/60 animate-pulse';
    }
  };

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-sans sticky top-0 z-50 shadow-xs transition-colors duration-200">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-2.5">

        {/* Left Console Title */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-sky-50 dark:bg-slate-800 text-sky-900 dark:text-sky-300 px-2.5 sm:px-3 py-1 rounded-xl shadow-2xs border border-sky-200/80 dark:border-slate-700/60">
            <Shield className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
            <span className="tracking-tight uppercase font-mono text-[11px] sm:text-xs font-bold">SENTINELBRIDGE</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 font-normal hidden xs:inline">|</span>
          <span className="text-slate-700 dark:text-slate-200 font-bold tracking-wider uppercase text-[10px] sm:text-[11px]">
            OPERATIONS CONSOLE
          </span>
          <span className="hidden lg:inline text-slate-300 dark:text-slate-700 font-normal">|</span>
          <span className="hidden lg:inline text-slate-500 dark:text-slate-400 text-[11px] font-medium">
            FloodSense + AetherBridge &bull; NIT Silchar
          </span>
        </div>

        {/* Right Status Indicators & Quick Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 font-sans text-xs w-full md:w-auto justify-between sm:justify-end">

          <div className="flex items-center space-x-1.5 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-[10.5px]">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold uppercase tracking-wider">ONLINE</span>
          </div>

          <div className={`flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border text-[9.5px] sm:text-[10.5px] font-bold ${getThreatBadge(threatLevel)}`}>
            <span className="text-slate-400 dark:text-slate-500 font-normal">RISK:</span>
            <span>{threatLevel}</span>
          </div>

          {/* Active Alert Silence/Acknowledge Button */}
          {alarmActive && onSilenceAlarm && (
            <button
              onClick={onSilenceAlarm}
              title="Acknowledge and silence the active acoustic alert"
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold text-[9.5px] sm:text-[10.5px] shadow-[0_0_18px_rgba(239,68,68,0.7)] ring-2 ring-red-300 dark:ring-red-400 animate-pulse cursor-pointer tracking-wider transition-all"
            >
              <BellOff className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>SILENCE</span>
            </button>
          )}

          <div className="font-mono bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-slate-800 dark:text-slate-200 text-[9.5px] sm:text-[10.5px] tracking-tight">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">{currentDate} </span>
            <span className="font-bold text-slate-900 dark:text-white">{currentTime}</span>
          </div>

          {/* Sound FX Toggle Button */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute Alert Sound FX' : 'Enable Alert Sound FX'}
              className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium transition-all cursor-pointer text-[10px] sm:text-[11px] shadow-2xs"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-500" />
                  <span className="font-semibold hidden sm:inline">AUDIO ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-400 hidden sm:inline">MUTED</span>
                </>
              )}
            </button>
          )}

          {/* Dark Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark HUD Mode'}
            className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium transition-all cursor-pointer text-[10px] sm:text-[11px] shadow-2xs"
          >
            {darkMode ? (
              <>
                <Sun className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
                <span className="font-semibold">LIGHT</span>
              </>
            ) : (
              <>
                <Moon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-indigo-500" />
                <span className="font-semibold">DARK</span>
              </>
            )}
          </button>

          {/* Telemetry Pause/Resume Button */}
          <button
            onClick={onToggleSimulation}
            className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer text-[10px] sm:text-[11px] shadow-2xs border border-slate-200 dark:border-slate-700"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${simulationRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>{simulationRunning ? 'LIVE' : 'PAUSED'}</span>
          </button>

        </div>
      </div>
    </header>
  );
};

