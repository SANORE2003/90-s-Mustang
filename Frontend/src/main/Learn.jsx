import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import Car from "../Components/Car";

const Learn = () => {
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* 🌌 Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Glowing Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        {/* Grid pattern */}
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
        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-purple-500/10 to-transparent" />
      </div>

      
    </div>
  );
};

export default Learn;
