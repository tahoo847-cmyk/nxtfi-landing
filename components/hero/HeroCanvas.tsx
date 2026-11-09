"use client";

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { CameraRig } from "./scene/CameraRig";
import { Interface } from "./scene/Interface";
import { Laptop } from "./scene/Laptop";
import { Studio } from "./scene/Studio";

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("NxtFi 3D scene failed:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Scene({ compact, onReady }: { compact: boolean; onReady: () => void }) {
  const rig = useRef<THREE.Group>(null);
  return (
    <>
      <Studio compact={compact} />
      <group ref={rig}>
        <Laptop onReady={onReady} />
        <Interface />
      </group>
      <CameraRig target={rig} />
    </>
  );
}

export default function HeroCanvas({ onReady }: { onReady: () => void }) {
  const [compact] = useState(() => innerWidth < 1024);
  const [dpr, setDpr] = useState(() => Math.min(devicePixelRatio, compact ? 1.5 : 2));
  const [onScreen, setOnScreen] = useState(true);

  // Stops rendering once the hero has scrolled away, so it never competes with the next section's scene.
  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const seen = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    seen.observe(hero);
    return () => seen.disconnect();
  }, []);

  return (
    <SceneBoundary
      fallback={
        <p role="status" className="absolute right-6 bottom-16 max-w-64 text-right text-xs text-(--fg-soft)">
          The 3D preview could not start in this browser.
        </p>
      }
    >
      <Canvas
        className="!absolute inset-0"
        dpr={dpr}
        frameloop={onScreen ? "always" : "never"}
        shadows="percentage"
        camera={{ fov: 28, near: 2, far: 60, position: [0, 2.4, 9.6] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1;
        }}
        aria-hidden
      >
        <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.5))} />
        <Suspense fallback={null}>
          <Scene compact={compact} onReady={onReady} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
