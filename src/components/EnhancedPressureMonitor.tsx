'use client';
import { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, RotateCw, Power } from 'lucide-react';

// Define interfaces for our component props
interface StatusIndicatorProps {
  status: boolean;
  label: string;
  value?: string | number;
}

interface PumpStatusType {
  running: boolean;
  tripped: boolean;
  stopped: boolean;
  efficiency: number;
}

interface SOVStatusType {
  state: 'closed' | 'open';
  position: number;
}

// Theme hook with proper typing
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const storedTheme = localStorage.getItem('theme');
    return (storedTheme === 'dark' || storedTheme === 'light') ? storedTheme : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff');
    }
  }, [theme]);

  return [theme, setTheme] as const;
};

// StatusIndicator component with proper type definition
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, value }) => (
  <div className="flex items-center justify-between p-3 border rounded-lg bg-white border-gray-200 shadow-sm">
    <div className="flex items-center space-x-3">
      <div className={`w-4 h-4 rounded-full ${
        status ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      }`} />
      <span className="font-medium text-gray-900">{label}</span>
    </div>
    {value !== undefined && (
      <span className="text-sm text-gray-700">{value}</span>
    )}
  </div>
);

const EnhancedPressureMonitor: React.FC = () => {
  // System state with proper typing
  const [pressureData, setPressureData] = useState<number[]>([]);
  const [currentPressure, setCurrentPressure] = useState<number>(0);
  const [systemStatus, setSystemStatus] = useState<'normal' | 'high' | 'low'>('normal');
  const [theme, setTheme] = useTheme();

  // Animation state
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Setpoints
  const [lowSetpoint, setLowSetpoint] = useState<number>(30);
  const [highSetpoint, setHighSetpoint] = useState<number>(70);

  // Enhanced pump status with type
  const [pumpStatus, setPumpStatus] = useState<PumpStatusType>({
    running: true,
    tripped: false,
    stopped: false,
    efficiency: 100,
  });

  // SOV status with type
  const [sovStatus, setSOVStatus] = useState<SOVStatusType>({
    state: 'closed',
    position: 0
  });

  const generatePressure = useCallback((): number => {
    const efficiency = pumpStatus.efficiency / 100;
    const basePressure = 50 * efficiency;
    const variance = 10 * efficiency;
    const noise = (Math.random() - 0.5) * variance;
    return Math.max(0, Math.min(100, basePressure + noise));
  }, [pumpStatus.efficiency]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPressure = generatePressure();
      setCurrentPressure(newPressure);
      setPressureData(prev => [...prev.slice(-40), newPressure]);

      // Update system status with hysteresis
      if (newPressure > highSetpoint + 2) {
        setSystemStatus('high');
        setPumpStatus(prev => ({ ...prev, running: false, stopped: true }));
      } else if (newPressure < lowSetpoint - 2) {
        setSystemStatus('low');
        setPumpStatus(prev => ({ ...prev, running: true, stopped: false }));
      } else if (newPressure <= highSetpoint - 1 && newPressure >= lowSetpoint + 1) {
        setSystemStatus('normal');
      }

      // Simulate gradual efficiency degradation
      if (Math.random() < 0.05) {
        setPumpStatus(prev => ({
          ...prev,
          efficiency: Math.max(60, prev.efficiency - 0.5)
        }));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [highSetpoint, lowSetpoint, generatePressure]);

  const getGraphPoints = () => {
    if (pressureData.length < 2) return '';
    
    // Use viewBox coordinates for better scaling
    const width = 1000; // Increased for better resolution
    const height = 200;  // Increased for better height
    const pointSpacing = width / (pressureData.length - 1);
    
    const points = pressureData.map((value, index) => {
      const x = index * pointSpacing;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    });
    
    let smoothPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i].split(',').map(Number);
      const [x2, y2] = points[i + 1].split(',').map(Number);
      const cp1x = x1 + (x2 - x1) / 3;
      const cp1y = y1;
      const cp2x = x1 + 2 * (x2 - x1) / 3;
      const cp2y = y2;
      
      if (i === 0) {
        smoothPoints.push(`M ${x1} ${y1}`);
      }
      smoothPoints.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`);
    }
    
    return smoothPoints.join(' ');
  };

  const handleReset = () => {
    setIsResetting(true);
    setPumpStatus({
      running: true,
      tripped: false,
      stopped: false,
      efficiency: 100
    });
    setSystemStatus('normal');
    setTimeout(() => setIsResetting(false), 1000);
  };

  const toggleSOV = () => {
    setSOVStatus(prev => ({
      state: prev.state === 'open' ? 'closed' : 'open',
      position: prev.state === 'open' ? 0 : 100
    }));
  };
  return (
    // Remove any potential white backgrounds by ensuring all container elements have dark backgrounds
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Updated header with consistent dark theme */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between bg-gray-900">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-semibold text-gray-100">Proserv</h1>
            <span className="px-2 py-1 rounded bg-gray-800 text-xs text-gray-400">
              v2.1
            </span>
          </div>
          <button
            onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </nav>
      </header>

      {/* Main content with consistent white theme */}
      <main className="pt-16 p-4 bg-white">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Pressure Display Card */}
          <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            {/* Current Pressure Display */}
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-gray-900">
                {currentPressure.toFixed(1)}
                <span className="text-2xl ml-2 text-gray-500">PSI</span>
              </div>
              <div className={`mt-2 text-sm font-medium ${
                systemStatus === 'normal' ? 'text-green-600' :
                systemStatus === 'high' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {systemStatus.toUpperCase()} PRESSURE
              </div>
            </div>

            {/* Enhanced Graph Container */}
            <div className="relative w-full h-[160px] overflow-hidden rounded-lg bg-gray-50 p-2">
              <svg 
                viewBox="0 0 1000 200" 
                className="w-full h-full" 
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid pattern */}
                <pattern id="grid" width="100" height="40" patternUnits="userSpaceOnUse">
                  <path 
                    d="M 100 0 L 0 0 0 40" 
                    fill="none" 
                    stroke="rgba(0,0,0,0.1)" 
                    strokeWidth="1"
                  />
                </pattern>
                <rect width="1000" height="200" fill="url(#grid)" />

                {/* Threshold lines */}
                <line 
                  x1="0" y1={200 - (highSetpoint * 2)} x2="1000" y2={200 - (highSetpoint * 2)}
                  stroke="#EF4444" strokeWidth="2" strokeDasharray="8"
                  opacity="0.5"
                />
                <line 
                  x1="0" y1={200 - (lowSetpoint * 2)} x2="1000" y2={200 - (lowSetpoint * 2)}
                  stroke="#F59E0B" strokeWidth="2" strokeDasharray="8"
                  opacity="0.5"
                />

                {/* Pressure line */}
                <path
                  d={getGraphPoints()}
                  fill="url(#line-gradient)"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
              </svg>
            </div>
          </section>

          {/* Status and Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Status Card */}
            <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-900">System Status</h2>
              <div className="space-y-3">
                <StatusIndicator
                  status={systemStatus === 'normal'}
                  label="System Health"
                  value={systemStatus.toUpperCase()}
                />
                <StatusIndicator
                  status={pumpStatus.running}
                  label="Pump Status"
                  value={`${pumpStatus.efficiency.toFixed(1)}% Efficiency`}
                />
                <StatusIndicator
                  status={sovStatus.state === 'open'}
                  label="SOV Status"
                  value={`${sovStatus.position}% Open`}
                />
              </div>
            </section>

            {/* Controls Card */}
            <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-900">System Controls</h2>
              <div className="grid grid-cols-1 gap-4">
                <button
                  className={`flex items-center justify-center space-x-2 w-full p-4 rounded-lg ${
                    isResetting ? 'bg-green-500' : 'bg-blue-500'
                  } text-white hover:bg-opacity-90 transition-colors`}
                  onClick={handleReset}
                  disabled={isResetting}
                >
                  <RotateCw className={`w-5 h-5 ${isResetting ? 'animate-spin' : ''}`} />
                  <span>Reset System</span>
                </button>
                <button
                  className={`flex items-center justify-center space-x-2 w-full p-4 rounded-lg ${
                    sovStatus.state === 'open' ? 'bg-red-500' : 'bg-gray-700'
                  } text-white hover:bg-opacity-90 transition-colors`}
                  onClick={toggleSOV}
                >
                  <Power className="w-5 h-5" />
                  <span>Toggle SOV {sovStatus.state === 'open' ? 'Closed' : 'Open'}</span>
                </button>
              </div>
            </section>
          </div>

          {/* Setpoints Card */}
          <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-black">Setpoints</h2>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-black">
                  Low Pressure Setpoint
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lowSetpoint}
                  onChange={(e) => setLowSetpoint(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"/>
                <div className="mt-1 text-sm text-black">
                  {lowSetpoint} PSI
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-black">
                  High Pressure Setpoint
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={highSetpoint}
                  onChange={(e) => setHighSetpoint(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"/>
                <div className="mt-1 text-sm text-black">
                  {highSetpoint} PSI
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EnhancedPressureMonitor;
