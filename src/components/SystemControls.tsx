// src/components/SystemControls.tsx
'use client';
import { useState } from 'react';
import { Power, Play, Pause, Activity } from 'lucide-react';
import { PumpStatus } from '@/types';

interface SystemControlsProps {
  onPumpStatusChange: (status: PumpStatus) => void;
}

export const SystemControls: React.FC<SystemControlsProps> = ({ onPumpStatusChange }) => {
  const [pumpState, setPumpState] = useState<PumpStatus>('stopped');
  const [sovState, setSovState] = useState<'closed' | 'open'>('closed');
  const [lastControlSource, setLastControlSource] = useState<'manual' | 'auto'>('manual');

  const simulateRelaySignal = () => {
    // Simulating realistic relay signal generation
    return Math.random() > 0.5;
  };

  const handlePumpStart = () => {
    const relaySignal = simulateRelaySignal();
    if (relaySignal) {
      const newStatus: PumpStatus = 'running';
      setPumpState(newStatus);
      setLastControlSource('manual');
      onPumpStatusChange(newStatus);
      console.log('Pump Start Signal Generated (Manual)');
    }
  };

  const handlePumpStop = () => {
    const relaySignal = simulateRelaySignal();
    if (relaySignal) {
      const newStatus: PumpStatus = 'stopped';
      setPumpState(newStatus);
      setLastControlSource('manual');
      onPumpStatusChange(newStatus);
      console.log('Pump Stop Signal Generated (Manual)');
    }
  };

  const handleSOVToggle = () => {
    const relaySignal = simulateRelaySignal();
    if (relaySignal) {
      setSovState(prev => prev === 'closed' ? 'open' : 'closed');
      console.log('SOV Toggle Signal Generated');
    }
  };

  // Update the pump state when changed externally (by auto control)
  if (pumpState !== 'running' && pumpState !== 'stopped') {
    setPumpState('stopped');
  }

  return (
    <section className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">SSV Control Panel Controls</h2>
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={handlePumpStart}
          disabled={pumpState === 'running'}
          className={`flex items-center justify-center space-x-2 w-full p-4 rounded-lg
            ${pumpState === 'running' ? 'bg-green-500' : 'bg-blue-500'}
            text-white hover:opacity-90`}
        >
          <Play className="w-5 h-5" />
          <span>Pump Start (Relay Signal)</span>
        </button>

        <button
          onClick={handlePumpStop}
          disabled={pumpState === 'stopped'}
          className={`flex items-center justify-center space-x-2 w-full p-4 rounded-lg
            ${pumpState === 'stopped' ? 'bg-red-500' : 'bg-gray-500'}
            text-white hover:opacity-90`}
        >
          <Pause className="w-5 h-5" />
          <span>Pump Stop (Relay Signal)</span>
        </button>

        <button
          onClick={handleSOVToggle}
          className={`flex items-center justify-center space-x-2 w-full p-4 rounded-lg
            ${sovState === 'open' ? 'bg-red-500' : 'bg-gray-700'}
            text-white hover:opacity-90`}
        >
          <Power className="w-5 h-5" />
          <span>SOV {sovState === 'open' ? 'Close' : 'Open'} (Relay Signal)</span>
        </button>
      </div>
    </section>
  );
};