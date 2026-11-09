"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { suspend } from "suspend-react";
import * as THREE from "three";
import { stage } from "../choreography";
import { PANEL_H, PANEL_W, SCREEN, colors, slotCentre } from "../ui/layout";
import { uiTextures } from "../ui/textures";
import { HINGE, LID_CLOSED, LID_OPEN } from "./Laptop";

/** Display centre relative to the hinge, in scene units, flush with the bezel so the panel sits at glass level. */
const DISPLAY: [number, number, number] = [0, 1.004, -0.032];

type Pose = { pos: [number, number, number]; ry: number; scale: number };

const DESKTOP: Pose[] = [
  { pos: [-1.7, 0.13, 0.34], ry: 0.15, scale: 1.55 },
  { pos: [-0.57, -0.12, 0.56], ry: 0.05, scale: 1.55 },
  { pos: [0.57, 0.13, 0.56], ry: -0.05, scale: 1.55 },
  { pos: [1.7, -0.12, 0.34], ry: -0.15, scale: 1.55 },
];

const COMPACT: Pose[] = [
  { pos: [-0.5, 0.42, 0.5], ry: 0, scale: 1.5 },
  { pos: [0.5, 0.42, 0.5], ry: 0, scale: 1.5 },
  { pos: [0.5, -0.2, 0.5], ry: 0, scale: 1.5 },
  { pos: [-0.5, -0.2, 0.5], ry: 0, scale: 1.5 },
];

function panelShape() {
  const w = PANEL_W, h = PANEL_H, r = 0.028;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

function softShadow() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.filter = "blur(14px)";
  ctx.fillStyle = "#000";
  ctx.fillRect(24, 24, size - 48, size - 48);
  return new THREE.CanvasTexture(canvas);
}

/** A point on a panel's edge, in the same space as the poses. side is [x, y] in -1..1. */
function edgePoint({ pos, ry, scale }: Pose, side: [number, number], z = -0.03) {
  const hw = (PANEL_W * scale) / 2, hh = (PANEL_H * scale) / 2;
  return new THREE.Vector3(
    pos[0] + side[0] * hw * Math.cos(ry),
    pos[1] + side[1] * hh,
    pos[2] - side[0] * hw * Math.sin(ry) + z,
  );
}

/** Runs edge to edge between panels, and behind each panel where they join up, so the line never crosses a card. */
function buildPath(poses: Pose[]) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const joints: THREE.Vector3[] = [];
  const leave: [number, number][] = [];
  const enter: [number, number][] = [];
  poses.forEach((p, i) => {
    const next = poses[i + 1];
    if (!next) return;
    const dx = next.pos[0] - p.pos[0], dy = next.pos[1] - p.pos[1];
    const across = Math.abs(dx) > Math.abs(dy);
    leave.push(across ? [Math.sign(dx), 0] : [0, Math.sign(dy)]);
    enter.push(across ? [-Math.sign(dx), 0] : [0, -Math.sign(dy)]);
  });
  poses.slice(0, -1).forEach((p, i) => {
    const from = edgePoint(p, leave[i]);
    const to = edgePoint(poses[i + 1], enter[i]);
    if (i > 0) path.add(new THREE.LineCurve3(joints[joints.length - 1], from));
    const reach = from.distanceTo(to) * 0.5;
    const out = new THREE.Vector3(leave[i][0], leave[i][1], 0).multiplyScalar(reach);
    const back = new THREE.Vector3(enter[i][0], enter[i][1], 0).multiplyScalar(reach);
    path.add(new THREE.CubicBezierCurve3(from, from.clone().add(out), to.clone().add(back), to));
    joints.push(from, to);
  });
  const lengths = path.getCurveLengths();
  const total = path.getLength();
  const at = joints.map((_, i) => (i === 0 ? 0 : lengths[i - 1] / total));
  return { path, joints, at };
}

const ease = (t: number) => t * t * (3 - 2 * t);

