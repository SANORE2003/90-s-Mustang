import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls as DreiOrbitControls,
} from "@react-three/drei";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Car from "../Components/Car";
import Gt from "../Components/Gt";
import Mustang1968 from "../Components/Mustang1968";
import logoGif from "../assets/wheelwithwings.gif";

// ======================
// Data Definitions
// ======================

const CAR_INFO = {
  Car: {
    name: "Classic Car",
    model: "1965",
    engine: "V6",
    speed: "150mph",
    brake: "BRAKE1",
    description: "A timeless classic with balanced performance and vintage charm.",
  },
  Gt: {
    name: "GT Sports",
    model: "1967",
    engine: "V7",
    speed: "180mph",
    brake: "BRAKE1",
    description: "Aggressive styling with enhanced power and track-ready dynamics.",
  },
  Mustang1968: {
    name: "Mustang 1968",
    model: "1968",
    engine: "V8",
    speed: "190mph",
    brake: "BRAKE1",
    description: "American muscle icon with roaring V8 and iconic design.",
  },
};

const CAR_COMPONENTS = {
  Car,
  Gt,
  Mustang1968,
};

// ======================
// 3D Scene Component
// ======================

const CarScene = ({ carKey }) => {
  const CarComponent = CAR_COMPONENTS[carKey] || Car;
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} castShadow shadowMapSize={[2048, 2048]} />
      <directionalLight position={[-5, 3, -5]} intensity={1} color="#4a90ff" />
      <directionalLight position={[0, 2, -8]} intensity={1} color="#b190f6" />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1.5} castShadow />
      <Environment preset="city" />
      <group position={[0, -1, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.8, 1.8, 1.8]}>
        <CarComponent />
      </group>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={5} color="#000000" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.51, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      <DreiOrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={12}
        minPolarAngle={0.3}
        maxPolarAngle={1.6}
        target={[0, 1, 0]}
      />
    </>
  );
};

// ======================
// Info Card Component
// ======================

const CarInfoCard = ({ carKey, label, gradientFrom, gradientTo, border, textColor, labelColor }) => {
  const info = carKey ? CAR_INFO[carKey] : null;

  return (
    <div
      className={`p-5 bg-gradient-to-b ${gradientFrom} ${gradientTo} backdrop-blur-lg rounded-2xl border ${border} shadow-lg`}
    >
      <h2 className={`text-xl font-bold ${labelColor} mb-3 text-center`}>{label}</h2>
      {info ? (
        <div className={`space-y-2 ${textColor}`}>
          <p><span className="font-semibold">Name:</span> {info.name}</p>
          <p><span className="font-semibold">Model:</span> {info.model}</p>
          <p><span className="font-semibold">Engine:</span> {info.engine}</p>
          <p><span className="font-semibold">Top Speed:</span> {info.speed}</p>
          <p><span className="font-semibold">Brakes:</span> {info.brake}</p>
          <p className="mt-2 text-sm italic opacity-90">{info.description}</p>
        </div>
      ) : (
        <p className={`text-center text-sm opacity-70`}>No car selected.</p>
      )}
    </div>
  );
};

// ======================
// Main Comparison Page
// ======================

