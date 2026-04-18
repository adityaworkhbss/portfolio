"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export default function GlobalBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    function handleMouseMove({ clientX, clientY }: MouseEvent) {
      mouseX.set(clientX);
      mouseY.set(clientY);
      if (!hasMouse) setHasMouse(true);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, hasMouse]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Subtle dot grid backdrop (Base) */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage:
            "radial-gradient(ellipse 100% 100% at 50% 10%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 100% at 50% 10%, #000 30%, transparent 100%)",
        }}
      />
      
      {/* Interactive Flashlight Dot Grid */}
      <motion.div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-1000 z-10"
        style={{
          opacity: hasMouse ? 1 : 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          WebkitMaskImage: useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
          maskImage: useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
        }}
      />

      {/* Gentle underlying glow following the mouse */}
      <motion.div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-1000 z-10 mix-blend-screen"
        style={{
          opacity: hasMouse ? 1 : 0,
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, var(--accent-glow), transparent 80%)`,
        }}
      />
    </div>
  );
}
