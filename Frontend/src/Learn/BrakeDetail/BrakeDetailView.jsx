// src/Learn/EngineDetail/BrakeDetailView.jsx
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function CenteredBrakeModel({ children }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);
      groupRef.current.position.sub(center);
      groupRef.current.position.y += 0.5; // Adjust as needed
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

const BRAKE_MODELS = {
  BRAKE1: React.lazy(() => import("../../Components/Brake1")),
  // Add more as needed: BRAKE2, etc.
};

export default function BrakeDetailView({ brakeType }) {
  const getBrakeScale = () => {
    // Adjust scale based on actual model size
    return [2.5, 2.5, 2.5]; // Assuming Brake1 is small and needs scaling up
  };

  const BrakeModel = BRAKE_MODELS[brakeType];

  if (!BrakeModel) {
    console.warn(`Brake model not found for type: ${brakeType}`);
    return null;
  }

  return (
    <CenteredBrakeModel>
      <React.Suspense fallback={null}>
        <BrakeModel scale={getBrakeScale()} />
      </React.Suspense>
    </CenteredBrakeModel>
  );
}