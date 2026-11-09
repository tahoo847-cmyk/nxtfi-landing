"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { suspend } from "suspend-react";
import * as THREE from "three";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { card } from "../choreography";
import { cardTextures, LAYERS } from "../ui/cardArt";
import { SOLUTION, solutionTextures } from "@/components/section-03/ui/solutionArt";
import { placeLinks } from "@/components/section-03/links";

const MODEL_URL = "/assets/section-02/models/nxtfi-card-base.glb";
const ROUGHNESS_URL = "/assets/section-02/textures/brushed-roughness.webp";

const WIDTH = 3;
const LAYER_DEPTH = 0.026;
const BEVEL = 0.0065;
const GAP = 0.45;
const DEPTH_GAP = 0.2;
const LIFT = 1.1;
const SAFE_ASPECT = 1.75;

/** The source model's card face sets the proportions and corner radius. Its 34-triangle outline is rebuilt with fine corners and a bevel. */
function measure(scene: THREE.Object3D) {
  const face = scene.getObjectByName("card_face") as THREE.Mesh;
  const pos = face.geometry.getAttribute("position");
  const box = new THREE.Box3().setFromBufferAttribute(pos as THREE.BufferAttribute);
  const long = box.max.z - box.min.z;
  const short = box.max.y - box.min.y;
  let flat = box.min.z;
  for (let i = 0; i < pos.count; i++) {
    if (box.max.y - pos.getY(i) < 1e-4) flat = Math.max(flat, pos.getZ(i));
  }
  const scale = WIDTH / long;
  return { height: short * scale, radius: (box.max.z - flat) * scale };
}

function layerGeometry(height: number, radius: number) {
  const w = WIDTH / 2;
  const h = height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-w + radius, -h);
  shape.lineTo(w - radius, -h);
  shape.absarc(w - radius, -h + radius, radius, -Math.PI / 2, 0, false);
  shape.lineTo(w, h - radius);
  shape.absarc(w - radius, h - radius, radius, 0, Math.PI / 2, false);
  shape.lineTo(-w + radius, h);
  shape.absarc(-w + radius, h - radius, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(-w, -h + radius);
  shape.absarc(-w + radius, -h + radius, radius, Math.PI, Math.PI * 1.5, false);

  const extruded = new THREE.ExtrudeGeometry(shape, {
    depth: LAYER_DEPTH - BEVEL * 2,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelOffset: -BEVEL,
    bevelSegments: 3,
    curveSegments: 20,
  });
  extruded.translate(0, 0, -(LAYER_DEPTH - BEVEL * 2) / 2);

  const geometry = toCreasedNormals(extruded, 0.7);
  const [lids, sides] = geometry.groups;
  const half = lids.count / 2;
  geometry.clearGroups();
  geometry.addGroup(0, half, 0);
  geometry.addGroup(half, half, 1);
  geometry.addGroup(sides.start, sides.count, 2);

  const pos = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  const uv = geometry.getAttribute("uv");
  for (let i = 0; i < pos.count; i++) {
    const back = i < half;
    const u = (pos.getX(i) + w) / WIDTH;
    uv.setXY(i, back ? 1 - u : u, (pos.getY(i) + h) / height);
    // Keeps the large faces flat. Averaged normals from the bevel would smear across them.
    if (i < lids.count) normal.setXYZ(i, 0, 0, back ? -1 : 1);
  }
  return geometry;
}

