// Dashboard.jsx - Updated with Learn button that passes car data
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Gauge } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import Car from "../Components/Car";
import Gt from "../Components/Gt";
import Mustang1968 from "../Components/Mustang1968";

// Individual Canvas Component for each car
const CarCanvas = ({ car }) => {
  const CarComponent = car.component;

  return (
    <Canvas shadows camera={{ position: car.camera.position, fov: car.camera.fov }}>
      {/* Lighting */}
      <ambientLight intensity={1.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 3, -5]} intensity={1} color="#4a90ff" />
      <directionalLight position={[0, 2, -8]} intensity={1} color="#8b5cf6" />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1.5} castShadow />

      {/* Environment */}
      <Environment preset="night" />

      {/* Car Model */}
      <group position={car.position} rotation={car.rotation} scale={car.scale}>
        <CarComponent />
      </group>

      {/* Contact Shadow */}
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.3}
        scale={10}
        blur={2.5}
        far={4}
        color="#000000"
      />

      {/* Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </Canvas>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const cars = [
    {
      component: Car,
      componentName: "Car", // Added for Parts.jsx mapping
      name: "Classic Car",
      model: "1965",
      engine: "V6",
      speed: "150mph",
      position: [0, 0, 0],
      rotation: [0, Math.PI / 3, 0],
      scale: [1.5, 1.5, 1.5],
      camera: { position: [5, 2, 5], fov: 40 },
    },
    {
      component: Gt,
      componentName: "Gt", // Added for Parts.jsx mapping
      name: "GT Sports",
      model: "1967",
      engine: "V7",
      speed: "180mph",
      position: [5, -4, 0],
      rotation: [0, 6.5, 0],
      scale: [1.75, 1.75, 1.75],
      camera: { position: [0, Math.PI / 4, 13], fov: 45 },
    },
    {
      component: Mustang1968,
      componentName: "Mustang1968", // Added for Parts.jsx mapping
      name: "Mustang 1968",
      model: "1968",
      engine: "V6",
      speed: "190mph",
      position: [5, -3.5, 0],
      rotation: [0, -1.5, 0],
      scale: [2, 2, 2],
      camera: { position: [0, 0, 9], fov: 55 },
    },
  ];

  const nextCar = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % cars.length);
  }, [cars.length]);

  const prevCar = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + cars.length) % cars.length);
  }, [cars.length]);

  // ✅ Keyboard Controls (Left & Right Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextCar();
      if (e.key === "ArrowLeft") prevCar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextCar, prevCar]);

  // ✅ Function to navigate to Parts page with selected car
 // ✅ Navigate to Parts with only carName
  const handlePartsClick = () => {
    navigate("/parts", {
      state: {
        carName: cars[currentIndex].componentName,
      },
    });
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-purple-500/10 to-transparent" />
      </div>

      {/* Canvas Container */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="relative w-full h-full flex items-center justify-center">
          {cars.map((car, index) => {
            const offset = index - currentIndex;
            const isActive = offset === 0;
            const translateX = offset * 100;
            const scale = isActive ? 1 : 0.6;
            const opacity = isActive ? 1 : 0;

            return (
              <div
                key={index}
                className="absolute inset-0 transition-all duration-700 ease-in-out flex items-center justify-center"
                style={{
                  transform: `translateX(${translateX}vw) scale(${scale})`,
                  opacity,
                  zIndex: isActive ? 20 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div className="flex items-center justify-center h-screen w-screen">
                  <CarCanvas car={car} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevCar}
          className="absolute left-8 z-30 bg-blue-600/20 hover:bg-blue-600/40 backdrop-blur-sm border border-blue-400/30 rounded-full p-4 transition-all duration-300 hover:scale-110 group"
          aria-label="Previous car"
        >
          <ChevronLeft className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
        </button>
        <button
          onClick={nextCar}
          className="absolute right-8 z-30 bg-blue-600/20 hover:bg-blue-600/40 backdrop-blur-sm border border-blue-400/30 rounded-full p-4 transition-all duration-300 hover:scale-110 group"
          aria-label="Next car"
        >
          <ChevronRight className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
        </button>

        {/* Speedometer Button */}
        <button
          onClick={() => navigate("/speedometer")}
          className="absolute top-8 right-8 z-30 bg-green-600/40 hover:bg-green-600/60 backdrop-blur-sm border border-green-400/50 rounded-full px-6 py-3 text-white font-bold transition-all duration-300 hover:scale-110 flex items-center gap-2"
        >
          <Gauge className="w-5 h-5" />
          Speedometer
        </button>

        {/* Learn Button - UPDATED to pass car data */}
        <button 
          onClick={handlePartsClick}
          className="absolute bottom-20 right-8 z-30 bg-purple-600/40 hover:bg-purple-600/60 backdrop-blur-sm border border-purple-400/50 rounded-full px-6 py-3 text-white font-bold transition-all duration-300 hover:scale-110 flex items-center gap-2"
        >
          Parts
        </button>
      </div>

      {/* Car Info Texts */}
      <div className="absolute top-[15%] left-[5%] z-50 pointer-events-none w-full">
        {cars.map((car, index) => {
          const offset = index - currentIndex;
          const translateX = offset * 100;
          return (
            <div
              key={index}
              className="absolute transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(${translateX}vw)`,
                opacity: offset === 0 ? 1 : 0,
                transition: "opacity 0.3s ease, transform 0.7s ease",
              }}
            >
              <h2 className="text-9xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {car.name}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-[30%] left-[50%] z-30 pointer-events-none w-full">
        {cars.map((car, index) => {
          const offset = index - currentIndex;
          const translateX = offset * -100;
          return (
            <div
              key={index}
              className="absolute transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(${translateX}vw)`,
                opacity: offset === 0 ? 1 : 0,
              }}
            >
              <p className="text-9xl font-bold text-white/90">
                Model: <span className="text-purple-400 font-bold">{car.model}</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-[30%] left-[8%] z-30 pointer-events-none w-full">
        {cars.map((car, index) => {
          const offset = index - currentIndex;
          const translateX = offset * 100;
          return (
            <div
              key={index}
              className="absolute transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(${translateX}vw)`,
                opacity: offset === 0 ? 1 : 0,
              }}
            >
              <p className="text-9xl font-bold text-white/90">
                <span className="text-purple-400 font-bold">{car.engine}</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="absolute top-[15%] left-[65%] z-30 pointer-events-none w-full">
        {cars.map((car, index) => {
          const offset = index - currentIndex;
          const translateX = offset * -100;
          return (
            <div
              key={index}
              className="absolute transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(${translateX}vw)`,
                opacity: offset === 0 ? 1 : 0,
              }}
            >
              <p className="text-9xl font-bold text-white/90">
                <span className="text-purple-400 font-bold">{car.speed}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center gap-3">
        {cars.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-400 w-8"
                : "bg-blue-400/30 hover:bg-blue-400/50"
            }`}
            aria-label={`Go to car ${index + 1}`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-2 left-0 right-0 z-30 flex justify-center pointer-events-none">
        <p className="text-blue-300/60 text-sm">
          Use ← and → arrow keys or buttons to navigate
        </p>
      </div>
    </div>
  );
}