// src/Learn/EngineDetail/EngineDetailView.jsx
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function CenteredEngineModel({ children }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);
      groupRef.current.position.sub(center);
      groupRef.current.position.y += 1.05; // Slight lift for visual balance
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

const ENGINE_MODELS = {
  V6: React.lazy(() => import("../../Components/V6_Engine")),
  V7: React.lazy(() => import("../../Components/V7_Engine")),
  V8: React.lazy(() => import("../../Components/V8_Engine")),
};

export default function EngineDetailView({ engineType }) {
  const getEngineScale = () => {
    if (engineType === "V8") {
      return [0.2, 0.2, 0.2];
    }
    return [2.5, 2.5, 2.5];
  };

  const EngineModel = ENGINE_MODELS[engineType];

  if (!EngineModel) {
    return null;
  }

  return (
    <CenteredEngineModel>
      <React.Suspense fallback={null}>
        <EngineModel scale={getEngineScale()} />
      </React.Suspense>
    </CenteredEngineModel>
  );
}