import * as THREE from "three";

const pins = new Map<string, THREE.Object3D>();
const seen = new Map<string, HTMLElement | null>();
const point = new THREE.Vector3();

export function addPin(id: string, object: THREE.Object3D) {
  pins.set(id, object);
  return () => void pins.delete(id);
}

/** Moves each label's zero-size root onto its pin's rendered position. The CSS draws the leader from there. */
export function placeTags(camera: THREE.Camera, width: number, height: number) {
  camera.updateMatrixWorld();
  for (const [id, pin] of pins) {
    let el = seen.get(id);
    if (!el?.isConnected) {
      el = document.querySelector<HTMLElement>(`[data-s4-tag="${id}"]`);
      seen.set(id, el);
    }
    if (!el) continue;
    pin.getWorldPosition(point).project(camera);
    el.style.transform = `translate3d(${Math.round(((point.x + 1) / 2) * width)}px, ${Math.round(((1 - point.y) / 2) * height)}px, 0)`;
  }
}
