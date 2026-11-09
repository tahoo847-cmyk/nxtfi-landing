"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { stage } from "../choreography";

/** Applies scroll state to the camera and laptop. The composition offset is a lens shift, so the laptop keeps its true perspective. */
export function CameraRig({ target }: { target: React.RefObject<THREE.Group | null> }) {
  const mouse = useRef(new THREE.Vector2());
  const damped = useRef(new THREE.Vector2());
  const look = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera, size }, dt) => {
    damped.current.lerp(mouse.current, 1 - Math.exp(-dt * 3.2));
    const amount = stage.parallax * (1 - stage.panels * 0.7);
    const mx = damped.current.x * amount;
    const my = damped.current.y * amount;

    camera.position.set(stage.cx + mx * 0.16, stage.cy - my * 0.1, stage.cz);
    camera.lookAt(look.current.set(stage.tx, stage.ty, stage.tz));

    const cam = camera as THREE.PerspectiveCamera;
    cam.setViewOffset(size.width, size.height, -stage.shiftX * size.width, -stage.shiftY * size.height, size.width, size.height);

    if (target.current) {
      target.current.rotation.y = stage.ry + mx * 0.025;
      target.current.rotation.x = my * 0.01;
    }
  });

  return null;
}
