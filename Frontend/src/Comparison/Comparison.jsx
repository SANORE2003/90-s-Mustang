import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls as DreiOrbitControls,
  useGLTF,
  Center,
} from "@react-three/drei";
import { ChevronDown, ArrowLeft, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Car from "../Components/Car";
import Gt from "../Components/Gt";
import Mustang1968 from "../Components/Mustang1968";
import EngineDetailView from "../Learn/EngineDetail/EngineDetailView";
import BrakeDetailView from "../Learn/BrakeDetail/BrakeDetailView";
import logoGif from "../assets/wheelwithwings.gif";

// GLB Model Components
function FordMustangBoss1969() {
  const { scene } = useGLTF('/ford_mustang_boss_1969.glb');
  return <primitive object={scene} />;
}

function Mustang2005() {
  const { scene } = useGLTF('/mustang2005.glb');
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

const CAR_INFO = {
  Car: {
    name: "Hardtop",
    model: "1965",
    engine: "V6",
    speed: "150mph",
    brake: "BRAKE1",
    description: "A timeless classic with balanced performance and vintage charm.",
  },
  Gt: {
    name: "GT Fastback",
    model: "1967",
    engine: "V7",
    speed: "180mph",
    brake: "BRAKE1",
    description: "Aggressive styling with enhanced power and track-ready dynamics.",
  },
  Mustang1968: {
    name: "SportsRoof",
    model: "1968",
    engine: "V8",
    speed: "190mph",
    brake: "BRAKE1",
    description: "American muscle icon with roaring V8 and iconic design.",
  },
  FordMustangBoss1969: {
    name: "Shelby GT350",
    model: "1969",
    engine: "V8",
    speed: "200mph",
    brake: "BRAKE1",
    description: "Legendary Shelby performance with race-bred engineering.",
  },
  Mustang2005: {
    name: "Mach 1",
    model: "1970",
    engine: "V12",
    speed: "200mph",
    brake: "BRAKE1",
    description: "Ultimate power with V12 performance and modern styling.",
  },
};

const CAR_COMPONENTS = {
  Car,
  Gt,
  Mustang1968,
  FordMustangBoss1969,
  Mustang2005,
};

const CarScene = ({ carKey, selectedPart }) => {
  const CarComponent = CAR_COMPONENTS[carKey] || Car;
  const carInfo = CAR_INFO[carKey] || CAR_INFO.Car;

  const renderDetail = () => {
    if (!selectedPart) return null;
    switch (selectedPart.toLowerCase()) {
      case "engine":
        return <EngineDetailView engineType={carInfo.engine} />;
      case "brakes":
        return <BrakeDetailView brakeType={carInfo.brake} />;
      default:
        return (
          <group position={[0, 0, 0]} scale={[2, 2, 2]}>
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
          </group>
        );
    }
  };

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 3, -5]} intensity={1} color="#4a90ff" />
      <directionalLight position={[0, 2, -8]} intensity={1} color="#b190f6" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        intensity={1.5}
        castShadow
      />
      <Environment preset="city" />

      {selectedPart ? (
        renderDetail()
      ) : (
        <group
          position={[0, -1, 0]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[1.8, 1.8, 1.8]}
        >
          <CarComponent />
        </group>
      )}

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={5}
        color="#000000"
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.51, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      <DreiOrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={selectedPart ? 1.5 : 3}
        maxDistance={
          selectedPart
            ? ["V7", "V8", "V12"].includes(carInfo.engine)
              ? 100
              : 20
            : 12
        }
        minPolarAngle={0.3}
        maxPolarAngle={1.6}
        target={[0, selectedPart ? 0 : 1, 0]}
      />
    </>
  );
};

const AIInsightBox = ({
  title,
  content,
  loading,
  bgGradient,
  border,
  textColor,
  titleColor,
}) => (
  <div
    className={`p-4 bg-gradient-to-b ${bgGradient} backdrop-blur-lg rounded-xl border ${border} shadow-lg shadow-black/30 flex flex-col h-full transition-all duration-300 hover:shadow-xl`}
  >
    <h3 className={`text-lg font-bold ${titleColor} mb-2 text-center`}>
      {title}
    </h3>
    <div
      className={`text-xs md:text-sm ${textColor} whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto max-h-40 custom-scrollbar`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <Loader className="w-5 h-5 animate-spin text-current" />
          <span className="text-center">Generating insight...</span>
        </div>
      ) : content ? (
        content
      ) : (
        <p className="text-center text-opacity-70">
          Select a car to generate AI insights.
        </p>
      )}
    </div>
  </div>
);

