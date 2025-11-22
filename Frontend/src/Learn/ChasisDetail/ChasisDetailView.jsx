// src/Learn/ChasisDetail/ChasisDetailView.jsx
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function CenteredChasisModel({ children }) {
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

const CHASIS_MODELS = {
  CHASIS1: React.lazy(() => import("../../Components/Chasis1")),
};

export default function ChasisDetailView({ chasisType }) {
  const getChasisScale = () => {
    return [0.2, 0.2, 0.2];
  };

  const ChasisModel = CHASIS_MODELS[chasisType];

  if (!ChasisModel) {
    return null;
  }

  return (
    <CenteredChasisModel>
      <React.Suspense fallback={null}>
        <ChasisModel scale={getChasisScale()} />
      </React.Suspense>
    </CenteredChasisModel>
  );
}