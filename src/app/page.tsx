// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { ProservLogo } from '@/components/ProservLogo';
import { SystemControls } from '@/components/SystemControls';
import { SystemStatus } from '@/components/SystemStatus';
import { PressureGraph } from '@/components/PressureGraph';
import { TransmitterSetpointControl } from '@/components/TransmitterSetpointControl';
import { TransmitterValueDisplay } from '@/components/TransmitterValueDisplay';
import { AutoPumpControl } from '@/components/AutoPumpControl';
import { Setpoints, PumpStatus } from '@/types';

export default function Home() {
  // State for pressures and setpoints
  const [pumpPressure, setPumpPressure] = useState<number>(0);
  const [flowlinePressure, setFlowlinePressure] = useState<number>(0);
  const [pumpStatus, setPumpStatus] = useState<PumpStatus>('stopped');
  
  // Initialize setpoints according to client requirements
  const [pumpSetpoints, setPumpSetpoints] = useState<Setpoints>({
    lowSetpoint: 12,
    highSetpoint: 100
  });
  
  const [flowlineSetpoints, setFlowlineSetpoints] = useState<Setpoints>({
    lowSetpoint: 12,
    highSetpoint: 100
  });
  
  // Simulate real-time pressure changes
  useEffect(() => {
    const pressureInterval = setInterval(() => {
      // Simulate realistic pressure fluctuations based on pump status
      setPumpPressure(prev => {
        let change;
        if (pumpStatus === 'running') {
          // Pressure tends to increase when pump is running
          change = Math.random() * 3 - 0.5; // Mostly increasing
        } else {
          // Pressure tends to decrease when pump is stopped
          change = Math.random() * 3 - 2.5; // Mostly decreasing
        }
        return Math.max(0, Math.min(120, prev + change));
      });
      
      setFlowlinePressure(prev => {
        let change;
        if (pumpStatus === 'running') {
          // Flowline follows pump with some delay/buffering
          change = Math.random() * 2 - 0.3; // Mostly increasing
        } else {
          // Flowline pressure drops when pump is off
          change = Math.random() * 2 - 1.8; // Mostly decreasing
        }
        return Math.max(0, Math.min(110, prev + change));
      });
    }, 2000); // Update every 2 seconds
    
    return () => clearInterval(pressureInterval);
  }, [pumpStatus]);
  
  const handlePumpStatusChange = (newStatus: PumpStatus) => {
    setPumpStatus(newStatus);
  };
  
  return (
    <main className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-3">
        <ProservLogo size={80} />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-right">Proserv SSV Control Panel</h1>
      </header>
      
      <TransmitterValueDisplay
        pumpPressure={pumpPressure}
        flowlinePressure={flowlinePressure}
        pumpSetpoints={pumpSetpoints}
        flowlineSetpoints={flowlineSetpoints}
      />
      
      <div className="my-4 sm:my-6">
        <PressureGraph
          pumpPressure={pumpPressure}
          flowlinePressure={flowlinePressure}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="order-1">
          <SystemControls
            onPumpStatusChange={handlePumpStatusChange}
          />
        </div>
        
        <div className="order-3 sm:order-2">
          <SystemStatus
            currentPumpStatus={pumpStatus}
          />
        </div>
        
        <div className="order-2 sm:order-3 sm:col-span-2 lg:col-span-1">
          <AutoPumpControl
            pumpPressure={pumpPressure}
            pumpSetpoints={pumpSetpoints}
            pumpStatus={pumpStatus}
            onPumpStatusChange={handlePumpStatusChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <TransmitterSetpointControl
          title="Pump Start-Stop Transmitter Setpoint"
          lowSetpoint={pumpSetpoints.lowSetpoint}
          highSetpoint={pumpSetpoints.highSetpoint}
          onSetpointChange={(newSetpoints) => setPumpSetpoints(newSetpoints)}
        />
        
        <TransmitterSetpointControl
          title="Flowline Transmitter Setpoint"
          lowSetpoint={flowlineSetpoints.lowSetpoint}
          highSetpoint={flowlineSetpoints.highSetpoint}
          onSetpointChange={(newSetpoints) => setFlowlineSetpoints(newSetpoints)}
        />
      </div>
      
      <footer className="mt-4 sm:mt-8 text-center">
        <button className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-600 text-sm sm:text-base">
          Reset System
        </button>
      </footer>
    </main>
  );
}