const CustomDropdown = ({
  label,
  options,
  value,
  onChange,
  gradient,
  border,
  textColor,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative w-full md:w-56 text-sm font-bold tracking-wide ${textColor}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex justify-between items-center px-4 py-2.5 rounded-xl bg-gradient-to-r ${gradient} border ${border} shadow-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-0`}
      >
        {value
          ? `${options.find((opt) => opt.key === value)?.name} (${
              options.find((opt) => opt.key === value)?.model
            })`
          : label}
        <ChevronDown
          className={`ml-2 w-4 h-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute mt-2 w-full rounded-xl overflow-hidden border ${border} shadow-2xl z-50`}
        >
          {options.map((opt) => (
            <div
              key={opt.key}
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
              className="cursor-pointer px-4 py-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-blue-800 hover:to-blue-900 text-white transition-all duration-200"
            >
              {opt.name} ({opt.model})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Comparison = () => {
  const navigate = useNavigate();
  const [carA, setCarA] = useState("");
  const [carB, setCarB] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);

  const [aiInsightA, setAiInsightA] = useState("");
  const [aiInsightB, setAiInsightB] = useState("");
  const [aiComparison, setAiComparison] = useState("");
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);

  const allCars = Object.keys(CAR_INFO);

  // === API CALL HELPERS ===
  const fetchGeneralInsight = async (carKey) => {
    const info = CAR_INFO[carKey];
    const question = `Describe the ${info.engine} engine, performance, design, and key features of the ${info.name} (${info.model}) in detail.`;
    try {
      const res = await fetch("http://127.0.0.1:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      return data.answer || "No response from AI.";
    } catch (err) {
      console.error("AI Fetch Error:", err);
      return "Failed to load AI response.";
    }
  };

  const fetchPartInsight = async (carKey, part) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/part-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carKey, part }),
      });
      const data = await res.json();
      return data.answer || "No insight available.";
    } catch (err) {
      console.error("Part Insight Fetch Error:", err);
      return "Failed to load part insight.";
    }
  };

  const fetchComparison = async (carAKey, carBKey) => {
    const infoA = CAR_INFO[carAKey];
    const infoB = CAR_INFO[carBKey];
    const question = `Compare the ${infoA.name} (${infoA.model}, ${infoA.engine}) and the ${infoB.name} (${infoB.model}, ${infoB.engine}) in terms of performance, engine power, top speed, and driving experience. Highlight key differences.`;
    try {
      const res = await fetch("http://127.0.0.1:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      return data.answer || "No comparison available.";
    } catch (err) {
      console.error("Comparison Fetch Error:", err);
      return "Failed to load comparison.";
    }
  };

  // === EFFECT: Update Car A Insight ===
  useEffect(() => {
    const updateInsightA = async () => {
      if (!carA) {
        setAiInsightA("");
        return;
      }

      setLoadingA(true);
      let response;
      if (selectedPart) {
        response = await fetchPartInsight(carA, selectedPart);
      } else {
        response = await fetchGeneralInsight(carA);
      }
      setAiInsightA(response);
      setLoadingA(false);
    };
    updateInsightA();
  }, [carA, selectedPart]);

  // === EFFECT: Update Car B Insight ===
  useEffect(() => {
    const updateInsightB = async () => {
      if (!carB) {
        setAiInsightB("");
        return;
      }

      setLoadingB(true);
      let response;
      if (selectedPart) {
        response = await fetchPartInsight(carB, selectedPart);
      } else {
        response = await fetchGeneralInsight(carB);
      }
      setAiInsightB(response);
      setLoadingB(false);
    };
    updateInsightB();
  }, [carB, selectedPart]);

  // === EFFECT: Update Comparison ===
  useEffect(() => {
    const updateComparison = async () => {
      if (!carA || !carB) {
        setAiComparison("");
        return;
      }
      setLoadingCompare(true);
      const response = await fetchComparison(carA, carB);
      setAiComparison(response);
      setLoadingCompare(false);
    };
    updateComparison();
  }, [carA, carB]);

  // === PART HANDLING ===
  const PARTS = [
    { id: "engine", name: "Engine" },
    { id: "transmission", name: "Transmission" },
    { id: "suspension", name: "Suspension" },
    { id: "brakes", name: "Brakes" },
    { id: "exhaust", name: "Exhaust" },
    { id: "wheels", name: "Wheels" },
  ];

  const handlePartClick = (partId) => {
    setSelectedPart(selectedPart === partId ? null : partId);
  };

  // === DROPDOWN OPTIONS ===
  const availableForB = allCars.filter((key) => key !== carA);
  const availableForA = allCars.filter((key) => key !== carB);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/3 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-bounce"
        style={{ animationDuration: "6s" }}
      />

      <img
        src={logoGif}
        alt="Mustang Logo"
        className="absolute top-2 right-8 w-40 h-40 object-contain z-30 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-transform duration-500 hover:scale-110"
      />

      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-400/40 hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 hover:scale-105 text-white shadow-lg shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-semibold tracking-wide">Dashboard</span>
        </button>
      </div>

      <h1 className="absolute top-[2%] left-1/2 transform -translate-x-1/2 text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 text-center px-4">
        Compare Vehicles
      </h1>

      <div className="absolute inset-0 pt-28 pb-4 px-2 md:px-4 flex flex-col gap-5">
        {/* Car Scenes */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 rounded-2xl overflow-hidden border border-blue-500/20 bg-black/30 backdrop-blur-lg shadow-2xl h-[280px] md:h-[360px]">
            {carA ? (
              <Canvas shadows camera={{ position: [5, 3, 5], fov: 50 }}>
                <CarScene carKey={carA} selectedPart={selectedPart} />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-4">
                <p className="text-blue-200/80 text-sm font-medium">Select Car A</p>
              </div>
            )}
          </div>

          <div className="flex-1 rounded-2xl overflow-hidden border border-purple-500/20 bg-black/30 backdrop-blur-lg shadow-2xl h-[280px] md:h-[360px]">
            {carB ? (
              <Canvas shadows camera={{ position: [5, 3, 5], fov: 50 }}>
                <CarScene carKey={carB} selectedPart={selectedPart} />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-4">
                <p className="text-purple-200/80 text-sm font-medium">Select Car B</p>
              </div>
            )}
          </div>
        </div>

        {/* Car Parts Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          {PARTS.map((part) => (
            <button
              key={part.id}
              onClick={() => handlePartClick(part.id)}
              className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                selectedPart === part.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg ring-2 ring-orange-400/50"
                  : "bg-white/10 text-orange-200 hover:bg-white/20 ring-orange-300/30"
              }`}
            >
              {part.name}
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
          <CustomDropdown
            label="Select Car A"
            value={carA}
            onChange={(val) => {
              setCarA(val);
              if (val === carB) setCarB("");
            }}
            options={availableForA.map((key) => ({
              key,
              name: CAR_INFO[key].name,
              model: CAR_INFO[key].model,
            }))}
            gradient="from-orange-700 via-red-800 to-red-900"
            border="border-orange-500/60"
            textColor="text-orange-100"
          />

          <span className="text-white font-bold text-xl mx-2 md:mx-4">VS</span>

          <CustomDropdown
            label="Select Car B"
            value={carB}
            onChange={(val) => {
              setCarB(val);
              if (val === carA) setCarA("");
            }}
            options={availableForB.map((key) => ({
              key,
              name: CAR_INFO[key].name,
              model: CAR_INFO[key].model,
            }))}
            gradient="from-purple-800 via-fuchsia-800 to-red-900"
            border="border-fuchsia-500/60"
            textColor="text-purple-100"
          />
        </div>

        {/* AI Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 h-[450px]">
          <AIInsightBox
            title={selectedPart ? `${CAR_INFO[carA]?.name || "Car A"} - ${selectedPart.charAt(0).toUpperCase() + selectedPart.slice(1)}` : "Car A AI Insight"}
            content={aiInsightA}
            loading={loadingA}
            bgGradient="from-cyan-900/30 to-blue-900/30"
            border="border-cyan-500/40"
            textColor="text-cyan-100"
            titleColor="text-cyan-300"
          />
          <AIInsightBox
            title="AI Comparison 🔥"
            content={aiComparison}
            loading={loadingCompare}
            bgGradient="from-orange-900/40 to-red-900/40"
            border="border-orange-500/50"
            textColor="text-orange-100"
            titleColor="text-orange-300"
          />
          <AIInsightBox
            title={selectedPart ? `${CAR_INFO[carB]?.name || "Car B"} - ${selectedPart.charAt(0).toUpperCase() + selectedPart.slice(1)}` : "Car B AI Insight"}
            content={aiInsightB}
            loading={loadingB}
            bgGradient="from-purple-900/30 to-red-900/30"
            border="border-purple-500/40"
            textColor="text-purple-100"
            titleColor="text-purple-300"
          />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #f97316, #ef4444); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #fb923c, #f87171); }
      `}</style>
    </div>
  );
};

export default Comparison;