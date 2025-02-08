// src/components/PressureGraph.tsx
'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PressureGraphProps } from '@/types';

interface PressureDataPoint {
  name: string;
  pumpPressure: number;
  flowlinePressure: number;
}

export const PressureGraph: React.FC<PressureGraphProps> = ({ 
  pumpPressure, 
  flowlinePressure 
}) => {
  const [pressureData, setPressureData] = useState<PressureDataPoint[]>([
    { name: 'Start', pumpPressure: 0, flowlinePressure: 0 }
  ]);

  useEffect(() => {
    // Add new data point while keeping only last 10 points
    setPressureData(prevData => {
      const newData = [
        ...prevData.slice(Math.max(prevData.length - 9, 0)),
        { 
          name: new Date().toLocaleTimeString(), 
          pumpPressure, 
          flowlinePressure 
        }
      ];
      return newData;
    });
  }, [pumpPressure, flowlinePressure]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Real-Time Pressure Monitoring</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={pressureData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Pressure (barg)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="pumpPressure" 
            stroke="#8884d8" 
            name="Pump Pressure"
            strokeWidth={3}
          />
          <Line 
            type="monotone" 
            dataKey="flowlinePressure" 
            stroke="#82ca9d" 
            name="Flowline Pressure"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};