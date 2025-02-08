// src/components/TransmitterSetpointControl.tsx
'use client';
import { useState } from 'react';
import { TransmitterSetpointControlProps, Setpoints } from '@/types';

export const TransmitterSetpointControl: React.FC<TransmitterSetpointControlProps> = ({ 
  title, 
  lowSetpoint, 
  highSetpoint, 
  onSetpointChange 
}) => {
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);
  const [localLowSetpoint, setLocalLowSetpoint] = useState<number>(lowSetpoint);
  const [localHighSetpoint, setLocalHighSetpoint] = useState<number>(highSetpoint);

  const handleSetpointUpdate = () => {
    const newSetpoints: Setpoints = {
      lowSetpoint: localLowSetpoint,
      highSetpoint: localHighSetpoint
    };
    onSetpointChange(newSetpoints);
  };

  return (
    <section className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isManualEntry}
          onChange={() => setIsManualEntry(!isManualEntry)}
          className="mr-2"
        />
        <label>Manual Entry</label>
      </div>

      {isManualEntry ? (
        <div className="space-y-4">
          <div>
            <label>Low Setpoint</label>
            <input
              type="number"
              value={localLowSetpoint}
              onChange={(e) => setLocalLowSetpoint(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>High Setpoint</label>
            <input
              type="number"
              value={localHighSetpoint}
              onChange={(e) => setLocalHighSetpoint(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label>Low Setpoint: {localLowSetpoint} barg</label>
            <input
              type="range"
              min="0"
              max="100"
              value={localLowSetpoint}
              onChange={(e) => setLocalLowSetpoint(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label>High Setpoint: {localHighSetpoint} barg</label>
            <input
              type="range"
              min="0"
              max="100"
              value={localHighSetpoint}
              onChange={(e) => setLocalHighSetpoint(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSetpointUpdate}
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Update Setpoints
      </button>
    </section>
  );
};
