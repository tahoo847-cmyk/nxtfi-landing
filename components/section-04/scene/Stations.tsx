"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { suspend } from "suspend-react";
import * as THREE from "three";
import { journey, STATIONS, term } from "../choreography";
import { addPin, placeTags } from "../tags";
import { journeyTextures } from "../ui/journeyArt";
import { FLOOR } from "./Terminal";

const BRUSHED_URL = "/assets/section-02/textures/brushed-roughness.webp";
const HALF = Math.PI / 2;

function Pin({ id, position }: { id: string; position: [number, number, number] }) {
  const ref = useRef<THREE.Object3D>(null);
  useEffect(() => addPin(id, ref.current!), [id]);
  return <object3D ref={ref} position={position} />;
}

/** Wedge body from a side profile, extruded across its width with a real bevel. */
function wedge(width: number, depth: number, front: number, back: number) {
  const b = 0.005;
  const z = depth / 2 - b;
  const shape = new THREE.Shape();
  shape.moveTo(z, 0);
  shape.lineTo(z, front - b);
  shape.lineTo(-z, back - b);
  shape.lineTo(-z, 0);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: width - b * 2, bevelEnabled: true, bevelSize: b, bevelThickness: b, bevelSegments: 4 });
  g.translate(0, 0, -(width - b * 2) / 2);
  g.rotateY(-HALF);
  return g;
}

function useMaterials() {
  const brushed = useTexture(BRUSHED_URL);
  return useMemo(
    () => ({
      aluminium: new THREE.MeshPhysicalMaterial({ color: "#c7cace", metalness: 1, roughness: 0.42, roughnessMap: brushed, anisotropy: 0.6, envMapIntensity: 1.15 }),
      graphite: new THREE.MeshStandardMaterial({ color: "#26282b", metalness: 0.45, roughness: 0.5 }),
      stone: new THREE.MeshStandardMaterial({ color: "#dcd8cf", metalness: 0, roughness: 0.82 }),
      muted: new THREE.MeshStandardMaterial({ color: "#a4a6a4", metalness: 0.5, roughness: 0.62 }),
      paper: new THREE.MeshStandardMaterial({ color: "#efeadf", roughness: 0.94 }),
    }),
    [brushed],
  );
}

type Materials = ReturnType<typeof useMaterials>;
type Art = Awaited<ReturnType<typeof journeyTextures>>;

function Screen({ map, width, height, y, opacity }: { map: THREE.Texture; width: number; height: number; y: number; opacity?: (m: THREE.MeshBasicMaterial) => void }) {
  const ref = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    if (ref.current && opacity) opacity(ref.current);
  });
  return (
    <mesh rotation={[-HALF, 0, 0]} position={[0, y, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial ref={ref} map={map} toneMapped={false} transparent={!!opacity} depthWrite={false} />
    </mesh>
  );
}

function Console({ m, art }: { m: Materials; art: Art }) {
  const group = useRef<THREE.Group>(null);
  const body = useMemo(() => wedge(0.36, 0.24, 0.034, 0.112), []);
  const slope = Math.atan2(0.078, 0.23);
  const showValue = (mat: THREE.MeshBasicMaterial) => void (mat.opacity = journey.value);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.visible = Math.abs(term.lx - STATIONS[1].x) < 1.05;
    g.rotation.y = journey.conRy;
  });

  return (
    <group position={[STATIONS[1].x, FLOOR, STATIONS[1].z]}>
      <group ref={group}>
        <mesh geometry={body} material={m.aluminium} castShadow receiveShadow />
        <group position={[0, 0.0735, 0]} rotation={[slope, 0, 0]}>
          <RoundedBox args={[0.336, 0.006, 0.206]} radius={0.003} smoothness={3} material={m.graphite} position={[0, 0.003, 0]} receiveShadow />
          <group position={[-0.081, 0.0066, -0.034]}>
            <Screen map={art.source} width={0.15} height={0.08} y={0.0002} />
          </group>
          <group position={[0.081, 0.0066, -0.034]}>
            <Screen map={art.pending} width={0.15} height={0.08} y={0.0002} />
            <Screen map={art.settled} width={0.15} height={0.08} y={0.0006} opacity={showValue} />
          </group>
          <group position={[-0.027, 0.0066, 0.062]}>
            <Screen map={art.rateOpen} width={0.258} height={0.04} y={0.0002} />
            <Screen map={art.rateDone} width={0.258} height={0.04} y={0.0006} opacity={showValue} />
          </group>
          <mesh material={m.aluminium} position={[0.132, 0.013, 0.062]} castShadow>
            <cylinderGeometry args={[0.019, 0.021, 0.018, 40]} />
          </mesh>
          <mesh position={[0.132, 0.0224, 0.052]}>
            <boxGeometry args={[0.0022, 0.0008, 0.012]} />
            <meshBasicMaterial color="#0e6b52" />
          </mesh>
          <Pin id="source" position={[-0.081, 0.008, -0.076]} />
          <Pin id="fiat" position={[0.081, 0.008, -0.076]} />
          <Pin id="rate" position={[0.152, 0.008, 0.066]} />
        </group>
      </group>
    </group>
  );
}

