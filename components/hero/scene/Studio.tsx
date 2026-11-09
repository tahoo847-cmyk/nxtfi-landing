"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { stage } from "../choreography";

const LIGHT = new THREE.Color("#e4e4e1");
const DARK = new THREE.Color("#0a0e0d");
const FLOOR_LIGHT = new THREE.Color("#e6e1d8");
const FLOOR_DARK = new THREE.Color("#0b0f0e");

export function Studio({ compact }: { compact: boolean }) {
  const scene = useThree((s) => s.scene);
  const key = useRef<THREE.DirectionalLight>(null);
  const glow = useRef<THREE.PointLight>(null);
  const floor = useRef<THREE.MeshStandardMaterial>(null);
  const fog = useRef<THREE.Fog>(null);
  const bg = useRef(new THREE.Color());

  useFrame(() => {
    const d = stage.dark;
    bg.current.copy(LIGHT).lerp(DARK, d);
    scene.background = bg.current;
    fog.current?.color.copy(bg.current);
    scene.environmentIntensity = THREE.MathUtils.lerp(0.62, 0.3, d);
    floor.current?.color.copy(FLOOR_LIGHT).lerp(FLOOR_DARK, d);
    if (key.current) key.current.intensity = THREE.MathUtils.lerp(1.7, 0.35, d);
    if (glow.current) glow.current.intensity = THREE.MathUtils.lerp(0, 2.4, d);
  });

  return (
    <>
      <fog ref={fog} attach="fog" args={compact ? ["#e4e4e1", 20, 38] : ["#e4e4e1", 10.5, 22]} />
      <Environment
        files={compact ? "/assets/hdr/studio_small_02_1k.hdr" : "/assets/hdr/studio_small_02_2k.hdr"}
        environmentRotation={[0, 1.25, 0]}
      />
      <directionalLight
        ref={key}
        position={[-4.5, 7.5, 4]}
        castShadow
        shadow-mapSize={compact ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-far={20}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* Sits just behind the display plane so it lights the keyboard without a highlight on the glass. */}
      <pointLight ref={glow} position={[0, 0.95, -1.42]} distance={5} decay={2} color="#cfeee3" />

      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[120, 120]} />
        {compact ? (
          <meshStandardMaterial ref={floor} roughness={0.6} />
        ) : (
          <MeshReflectorMaterial
            ref={floor as never}
            blur={[420, 140]}
            resolution={1024}
            mixBlur={1}
            mixStrength={0.7}
            mirror={0.35}
            roughness={0.72}
            metalness={0}
            depthScale={0}
          />
        )}
      </mesh>
      <ContactShadows position={[0, 0.004, 0]} scale={11} blur={2.6} far={2.2} opacity={0.62} resolution={512} color="#10201b" />
    </>
  );
}
