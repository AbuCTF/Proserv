// src/components/AutoPumpControl.tsx
'use client';
import { useEffect, useState } from 'react';
import { Setpoints, PumpStatus } from '@/types';

interface AutoPumpControlProps {
  pumpPressure: number;
  pumpSetpoints: Setpoints;
  pumpStatus: PumpStatus;
  onPumpStatusChange: (status: PumpStatus) => void;
}

export const AutoPumpControl: React.FC<AutoPumpControlProps> = ({
  pumpPressure,
  pumpSetpoints,
  pumpStatus,
  onPumpStatusChange
}) => {
  const [isAutoEnabled, setIsAutoEnabled] = useState<boolean>(true);
  const [lastAutoAction, setLastAutoAction] = useState<string>('');
  const [lastActionTime, setLastActionTime] = useState<string>('');
  
  useEffect(() => {
    if (!isAutoEnabled) return;
    
    // Auto-start pump when pressure falls below low setpoint
    if (pumpPressure < pumpSetpoints.lowSetpoint && pumpStatus !== 'running') {
      onPumpStatusChange('running');
      const now = new Date().toLocaleTimeString();
      setLastAutoAction('Auto-started pump due to low pressure');
      setLastActionTime(now);
      console.log('Auto-Control: Started pump due to low pressure');
    }
    
    // Auto-stop pump when pressure exceeds high setpoint
    if (pumpPressure > pumpSetpoints.highSetpoint && pumpStatus === 'running') {
      onPumpStatusChange('stopped');
      const now = new Date().toLocaleTimeString();
      setLastAutoAction('Auto-stopped pump due to high pressure');
      setLastActionTime(now);
      console.log('Auto-Control: Stopped pump due to high pressure');
    }
  }, [pumpPressure, pumpSetpoints, pumpStatus, isAutoEnabled, onPumpStatusChange]);
  
  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-lg h-full">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Automatic Pump Control</h2>
      
      <div className="flex items-center mb-3 sm:mb-4">
        <input
          type="checkbox"
          checked={isAutoEnabled}
          onChange={() => setIsAutoEnabled(!isAutoEnabled)}
          className="mr-2"
          id="auto-control-toggle"
        />
        <label htmlFor="auto-control-toggle" className="font-semibold text-sm sm:text-base">Enable Auto Control</label>
      </div>
      
      <div className="bg-gray-100 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
        <p className="font-semibold">Auto Control Settings:</p>
        <ul className="mt-1 sm:mt-2 text-xs sm:text-sm">
          <li>• Auto-start pump when pressure &lt; {pumpSetpoints.lowSetpoint} barg</li>
          <li>• Auto-stop pump when pressure &gt; {pumpSetpoints.highSetpoint} barg</li>
        </ul>
      </div>
      
      {lastAutoAction && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs sm:text-sm font-medium">{lastAutoAction}</p>
          <p className="text-xs text-gray-500">at {lastActionTime}</p>
        </div>
      )}
      
      <div className="mt-3 sm:mt-4 flex items-center">
        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 ${isAutoEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className="text-xs sm:text-sm">{isAutoEnabled ? 'Auto Control Active' : 'Auto Control Disabled'}</span>
      </div>
    </section>
  );
};