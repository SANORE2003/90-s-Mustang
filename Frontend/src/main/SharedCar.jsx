import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Car from "../Components/Car";

// Inner component: runs inside Canvas
function CarModel({ scrollYRef }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;

    // Rotate continuously
    groupRef.current.rotation.y += 0.01;

    const scrollY = scrollYRef.current;
    const windowHeight = window.innerHeight;
    let targetY;

    // Animate within first 2 viewport heights (Home + AboutCar)
    if (scrollY <= windowHeight) {
      // Home section: move down slightly
      const progress = scrollY / windowHeight;
      targetY = -progress * 1.5;
    } else if (scrollY > windowHeight && scrollY <= windowHeight * 2) {
      // AboutCar section: fixed position
      targetY = -1.5;
    } else {
      // Beyond AboutCar: keep same position (don't hide)
      targetY = -1.5;
    }

    // Smooth interpolation
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1;
  });

  return (
    <group ref={groupRef} scale={[0.9, 0.9, 0.9]}>
      <Car />
    </group>
  );
}

// Outer component: handles scroll tracking
export default function SharedCar() {
  const scrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialize

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>
        <ambientLight intensity={2.5} />
        <directionalLight
          intensity={3}
          position={[5, 10, 5]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <CarModel scrollYRef={scrollYRef} />
      </Canvas>
    </div>
  );
}