const Comparison = () => {
  const navigate = useNavigate();
  const [carA, setCarA] = useState("");
  const [carB, setCarB] = useState("");
  const allCars = Object.keys(CAR_INFO);
  const [aiComparison, setAiComparison] = useState("");

  // Generate AI comparison text
  useEffect(() => {
    if (carA && carB) {
      const infoA = CAR_INFO[carA];
      const infoB = CAR_INFO[carB];
      const comparisonText = `AI Analysis:\n\nBetween the ${infoA.name} (${infoA.model}) and the ${infoB.name} (${infoB.model}), the ${infoB.name} offers superior top speed (${infoB.speed} vs ${infoA.speed}) and a more aggressive engine note due to its ${infoB.engine} configuration. However, the ${infoA.name} provides a smoother, more refined driving experience ideal for daily cruising. Choose ${infoB.name} for raw performance, or ${infoA.name} for classic elegance.`;
      setAiComparison(comparisonText);
    } else {
      setAiComparison("");
    }
  }, [carA, carB]);

  const handleCarAChange = (e) => setCarA(e.target.value);
  const handleCarBChange = (e) => setCarB(e.target.value);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/3 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-bounce"
        style={{ animationDuration: "6s" }}
      />

      {/* Logo */}
      <img
        src={logoGif}
        alt="Mustang Logo"
        className="absolute top-2 right-8 w-40 h-40 object-contain z-30 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] hover:scale-125 transition-transform duration-500"
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-400/40 hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 hover:scale-105 text-white shadow-lg shadow-blue-500/10"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-semibold tracking-wide">Dashboard</span>
        </button>
      </div>

      {/* Page Title */}
      <h1 className="absolute top-[2%] left-1/2 transform -translate-x-1/2 text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 text-center px-4">
        Compare Vehicles
      </h1>

      {/* Main Content */}
      <div className="absolute inset-0 pt-28 pb-4 px-4 md:px-6 flex flex-col gap-6">
        {/* 3D Canvases */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-b from-black/30 to-black/50 backdrop-blur-lg shadow-2xl shadow-indigo-900/30 h-[320px] md:h-[400px]">
            {carA ? (
              <Canvas shadows camera={{ position: [5, 3, 5], fov: 50 }}>
                <CarScene carKey={carA} />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-4">
                <p className="text-blue-200/80 text-sm">Select a car to view its 3D model.</p>
              </div>
            )}
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden border border-purple-500/20 bg-gradient-to-b from-black/30 to-black/50 backdrop-blur-lg shadow-2xl shadow-purple-900/30 h-[320px] md:h-[400px]">
            {carB ? (
              <Canvas shadows camera={{ position: [5, 3, 5], fov: 50 }}>
                <CarScene carKey={carB} />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-4">
                <p className="text-purple-200/80 text-sm">Select a second car to compare.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dropdown Selectors */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center px-2">
          <select
            value={carA}
            onChange={handleCarAChange}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-white border border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full md:w-auto"
          >
            <option value="">Select Car A</option>
            {allCars.map((key) => (
              <option key={key} value={key}>
                {CAR_INFO[key].name} ({CAR_INFO[key].model})
              </option>
            ))}
          </select>
          <span className="text-white font-bold text-xl hidden md:block">VS</span>
          <span className="text-white font-bold text-center my-2 md:hidden">VS</span>
          <select
            value={carB}
            onChange={handleCarBChange}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/50 to-red-900/50 text-white border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full md:w-auto"
          >
            <option value="">Select Car B</option>
            {allCars.map((key) => (
              <option key={key} value={key}>
                {CAR_INFO[key].name} ({CAR_INFO[key].model})
              </option>
            ))}
          </select>
        </div>

        {/* Info Cards + AI Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <CarInfoCard
            carKey={carA}
            label="Car A"
            gradientFrom="from-cyan-900/20"
            gradientTo="to-blue-900/20"
            border="border-cyan-500/30"
            textColor="text-blue-100"
            labelColor="text-cyan-300"
          />
          <div className="p-5 bg-gradient-to-b from-orange-900/30 to-red-900/30 backdrop-blur-lg rounded-2xl border border-orange-500/40 shadow-lg flex items-center justify-center">
            {aiComparison ? (
              <div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-400 mb-3 text-center">
                  AI Comparison 🔥
                </h2>
                <div className="text-orange-100 whitespace-pre-line leading-relaxed text-sm md:text-base max-h-48 overflow-y-auto custom-scrollbar">
                  {aiComparison}
                </div>
              </div>
            ) : (
              <p className="text-orange-200/70 text-center text-sm">
                Select both cars to see AI analysis.
              </p>
            )}
          </div>
          <CarInfoCard
            carKey={carB}
            label="Car B"
            gradientFrom="from-purple-900/20"
            gradientTo="to-red-900/20"
            border="border-purple-500/30"
            textColor="text-purple-100"
            labelColor="text-purple-300"
          />
        </div>
      </div>

      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ef4444);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #fb923c, #f87171);
        }
      `}</style>
    </div>
  );
};

export default Comparison;