export function Card({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF(MODEL_URL);
  const { faces, back, route } = suspend(cardTextures, ["nxtfi-card"]);
  const brushed = useTexture(ROUGHNESS_URL);
  const solutionFaces = suspend(solutionTextures, ["nxtfi-solution"]);

  const rig = useRef<THREE.Group>(null);
  const layers = useRef<(THREE.Mesh | null)[]>([]);
  const warmLight = useRef<THREE.DirectionalLight>(null);
  const floor = useRef<THREE.Mesh>(null);
  const skin = useRef(false);
  const mouse = useRef(new THREE.Vector2());
  const damped = useRef(new THREE.Vector2());

  const geometry = useMemo(() => {
    const { height, radius } = measure(scene);
    return layerGeometry(height, radius);
  }, [scene]);

  const materials = useMemo(() => {
    const surface = (map: THREE.Texture) =>
      new THREE.MeshPhysicalMaterial({
        map,
        metalness: 0.14,
        roughness: 0.62,
        roughnessMap: brushed,
        clearcoat: 0.7,
        clearcoatRoughness: 0.14,
      });
    const edges = LAYERS.map(
      ({ edge }) => new THREE.MeshStandardMaterial({ color: edge, metalness: 0.75, roughness: 0.32 }),
    );
    const backFace = surface(back);
    backFace.emissive.set("#ffffff");
    backFace.emissiveMap = route;
    backFace.emissiveIntensity = 0;
    return { fronts: faces.map(surface), edges, backFace };
  }, [back, brushed, faces, route]);

  // The same four meshes carry a second skin for Section 03. It is swapped in while the faces point away from the camera.
  const solution = useMemo(() => {
    const fronts = SOLUTION.map(({ metalness, roughness, opacity }, i) => {
      const m = new THREE.MeshPhysicalMaterial({
        map: solutionFaces[i],
        metalness,
        roughness,
        roughnessMap: i === 3 ? null : brushed,
        clearcoat: i === 3 ? 1 : 0.5,
        clearcoatRoughness: i === 3 ? 0.35 : 0.2,
        transparent: opacity < 1,
        opacity,
      });
      return m;
    });
    const edges = SOLUTION.map(
      ({ edge, opacity }) =>
        new THREE.MeshStandardMaterial({ color: edge, metalness: 0.85, roughness: 0.28, transparent: opacity < 1, opacity: Math.min(1, opacity + 0.2) }),
    );
    return { fronts, edges };
  }, [brushed, solutionFaces]);

  useLayoutEffect(() => onReady(), [onReady]);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera, size }, dt) => {
    damped.current.lerp(mouse.current, 1 - Math.exp(-dt * 3));
    const mx = damped.current.x * card.parallax;
    const my = damped.current.y * card.parallax;
    const aspect = size.width / size.height;

    // Read every frame: this must match the 1024px breakpoint GSAP uses, even after a resize.
    const compact = size.width < 1024;
    // The camera frames by height, so a narrow window would crop the sides. Pulling back keeps the same width in view,
    // which is what the vw-based text columns assume.
    const framed = compact ? 1 : Math.max(1, SAFE_ASPECT / aspect);

    camera.position.set(card.cx + mx * 0.1, card.cy - my * 0.07, card.cz * framed);
    camera.lookAt(card.cx * 0.6, card.cy * 0.6, 0);

    const group = rig.current;
    if (group) {
      group.scale.setScalar(compact ? THREE.MathUtils.clamp(aspect / 0.46, 1, 1.22) : 1);
      group.position.set(card.px, card.py, card.pz);
      group.rotation.set(card.rx + my * 0.03, card.ry + mx * 0.05, card.rz);
    }

    const skinned = card.look > 0.5;
    const swap = skinned !== skin.current;
    skin.current = skinned;

    layers.current.forEach((layer, i) => {
      if (!layer) return;
      const stacked = (1.5 - i) * LAYER_DEPTH;
      const front = solution.fronts[i];
      layer.position.set(
        0,
        (1.5 - i) * GAP * card.spread,
        stacked - i * DEPTH_GAP * card.spread + (3 - i) * LIFT * card.lift,
      );
      if (swap) {
        layer.material = skinned
          ? [i === 3 ? materials.backFace : solution.edges[i], front, solution.edges[i]]
          : [i === 3 ? materials.backFace : materials.edges[i], materials.fronts[i], materials.edges[i]];
      }
    });
    materials.backFace.emissiveIntensity = card.route * 0.95;
    if (!compact && card.lift > 0.01) placeLinks(layers.current, WIDTH / 2 - 0.02, camera, size.width, size.height);

    if (warmLight.current) warmLight.current.intensity = card.warm * 1.3;
    if (floor.current) {
      floor.current.visible = card.warm > 0.01;
      floor.current.position.set(card.px, card.py - 1.05, 0);
      (floor.current.material as THREE.ShadowMaterial).opacity = card.warm * 0.2;
    }
  });

  return (
    <>
    <directionalLight ref={warmLight} color="#ffcfa3" position={[5, -1.5, 5]} intensity={0} />
    <mesh ref={floor} rotation={[-Math.PI / 2, 0, 0]} receiveShadow visible={false}>
      <planeGeometry args={[14, 14]} />
      <shadowMaterial transparent opacity={0} />
    </mesh>
    <group ref={rig}>
      {LAYERS.map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            layers.current[i] = m;
          }}
          geometry={geometry}
          material={[i === 3 ? materials.backFace : materials.edges[i], materials.fronts[i], materials.edges[i]]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
    </>
  );
}

useGLTF.preload(MODEL_URL);
