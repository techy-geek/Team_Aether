import { Waves, Radio } from 'lucide-react';
import { useSimulationState } from './hooks/useSimulationState';
import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { BottomStatusBar } from './components/BottomStatusBar';
import { FloodSensePanel } from './components/FloodSense/FloodSensePanel';
import { AetherBridgePanel } from './components/AetherBridge/AetherBridgePanel';

export function App() {
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

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col justify-between font-sans">
      
      {/* Top Console Header */}
      <Header
        threatLevel={floodSenseData.riskLevel}
        currentTime={currentTime}
        currentDate={currentDate}
        simulationRunning={simulationRunning}
        onToggleSimulation={() => setSimulationRunning(!simulationRunning)}
      />

      {/* Main Operations Viewport */}
      <main className="max-w-[1920px] mx-auto w-full p-2.5 sm:p-3 flex-1 flex flex-col gap-3">
        
        {/* Desktop 3-Column Responsive Grid */}
        <div className="flex flex-col lg:flex-row gap-3 items-start">
          
          {/* Left Subsystems Sidebar */}
          <SidebarLeft
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            floodData={floodSenseData}
            aetherData={aetherBridgeData}
            events={events}
          />

          {/* Center Primary Workspace Panel (Dominant Area) */}
          <section className="flex-1 w-full min-w-0 flex flex-col gap-3">
            
            {/* Primary Tab Switcher Bar */}
            <div className="bg-white px-3 py-2 rounded border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider">
                  PRIMARY MONITORING WORKSPACE
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">
                  {activeTab === 'FLOODSENSE' ? 'Catchment Hydrograph & Runoff' : 'Tactical Radio & RF Spectrum'}
                </span>
              </div>

              {/* Console Tab Selector Buttons */}
              <div className="flex items-center space-x-1.5 w-full sm:w-auto text-xs font-sans">
                <button
                  onClick={() => setActiveTab('FLOODSENSE')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded font-bold border transition-colors cursor-pointer ${
                    activeTab === 'FLOODSENSE'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Waves className="w-3.5 h-3.5" />
                  <span>FLOODSENSE</span>
                </button>

                <button
                  onClick={() => setActiveTab('AETHERBRIDGE')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded font-bold border transition-colors cursor-pointer ${
                    activeTab === 'AETHERBRIDGE'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>AETHERBRIDGE</span>
                </button>
              </div>
            </div>

            {/* Active Simulation Viewport */}
            {activeTab === 'FLOODSENSE' ? (
              <FloodSensePanel
                floodData={floodSenseData}
                hydrographData={hydrographData}
                onRainfallChange={handleRainfallChange}
                onRiverStageChange={handleRiverStageChange}
                onToggleSimulation={() => setSimulationRunning(!simulationRunning)}
                onSpeedChange={setSimulationSpeed}
                onReset={resetSimulation}
              />
            ) : (
              <AetherBridgePanel
                aetherData={aetherBridgeData}
                spectrumData={spectrumData}
                onTogglePtt={togglePtt}
                onToggleNoise={toggleNoise}
                onDrop5gLink={drop5gLink}
                onRestoreLink={restoreLink}
              />
            )}

          </section>

          {/* Right Operational Status Sidebar */}
          <SidebarRight
            floodData={floodSenseData}
            aetherData={aetherBridgeData}
            events={events}
          />

        </div>

        {/* Command Console Bottom Status Bar */}
        <BottomStatusBar
          floodData={floodSenseData}
          aetherData={aetherBridgeData}
        />

      </main>

    </div>
  );
}

export default App;