export function Interface() {
  const { screen, panels } = suspend(uiTextures, ["nxtfi-ui"]);
  const width = useThree((s) => s.size.width);
  const poses = width < 1024 ? COMPACT : DESKTOP;

  const group = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshStandardMaterial>(null);
  const cards = useRef<(THREE.Group | null)[]>([]);
  const shadows = useRef<(THREE.Mesh | null)[]>([]);
  const tube = useRef<THREE.Mesh>(null);
  const nodes = useRef<(THREE.Mesh | null)[]>([]);

  const face = useMemo(() => {
    const geo = new THREE.ShapeGeometry(panelShape(), 12);
    const uv = geo.attributes.uv as THREE.BufferAttribute;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, pos.getX(i) / PANEL_W + 0.5, pos.getY(i) / PANEL_H + 0.5);
    }
    return geo;
  }, []);
  const edge = useMemo(
    () => new THREE.ExtrudeGeometry(panelShape(), { depth: 0.012, bevelEnabled: false, curveSegments: 12 }),
    [],
  );
  const shadowTex = useMemo(softShadow, []);

  const { pathGeo, joints, at } = useMemo(() => {
    const { path, joints, at } = buildPath(poses);
    return { pathGeo: new THREE.TubeGeometry(path, 420, 0.0055, 8, false), joints, at };
  }, [poses]);

  useFrame(() => {
    const angle = THREE.MathUtils.lerp(LID_CLOSED, LID_OPEN, stage.lid);
    if (group.current) group.current.rotation.x = angle;
    if (screenMat.current) {
      screenMat.current.emissiveIntensity = THREE.MathUtils.lerp(1, 0.5, stage.panels) * (0.25 + 0.75 * stage.lid);
    }

    poses.forEach((pose, i) => {
      const card = cards.current[i];
      if (!card) return;
      const lift = ease(THREE.MathUtils.clamp((stage.panels - i * 0.12) / 0.64, 0, 1));
      const [sx, sy] = slotCentre(i);
      card.position.set(
        THREE.MathUtils.lerp(sx, pose.pos[0], lift),
        THREE.MathUtils.lerp(sy, pose.pos[1], lift),
        THREE.MathUtils.lerp(0.003, pose.pos[2], lift),
      );
      card.rotation.y = pose.ry * lift;
      card.scale.setScalar(THREE.MathUtils.lerp(1, pose.scale, lift));

      const shadow = shadows.current[i];
      if (shadow) {
        shadow.position.set(card.position.x * 0.9, card.position.y - 0.08 * lift, 0.002);
        (shadow.material as THREE.MeshBasicMaterial).opacity = 0.7 * lift;
      }
    });

    if (tube.current) {
      tube.current.visible = stage.path > 0.001;
      pathGeo.setDrawRange(0, Math.floor(pathGeo.index!.count * stage.path));
    }
    nodes.current.forEach((node, i) => {
      if (!node) return;
      const reached = THREE.MathUtils.clamp((stage.path - at[i]) / 0.03, 0, 1);
      node.scale.setScalar(reached);
      node.visible = stage.path > 0.001 && reached > 0.01;
    });
  });

  return (
    <group position={HINGE}>
      <group ref={group}>
        <group position={DISPLAY}>
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[SCREEN.worldW * 1.006, SCREEN.worldH * 1.01]} />
            <meshStandardMaterial
              ref={screenMat}
              color="#000000"
              emissive="#ffffff"
              emissiveMap={screen}
              roughness={0.16}
              envMapIntensity={0.3}
              metalness={0}
            />
          </mesh>

          {poses.map((_, i) => (
            <mesh key={i} ref={(m) => { shadows.current[i] = m; }} scale={[PANEL_W * 2.1, PANEL_H * 2.3, 1]}>
              <planeGeometry />
              <meshBasicMaterial map={shadowTex} transparent opacity={0} depthWrite={false} toneMapped={false} />
            </mesh>
          ))}

          {poses.map((_, i) => (
            <group key={i} ref={(g) => { cards.current[i] = g; }}>
              <mesh geometry={edge} position={[0, 0, -0.013]}>
                <meshPhysicalMaterial color={colors.card} roughness={0.32} metalness={0.4} />
              </mesh>
              <mesh geometry={face}>
                <meshStandardMaterial color="#000000" emissive="#ffffff" emissiveMap={panels[i]} roughness={0.28} metalness={0} />
              </mesh>
            </group>
          ))}

          <mesh ref={tube} geometry={pathGeo} frustumCulled={false}>
            <meshBasicMaterial color={colors.accent} toneMapped={false} />
          </mesh>
          {joints.map((point, i) => (
            <mesh key={i} ref={(m) => { nodes.current[i] = m; }} position={point}>
              <sphereGeometry args={[0.017, 16, 16]} />
              <meshBasicMaterial color={colors.accent} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
