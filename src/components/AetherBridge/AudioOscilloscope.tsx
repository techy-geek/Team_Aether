import React, { useEffect, useRef, useState } from 'react';
import { Activity, Mic, Zap } from 'lucide-react';
import type { AetherBridgeData } from '../../types/simulation';

interface AudioOscilloscopeProps {
  data: AetherBridgeData;
}

export const AudioOscilloscope: React.FC<AudioOscilloscopeProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scopeMode, setScopeMode] = useState<'time' | 'fft' | 'envelope'>('time');
  const [gain, setGain] = useState<number>(1.2);
  const [timebase, setTimebase] = useState<number>(1);
  const [agcEnabled, setAgcEnabled] = useState<boolean>(true);

  // Animation frame loop for continuous realistic voice oscilloscope rendering
  useEffect(() => {
    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const isDark = document.documentElement.classList.contains('dark');

      // Clear background (SCADA crisp canvas)
      ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Draw Oscilloscope Graticule (Grid Lines)
      ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.lineWidth = 1;

      // Vertical divisions
      const vDivs = 10;
      for (let i = 0; i <= vDivs; i++) {
        const x = (i / vDivs) * width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal divisions
      const hDivs = 6;
      for (let j = 0; j <= hDivs; j++) {
        const y = (j / hDivs) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center crosshair axis
      ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Waveform Trace
      ctx.beginPath();
      const points = 300;

      phase += 0.08 * timebase;

      if (scopeMode === 'time') {
        // TIME DOMAIN OSCILLOSCOPE
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = data.pttActive
          ? data.noiseInjected
            ? '#f97316' // Amber-orange if noisy voice
            : '#38bdf8' // Bright Cyan-Blue if clean voice
          : data.squelchOpen
            ? '#64748b' // Squelch noise
            : '#475569'; // Idle quiet line

        for (let i = 0; i < points; i++) {
          const x = (i / (points - 1)) * width;
          const t = (i / points) * 12 * timebase + phase;

          let amp = 0;

          if (data.pttActive) {
            // Complex speech formant harmonics (fundamental + 3rd + 5th + modulation envelope)
            const f1 = Math.sin(t * 1.8) * 0.45;
            const f2 = Math.sin(t * 3.6 + 0.4) * 0.28;
            const f3 = Math.sin(t * 7.2 + 1.1) * 0.18;
            const voiceMod = Math.sin(t * 0.4) * 0.3 + 0.7; // speech envelope variation
            amp = (f1 + f2 + f3) * voiceMod * (agcEnabled ? 1.1 : gain);

            if (data.noiseInjected) {
              // High frequency RF hash
              amp += (Math.random() - 0.5) * 0.55;
            }
          } else if (data.squelchOpen) {
            // Squelch open background RF static
            amp = (Math.random() - 0.5) * 0.25;
          } else {
            // Idle baseline subtle thermal noise
            amp = (Math.sin(t * 0.5) * 0.02) + (Math.random() - 0.5) * 0.015;
          }

          // Scale to canvas pixels
          const maxAmpPixels = (height / 2) * 0.85;
          const y = centerY - amp * maxAmpPixels;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

      } else if (scopeMode === 'fft') {
        // AUDIO SPECTRUM BARS (300 Hz to 3400 Hz Voice Band)
        const barCount = 32;
        const barWidth = (width / barCount) - 3;

        for (let b = 0; b < barCount; b++) {
          const bx = b * (barWidth + 3) + 2;
          let barHeightPercent = 0;

          if (data.pttActive) {
            // Formant peaks around bar 4-12 (300-1200 Hz speech core)
            const speechProfile = Math.exp(-Math.pow((b - 8) / 6, 2)) * 0.85 + Math.exp(-Math.pow((b - 20) / 5, 2)) * 0.5;
            const dynamicJitter = Math.sin(phase * 2 + b) * 0.15;
            barHeightPercent = Math.max(0.05, Math.min(0.95, (speechProfile + dynamicJitter) * (data.noiseInjected ? 1.2 : 1.0)));
          } else if (data.squelchOpen) {
            barHeightPercent = 0.15 + Math.random() * 0.2;
          } else {
            barHeightPercent = 0.03 + Math.random() * 0.02;
          }

          const barH = barHeightPercent * (height - 30);
          const by = height - barH - 10;

          ctx.fillStyle = data.pttActive
            ? data.noiseInjected ? '#f97316' : '#38bdf8'
            : isDark ? '#475569' : '#94a3b8';
          ctx.fillRect(bx, by, barWidth, barH);
        }

      } else {
        // ENVELOPE / VOWEL MODULATION (RMS ENERGY)
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#14b8a6';
        ctx.fillStyle = 'rgba(20, 184, 166, 0.15)';

        ctx.beginPath();
        for (let i = 0; i < points; i++) {
          const x = (i / (points - 1)) * width;
          const t = (i / points) * 6 + phase * 0.5;
          const env = data.pttActive
            ? Math.abs(Math.sin(t * 1.5) * Math.cos(t * 0.5)) * (height * 0.38) + 10
            : 4;

          const y1 = centerY - env;
          if (i === 0) ctx.moveTo(x, y1);
          else ctx.lineTo(x, y1);
        }

        for (let i = points - 1; i >= 0; i--) {
          const x = (i / (points - 1)) * width;
          const t = (i / points) * 6 + phase * 0.5;
          const env = data.pttActive
            ? Math.abs(Math.sin(t * 1.5) * Math.cos(t * 0.5)) * (height * 0.38) + 10
            : 4;

          const y2 = centerY + env;
          ctx.lineTo(x, y2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [data.pttActive, data.noiseInjected, data.squelchOpen, scopeMode, gain, timebase, agcEnabled]);

  // Audio VU Level in dB
  const vuLevel = data.pttActive
    ? data.noiseInjected ? -4 : -8
    : data.squelchOpen ? -26 : -54;

  const vuPercent = Math.min(100, Math.max(0, ((vuLevel + 60) / 60) * 100));

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col gap-3.5 font-sans transition-colors duration-200">

      {/* Scope Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              TACTICAL AUDIO OSCILLOSCOPE & VOICE MODULATION
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Time-Domain Baseband Voice &bull; Opus Wideband Codec (16 kHz / 24 kbps)
          </span>
        </div>

        {/* State Badges & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-[11px]">
            <button
              onClick={() => setScopeMode('time')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${scopeMode === 'time' ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Waveform
            </button>
            <button
              onClick={() => setScopeMode('fft')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${scopeMode === 'fft' ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              FFT (0-4 kHz)
            </button>
            <button
              onClick={() => setScopeMode('envelope')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${scopeMode === 'envelope' ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Envelope
            </button>
          </div>

          {/* PTT Voice State Indicator */}
          <div className={`px-3 py-1 rounded-full border text-[11px] font-semibold flex items-center space-x-1.5 ${data.pttActive
              ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800/60 animate-pulse'
              : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
            <Mic className="w-3.5 h-3.5" />
            <span>{data.pttActive ? 'MIC LIVE (TX)' : 'STANDBY (RX)'}</span>
          </div>
        </div>
      </div>

      {/* Main Oscilloscope Canvas & Diagnostic Overlay */}
      <div className="relative w-full h-[190px] rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-inner">

        {/* Floating Graticule Readout Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 dark:bg-slate-800/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/90 dark:border-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300 shadow-2xs flex items-center space-x-2">
          <span>TIMEBASE: 5 ms/DIV</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span>SCALE: 100 mV/DIV</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className={data.pttActive ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 dark:text-slate-400'}>
            SR: 16.0 kHz
          </span>
        </div>

        {/* Floating Codec Status Banner */}
        <div className="absolute top-2.5 right-2.5 z-10 bg-white/95 dark:bg-slate-800/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/90 dark:border-slate-700 text-[10px] font-mono text-slate-700 dark:text-slate-200 shadow-2xs flex items-center space-x-1.5">
          <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>CODEC: OPUS VBR</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span>24 kbps RTP</span>
        </div>

        <canvas
          ref={canvasRef}
          width={700}
          height={190}
          className="w-full h-full block"
        />

        {/* Center Live PTT Banner when transmitting */}
        {data.pttActive && (
          <div className="absolute bottom-2.5 right-2.5 bg-red-600/90 text-white text-[10.5px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>VOICE MODULATION STREAM ACTIVE</span>
          </div>
        )}
      </div>

      {/* Audio Scope Bottom Controls & VU Meter */}
      <div className="bg-slate-50/90 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/70 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">

        {/* Mic Peak VU Meter */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider shrink-0">
            Audio VU:
          </span>
          <div className="flex-1 md:w-44 h-3 bg-slate-200/80 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 flex gap-0.5">
            <div
              className={`h-full rounded-full transition-all duration-75 ${vuPercent > 80 ? 'bg-red-500' : vuPercent > 50 ? 'bg-amber-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                }`}
              style={{ width: `${vuPercent}%` }}
            />
          </div>
          <span className="font-mono text-[10.5px] text-slate-700 dark:text-slate-300 font-semibold shrink-0 w-14 text-right">
            {vuLevel} dBFS
          </span>
        </div>

        {/* Scope Interactive Tuning Sliders / Buttons */}
        <div className="flex items-center gap-3 font-sans text-xs">

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Gain:</span>
            <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-[10px]">
              {[1.0, 1.5, 2.5].map((g) => (
                <button
                  key={g}
                  onClick={() => setGain(g)}
                  className={`px-1.5 py-0.2 rounded font-mono ${gain === g ? 'bg-slate-900 dark:bg-teal-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  {g}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Timebase:</span>
            <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-[10px]">
              {[1, 2, 4].map((tb) => (
                <button
                  key={tb}
                  onClick={() => setTimebase(tb)}
                  className={`px-1.5 py-0.2 rounded font-mono ${timebase === tb ? 'bg-slate-900 dark:bg-teal-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  {tb}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">AGC:</span>
            <button
              onClick={() => setAgcEnabled(!agcEnabled)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${agcEnabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                }`}
            >
              {agcEnabled ? 'AUTO AGC ON' : 'MANUAL'}
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">DSP Squelch:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 font-bold text-[11px]">
              {data.squelchOpen ? 'UNMUTED' : 'MUTED'}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

