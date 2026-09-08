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

      // Clear background (SCADA crisp light canvas)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Draw Oscilloscope Graticule (Grid Lines)
      ctx.strokeStyle = '#e2e8f0';
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
      ctx.strokeStyle = '#cbd5e1';
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
            ? '#ea580c' // Amber-orange if noisy voice
            : '#0284c7' // Bright Cyan-Blue if clean voice
          : data.squelchOpen
          ? '#64748b' // Squelch noise
          : '#94a3b8'; // Idle quiet line

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
            ? data.noiseInjected ? '#ea580c' : '#0284c7'
            : '#94a3b8';
          ctx.fillRect(bx, by, barWidth, barH);
        }

      } else {
        // ENVELOPE / VOWEL MODULATION (RMS ENERGY)
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0d9488';
        ctx.fillStyle = 'rgba(13, 148, 136, 0.12)';

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
    <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs flex flex-col gap-3 font-sans">
      
      {/* Scope Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-2.5">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-700" />
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              TACTICAL AUDIO OSCILLOSCOPE & VOICE MODULATION
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-sans">
            Time-Domain Baseband Voice &bull; Opus Wideband Codec (16 kHz / 24 kbps)
          </span>
        </div>

        {/* State Badges & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-[11px]">
            <button
              onClick={() => setScopeMode('time')}
              className={`px-2 py-0.5 rounded transition-all ${
                scopeMode === 'time' ? 'bg-cyan-700 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Waveform
            </button>
            <button
              onClick={() => setScopeMode('fft')}
              className={`px-2 py-0.5 rounded transition-all ${
                scopeMode === 'fft' ? 'bg-cyan-700 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FFT (0-4 kHz)
            </button>
            <button
              onClick={() => setScopeMode('envelope')}
              className={`px-2 py-0.5 rounded transition-all ${
                scopeMode === 'envelope' ? 'bg-cyan-700 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Envelope
            </button>
          </div>

          {/* PTT Voice State Indicator */}
          <div className={`px-2.5 py-0.5 rounded border text-[11px] font-semibold flex items-center space-x-1.5 ${
            data.pttActive
              ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}>
            <Mic className="w-3 h-3" />
            <span>{data.pttActive ? 'MIC LIVE (TX)' : 'STANDBY (RX)'}</span>
          </div>
        </div>
      </div>

      {/* Main Oscilloscope Canvas & Diagnostic Overlay */}
      <div className="relative w-full h-[190px] rounded border border-slate-200 overflow-hidden bg-slate-50">
        
        {/* Floating Graticule Readout Overlay */}
        <div className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 text-[10px] font-mono text-slate-600 shadow-2xs flex items-center space-x-2">
          <span>TIMEBASE: 5 ms/DIV</span>
          <span className="text-slate-300">|</span>
          <span>SCALE: 100 mV/DIV</span>
          <span className="text-slate-300">|</span>
          <span className={data.pttActive ? 'text-cyan-700 font-bold' : 'text-slate-500'}>
            SR: 16.0 kHz
          </span>
        </div>

        {/* Floating Codec Status Banner */}
        <div className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 text-[10px] font-mono text-slate-700 shadow-2xs flex items-center space-x-1.5">
          <Zap className="w-3 h-3 text-emerald-600" />
          <span>CODEC: OPUS VBR</span>
          <span className="text-slate-300">|</span>
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
          <div className="absolute bottom-2 right-2 bg-red-600/90 text-white text-[10.5px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center space-x-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>VOICE MODULATION STREAM ACTIVE</span>
          </div>
        )}
      </div>

      {/* Audio Scope Bottom Controls & VU Meter */}
      <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Mic Peak VU Meter */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider shrink-0">
            Audio VU:
          </span>
          <div className="flex-1 md:w-44 h-3.5 bg-slate-200 rounded-xs overflow-hidden p-0.5 flex gap-0.5">
            <div
              className={`h-full rounded-xs transition-all duration-75 ${
                vuPercent > 80 ? 'bg-red-500' : vuPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${vuPercent}%` }}
            />
          </div>
          <span className="font-mono text-[10.5px] text-slate-700 font-semibold shrink-0 w-12 text-right">
            {vuLevel} dBFS
          </span>
        </div>

        {/* Scope Interactive Tuning Sliders / Buttons */}
        <div className="flex items-center gap-3 font-sans text-xs">
          
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 text-[11px]">Gain:</span>
            <div className="flex bg-white rounded border border-slate-200 p-0.5 text-[10px]">
              {[1.0, 1.5, 2.5].map((g) => (
                <button
                  key={g}
                  onClick={() => setGain(g)}
                  className={`px-1.5 py-0.2 rounded font-mono ${
                    gain === g ? 'bg-slate-800 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {g}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 text-[11px]">Timebase:</span>
            <div className="flex bg-white rounded border border-slate-200 p-0.5 text-[10px]">
              {[1, 2, 4].map((tb) => (
                <button
                  key={tb}
                  onClick={() => setTimebase(tb)}
                  className={`px-1.5 py-0.2 rounded font-mono ${
                    timebase === tb ? 'bg-slate-800 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tb}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 text-[11px]">AGC:</span>
            <button
              onClick={() => setAgcEnabled(!agcEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                agcEnabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              {agcEnabled ? 'AUTO AGC ON' : 'MANUAL'}
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-500 text-[11px]">DSP Squelch:</span>
            <span className="font-mono text-slate-800 font-bold text-[11px]">
              {data.squelchOpen ? 'UNMUTED' : 'MUTED'}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
