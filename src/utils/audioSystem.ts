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
      this.playBeep(600, 0.08, 'sine', 0.1);
    }
    return this.soundEnabled;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.1, delay: number = 0) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  public playBeep(freq = 500, duration = 0.08, type: OscillatorType = 'sine', gain = 0.08) {
    this.playTone(freq, duration, type, gain);
  }

  public playSingleSound(level: RiskLevel) {
    if (!this.soundEnabled) return;

    switch (level) {
      case 'SAFE':
        // Soft confirmation chime
        this.playTone(523.25, 0.12, 'sine', 0.06, 0);
        this.playTone(659.25, 0.18, 'sine', 0.05, 0.08);
        this.playTone(783.99, 0.25, 'sine', 0.04, 0.16);
        break;

      case 'WATCH':
        // Sonar ping
        this.playTone(440, 0.18, 'triangle', 0.1, 0);
        this.playTone(554.37, 0.22, 'sine', 0.08, 0.1);
        break;

      case 'WARNING':
        // Dual warning pulses
        this.playTone(620, 0.12, 'sawtooth', 0.1, 0);
        this.playTone(580, 0.12, 'sawtooth', 0.1, 0.14);
        this.playTone(620, 0.16, 'triangle', 0.11, 0.28);
        break;

      case 'CRITICAL':
        // Urgent emergency klaxon burst
        this.playTone(880, 0.1, 'sawtooth', 0.14, 0);
        this.playTone(740, 0.1, 'sawtooth', 0.14, 0.11);
        this.playTone(880, 0.12, 'sawtooth', 0.16, 0.22);
        this.playTone(987.77, 0.2, 'sawtooth', 0.18, 0.35);
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

    const intervalMs = level === 'CRITICAL' ? 1600 : level === 'WARNING' ? 2400 : 3400;

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
