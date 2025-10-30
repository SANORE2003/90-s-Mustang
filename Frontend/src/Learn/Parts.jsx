// Parts.jsx
import * as THREE from "three";
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls as DreiOrbitControls,
} from "@react-three/drei";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Info,
  Zap,
  Settings,
  ShieldCheck,
  Gauge,
  Waves,
  Circle,
  Loader,
  Send,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import Car from "../Components/Car";
import Gt from "../Components/Gt";
import Mustang1968 from "../Components/Mustang1968";
import V6_Engine from "../Components/V6_Engine";
import V7_Engine from "../Components/V7_Engine";
import V8_Engine from "../Components/V8_Engine"; // ✅ V8 Support

const CAR_INFO = {
  Car: {
    name: "Classic Car",
    model: "1965",
    engine: "V6",
    speed: "150mph",
  },
  Gt: {
    name: "GT Sports",
    model: "1967",
    engine: "V7",
    speed: "180mph",
  },
  Mustang1968: {
    name: "Mustang 1968",
    model: "1968",
    engine: "V8", // ✅ Using V8
    speed: "190mph",
  },
};

const CAR_COMPONENTS = {
  Car,
  Gt,
  Mustang1968,
};

const PART_ICONS = {
  Engine: Zap,
  Transmission: Settings,
  Suspension: Waves,
  Brakes: ShieldCheck,
  Exhaust: Waves,
  Wheels: Circle,
};

const ENGINE_MODELS = {
  V6: V6_Engine,
  V7: V7_Engine,
  V8: V8_Engine, // ✅ Registered
};

// 🔧 Custom OrbitControls — dynamic zoom limits based on engine type
function CustomOrbitControls({ isEngineView, engineType }) {
  const { camera, gl } = useThree();

  // Adjust max zoom-out distance per engine
  let maxDist = isEngineView ? 20 : 12;
  if (isEngineView && engineType === "V8") {
    maxDist = 200; // Allow more zoom-out for larger V8
  }

  return (
    <DreiOrbitControls
      args={[camera, gl.domElement]}
      enableDamping={true}
      dampingFactor={0.05}
      enablePan={true}
      minDistance={isEngineView ? 2 : 3}
      maxDistance={maxDist}
      minPolarAngle={0.3}
      maxPolarAngle={1.6}
      autoRotate={false}
      target={[0, isEngineView ? 0 : 1, 0]}
    />
  );
}

// 🔧 Auto-center engine model on load
function CenteredEngineModel({ children }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);
      groupRef.current.position.sub(center);
      groupRef.current.position.y += 1.05;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

