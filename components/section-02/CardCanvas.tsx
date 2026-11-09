"use client";

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { Card } from "./scene/Card";

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("NxtFi card scene failed:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function CardCanvas({ onReady }: { onReady: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [compact] = useState(() => innerWidth < 1024);
  const [dpr, setDpr] = useState(() => Math.min(devicePixelRatio, compact ? 1.5 : 2));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "50% 0px" });
    seen.observe(wrap.current!);
    return () => seen.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <SceneBoundary
        fallback={
          <div role="status" className="absolute inset-0 grid place-items-center px-6">
            <p className="text-xs text-white/60">The 3D card could not start in this browser.</p>
          </div>
        }
      >
        <Canvas
          className="!absolute inset-0"
          dpr={dpr}
          shadows="percentage"
          frameloop={visible ? "always" : "demand"}
          camera={{ fov: 28, near: 1, far: 40, position: [0, 0, 9] }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.NeutralToneMapping;
            gl.toneMappingExposure = 1;
          }}
          aria-hidden
        >
          <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.5))} />
          <Suspense fallback={null}>
            <Environment
              files="/assets/section-02/hdr/white_studio_02_1k.hdr"
              environmentRotation={[0, 0.9, 0]}
              environmentIntensity={1.05}
            />
            <directionalLight
              position={[-3, 5, 7]}
              intensity={1.5}
              castShadow
              shadow-mapSize={compact ? [1024, 1024] : [2048, 2048]}
              shadow-camera-left={-4}
              shadow-camera-right={4}
              shadow-camera-top={4}
              shadow-camera-bottom={-4}
              shadow-camera-near={1}
              shadow-camera-far={20}
              shadow-bias={-0.0005}
              shadow-normalBias={0.012}
            />
            <Card onReady={onReady} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
