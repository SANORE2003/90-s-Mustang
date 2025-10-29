// AboutUs.jsx
import React, { Suspense, useRef, useLayoutEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import Mustang1968 from "../Components/Mustang1968";
import Gt from "../Components/Gt";
import gsap from "gsap";

export default function AboutCar() {
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const mustangCanvasRef = useRef(null);
  const gtCanvasRef = useRef(null);

  useLayoutEffect(() => {
    // Animate center content: fade + slide up
    gsap.from([titleRef.current, paragraphRef.current], {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      immediateRender: false,
    });

    // Animate glowing orbs
    gsap.from([orb1Ref.current, orb2Ref.current], {
      opacity: 0,
      scale: 0.5,
      duration: 1.2,
      stagger: 0.3,
      ease: "back.out(1.7)",
      immediateRender: false,
    });

    // Subtle floating animation for car containers
    const floatAnim = (element) => {
      if (!element) return;
      gsap.to(element, {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    };

    floatAnim(mustangCanvasRef.current);
    floatAnim(gtCanvasRef.current);

    // Cleanup
    return () => {
      gsap.killTweensOf([
        titleRef.current,
        paragraphRef.current,
        orb1Ref.current,
        orb2Ref.current,
        mustangCanvasRef.current,
        gtCanvasRef.current,
      ]);
    };
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* 🌌 Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Glowing Orbs */}
        <div
          ref={orb1Ref}
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"
        />
        <div
          ref={orb2Ref}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
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

      {/* 🚗 Mustang - Right Side */}
      <div
        ref={mustangCanvasRef}
        className="absolute top-6 right-8 w-[400px] h-[300px] z-10"
      >
        <Canvas
          camera={{
            position: [4, 2, 7],
            fov: 35,
            near: 0.1,
            far: 100,
          }}
          gl={{ alpha: true, antialias: true }}
          shadows
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1.4} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={2.2}
              color="#ffffff"
              castShadow
            />
            <directionalLight position={[-5, 3, -5]} intensity={1} color="#4a90ff" />
            <directionalLight position={[0, 2, -8]} intensity={1} color="#8b5cf6" />
            <Environment preset="night" />

            <group
              position={[0, -0.7, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[1.8, 1.8, 1.8]}
            >
              <Mustang1968 />
            </group>

            <ContactShadows
              position={[0, -0.7, 0]}
              opacity={0.15}
              scale={10}
              blur={2}
              far={4}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 🏎️ GT - Left Side */}
      <div
        ref={gtCanvasRef}
        className="absolute top-2 left-8 w-[400px] h-[300px] z-10"
      >
        <Canvas
          camera={{
            position: [4, 2, 7],
            fov: 35,
            near: 0.1,
            far: 100,
          }}
          gl={{ alpha: true, antialias: true }}
          shadows
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1.4} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={2.2}
              color="#ffffff"
              castShadow
            />
            <directionalLight position={[-5, 3, -5]} intensity={1} color="#4a90ff" />
            <directionalLight position={[0, 2, -8]} intensity={1} color="#8b5cf6" />
            <Environment preset="night" />

            <group
              position={[0, -0.7, 0]}
              rotation={[0, Math.PI / 2.5, 0]}
              scale={[1.3, 1.3, 1.3]}
            >
              <Gt />
            </group>

            <ContactShadows
              position={[0, -0.7, 0]}
              opacity={0.35}
              scale={20}
              blur={2}
              far={4}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 🧭 Center Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pt-2">
        <h1
          ref={titleRef}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 drop-shadow-lg"
        >
          About Us
        </h1>
        <p
          ref={paragraphRef}
          className="max-w-2xl text-slate-50 text-lg leading-relaxed drop-shadow-md"
        >
          At Mustang, we blend cutting-edge design with performance-driven
          engineering to create unforgettable driving experiences. Our mission
          is to inspire passion, innovation, and excellence in every ride.
          Discover the story behind our journey and the people who make it
          possible.
        </p>
      </div>
    </div>
  );
}