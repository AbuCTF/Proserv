// src/components/SystemControls.tsx - Updated for ESP32
"use client";
import { useState } from "react";
import { Power, Play, Pause } from "lucide-react";
import { PumpStatus } from "@/types";

interface SystemControlsProps {
  onPumpStatusChange: (status: PumpStatus) => void;
  espApiBase: string; // Add ESP32 API base URL as a prop
}

export const SystemControls: React.FC<SystemControlsProps> = ({
  onPumpStatusChange,
  espApiBase,
}) => {
  const [pumpState, setPumpState] = useState<PumpStatus>("stopped");
  const [sovState, setSovState] = useState<"closed" | "open">("closed");

  const handlePumpControl = async (action: "start" | "stop") => {
    try {
      // Convert action to boolean status for ESP32 API
      const pumpStatus = action === "start";

      const res = await fetch(`${espApiBase}/api/pump`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: pumpStatus }),
      });

      if (res.ok) {
        const newStatus: PumpStatus = pumpStatus ? "running" : "stopped";
        setPumpState(newStatus);
        onPumpStatusChange(newStatus);
        console.log(`Pump ${action} command sent.`);
      } else {
        console.error("Pump control failed");
      }
    } catch (error) {
      console.error("Error controlling pump:", error);
    }
  };

  // Keep SOV logic simulated
  const simulateRelaySignal = () => Math.random() > 0.5;

  const handleSOVToggle = () => {
    const relaySignal = simulateRelaySignal();
    if (relaySignal) {
      setSovState((prev) => (prev === "closed" ? "open" : "closed"));
      console.log("SOV Toggle Signal Generated");
    }
  };

  return (
    <section className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">SSV Control Panel Controls</h2>
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => handlePumpControl("start")}
          disabled={pumpState === "running"}
          className={`flex items-center justify-center space-x-2 w-full p-4 rounded-lg
            ${pumpState === "running" ? "bg-green-500" : "bg-blue-500"}
            text-white hover:opacity-90`}
        >
          <Play className="w-5 h-5" />
          <span>Pump Start (Relay Signal)</span>
        </button>

        <button
          onClick={() => handlePumpControl("stop")}
          disabled={pumpState === "stopped"}
          className={`flex items-center justify-center space-x-2 w-full p-4 rounded-lg
            ${pumpState === "stopped" ? "bg-red-500" : "bg-gray-500"}
            text-white hover:opacity-90`}
        >
          <Pause className="w-5 h-5" />
          <span>Pump Stop (Relay Signal)</span>
        </button>

        <button
          onClick={handleSOVToggle}
          className={`flex items-center justify-center space-x-2 w-full p-4 rounded-lg
            ${sovState === "open" ? "bg-red-500" : "bg-gray-700"}
            text-white hover:opacity-90`}
        >
          <Power className="w-5 h-5" />
          <span>
            SOV {sovState === "open" ? "Close" : "Open"} (Relay Signal)
          </span>
        </button>
      </div>
    </section>
  );
};
