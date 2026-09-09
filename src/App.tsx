import { useState, useEffect, useRef } from 'react';
import { useSimulationState } from './hooks/useSimulationState';
import { Header } from './components/Header';
import { SubsystemsTopBar } from './components/SubsystemsTopBar';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { BottomStatusBar } from './components/BottomStatusBar';
import { FloodSensePanel } from './components/FloodSense/FloodSensePanel';
import { AetherBridgePanel } from './components/AetherBridge/AetherBridgePanel';
import { telemetryAudio } from './utils/audioSystem';
import type { RiskLevel } from './types/simulation';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sentinel_theme') === 'dark';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return telemetryAudio.isEnabled();
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sentinel_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sentinel_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const toggleSound = () => {
    const newState = telemetryAudio.toggleSound();
    setSoundEnabled(newState);
  };

  const {
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
    setSimulationSpeed,
    togglePtt,
    toggleNoise,
    drop5gLink,
    restoreLink,
    resetSimulation,
  } = useSimulationState();

  const [alarmActive, setAlarmActive] = useState<boolean>(() => {
    return telemetryAudio.isAlertActive();
  });

  // Subscribe to alarm state changes from the audio system
  useEffect(() => {
    const unsubscribe = telemetryAudio.subscribe((active) => {
      setAlarmActive(active);
    });
    return unsubscribe;
  }, []);

  // Trigger continuous danger sound cue whenever risk level changes
  const prevRiskRef = useRef<RiskLevel>(floodSenseData.riskLevel);
  useEffect(() => {
    if (prevRiskRef.current !== floodSenseData.riskLevel) {
      telemetryAudio.triggerRiskAlert(floodSenseData.riskLevel);
      prevRiskRef.current = floodSenseData.riskLevel;
    }
  }, [floodSenseData.riskLevel]);

  // Perimeter border glow map according to risk level (Gradually scales from subtle on SAFE to full current intensity on CRITICAL)
  const perimeterGlowMap: Record<RiskLevel, string> = {
    SAFE: 'border-[2px] border-emerald-500/25 shadow-[inset_0_0_20px_rgba(16,185,129,0.1),0_0_12px_rgba(16,185,129,0.08)]',
    WATCH: 'border-[3px] border-amber-500/45 shadow-[inset_0_0_50px_rgba(245,158,11,0.2),inset_0_0_15px_rgba(245,158,11,0.3),0_0_25px_rgba(245,158,11,0.22)]',
    WARNING: 'border-[4.5px] border-orange-500/65 shadow-[inset_0_0_85px_rgba(249,115,22,0.3),inset_0_0_25px_rgba(249,115,22,0.45),0_0_45px_rgba(249,115,22,0.35)]',
    CRITICAL: 'border-[6px] border-red-500/90 shadow-[inset_0_0_125px_rgba(239,68,68,0.48),inset_0_0_45px_rgba(239,68,68,0.7),0_0_70px_rgba(239,68,68,0.6)] animate-pulse',
  };

  const handleSilenceAlarm = () => {
    telemetryAudio.silenceAlarm();
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-200 relative">

      {/* Full-Website Perimeter Border Glow Overlay (Gradually Scaled) */}
      <div
        className={`fixed inset-0 pointer-events-none z-40 transition-all duration-500 ${perimeterGlowMap[floodSenseData.riskLevel]}`}
      />

      {/* Top Console Header */}
      <Header
        threatLevel={floodSenseData.riskLevel}
        currentTime={currentTime}
        currentDate={currentDate}
        simulationRunning={simulationRunning}
        onToggleSimulation={() => setSimulationRunning(!simulationRunning)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        alarmActive={alarmActive}
        onSilenceAlarm={handleSilenceAlarm}
      />

      {/* Main Operations Viewport */}
      <main className="max-w-[1920px] mx-auto w-full p-2.5 sm:p-3 flex-1 flex flex-col gap-3">

        {/* Desktop 3-Column Responsive Grid */}
        <div className="flex flex-col lg:flex-row gap-3 items-start">

          {/* Left Subsystems Sidebar (with Active Controls & Telemetry Log) */}
          <SidebarLeft
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            floodData={floodSenseData}
            aetherData={aetherBridgeData}
            events={events}
            onRainfallChange={handleRainfallChange}
            onRiverStageChange={handleRiverStageChange}
            onToggleSimulation={() => setSimulationRunning(!simulationRunning)}
            onSpeedChange={setSimulationSpeed}
            onReset={resetSimulation}
            onTogglePtt={togglePtt}
            onToggleNoise={toggleNoise}
            onDrop5gLink={drop5gLink}
            onRestoreLink={restoreLink}
          />

          {/* Center Primary Workspace Panel (Dominant Area) */}
          <section className="flex-1 w-full min-w-0 flex flex-col gap-3">

            {/* Top Horizontal Subsystems Dashboard */}
            <SubsystemsTopBar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              floodData={floodSenseData}
              aetherData={aetherBridgeData}
            />

            {/* Active Simulation Viewport */}
            {activeTab === 'FLOODSENSE' ? (
              <FloodSensePanel
                floodData={floodSenseData}
                hydrographData={hydrographData}
              />
            ) : (
              <AetherBridgePanel
                aetherData={aetherBridgeData}
                spectrumData={spectrumData}
              />
            )}

          </section>

          {/* Right Operational Status Sidebar */}
          <SidebarRight
            activeTab={activeTab}
            floodData={floodSenseData}
            aetherData={aetherBridgeData}
            events={events}
          />

        </div>

        {/* Command Console Bottom Status Bar */}
        <BottomStatusBar />

      </main>

    </div>
  );
}

export default App;

