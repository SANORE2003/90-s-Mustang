// Mustang1.jsx - 3D Car Component
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Car from "../Components/Car"; 

// Wrapper component to handle rotation
function RotatingCar({ position, scale, ...props }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5; // smooth rotation
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} {...props}>
      <Car />
    </group>
  );
}

export default function Mustang1() {
  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 2, 5], fov: 50 }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={2.5} />
        <directionalLight
          intensity={3}
          position={[5, 10, 5]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Car */}
        <RotatingCar position={[2, 0, 0]} scale={[0.9, 0.9, 0.9]} />
      </Canvas>
    </div>
  );
}
