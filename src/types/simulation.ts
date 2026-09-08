export type ActiveTab = 'FLOODSENSE' | 'AETHERBRIDGE';

export type RiskLevel = 'SAFE' | 'WATCH' | 'WARNING' | 'CRITICAL';

export type BearerType = '5G NR SA' | 'LTE FALLBACK' | 'NTN SATELLITE' | 'LOCAL VHF';

export interface SystemEvent {
  id: string;
  timestamp: string;
  module: 'SYSTEM' | 'FLOODSENSE' | 'AETHERBRIDGE';
  message: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
}

export interface ModelMetrics {
  name: string;
  status: 'ACTIVE' | 'STANDBY' | 'DEGRADED';
  weight: number; // percentage e.g. 60
  prediction: RiskLevel;
  confidence: number; // percentage e.g. 94
  type: string;
}

export interface HydrographPoint {
  time: string;
  historicalStage?: number;
  predictedStage?: number;
  lowerConfidence?: number;
  upperConfidence?: number;
  rainfall: number;
  warningThreshold: number;
  dangerThreshold: number;
  isNow?: boolean;
}

export interface FloodSenseData {
  riskLevel: RiskLevel;
  ensembleConfidence: number;
  currentStage: number; // in meters (e.g., 2.84)
  predictedPeak: number; // in meters (e.g., 4.31)
  timeToPeak: string; // e.g., "2h 18m"
  rainfall6h: number; // in mm (e.g., 86)
  lstmModel: ModelMetrics;
  randomForestModel: ModelMetrics;
  simulationRunning: boolean;
  simulationSpeed: number;
  rainfallOverride: number;
  riverStageOverride: number;
  physicsOverrideActive: boolean;
}

export interface PipelineNode {
  id: string;
  title: string;
  tech: string;
  detail: string;
  status: 'ACTIVE' | 'STANDBY' | 'WARNING' | 'OFFLINE';
  icon: string;
}

export interface SpectrumPoint {
  frequency: number; // MHz e.g. 155.0 to 156.4
  power: number; // dBFS e.g. -110 to -20
  isCarrierPeak?: boolean;
}

export interface LatencyBreakdown {
  vhfToSdr: number;
  gnuRadio: number;
  squelchVox: number;
  sipRtp: number;
  fiveGUplink: number;
  eoc: number;
}

export interface BearerStatus {
  name: BearerType;
  status: 'HEALTHY' | 'STANDBY' | 'ACTIVE' | 'OFFLINE' | 'READY';
  latency: number;
  active: boolean;
}

export interface AetherBridgeData {
  linkHealthy: boolean;
  activeBearer: BearerType;
  pttActive: boolean;
  squelchOpen: boolean;
  squelchThreshold: number; // dBFS e.g. -72
  carrierDetected: boolean;
  totalLatency: number; // ms e.g. 87
  latencyLimit: number; // ms e.g. 150
  latencyHeadroom: number; // ms e.g. 63
  noiseInjected: boolean;
  signalStrength: number; // dBm e.g. -61
  packetLoss: number; // percentage e.g. 0.2
  latencyBreakdown: LatencyBreakdown;
  bearers: BearerStatus[];
}
