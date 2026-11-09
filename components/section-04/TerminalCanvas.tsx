"use client";

import { Component, Suspense, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { FLOOR, Terminal } from "./scene/Terminal";
import { Stations } from "./scene/Stations";
import { term } from "./choreography";

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("NxtFi terminal scene failed:", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Keeps the studio lights and the floor shadow with the camera as it travels along the table. */
function Follow({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    ref.current?.position.set(term.lx, 0, term.z);
  });
  return <group ref={ref}>{children}</group>;
}

export default function TerminalCanvas({ active }: { active: boolean }) {
  const [compact] = useState(() => innerWidth < 1024);
  const [target, setTarget] = useState<THREE.Object3D | undefined>();
  const [dpr, setDpr] = useState(() => Math.min(devicePixelRatio, compact ? 1.5 : 2));

  return (
    <SceneBoundary>
      <Canvas
        className="!absolute inset-0"
        dpr={dpr}
        shadows="percentage"
        frameloop={active ? "always" : "demand"}
        camera={{ fov: 28, near: 0.1, far: 20, position: [0, 0.1, 1.9] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
        }}
        aria-hidden
      >
        <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.5))} />
        <Suspense fallback={null}>
          <Environment files="/assets/section-02/hdr/white_studio_02_1k.hdr" environmentRotation={[0, 0.5, 0]} environmentIntensity={0.95} />
          <Follow>
            <object3D ref={(o) => setTarget(o ?? undefined)} />
            <directionalLight
              position={[-1.4, 2.2, 1.8]}
              intensity={1.7}
              target={target}
              castShadow
              shadow-mapSize={compact ? [1024, 1024] : [2048, 2048]}
              shadow-camera-left={-0.6}
              shadow-camera-right={0.6}
              shadow-camera-top={0.6}
              shadow-camera-bottom={-0.6}
              shadow-camera-near={0.5}
              shadow-camera-far={6}
              shadow-bias={-0.0004}
              shadow-radius={5}
            />
            <directionalLight position={[1.6, 0.9, -1.4]} intensity={2.4} color="#dfeee6" />
            <directionalLight position={[1.8, 0.2, 1.6]} intensity={0.5} color="#fff1e2" />
            <ContactShadows position={[0, FLOOR - 0.001, 0]} scale={1.5} resolution={512} blur={2.6} far={0.32} opacity={0.42} color="#1d352c" />
          </Follow>
          <Terminal />
          <Stations />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
