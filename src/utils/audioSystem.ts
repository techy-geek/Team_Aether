import type { RiskLevel } from '../types/simulation';

type AlarmStateListener = (active: boolean, level: RiskLevel | null) => void;

class TelemetryAudioSystem {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private alertInterval: number | null = null;
  private activeAlertLevel: RiskLevel | null = null;
  private listeners: Set<AlarmStateListener> = new Set();

  constructor() {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sentinel_sound_enabled') : null;
    this.soundEnabled = saved !== null ? saved === 'true' : true;

    // Automatic unlock on any user gesture to satisfy browser autoplay security policies
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      };

      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public subscribe(listener: AlarmStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isAlertActive(), this.activeAlertLevel);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const active = this.isAlertActive();
    this.listeners.forEach(fn => fn(active, this.activeAlertLevel));
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public isAlertActive(): boolean {
    return this.alertInterval !== null && this.activeAlertLevel !== null;
  }

  public getActiveLevel(): RiskLevel | null {
    return this.activeAlertLevel;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sentinel_sound_enabled', String(this.soundEnabled));
    }
    if (!this.soundEnabled) {
      this.silenceAlarm();
    } else {
      this.initContext();
      this.playBeep(750, 0.12, 'sine', 0.25);
    }
    return this.soundEnabled;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.25, delay: number = 0) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const now = this.ctx.currentTime + Math.max(0, delay);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Robust linear attack and decay envelope
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.015);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    try {
      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Audio node scheduling safe catch
    }
  }

  public playBeep(freq = 600, duration = 0.1, type: OscillatorType = 'sine', gain = 0.2) {
    this.playTone(freq, duration, type, gain);
  }

  public playSingleSound(level: RiskLevel) {
    if (!this.soundEnabled) return;

    switch (level) {
      case 'SAFE':
        // Soft affirmative telemetry confirmation
        this.playTone(523.25, 0.14, 'sine', 0.18, 0);
        this.playTone(659.25, 0.16, 'sine', 0.18, 0.08);
        this.playTone(783.99, 0.22, 'sine', 0.18, 0.16);
        break;

      case 'WATCH':
        // Sonar ping
        this.playTone(440, 0.2, 'triangle', 0.25, 0);
        this.playTone(554.37, 0.22, 'sine', 0.22, 0.1);
        break;

      case 'WARNING':
        // Warning pulses
        this.playTone(650, 0.14, 'sawtooth', 0.25, 0);
        this.playTone(580, 0.14, 'sawtooth', 0.25, 0.14);
        this.playTone(650, 0.18, 'triangle', 0.28, 0.28);
        break;

      case 'CRITICAL':
        // High-priority SCADA Master Emergency Alarm
        this.playTone(960, 0.15, 'sawtooth', 0.32, 0);
        this.playTone(720, 0.15, 'square', 0.22, 0);

        this.playTone(960, 0.15, 'sawtooth', 0.32, 0.18);
        this.playTone(720, 0.15, 'square', 0.22, 0.18);

        this.playTone(1100, 0.24, 'sawtooth', 0.35, 0.36);
        this.playTone(825, 0.24, 'square', 0.25, 0.36);
        break;
    }
  }

  public triggerRiskAlert(level: RiskLevel) {
    this.stopAlertLoop();

    if (level === 'SAFE') {
      this.playSingleSound('SAFE');
      this.activeAlertLevel = null;
      this.notifyListeners();
      return;
    }

    // For alert levels (WATCH, WARNING, CRITICAL), start a continuous sound loop
    this.activeAlertLevel = level;
    this.playSingleSound(level);

    const intervalMs = level === 'CRITICAL' ? 1500 : level === 'WARNING' ? 2200 : 3200;

    this.alertInterval = window.setInterval(() => {
      if (this.soundEnabled && this.activeAlertLevel) {
        this.playSingleSound(this.activeAlertLevel);
      }
    }, intervalMs);

    this.notifyListeners();
  }

  public silenceAlarm() {
    this.stopAlertLoop();
    this.activeAlertLevel = null;
    this.notifyListeners();
  }

  private stopAlertLoop() {
    if (this.alertInterval !== null) {
      window.clearInterval(this.alertInterval);
      this.alertInterval = null;
    }
  }
}

export const telemetryAudio = new TelemetryAudioSystem();
