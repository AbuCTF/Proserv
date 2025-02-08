// src/components/SystemStatus.tsx
'use client';
import { useState, useEffect } from 'react';
import { PumpStatus } from '@/types';

interface SystemStatusProps {
  currentPumpStatus: PumpStatus;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ currentPumpStatus }) => {
  return (
    <section className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">SSV Control Panel Status</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <span className={`mr-2 w-4 h-4 rounded-full ${currentPumpStatus === 'running' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
          <span>Pump Running</span>
        </div>
        <div className="flex items-center">
          <span className={`mr-2 w-4 h-4 rounded-full ${currentPumpStatus === 'stopped' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
          <span>Pump Stop</span>
        </div>
        <div className="flex items-center">
          <span className={`mr-2 w-4 h-4 rounded-full ${currentPumpStatus === 'tripped' ? 'bg-yellow-500' : 'bg-gray-300'}`}></span>
          <span>Pump Trip</span>
        </div>
      </div>
    </section>
  );
};