/** Selected route, as plinth-local x/z points. The three named stops sit at these indices. */
const ROUTE: [number, number][] = [[-0.25, 0.055], [-0.13, 0.055], [0.02, 0.055], [0.11, -0.035], [0.215, -0.035]];
const QUIET: [number, number][][] = [
  [[-0.13, 0.055], [-0.05, -0.1], [0.08, -0.1], [0.215, -0.035]],
  [[-0.13, 0.055], [-0.05, 0.14], [0.12, 0.14], [0.215, -0.035]],
  [[0.02, 0.055], [0.1, 0.14]],
];
const TOP = 0.03;

function Track({ points, material, width, height }: { points: [number, number][]; material: THREE.Material; width: number; height: number }) {
  return points.slice(1).map(([x, z], i) => {
    const [px, pz] = points[i];
    const length = Math.hypot(x - px, z - pz);
    return (
      <group key={i}>
        <mesh material={material} position={[(x + px) / 2, TOP + height / 2, (z + pz) / 2]} rotation={[0, -Math.atan2(z - pz, x - px), 0]} castShadow receiveShadow>
          <boxGeometry args={[length, height, width]} />
        </mesh>
        <mesh material={material} position={[x, TOP + height / 2, z]} castShadow>
          <cylinderGeometry args={[width / 2, width / 2, height, 16]} />
        </mesh>
      </group>
    );
  });
}

function Junction({ at, radius, height, material, lamp }: { at: [number, number]; radius: number; height: number; material: THREE.Material; lamp?: (m: THREE.MeshStandardMaterial) => void }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (ref.current && lamp) lamp(ref.current);
  });
  return (
    <group position={[at[0], TOP, at[1]]}>
      <mesh material={material} position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.08, height, 40]} />
      </mesh>
      <mesh position={[0, height + 0.0006, 0]} rotation={[-HALF, 0, 0]}>
        <circleGeometry args={[radius * 0.52, 32]} />
        <meshStandardMaterial ref={ref} color="#7f8a85" emissive="#3fbf94" emissiveIntensity={0} roughness={0.4} />
      </mesh>
    </group>
  );
}

const lengths = ROUTE.slice(1).map(([x, z], i) => Math.hypot(x - ROUTE[i][0], z - ROUTE[i][1]));
const total = lengths.reduce((a, b) => a + b, 0);

function along(t: number) {
  let left = t * total;
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i]) {
      const f = left / lengths[i];
      return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * f, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * f];
    }
    left -= lengths[i];
  }
  return ROUTE[ROUTE.length - 1];
}

