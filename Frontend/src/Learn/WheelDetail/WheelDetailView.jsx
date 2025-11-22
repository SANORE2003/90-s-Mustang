// src/Learn/ChasisDetail/ChasisDetailView.jsx
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function CenteredWheelModel({ children }) {
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

const WHEEL_MODELS = {
  WHEEL1: React.lazy(() => import("../../Components/Wheel1")),
};

export default function WheelDetailView({ wheelType }) {
  const getWheelScale = () => {
    return [2, 2, 2];
  };

  const WheelModel = WHEEL_MODELS[wheelType];

  if (!WheelModel) {
    return null;
  }

  return (
    <CenteredWheelModel>
      <React.Suspense fallback={null}>
        <WheelModel scale={getWheelScale()} />
      </React.Suspense>
    </CenteredWheelModel>
  );
}