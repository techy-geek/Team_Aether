import { useState, useEffect, useCallback } from 'react';
import type {
  ActiveTab,
  SystemEvent,
  FloodSenseData,
  AetherBridgeData,
  SpectrumPoint,
  BearerType,
} from '../types/simulation';
import { floodMlEngine } from '../models/floodMlEngine';

const INITIAL_EVENTS: SystemEvent[] = [
  { id: '1', timestamp: '14:32:08', module: 'FLOODSENSE', message: 'CWC Assam Hydrological ML Engine loaded (203,804 training records).', severity: 'info' },
  { id: '2', timestamp: '14:32:14', module: 'FLOODSENSE', message: 'Annapurna Ghat / AP Ghat telemetry calibrated. Baseflow stage nominal.', severity: 'info' },
  { id: '3', timestamp: '14:32:19', module: 'FLOODSENSE', message: 'Trained sequence routing model active. State: SAFE (0.50m).', severity: 'success' },
  { id: '4', timestamp: '14:32:25', module: 'AETHERBRIDGE', message: 'HackRF SDR rx tuned to 155.700 MHz. Squelch threshold -72 dBFS.', severity: 'success' },
  { id: '5', timestamp: '14:32:31', module: 'AETHERBRIDGE', message: '5G NR SA PDU session established. QoS 5QI 1 (VoNR priority).', severity: 'success' },
];

export function useSimulationState() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('FLOODSENSE');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [events, setEvents] = useState<SystemEvent[]>(INITIAL_EVENTS);

  // Simulation state (Default Hydrological Forcing Controls set to minimum)
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [rainfallOverride, setRainfallOverride] = useState<number>(0);
  const [riverStageOverride, setRiverStageOverride] = useState<number>(0.5);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('SCENARIO_DRY_BASELINE');

  // Continuous time phase for 60 FPS / 100ms ultra-smooth graph rendering
  const [timePhase, setTimePhase] = useState<number>(() => Date.now() / 1000);

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
        { mod: 'FLOODSENSE', msg: 'Barak river telemetry packet ingested from Annapurna Ghat.', sev: 'info' },
        { mod: 'AETHERBRIDGE', msg: 'VHF receiver carrier SNR: 24.8 dB (155.700 MHz).', sev: 'info' },
        { mod: 'FLOODSENSE', msg: 'CWC-trained ML ensemble state evaluated (Accuracy: 97.79%).', sev: 'success' },
        { mod: 'AETHERBRIDGE', msg: '5G NR SA packet round-trip time: 87 ms.', sev: 'info' },
      ] as const;
      const pick = msgs[Math.floor(Math.random() * msgs.length)];
      addEvent(pick.mod, pick.msg, pick.sev);
    }, 12000);

    return () => clearInterval(heartbeatTimer);
  }, [simulationRunning, addEvent]);

  // Execute Trained Machine Learning Model Inference (replaces strict formula)
  const mlResult = floodMlEngine.predict(rainfallOverride, riverStageOverride, timePhase);
  const hydrographData = mlResult.hydrograph;

  const floodSenseData: FloodSenseData = {
    riskLevel: mlResult.riskLevel,
    ensembleConfidence: mlResult.ensembleConfidence,
    currentStage: hydrographData.find(p => p.isNow)?.historicalStage ?? riverStageOverride,
    predictedPeak: mlResult.predictedPeak,
    timeToPeak: mlResult.timeToPeakFormatted,
    rainfall6h: rainfallOverride,
    lstmModel: mlResult.lstmModel,
    randomForestModel: mlResult.randomForestModel,
    simulationRunning,
    simulationSpeed,
    rainfallOverride,
    riverStageOverride,
    physicsOverrideActive: mlResult.riskLevel === 'CRITICAL' || mlResult.riskLevel === 'WARNING',
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

  const spectrumData = generateSpectrumData();

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
    setSelectedScenarioId('CUSTOM');
    if (val > 140 && mlResult.riskLevel !== 'CRITICAL') {
      addEvent('FLOODSENSE', `Trained ML model predicted critical catchment response at ${val} mm / 6h.`, 'critical');
    } else if (val > 80) {
      addEvent('FLOODSENSE', `Precipitation rate increased to ${val} mm / 6h. Sequence model updating forecast.`, 'warning');
    }
  };

  const handleRiverStageChange = (val: number) => {
    setRiverStageOverride(val);
    setSelectedScenarioId('CUSTOM');
  };

  const applyStormScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const scenarios = floodMlEngine.getStormScenarios();
    const sc = scenarios.find(s => s.id === scenarioId);
    if (sc) {
      setRainfallOverride(sc.rainfall6h);
      setRiverStageOverride(sc.initialStage);
      addEvent('FLOODSENSE', `Applied historical CWC storm scenario: ${sc.name} (${sc.actualEventDate})`, sc.rainfall6h > 100 ? 'critical' : 'info');
    }
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
    setRainfallOverride(0);
    setRiverStageOverride(0.5);
    setSelectedScenarioId('SCENARIO_DRY_BASELINE');
    setSimulationRunning(true);
    setSimulationSpeed(1);
    setNoiseInjected(false);
    setPttActive(false);
    setActiveBearer('5G NR SA');
    addEvent('SYSTEM', 'Console metrics reset to CWC baseline (dry flow 0.50m).', 'info');
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
    applyStormScenario,
    selectedScenarioId,
    stormScenarios: floodMlEngine.getStormScenarios(),
    modelMetadata: floodMlEngine.getModelMetadata(),
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
