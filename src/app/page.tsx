// app/page.tsx - Updated version
"use client";
import { useState, useEffect } from "react";
import { ProservLogo } from "@/components/ProservLogo";
import { SystemControls } from "@/components/SystemControls";
import { SystemStatus } from "@/components/SystemStatus";
import { PressureGraph } from "@/components/PressureGraph";
import { TransmitterSetpointControl } from "@/components/TransmitterSetpointControl";
import { TransmitterValueDisplay } from "@/components/TransmitterValueDisplay";
import { AutoPumpControl } from "@/components/AutoPumpControl";
import { Setpoints, PumpStatus } from "@/types";

const ESP_API_BASE = "http://192.168.181.161"; // Replace with your ESP32's IP address

export default function Home() {
  const [pumpPressure, setPumpPressure] = useState<number>(0);
  const [flowlinePressure, setFlowlinePressure] = useState<number>(0);
  const [pumpStatus, setPumpStatus] = useState<PumpStatus>("stopped");

  const [pumpSetpoints, setPumpSetpoints] = useState<Setpoints>({
    lowSetpoint: 10, // Default ESP32 startThreshold value
    highSetpoint: 95, // Default ESP32 stopThreshold value
  });

  const [flowlineSetpoints, setFlowlineSetpoints] = useState<Setpoints>({
    lowSetpoint: 12,
    highSetpoint: 100,
  });

  // Fetch latest state from ESP every 2 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${ESP_API_BASE}/api/state`);
        const data = await res.json();

        // Update based on ESP32 server response format
        setPumpPressure(data.pressure || 0);
        // If your ESP doesn't provide flowlinePressure, you can either
        // use the same pressure value or keep your existing simulation
        setFlowlinePressure(data.pressure || 0);

        // Status comes as a boolean from ESP32
        setPumpStatus(data.pumpStatus ? "running" : "stopped");

        // Update thresholds from ESP32 values
        setPumpSetpoints({
          lowSetpoint: data.startThreshold || 10,
          highSetpoint: data.stopThreshold || 95,
        });
      } catch (err) {
        console.error("Error fetching from ESP32:", err);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 2000); // poll every 2s
    return () => clearInterval(interval);
  }, []);

  // Pump on/off control via API
  const handlePumpStatusChange = async (newStatus: PumpStatus) => {
    try {
      await fetch(`${ESP_API_BASE}/api/pump`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus === "running" }),
      });
      setPumpStatus(newStatus); // Optimistic update
    } catch (err) {
      console.error("Failed to update pump status:", err);
    }
  };

  // Update thresholds (only for pump setpoint changes)
  const updatePumpSetpoints = async (newSetpoints: Setpoints) => {
    try {
      await fetch(`${ESP_API_BASE}/api/thresholds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startThreshold: newSetpoints.lowSetpoint,
          stopThreshold: newSetpoints.highSetpoint,
        }),
      });
      setPumpSetpoints(newSetpoints);
    } catch (err) {
      console.error("Failed to update setpoints:", err);
    }
  };

  // Add manual control for simulation parameters (optional)
  const updateSimulationParams = async (
    pressure: number,
    rate: number = 1.0
  ) => {
    try {
      await fetch(`${ESP_API_BASE}/api/simulation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pressure, rate }),
      });
    } catch (err) {
      console.error("Failed to update simulation params:", err);
    }
  };

  return (
    <main className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      {/* Rest of your component remains the same */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-3">
        <ProservLogo size={80} />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-right">
          Proserv SSV Control Panel
        </h1>
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
            espApiBase={ESP_API_BASE}
          />{" "}
        </div>

        <div className="order-3 sm:order-2">
          <SystemStatus currentPumpStatus={pumpStatus} />
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
          onSetpointChange={updatePumpSetpoints}
        />

        <TransmitterSetpointControl
          title="Flowline Transmitter Setpoint"
          lowSetpoint={flowlineSetpoints.lowSetpoint}
          highSetpoint={flowlineSetpoints.highSetpoint}
          onSetpointChange={(newSetpoints) =>
            setFlowlineSetpoints(newSetpoints)
          }
        />
      </div>

      <footer className="mt-4 sm:mt-8 text-center">
        <button
          className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
          onClick={() => updateSimulationParams(50, 1.0)} // Reset simulation to default values
        >
          Reset System
        </button>
      </footer>
    </main>
  );
}
