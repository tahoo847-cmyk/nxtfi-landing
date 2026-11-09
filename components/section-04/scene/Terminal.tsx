"use client";

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { suspend } from "suspend-react";
import * as THREE from "three";
import { term } from "../choreography";
import { screenTexture } from "../ui/screenArt";
import { placeLink } from "../link";

export const TERMINAL_URL = "/assets/section-04/models/pos-terminal.glb";

/** Base of the reshaped device, and where the connector lands: the lower left of the screen, before reshaping. */
export const FLOOR = -0.1205;
const ANCHOR: [number, number, number] = [-0.151, -0.012, 0.06];

const NECK = -0.06;
const TILT = -0.24;
const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/** Bends the source model from a monitor into a countertop terminal: shorter neck, smaller base, screen leaning back. */
function reshape(p: THREE.Vector3, n?: THREE.Vector3) {
  const base = smooth((-0.09 - p.y) / 0.05);
  const lean = TILT * smooth((p.y + 0.085) / 0.04);
  const y = p.y < NECK ? NECK + (p.y - NECK) * 0.62 : p.y;
  const [c, s] = [Math.cos(lean), Math.sin(lean)];
  const [dy, dz] = [y - NECK, p.z * (1 - 0.1 * base) + 0.01];
  p.set(p.x * (1 - 0.24 * base), NECK + dy * c - dz * s, dy * s + dz * c - 0.01);
  if (n) n.set(n.x, n.y * c - n.z * s, n.y * s + n.z * c);
}

function build(scene: THREE.Object3D) {
  scene.updateMatrixWorld(true);
  const device = new THREE.Group();
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
    const pos = geometry.getAttribute("position");
    const nor = geometry.getAttribute("normal");
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i);
      n.fromBufferAttribute(nor, i);
      reshape(p, n);
      pos.setXYZ(i, p.x, p.y, p.z);
      nor.setXYZ(i, n.x, n.y, n.z);
    }
    const part = new THREE.Mesh(geometry, mesh.material);
    part.name = mesh.name;
    device.add(part);
  });
  return device;
}

const anchor = new THREE.Vector3();

export function Terminal() {
  const { scene } = useGLTF(TERMINAL_URL);
  const device = useMemo(() => build(scene), [scene]);
  const tex = suspend(screenTexture, ["nxtfi-terminal-screen"]);

  const screen = useMemo(
    // Untone-mapped light, so the interface keeps its true whites. The dim base colour leaves room for glass reflections.
    () => new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0, roughness: 0.18, metalness: 0, toneMapped: false }),
    [tex],
  );

  useEffect(() => {
    device.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (mesh.name.includes("Android_Panel")) {
        mesh.material = screen;
        mesh.castShadow = false;
      } else if (mesh.name.includes("Black_Pastics")) {
        const m = (mesh.material as THREE.MeshStandardMaterial).clone();
        m.map = null;
        m.color.set("#303337");
        m.roughness = 0.36;
        m.metalness = 0.6;
        m.envMapIntensity = 1.15;
        mesh.material = m;
      } else if (mesh.name.includes("Glass")) {
        const m = mesh.material as THREE.MeshStandardMaterial;
        m.depthWrite = false;
        m.opacity = 0.07;
        m.envMapIntensity = 1.4;
      }
    });
  }, [device, screen]);

  useFrame(({ camera, size }) => {
    const wide = size.width >= 1024;
    const framed = wide ? Math.max(1, 1.75 / (size.width / size.height)) : 1;
    camera.position.set(term.cx, term.cy, term.z + term.d * framed);
    camera.lookAt(term.lx, term.ly, term.z);
    device.position.set(term.px, term.py, 0);
    device.rotation.set(0, term.ry, 0);
    screen.color.setScalar(0.03 + 0.12 * term.screen);
    screen.emissiveIntensity = term.screen * 0.94;

    if (!wide) return placeLink(null);
    if (term.screen < 0.01) return;
    device.updateWorldMatrix(true, false);
    camera.updateMatrixWorld();
    anchor.set(...ANCHOR);
    reshape(anchor);
    anchor.applyMatrix4(device.matrixWorld).project(camera);
    placeLink({ x: Math.round(((anchor.x + 1) / 2) * size.width), y: Math.round(((1 - anchor.y) / 2) * size.height) });
  });

  return <primitive object={device} />;
}

useGLTF.preload(TERMINAL_URL);
