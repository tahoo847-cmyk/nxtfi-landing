"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { stage } from "../choreography";

export const MODEL_URL = "/assets/models/laptop.glb";

export const LID_OPEN = -0.24;
export const LID_CLOSED = 1.1;
export const HINGE: [number, number, number] = [0, 0.065, -1.03];

/** The model paints metal as grey in its base map, so a metalness/roughness map can be derived from it. */
function deriveSurface(source: THREE.Texture, metalRough: number, otherRough: number) {
  const img = source.image as ImageBitmap;
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const v = px[i];
    const metal = v > 70 && v < 190 ? 1 : 0;
    px[i + 1] = (metal ? metalRough : otherRough) * 255;
    px[i + 2] = metal * 255;
  }
  ctx.putImageData(data, 0, 0);
  const out = new THREE.CanvasTexture(canvas);
  out.flipY = source.flipY;
  out.colorSpace = THREE.NoColorSpace;
  out.anisotropy = 8;
  return out;
}

export function Laptop({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF(MODEL_URL);
  const tilt = useRef(new THREE.Quaternion());
  const axis = useRef(new THREE.Vector3(1, 0, 0));

  const { lid, base } = useMemo(() => {
    const frame = scene.getObjectByName("Frame_ComputerFrame_0") as THREE.Mesh;
    const shell = scene.getObjectByName("Screen_ComputerScreen_0") as THREE.Mesh;
    const lid = scene.getObjectByName("Screen")!;

    const dress = (mesh: THREE.Mesh, metalRough: number, otherRough: number, backlit: boolean, reflect = 1) => {
      const src = mesh.material as THREE.MeshStandardMaterial;
      const surface = deriveSurface(src.map!, metalRough, otherRough);
      mesh.material = new THREE.MeshPhysicalMaterial({
        map: src.map,
        color: new THREE.Color(3.4, 3.3, 3.14),
        metalness: 1,
        roughness: 1,
        metalnessMap: surface,
        roughnessMap: surface,
        emissive: new THREE.Color(backlit ? "#dfe7e4" : "#000000"),
        emissiveMap: backlit ? src.emissiveMap : null,
        emissiveIntensity: backlit ? 0.75 : 0,
        envMapIntensity: reflect,
      });
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    };
    dress(frame, 0.34, 0.42, true);
    dress(shell, 0.34, 0.08, false, 0.45);

    return { lid, base: lid.quaternion.clone() };
  }, [scene]);

  useLayoutEffect(() => onReady(), [onReady]);

  useFrame(() => {
    const angle = THREE.MathUtils.lerp(LID_CLOSED, LID_OPEN, stage.lid);
    tilt.current.setFromAxisAngle(axis.current, angle);
    lid.quaternion.copy(base).premultiply(tilt.current);
  });

  return <primitive object={scene} scale={0.1} />;
}

useGLTF.preload(MODEL_URL);
