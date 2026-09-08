import { useState, useEffect, useCallback } from 'react';
import type {
  ActiveTab,
  RiskLevel,
  SystemEvent,
  FloodSenseData,
  AetherBridgeData,
  HydrographPoint,
  SpectrumPoint,
  BearerType,
} from '../types/simulation';

const INITIAL_EVENTS: SystemEvent[] = [
  { id: '1', timestamp: '14:32:08', module: 'FLOODSENSE', message: 'Station SIL-CATCH-04 telemetry online. Gauge zero calibrated.', severity: 'info' },
  { id: '2', timestamp: '14:32:14', module: 'FLOODSENSE', message: 'Tipping bucket rain gauge reported 86 mm / 6h accumulation.', severity: 'info' },
  { id: '3', timestamp: '14:32:19', module: 'FLOODSENSE', message: 'Stage forecast crossed 3.20 m mark. Escalating state: SAFE → WATCH.', severity: 'warning' },
  { id: '4', timestamp: '14:32:25', module: 'AETHERBRIDGE', message: 'HackRF SDR rx tuned to 155.700 MHz. Squelch threshold -72 dBFS.', severity: 'success' },
  { id: '5', timestamp: '14:32:31', module: 'AETHERBRIDGE', message: '5G NR SA PDU session established. QoS 5QI 1 (VoNR priority).', severity: 'success' },
];

