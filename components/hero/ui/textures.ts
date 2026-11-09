import * as THREE from "three";
import { drawPanel, STAGES } from "./drawPanels";
import { drawScreen } from "./drawScreen";
import { mono, sans } from "./canvasKit";

const toTexture = (canvas: HTMLCanvasElement) => {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
};

let pending: Promise<{ screen: THREE.Texture; panels: THREE.Texture[] }> | undefined;

/** Fonts must be ready before the canvases draw, so this resolves once and suspends the scene until then. */
export function uiTextures() {
  pending ??= (async () => {
    await Promise.all([
      document.fonts.load(`500 40px ${sans()}`),
      document.fonts.load(`400 40px ${sans()}`),
      document.fonts.load(`500 40px ${mono()}`),
    ]);
    const screen = toTexture(await drawScreen());
    const panels = (await Promise.all(STAGES.map(drawPanel))).map(toTexture);
    return { screen, panels };
  })();
  return pending;
}