function Routing({ m }: { m: Materials }) {
  const group = useRef<THREE.Group>(null);
  const puck = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.visible = Math.abs(term.lx - STATIONS[2].x) < 1.05;
    g.rotation.y = journey.routeRy;
    const [x, z] = along(journey.t);
    puck.current?.position.set(x, TOP + 0.0145, z);
  });

  return (
    <group position={[STATIONS[2].x, FLOOR, STATIONS[2].z]}>
      <group ref={group}>
        <RoundedBox args={[0.6, 0.03, 0.4]} radius={0.006} smoothness={3} material={m.stone} position={[0, 0.015, 0]} castShadow receiveShadow />
        <Track points={ROUTE} material={m.aluminium} width={0.016} height={0.012} />
        {QUIET.map((points, i) => (
          <Track key={i} points={points} material={m.muted} width={0.009} height={0.005} />
        ))}
        <Junction at={ROUTE[0]} radius={0.016} height={0.02} material={m.graphite} />
        <Junction at={ROUTE[1]} radius={0.026} height={0.04} material={m.aluminium} lamp={(l) => void (l.emissiveIntensity = journey.risk * 2.2)} />
        <Junction at={ROUTE[2]} radius={0.026} height={0.04} material={m.aluminium} lamp={(l) => void (l.emissiveIntensity = journey.check * 2.2)} />
        <Junction at={[-0.05, -0.1]} radius={0.012} height={0.016} material={m.muted} />
        <Junction at={[0.08, -0.1]} radius={0.012} height={0.016} material={m.muted} />
        <Junction at={[-0.05, 0.14]} radius={0.012} height={0.016} material={m.muted} />
        <Junction at={[0.12, 0.14]} radius={0.012} height={0.016} material={m.muted} />
        <group position={[0.235, TOP, -0.035]}>
          <RoundedBox args={[0.074, 0.05, 0.1]} radius={0.003} smoothness={2} material={m.graphite} position={[0, 0.025, 0]} castShadow receiveShadow />
          <RoundedBox args={[0.05, 0.03, 0.07]} radius={0.003} smoothness={2} material={m.aluminium} position={[0, 0.065, 0]} castShadow />
          <Junction at={[0, 0]} radius={0.012} height={0.0515} material={m.graphite} lamp={(l) => void (l.emissiveIntensity = journey.dest * 1.6)} />
        </group>
        <group ref={puck}>
          <mesh castShadow>
            <cylinderGeometry args={[0.0125, 0.0125, 0.009, 32]} />
            <meshStandardMaterial color="#0e6b52" metalness={0.5} roughness={0.32} />
          </mesh>
        </group>
        <Pin id="risk" position={[ROUTE[1][0], TOP + 0.045, ROUTE[1][1]]} />
        <Pin id="check" position={[ROUTE[2][0], TOP + 0.045, ROUTE[2][1]]} />
        <Pin id="dest" position={[0.272, TOP + 0.03, -0.035]} />
      </group>
    </group>
  );
}

function Overlay({ map, read }: { map: THREE.Texture; read: () => number }) {
  const ref = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    if (ref.current) ref.current.opacity = read();
  });
  return (
    <mesh rotation={[-HALF, 0, 0]} position={[0, 0.0008, 0]}>
      <planeGeometry args={[0.22, 0.31]} />
      <meshBasicMaterial ref={ref} map={map} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Statement({ m, art }: { m: Materials; art: Art }) {
  const group = useRef<THREE.Group>(null);
  const board = useMemo(() => wedge(0.3, 0.4, 0.016, 0.15), []);
  const slope = Math.atan2(0.134, 0.39);
  const sheet = useMemo(() => {
    const s = new THREE.MeshStandardMaterial({ map: art.paper, bumpMap: art.bump, bumpScale: 5, roughness: 0.92 });
    return [m.paper, m.paper, s, m.paper, m.paper, m.paper];
  }, [art, m]);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.visible = Math.abs(term.lx - STATIONS[3].x) < 1.05;
    g.rotation.y = journey.docRy;
  });

  return (
    <group position={[STATIONS[3].x, FLOOR, STATIONS[3].z]}>
      <group ref={group}>
        <mesh geometry={board} material={m.graphite} castShadow receiveShadow />
        <group position={[0, 0.083, 0]} rotation={[slope, 0, 0]}>
          <mesh material={m.paper} position={[-0.003, 0.0014, 0.004]} rotation={[0, 0.03, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.0012, 0.31]} />
          </mesh>
          <mesh material={m.paper} position={[0.003, 0.0028, 0.002]} rotation={[0, -0.02, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.0012, 0.31]} />
          </mesh>
          <group position={[0, 0.0042, 0.012]}>
            <mesh material={sheet} castShadow receiveShadow>
              <boxGeometry args={[0.22, 0.0012, 0.31]} />
            </mesh>
            <Overlay map={art.record} read={() => journey.rows} />
            <Overlay map={art.recon} read={() => journey.recon} />
            <Overlay map={art.stamp} read={() => journey.stamp} />
            <Pin id="record" position={[0.112, 0.001, -0.02]} />
            <Pin id="status" position={[0.112, 0.001, 0.125]} />
          </group>
          <group position={[0, 0.009, -0.163]}>
            <RoundedBox args={[0.25, 0.012, 0.04]} radius={0.004} smoothness={3} material={m.aluminium} castShadow />
            <group position={[0, 0.0062, 0]}>
              <Screen map={art.strip} width={0.2} height={0.026} y={0} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export function Stations() {
  const m = useMaterials();
  const art = suspend(journeyTextures, ["nxtfi-journey"]);
  useFrame(({ camera, size }) => {
    if (size.width >= 1024) placeTags(camera, size.width, size.height);
  });
  return (
    <>
      <Console m={m} art={art} />
      <Routing m={m} />
      <Statement m={m} art={art} />
    </>
  );
}