export function useSimulationState() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('FLOODSENSE');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [events, setEvents] = useState<SystemEvent[]>(INITIAL_EVENTS);

  // Simulation state
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [rainfallOverride, setRainfallOverride] = useState<number>(86);
  const [riverStageOverride, setRiverStageOverride] = useState<number>(2.84);

  // Continuous time phase for 60 FPS / 100ms ultra-smooth graph rendering
  const [timePhase, setTimePhase] = useState<number>(Date.now() / 1000);

  // AetherBridge State
  const [pttActive, setPttActive] = useState<boolean>(false);
  const [noiseInjected, setNoiseInjected] = useState<boolean>(false);
  const [activeBearer, setActiveBearer] = useState<BearerType>('5G NR SA');

  // Clock Update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-GB'));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ultra-smooth high frequency real-time timer loop (100ms / 10Hz)
  useEffect(() => {
    if (!simulationRunning) return;

    const intervalMs = Math.max(50, Math.round(100 / simulationSpeed));
    const timer = setInterval(() => {
      setTimePhase(Date.now() / 1000);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [simulationRunning, simulationSpeed]);

  // Event Helper
  const addEvent = useCallback((module: 'SYSTEM' | 'FLOODSENSE' | 'AETHERBRIDGE', message: string, severity: 'info' | 'success' | 'warning' | 'critical') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setEvents(prev => [
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timeStr,
        module,
        message,
        severity,
      },
      ...prev.slice(0, 49),
    ]);
  }, []);

  // Periodic Telemetry Heartbeat Event
  useEffect(() => {
    if (!simulationRunning) return;
    const heartbeatTimer = setInterval(() => {
      const msgs = [
        { mod: 'FLOODSENSE', msg: 'River stage sensor SIL-04 telemetry packet ingested.', sev: 'info' },
        { mod: 'AETHERBRIDGE', msg: 'VHF receiver carrier SNR: 24.8 dB (155.700 MHz).', sev: 'info' },
        { mod: 'FLOODSENSE', msg: 'Catchment routing LSTM hidden state updated.', sev: 'success' },
        { mod: 'AETHERBRIDGE', msg: '5G NR SA packet round-trip time: 87 ms.', sev: 'info' },
      ] as const;
      const pick = msgs[Math.floor(Math.random() * msgs.length)];
      addEvent(pick.mod, pick.msg, pick.sev);
    }, 12000);

    return () => clearInterval(heartbeatTimer);
  }, [simulationRunning, addEvent]);

  // Dynamic real-time micro ripple calculation for Hydrograph (60 FPS smooth wave)
  const ripple = Math.sin(timePhase * 1.8) * 0.05 + Math.cos(timePhase * 3.2) * 0.02;
  const liveStage = Number((riverStageOverride + ripple).toFixed(2));
  const predictedPeak = Number((riverStageOverride + (rainfallOverride / 50) * 0.95 + Math.sin(timePhase * 1.4) * 0.06).toFixed(2));
  
  let calculatedRisk: RiskLevel = 'SAFE';
  if (predictedPeak >= 5.0) {
    calculatedRisk = 'CRITICAL';
  } else if (predictedPeak >= 4.0) {
    calculatedRisk = 'WARNING';
  } else if (predictedPeak >= 3.2) {
    calculatedRisk = 'WATCH';
  } else {
    calculatedRisk = 'SAFE';
  }

  // Smooth micro confidence fluctuation
  const confFluctuation = Math.round(Math.sin(timePhase * 2.0) * 1.5);
  const baseConf = calculatedRisk === 'CRITICAL' ? 96 : calculatedRisk === 'WARNING' ? 94 : 91;
  const ensembleConfidence = Math.min(99, Math.max(75, baseConf + confFluctuation));

  // Hydrograph data with continuous live smooth wave movement
  const hydrographData: HydrographPoint[] = [
    { time: '-6h', historicalStage: Number((1.82 + Math.sin(timePhase * 1.2 - 2.5) * 0.04).toFixed(2)), rainfall: 12, warningThreshold: 3.5, dangerThreshold: 4.8 },
    { time: '-5h', historicalStage: Number((1.95 + Math.sin(timePhase * 1.2 - 2.0) * 0.04).toFixed(2)), rainfall: 18, warningThreshold: 3.5, dangerThreshold: 4.8 },
    { time: '-4h', historicalStage: Number((2.10 + Math.sin(timePhase * 1.2 - 1.5) * 0.04).toFixed(2)), rainfall: 35, warningThreshold: 3.5, dangerThreshold: 4.8 },
    { time: '-3h', historicalStage: Number((2.34 + Math.sin(timePhase * 1.2 - 1.0) * 0.04).toFixed(2)), rainfall: 52, warningThreshold: 3.5, dangerThreshold: 4.8 },
    { time: '-2h', historicalStage: Number((2.58 + Math.sin(timePhase * 1.2 - 0.5) * 0.04).toFixed(2)), rainfall: 68, warningThreshold: 3.5, dangerThreshold: 4.8 },
    { time: '-1h', historicalStage: Number((2.72 + Math.sin(timePhase * 1.2 - 0.2) * 0.04).toFixed(2)), rainfall: 78, warningThreshold: 3.5, dangerThreshold: 4.8 },
    { time: 'NOW', historicalStage: liveStage, predictedStage: liveStage, lowerConfidence: Number((liveStage - 0.05).toFixed(2)), upperConfidence: Number((liveStage + 0.05).toFixed(2)), rainfall: rainfallOverride, warningThreshold: 3.5, dangerThreshold: 4.8, isNow: true },
    { time: '+1h', predictedStage: Number((liveStage + (predictedPeak - liveStage) * 0.55 + Math.sin(timePhase * 1.5 + 0.5) * 0.05).toFixed(2)), lowerConfidence: Number((liveStage + (predictedPeak - liveStage) * 0.45).toFixed(2)), upperConfidence: Number((liveStage + (predictedPeak - liveStage) * 0.65).toFixed(2)), rainfall: Math.max(0, rainfallOverride - 15), warningThreshold: 3.5, dangerThreshold: 4.8 },
    { time: '+2h', predictedStage: predictedPeak, lowerConfidence: Number((predictedPeak - 0.22).toFixed(2)), upperConfidence: Number((predictedPeak + 0.25).toFixed(2)), rainfall: Math.max(0, rainfallOverride - 35), warningThreshold: 3.5, dangerThreshold: 4.8 },
    { time: '+3h', predictedStage: Number((predictedPeak - 0.35 + Math.cos(timePhase * 1.5 + 1.0) * 0.05).toFixed(2)), lowerConfidence: Number((predictedPeak - 0.60).toFixed(2)), upperConfidence: Number((predictedPeak - 0.10).toFixed(2)), rainfall: Math.max(0, rainfallOverride - 55), warningThreshold: 3.5, dangerThreshold: 4.8 },
    { time: '+4h', predictedStage: Number((predictedPeak - 0.85 + Math.sin(timePhase * 1.5 + 1.5) * 0.04).toFixed(2)), lowerConfidence: Number((predictedPeak - 1.15).toFixed(2)), upperConfidence: Number((predictedPeak - 0.55).toFixed(2)), rainfall: Math.max(0, rainfallOverride - 70), warningThreshold: 3.5, dangerThreshold: 4.8 },
    { time: '+5h', predictedStage: Number((predictedPeak - 1.30 + Math.cos(timePhase * 1.5 + 2.0) * 0.04).toFixed(2)), lowerConfidence: Number((predictedPeak - 1.65).toFixed(2)), upperConfidence: Number((predictedPeak - 0.95).toFixed(2)), rainfall: 10, warningThreshold: 3.5, dangerThreshold: 4.8 },
  ];

  const floodSenseData: FloodSenseData = {
    riskLevel: calculatedRisk,
    ensembleConfidence,
    currentStage: liveStage,
    predictedPeak,
    timeToPeak: '2h 18m',
    rainfall6h: rainfallOverride,
    lstmModel: {
      name: 'Catchment Routing LSTM',
      status: 'ACTIVE',
      weight: 60,
      prediction: calculatedRisk,
      confidence: Math.min(99, Math.max(75, (calculatedRisk === 'CRITICAL' ? 97 : 94) + confFluctuation)),
      type: 'Sequence Model',
    },
    randomForestModel: {
      name: 'Runoff Classifier (Random Forest)',
      status: 'ACTIVE',
      weight: 40,
      prediction: calculatedRisk,
      confidence: Math.min(99, Math.max(75, (calculatedRisk === 'CRITICAL' ? 92 : 87) + confFluctuation)),
      type: 'Tree Ensemble',
    },
    simulationRunning,
    simulationSpeed,
    rainfallOverride,
    riverStageOverride,
    physicsOverrideActive: calculatedRisk === 'CRITICAL' || calculatedRisk === 'WARNING',
  };

  // RF Spectrum Data Generator with high frequency smooth modulation
  const generateSpectrumData = useCallback((): SpectrumPoint[] => {
    const centerFreq = 155.700;
    const points: SpectrumPoint[] = [];
    const baseNoise = noiseInjected ? -55 : -110;

    for (let f = 155.200; f <= 156.200; f += 0.035) {
      const freqFixed = Number(f.toFixed(3));
      const distance = Math.abs(freqFixed - centerFreq);
      
      // Smooth continuous RF noise jitter per frequency bin
      const binPhase = freqFixed * 80 + timePhase * 6.0;
      const jitter = Math.sin(binPhase) * 2.5 + Math.cos(binPhase * 1.7) * 1.5;
      let power = baseNoise + jitter;

      if (distance < 0.04) {
        // Carrier Peak at 155.700 MHz with live audio modulation pulse
        const audioVoicePulse = pttActive ? Math.sin(timePhase * 12.0) * 9 + Math.cos(timePhase * 18.0) * 4 : Math.sin(timePhase * 3.0) * 2;
        const carrierBoost = (pttActive ? 75 : 55) + audioVoicePulse;
        power = baseNoise + carrierBoost - (distance * 400);
      }

      points.push({
        frequency: freqFixed,
        power: Number(power.toFixed(1)),
        isCarrierPeak: Math.abs(freqFixed - centerFreq) < 0.02,
      });
    }

    return points;
  }, [pttActive, noiseInjected, timePhase]);

  const [spectrumData, setSpectrumData] = useState<SpectrumPoint[]>(generateSpectrumData());

  useEffect(() => {
    setSpectrumData(generateSpectrumData());
  }, [generateSpectrumData]);

  // Dynamic Latency & Link calculations with smooth micro jitter
  const latencyJitter = simulationRunning ? Math.round(Math.sin(timePhase * 4.0) * 2) : 0;
  let baseLatency = 87;
  if (activeBearer === 'LTE FALLBACK') baseLatency = 108;
  if (activeBearer === 'NTN SATELLITE') baseLatency = 215;
  if (activeBearer === 'LOCAL VHF') baseLatency = 14;

  const totalLatency = Math.max(10, baseLatency + latencyJitter);

  const aetherBridgeData: AetherBridgeData = {
    linkHealthy: !noiseInjected && activeBearer !== 'LOCAL VHF',
    activeBearer,
    pttActive,
    squelchOpen: pttActive || !noiseInjected,
    squelchThreshold: -72,
    carrierDetected: true,
    totalLatency,
    latencyLimit: 150,
    latencyHeadroom: Math.max(0, 150 - totalLatency),
    noiseInjected,
    signalStrength: noiseInjected ? -98 + Math.round(latencyJitter * 0.5) : pttActive ? -52 + Math.round(latencyJitter) : -61 + Math.round(latencyJitter * 0.5),
    packetLoss: noiseInjected ? Number((4.8 + Math.sin(timePhase * 2.5) * 0.4).toFixed(1)) : 0.2,
    latencyBreakdown: {
      vhfToSdr: 12,
      gnuRadio: 18,
      squelchVox: 6,
      sipRtp: 22,
      fiveGUplink: activeBearer === '5G NR SA' ? 20 + latencyJitter : activeBearer === 'LTE FALLBACK' ? 41 + latencyJitter : 148 + latencyJitter,
      eoc: 9,
    },
    bearers: [
      { name: '5G NR SA', status: activeBearer === '5G NR SA' ? 'HEALTHY' : 'OFFLINE', latency: 87 + latencyJitter, active: activeBearer === '5G NR SA' },
      { name: 'LTE FALLBACK', status: activeBearer === 'LTE FALLBACK' ? 'ACTIVE' : 'STANDBY', latency: 108 + latencyJitter, active: activeBearer === 'LTE FALLBACK' },
      { name: 'NTN SATELLITE', status: activeBearer === 'NTN SATELLITE' ? 'ACTIVE' : 'STANDBY', latency: 215 + latencyJitter, active: activeBearer === 'NTN SATELLITE' },
      { name: 'LOCAL VHF', status: activeBearer === 'LOCAL VHF' ? 'ACTIVE' : 'READY', latency: 14, active: activeBearer === 'LOCAL VHF' },
    ],
  };

  // User Actions
  const handleRainfallChange = (val: number) => {
    setRainfallOverride(val);
    if (val > 140 && calculatedRisk !== 'CRITICAL') {
      addEvent('FLOODSENSE', `Rain gauge SIL-04 accumulation threshold exceeded: ${val} mm / 6h.`, 'critical');
    } else if (val > 90) {
      addEvent('FLOODSENSE', `Precipitation rate increased to ${val} mm / 6h.`, 'warning');
    }
  };

  const handleRiverStageChange = (val: number) => {
    setRiverStageOverride(val);
  };

  const togglePtt = () => {
    setPttActive(prev => {
      const next = !prev;
      if (next) {
        addEvent('AETHERBRIDGE', 'PTT Keyed — Voice channel active on 155.700 MHz FM.', 'success');
      } else {
        addEvent('AETHERBRIDGE', 'PTT Unkeyed — Carrier squelched.', 'info');
      }
      return next;
    });
  };

  const toggleNoise = () => {
    setNoiseInjected(prev => {
      const next = !prev;
      if (next) {
        addEvent('AETHERBRIDGE', 'RF Interference detected on 155.700 MHz (-55 dBFS noise floor).', 'critical');
      } else {
        addEvent('AETHERBRIDGE', 'RF Interference cleared. Nominal SNR restored.', 'success');
      }
      return next;
    });
  };

  const drop5gLink = () => {
    if (activeBearer === '5G NR SA') {
      setActiveBearer('LTE FALLBACK');
      addEvent('AETHERBRIDGE', '5G NR carrier link lost. Failover switched to LTE bearer.', 'warning');
    } else if (activeBearer === 'LTE FALLBACK') {
      setActiveBearer('NTN SATELLITE');
      addEvent('AETHERBRIDGE', 'Terrestrial LTE link lost. Failover switched to NTN Satellite.', 'warning');
    } else if (activeBearer === 'NTN SATELLITE') {
      setActiveBearer('LOCAL VHF');
      addEvent('AETHERBRIDGE', 'Satellite link degraded. Fallback to Local VHF analog relay.', 'critical');
    }
  };

  const restoreLink = () => {
    setActiveBearer('5G NR SA');
    setNoiseInjected(false);
    addEvent('AETHERBRIDGE', 'Primary 5G NR SA link re-established (VoNR QoS 5QI 1).', 'success');
  };

  const resetSimulation = () => {
    setRainfallOverride(86);
    setRiverStageOverride(2.84);
    setSimulationRunning(true);
    setSimulationSpeed(1);
    setNoiseInjected(false);
    setPttActive(false);
    setActiveBearer('5G NR SA');
    addEvent('SYSTEM', 'Console metrics reset to default telemetry baseline.', 'info');
  };

  return {
    activeTab,
    setActiveTab,
    currentTime,
    currentDate,
    events,
    floodSenseData,
    aetherBridgeData,
    hydrographData,
    spectrumData,
    handleRainfallChange,
    handleRiverStageChange,
    simulationRunning,
    setSimulationRunning,
    simulationSpeed,
    setSimulationSpeed,
    togglePtt,
    toggleNoise,
    drop5gLink,
    restoreLink,
    resetSimulation,
    addEvent,
  };
}