const Parts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPart, setSelectedPart] = useState(null);
  const [partsWithResponses, setPartsWithResponses] = useState([]);
  const [userQuestion, setUserQuestion] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const [isViewingDetailModel, setIsViewingDetailModel] = useState(false);

  const carName = location.state?.carName || "Car";
  const carInfo = CAR_INFO[carName] || CAR_INFO.Car;
  const CarComponent = CAR_COMPONENTS[carName] || Car;

  // Car view settings
  const CAR_POSITION = [0, -1, 0];
  const CAR_ROTATION = [0, Math.PI / 4, 0];
  const CAR_SCALE = [1.8, 1.8, 1.8];
  const CAMERA_POSITION_CAR = [5, 3, 5];

  // 🔥 Enhanced camera position for V8 engine
  const getEngineCameraPosition = () => {
    if (carInfo.engine === "V8") {
      return [6, 6, 30]; // pulled back significantly for full V8 view
    }
    return [6, 5, 12]; // default for V6/V7
  };

  // REMOVE: const ENGINE_SCALE = [1.2, 1.2, 1.2];

  // ADD:
  const getEngineScale = () => {
    if (carInfo.engine === "V8") {
      return [0.2, 0.2, 0.2]; // adjust as needed
    }
    return [2.5, 2.5, 2.5];
  };

  const ENGINE_SCALE = [1.2, 1.2, 1.2];

  const baseCarParts = [
    {
      id: 1,
      name: "Engine",
      description: `${carInfo.engine} engine with high performance capabilities and precision tuning.`,
      status: "Operational",
      question: `Tell me about this ${carInfo.engine} engine.`,
    },
    {
      id: 2,
      name: "Transmission",
      description:
        "6-speed manual transmission for optimal control and gear responsiveness.",
      status: "Operational",
      question: "How does the transmission system work?",
    },
    {
      id: 3,
      name: "Suspension",
      description:
        "Sport-tuned suspension system for enhanced handling and road grip.",
      status: "Operational",
      question: "What makes the suspension sport-tuned?",
    },
    {
      id: 4,
      name: "Brakes",
      description:
        "High-performance disc brakes on all wheels with rapid heat dissipation.",
      status: "Operational",
      question: "Explain the brake performance specs.",
    },
    {
      id: 5,
      name: "Exhaust",
      description:
        "Performance exhaust system with deep resonance and reduced backpressure.",
      status: "Operational",
      question: "How does the exhaust improve performance?",
    },
    {
      id: 6,
      name: "Wheels",
      description:
        "18-inch forged alloy wheels with ultra-grip performance tires.",
      status: "Operational",
      question: "What are the wheel material and tire specs?",
    },
  ];

  useEffect(() => {
    setPartsWithResponses(
      baseCarParts.map((part) => ({ ...part, response: null, loading: false }))
    );
    setSelectedPart(null);
    setUserQuestion("");
    setIsInputActive(false);
    setIsViewingDetailModel(false);
  }, [carName]);

  const sendQuestionToBackend = async (partId, question) => {
    setPartsWithResponses((prev) =>
      prev.map((p) => (p.id === partId ? { ...p, loading: true } : p))
    );

    try {
      const response = await fetch("http://127.0.0.1:5000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      let aiResponse = "No response received.";
      if (response.ok) {
        const data = await response.json();
        aiResponse = data.answer || data.response || "Answer not available.";
      }

      setPartsWithResponses((prev) =>
        prev.map((p) =>
          p.id === partId ? { ...p, response: aiResponse, loading: false } : p
        )
      );
    } catch (error) {
      console.error("Error sending question:", error);
      setPartsWithResponses((prev) =>
        prev.map((p) =>
          p.id === partId
            ? { ...p, response: "Failed to load response.", loading: false }
            : p
        )
      );
    }
  };

  const handlePartClick = (part) => {
    setSelectedPart(part);
    const currentPart = partsWithResponses.find((p) => p.id === part.id);
    if (currentPart && !currentPart.response && !currentPart.loading) {
      sendQuestionToBackend(part.id, part.question);
    }
    setUserQuestion("");
    setIsInputActive(false);

    if (part.name === "Engine" && ENGINE_MODELS[carInfo.engine]) {
      setIsViewingDetailModel(true);
    } else {
      setIsViewingDetailModel(false);
    }
  };

  const handleBackClick = () => {
    setSelectedPart(null);
    setUserQuestion("");
    setIsInputActive(false);
    setIsViewingDetailModel(false);
  };

  const handleAskFollowUp = () => {
    if (!userQuestion.trim() || !selectedPart) return;
    sendQuestionToBackend(selectedPart.id, userQuestion);
    setUserQuestion("");
    setIsInputActive(false);
  };

  const getPartIcon = (partName) => PART_ICONS[partName] || Info;

  const enrichedSelectedPart = selectedPart
    ? partsWithResponses.find((p) => p.id === selectedPart.id) || selectedPart
    : null;

  const render3DModel = () => {
    if (isViewingDetailModel && selectedPart?.name === "Engine") {
      const EngineModel = ENGINE_MODELS[carInfo.engine];
      if (EngineModel) {
        return (
          <CenteredEngineModel>
            <EngineModel scale={getEngineScale()} />
          </CenteredEngineModel>
        );
      }
    }

    return (
      <group position={CAR_POSITION} rotation={CAR_ROTATION} scale={CAR_SCALE}>
        <CarComponent />
      </group>
    );
  };

  const cameraPosition =
    isViewingDetailModel && ENGINE_MODELS[carInfo.engine]
      ? getEngineCameraPosition()
      : CAMERA_POSITION_CAR;

  const showEngineNotAvailable =
    selectedPart?.name === "Engine" &&
    !ENGINE_MODELS[carInfo.engine] &&
    !isViewingDetailModel;

  const isEngineView = isViewingDetailModel && ENGINE_MODELS[carInfo.engine];

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

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-400/40 hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 hover:scale-105 text-white shadow-lg shadow-blue-500/10"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-semibold tracking-wide">Dashboard</span>
        </button>

        <div className="text-right">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
            {carInfo.name}
          </h1>
          <p className="text-blue-200/90 text-lg mt-1 tracking-wide">
            Model: <span className="font-medium">{carInfo.model}</span> •
            Engine: <span className="font-medium">{carInfo.engine}</span> • Top
            Speed: <span className="font-medium">{carInfo.speed}</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex pt-32 pb-8 px-6 md:px-8 gap-6 md:gap-8">
        {/* 3D Viewer */}
        <div className="w-full md:w-2/3 h-full relative">
          <div className="h-full rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-b from-black/30 to-black/50 backdrop-blur-lg shadow-2xl shadow-indigo-900/30">
            <Canvas shadows camera={{ position: cameraPosition, fov: 50 }}>
              <ambientLight intensity={1.4} />
              <directionalLight
                position={[5, 8, 5]}
                intensity={2.2}
                castShadow
                shadow-mapSize={[2048, 2048]}
              />
              <directionalLight
                position={[-5, 3, -5]}
                intensity={1}
                color="#4a90ff"
              />
              <directionalLight
                position={[0, 2, -8]}
                intensity={1}
                color="#b190f6"
              />
              <spotLight
                position={[0, 10, 0]}
                angle={0.5}
                penumbra={1}
                intensity={1.5}
                castShadow
              />

              <Environment preset="city" />

              {render3DModel()}

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
                <planeGeometry args={[50, 50]} />
                <shadowMaterial opacity={0.2} />
              </mesh>

              <CustomOrbitControls
                isEngineView={isEngineView}
                engineType={carInfo.engine}
              />
            </Canvas>

            {showEngineNotAvailable && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                <div className="text-center p-6 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border border-rose-500/40 rounded-xl max-w-md mx-4">
                  <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {carInfo.engine} Engine Model Not Available
                  </h3>
                  <p className="text-rose-200/90">
                    Detailed 3D model is not yet available for this engine type.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/3 h-full flex flex-col">
          <div className="bg-gradient-to-b from-black/40 to-indigo-900/30 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 md:p-6 flex-1 overflow-hidden flex flex-col relative shadow-xl shadow-purple-900/20">
            <div className="relative w-full h-full overflow-hidden">
              {/* Parts List */}
              <div
                className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)] will-change-transform ${
                  selectedPart
                    ? "-translate-y-full opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2.5">
                  <Info className="w-6 h-6 text-cyan-400 drop-shadow-lg" />
                  <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    Vehicle Systems
                  </span>
                </h2>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[calc(100vh-230px)]">
                  {partsWithResponses.map((part) => {
                    const PartIcon = PART_ICONS[part.name] || Settings;
                    return (
                      <button
                        key={part.id}
                        onClick={() => handlePartClick(part)}
                        className="w-full text-left p-4 rounded-xl transition-all duration-300 border border-white/10 bg-gradient-to-r from-white/5 to-transparent hover:from-cyan-500/10 hover:border-cyan-400/40 active:scale-[0.98] shadow-lg shadow-black/20"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg border border-cyan-400/30">
                            <PartIcon className="w-5 h-5 text-cyan-300" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {part.name}
                            </h3>
                            <p className="text-sm text-blue-200/80 leading-relaxed">
                              {part.description}
                            </p>
                          </div>
                          <span
                            className={`self-start mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              part.status === "Operational"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                                : "bg-rose-500/20 text-rose-300 border border-rose-400/40"
                            }`}
                          >
                            {part.status}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Part Detail View */}
              <div
                className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)] will-change-transform ${
                  selectedPart
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0 pointer-events-none"
                }`}
              >
                <button
                  onClick={handleBackClick}
                  className="self-start mb-4 flex items-center gap-2 text-cyan-300 hover:text-cyan-100 font-semibold transition-all group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back to Systems
                </button>

                {enrichedSelectedPart && (
                  <div className="flex-1 flex flex-col h-full">
                    <div
                      className="overflow-y-auto pr-2 custom-scrollbar"
                      style={{
                        maxHeight: "calc(100vh - 260px)",
                        paddingBottom: "1rem",
                      }}
                    >
                      <div className="p-5 bg-gradient-to-br from-indigo-800/20 via-blue-800/10 to-purple-900/20 border border-cyan-400/30 rounded-xl shadow-inner">
                        <div className="flex items-start gap-4 mb-5">
                          {(() => {
                            const Icon = getPartIcon(enrichedSelectedPart.name);
                            return (
                              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-xl border border-cyan-400/40">
                                <Icon className="w-6 h-6 text-cyan-300" />
                              </div>
                            );
                          })()}
                          <div>
                            <h3 className="text-2xl font-extrabold text-white">
                              {enrichedSelectedPart.name}
                            </h3>
                            <div className="mt-1 inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-400/40">
                              {enrichedSelectedPart.status}
                            </div>
                          </div>
                        </div>

                        <p className="text-blue-100/90 text-base leading-relaxed mb-6">
                          {enrichedSelectedPart.description}
                        </p>

                        {enrichedSelectedPart.loading ? (
                          <div className="mb-6 p-4 bg-indigo-900/30 rounded-lg border border-cyan-500/20 flex items-center gap-3">
                            <Loader className="w-5 h-5 text-cyan-400 animate-spin" />
                            <span className="text-cyan-200">
                              Loading AI response...
                            </span>
                          </div>
                        ) : enrichedSelectedPart.response ? (
                          <div className="mb-6 p-4 bg-gray-900/40 rounded-lg border border-cyan-500/20">
                            <h4 className="text-cyan-300 font-semibold mb-2 flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              AI Insight
                            </h4>
                            <p className="text-blue-100/90 text-sm leading-relaxed whitespace-pre-wrap">
                              {enrichedSelectedPart.response}
                            </p>
                          </div>
                        ) : null}

                        <div className="pt-4 border-t border-cyan-500/20">
                          {isInputActive ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={userQuestion}
                                onChange={(e) =>
                                  setUserQuestion(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleAskFollowUp();
                                  }
                                }}
                                placeholder="Type your question..."
                                className="flex-1 px-4 py-2.5 bg-black/30 border border-cyan-500/30 rounded-lg text-white placeholder:text-blue-300/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                autoFocus
                              />
                              <button
                                onClick={handleAskFollowUp}
                                disabled={!userQuestion.trim()}
                                className="p-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                              >
                                <Send className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setIsInputActive(true)}
                              className="w-full py-2.5 flex items-center justify-center gap-2 text-cyan-300 hover:text-cyan-100 font-medium rounded-lg border border-cyan-500/30 bg-black/20 hover:bg-black/30 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Ask a follow-up question
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #60a5fa, #a78bfa);
        }
      `}</style>
    </div>
  );
};

export default Parts;
