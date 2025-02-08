// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { ProservLogo } from '@/components/ProservLogo';
import { SystemControls } from '@/components/SystemControls';
import { SystemStatus } from '@/components/SystemStatus';
import { PressureGraph } from '@/components/PressureGraph';
import { TransmitterSetpointControl } from '@/components/TransmitterSetpointControl';
import { TransmitterValueDisplay } from '@/components/TransmitterValueDisplay';
import { Setpoints, PumpStatus } from '@/types';

export default function Home() {
  // State for pressures and setpoints
  const [pumpPressure, setPumpPressure] = useState<number>(0);
  const [flowlinePressure, setFlowlinePressure] = useState<number>(0);
  
  const [pumpStatus, setPumpStatus] = useState<PumpStatus>('stopped');
  
  const [pumpSetpoints, setPumpSetpoints] = useState<Setpoints>({
    lowSetpoint: 4,
    highSetpoint: 100
  });

  const [flowlineSetpoints, setFlowlineSetpoints] = useState<Setpoints>({
    lowSetpoint: 4,
    highSetpoint: 100
  });

  // Simulate real-time pressure changes
  useEffect(() => {
    const pressureInterval = setInterval(() => {
      // Simulate realistic pressure fluctuations
      setPumpPressure(prev => {
        const newPressure = prev + (Math.random() * 10 - 5);
        return Math.max(0, Math.min(100, newPressure));
      });

      setFlowlinePressure(prev => {
        const newPressure = prev + (Math.random() * 10 - 5);
        return Math.max(0, Math.min(100, newPressure));
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(pressureInterval);
  }, []);

  const handlePumpStatusChange = (newStatus: PumpStatus) => {
    setPumpStatus(newStatus);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <ProservLogo size={80} />
        <h1 className="text-3xl font-bold">Proserv SSV Control Panel</h1>
      </header>

      <TransmitterValueDisplay 
        pumpPressure={pumpPressure}
        flowlinePressure={flowlinePressure}
        pumpSetpoints={pumpSetpoints}
        flowlineSetpoints={flowlineSetpoints}
      />

      <PressureGraph 
        pumpPressure={pumpPressure} 
        flowlinePressure={flowlinePressure} 
      />

      <div className="grid grid-cols-2 gap-6 mb-6">
        <SystemControls 
          onPumpStatusChange={handlePumpStatusChange} 
        />
        <SystemStatus 
          currentPumpStatus={pumpStatus} 
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
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

      <footer className="mt-8 text-center">
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Reset System
        </button>
      </footer>
    </main>
  );
}