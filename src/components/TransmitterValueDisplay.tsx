'use client';
import { useState, useEffect } from 'react';
import { Setpoints, TransmitterValueDisplayProps } from '@/types';

export const TransmitterValueDisplay: React.FC<TransmitterValueDisplayProps> = ({ 
  pumpPressure, 
  flowlinePressure, 
  pumpSetpoints, 
  flowlineSetpoints 
}) => {
  const getPressureStatus = (pressure: number, setpoints: Setpoints) => {
    if (pressure < setpoints.lowSetpoint) return 'Low Pressure';
    if (pressure > setpoints.highSetpoint) return 'High Pressure';
    return 'Normal Pressure';
  };

  return (
    <div className="flex justify-between bg-white rounded-xl p-4 shadow-lg mb-6">
      <div className="text-center flex-1">
        <h3 className="font-bold text-lg">Pump Transmitter</h3>
        <p className={`
          font-semibold 
          ${getPressureStatus(pumpPressure, pumpSetpoints) === 'Low Pressure' ? 'text-blue-500' : 
            getPressureStatus(pumpPressure, pumpSetpoints) === 'High Pressure' ? 'text-red-500' : 'text-green-500'}
        `}>
          {getPressureStatus(pumpPressure, pumpSetpoints)}
        </p>
        <p>{pumpPressure.toFixed(2)} barg</p>
      </div>
      <div className="text-center flex-1">
        <h3 className="font-bold text-lg">Flowline Transmitter</h3>
        <p className={`
          font-semibold 
          ${getPressureStatus(flowlinePressure, flowlineSetpoints) === 'Low Pressure' ? 'text-blue-500' : 
            getPressureStatus(flowlinePressure, flowlineSetpoints) === 'High Pressure' ? 'text-red-500' : 'text-green-500'}
        `}>
          {getPressureStatus(flowlinePressure, flowlineSetpoints)}
        </p>
        <p>{flowlinePressure.toFixed(2)} barg</p>
      </div>
    </div>
  );
};