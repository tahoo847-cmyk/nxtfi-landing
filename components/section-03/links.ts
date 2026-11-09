import * as THREE from "three";

const point = new THREE.Vector3();
let tags: HTMLElement[] = [];
let lines: SVGLineElement[] = [];
let dots: SVGCircleElement[] = [];

function find() {
  if (tags[0]?.isConnected) return;
  tags = [...document.querySelectorAll<HTMLElement>("[data-sol-tag]")];
  lines = [...document.querySelectorAll<SVGLineElement>("[data-sol-link] line")];
  dots = [...document.querySelectorAll<SVGCircleElement>("[data-sol-link] circle")];
}

/**
 * Pins each label and connector to its layer's rendered right edge. Each label sits level with its own layer, so the
 * connectors stay horizontal and cannot cross. Only writes when a value changes, so a settled scene costs no layout.
 */
export function placeLinks(layers: (THREE.Mesh | null)[], edge: number, camera: THREE.Camera, width: number, height: number) {
  find();
  camera.updateMatrixWorld();
  const sizes = tags.map((tag) => [tag.offsetLeft, tag.offsetHeight]);

  layers.forEach((layer, i) => {
    if (!layer || !tags[i] || !lines[i] || !dots[i]) return;
    layer.updateWorldMatrix(true, false);
    point.set(edge, 0, 0).applyMatrix4(layer.matrixWorld).project(camera);
    const x = Math.round(((point.x + 1) / 2) * width);
    const y = Math.round(((1 - point.y) / 2) * height);
    const [left, tall] = sizes[i];
    const top = `${y - Math.round(tall / 2)}px`;
    if (tags[i].style.top !== top) tags[i].style.top = top;

    const [x1, y1, x2] = [String(x), String(y), String(left)];
    if (lines[i].getAttribute("x1") === x1 && lines[i].getAttribute("y1") === y1 && lines[i].getAttribute("x2") === x2) return;
    lines[i].setAttribute("x1", x1);
    lines[i].setAttribute("x2", x2);
    lines[i].setAttribute("y1", y1);
    lines[i].setAttribute("y2", y1);
    dots[i].setAttribute("cx", x1);
    dots[i].setAttribute("cy", y1);
  });
}
