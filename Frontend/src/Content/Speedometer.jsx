import React, { useState, useEffect, useRef } from 'react';

export default function CarSpeedometer() {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Initialize audio engine
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = 0;

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update engine sound based on speed
  useEffect(() => {
    if (!audioContextRef.current) return;

    // Stop previous oscillator if exists
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    if (speed > 0) {
      // Create new oscillator
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = 'sawtooth';
      
      // Calculate frequency based on RPM (engine sound pitch)
      const baseFrequency = 80 + (rpm / 8000) * 300; // 80Hz to 380Hz
      oscillatorRef.current.frequency.value = baseFrequency;
      
      // Add some variation for realism
      const lfo = audioContextRef.current.createOscillator();
      lfo.frequency.value = 5;
      const lfoGain = audioContextRef.current.createGain();
      lfoGain.gain.value = 10;
      lfo.connect(lfoGain);
      lfoGain.connect(oscillatorRef.current.frequency);
      
      // Connect to gain node
      oscillatorRef.current.connect(gainNodeRef.current);
      
      // Set volume based on speed
      const volume = Math.min(0.3, speed / 220 * 0.3);
      gainNodeRef.current.gain.value = volume;
      
      // Start oscillators
      oscillatorRef.current.start();
      lfo.start();
    } else {
      gainNodeRef.current.gain.value = 0;
    }
  }, [speed, rpm]);

  useEffect(() => {
    setRpm(speed * 40 + Math.random() * 200);
  }, [speed]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      
      setSpeed(prevSpeed => {
        let newSpeed = prevSpeed + (e.deltaY > 0 ? -2 : 2);
        newSpeed = Math.max(0, Math.min(220, newSpeed));
        return newSpeed;
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const speedAngle = (speed / 220) * 270 - 135;
  const rpmAngle = (rpm / 8000) * 270 - 135;

  const createTicks = (count, radius, length, labels = false, step = 1) => {
    const ticks = [];
    for (let i = 0; i <= count; i++) {
      const angle = (i / count) * 270 - 135;
      const rad = (angle * Math.PI) / 180;
      const x1 = 150 + Math.cos(rad) * radius;
      const y1 = 150 + Math.sin(rad) * radius;
      const x2 = 150 + Math.cos(rad) * (radius - length);
      const y2 = 150 + Math.sin(rad) * (radius - length);

      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={i % 2 === 0 ? '#fff' : '#666'}
          strokeWidth={i % 2 === 0 ? 2 : 1}
        />
      );

      if (labels && i % 2 === 0) {
        const labelRadius = radius - length - 15;
        const lx = 150 + Math.cos(rad) * labelRadius;
        const ly = 150 + Math.sin(rad) * labelRadius;
        ticks.push(
          <text
            key={`label-${i}`}
            x={lx}
            y={ly}
            fill="#fff"
            fontSize="12"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {i * step}
          </text>
        );
      }
    }
    return ticks;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-8">
      <div className="relative">
        {/* Instruction Text */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-white text-lg font-semibold mb-2">
            🎧 Scroll your mouse wheel to control speed
            {speed > 0 && <span className="ml-2 text-green-400">🔊 Engine Running</span>}
          </p>
          <p className="text-gray-400 text-sm">↑ Scroll Up = Accelerate | ↓ Scroll Down = Decelerate</p>
        </div>

        {/* Main Dashboard */}
        <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl border-4 border-gray-700">
          <div className="flex gap-8">
            {/* RPM Gauge */}
            <div className="relative">
              <svg width="300" height="300" className="transform rotate-0">
                {/* Gauge Background */}
                <circle cx="150" cy="150" r="140" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
                
                {/* Danger Zone */}
                <path
                  d="M 150 150 L 222 75 A 140 140 0 0 1 255 150 Z"
                  fill="rgba(239, 68, 68, 0.3)"
                />
                
                {/* Ticks */}
                {createTicks(16, 135, 10)}
                
                {/* RPM Labels */}
                {[0, 2, 4, 6, 8].map((val, i) => {
                  const angle = (i / 4) * 270 - 135;
                  const rad = (angle * Math.PI) / 180;
                  const x = 150 + Math.cos(rad) * 110;
                  const y = 150 + Math.sin(rad) * 110;
                  return (
                    <text
                      key={val}
                      x={x}
                      y={y}
                      fill="#fff"
                      fontSize="18"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {val}
                    </text>
                  );
                })}
                
                {/* Center Text */}
                <text x="150" y="180" fill="#888" fontSize="12" textAnchor="middle">
                  RPM x1000
                </text>
                
                {/* Needle */}
                <line
                  x1="150"
                  y1="150"
                  x2="150"
                  y2="40"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  transform={`rotate(${rpmAngle} 150 150)`}
                  style={{ transition: 'transform 0.3s ease-out' }}
                />
                <circle cx="150" cy="150" r="12" fill="#ef4444" />
                <circle cx="150" cy="150" r="6" fill="#1a1a1a" />
              </svg>
            </div>

            {/* Speed Gauge */}
            <div className="relative">
              <svg width="300" height="300" className="transform rotate-0">
                {/* Gauge Background */}
                <circle cx="150" cy="150" r="140" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
                
                {/* Ticks */}
                {createTicks(22, 135, 10)}
                
                {/* Speed Labels */}
                {[0, 40, 80, 120, 160, 200, 220].map((val, i) => {
                  const angle = ((val / 220) * 270) - 135;
                  const rad = (angle * Math.PI) / 180;
                  const x = 150 + Math.cos(rad) * 110;
                  const y = 150 + Math.sin(rad) * 110;
                  return (
                    <text
                      key={val}
                      x={x}
                      y={y}
                      fill="#fff"
                      fontSize="16"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {val}
                    </text>
                  );
                })}
                
                {/* Center Text */}
                <text x="150" y="180" fill="#888" fontSize="12" textAnchor="middle">
                  km/h
                </text>
                
                {/* Needle */}
                <line
                  x1="150"
                  y1="150"
                  x2="150"
                  y2="40"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  transform={`rotate(${speedAngle} 150 150)`}
                  style={{ transition: 'transform 0.3s ease-out' }}
                />
                <circle cx="150" cy="150" r="12" fill="#3b82f6" />
                <circle cx="150" cy="150" r="6" fill="#1a1a1a" />
              </svg>
              
              {/* Digital Speed Display */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-black px-6 py-3 rounded-lg border-2 border-blue-500">
                  <div className="text-5xl font-bold text-blue-400 tabular-nums">
                    {Math.round(speed)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Panel */}
          <div className="mt-6 flex justify-between items-center bg-black rounded-xl p-4">
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-gray-400 text-xs uppercase">Gear</div>
                <div className="text-white text-2xl font-bold">
                  {speed === 0 ? 'N' : speed < 40 ? '1' : speed < 80 ? '2' : speed < 120 ? '3' : speed < 160 ? '4' : '5'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs uppercase">Fuel</div>
                <div className="text-green-400 text-2xl font-bold">78%</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs uppercase">Temp</div>
                <div className="text-blue-400 text-2xl font-bold">90°C</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs uppercase">Sound</div>
                <div className={`text-2xl font-bold ${speed > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                  {speed > 0 ? '🔊' : '🔇'}
                </div>
              </div>
            </div>
            
            {/* Warning Lights */}
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${speed > 180 ? 'bg-red-500' : 'bg-gray-700'}`}>
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${speed > 0 ? 'bg-green-500' : 'bg-gray-700'}`}>
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}