// src/Learn/ChasisDetail/ChasisDetailView.jsx
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function CenteredExhaustModel({ children }) {
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

const EXHAUST_MODELS = {
  EXHAUST1: React.lazy(() => import("../../Components/Exhaust1")),
};

export default function ExhaustDetailView({ exhaustType }) {
  const getExhaustScale = () => {
    return [0.2, 0.2, 0.2];
  };

  const ExhaustModel = EXHAUST_MODELS[exhaustType];

  if (!ExhaustModel) {
    return null;
  }

  return (
    <CenteredExhaustModel>
      <React.Suspense fallback={null}>
        <ExhaustModel scale={getExhaustScale()} />
      </React.Suspense>
    </CenteredExhaustModel>
  );
}