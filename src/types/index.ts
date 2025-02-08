export interface Setpoints {
    lowSetpoint: number;
    highSetpoint: number;
  }
  
  export interface TransmitterSetpointControlProps {
    title: string;
    lowSetpoint: number;
    highSetpoint: number;
    onSetpointChange: (setpoints: Setpoints) => void;
  }
  
  export interface TransmitterValueDisplayProps {
    pumpPressure: number;
    flowlinePressure: number;
    pumpSetpoints: Setpoints;
    flowlineSetpoints: Setpoints;
  }
  
  export interface PressureGraphProps {
    pumpPressure: number;
    flowlinePressure: number;
  }
  
  export type PumpStatus = 'stopped' | 'running' | 'tripped';