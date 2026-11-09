import * as THREE from "three";
import { ArrowLeftRight, Landmark, Route, Wallet, type IconNode } from "lucide";
import { box, icon, makeCanvas, mono, sans, text } from "@/components/hero/ui/canvasKit";

export const LAYERS: { label: string; node: IconNode; fill: string; ink: string; edge: string }[] = [
  { label: "Digital assets", node: Wallet, fill: "#d9d5ca", ink: "#0f1614", edge: "#b9b4a6" },
  { label: "Conversion", node: ArrowLeftRight, fill: "#a3bcb0", ink: "#0f1614", edge: "#83a091" },
  { label: "Payment routing", node: Route, fill: "#14795e", ink: "#eef2f0", edge: "#0e6b52" },
  { label: "Fiat settlement", node: Landmark, fill: "#0c4a3a", ink: "#eef2f0", edge: "#0a3a2e" },
];

const W = 2048;
const H = 1270;
const PAD = 110;

function band(ctx: CanvasRenderingContext2D, i: number, width: number, height: number, k: number) {
  const { label, ink } = LAYERS[i];
  const y = height - 112 * k;
  text(ctx, `0${i + 1}`, PAD * k, y, `500 ${44 * k}px ${mono()}`, ink);
  text(ctx, label, (PAD + 110) * k, y, `500 ${68 * k}px ${sans()}`, ink);
}

async function drawFront() {
  const { canvas, ctx } = makeCanvas(W, H);
  const { fill, ink } = LAYERS[0];
  box(ctx, 0, 0, W, H, 0, fill);

  text(ctx, "NxtFi", PAD, 270, `600 176px ${sans()}`, ink);
  text(ctx, "DIGITAL TRANSACTION", W - PAD, 196, `500 40px ${mono()}`, "rgba(15,22,20,0.62)", "right");

  const y = 690;
  ctx.strokeStyle = "rgba(15,22,20,0.32)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(PAD + 70, y);
  ctx.lineTo(W - PAD - 70, y);
  ctx.stroke();

  const glyphs = await Promise.all(LAYERS.map((l) => icon(l.node, ink, 84)));
  glyphs.forEach((glyph, i) => {
    const x = PAD + 70 + (i * (W - PAD * 2 - 140)) / 3;
    ctx.beginPath();
    ctx.arc(x, y, 72, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "rgba(15,22,20,0.32)";
    ctx.stroke();
    ctx.drawImage(glyph, x - 42, y - 42);
  });

  band(ctx, 0, W, H, 1);
  text(ctx, "ILLUSTRATIVE", W - PAD, H - 112, `500 40px ${mono()}`, "rgba(15,22,20,0.62)", "right");
  return canvas;
}

async function drawLayer(i: number) {
  const k = 0.75;
  const { canvas, ctx } = makeCanvas(W * k, H * k);
  const { fill, ink, node } = LAYERS[i];
  box(ctx, 0, 0, W * k, H * k, 0, fill);
  band(ctx, i, W * k, H * k, k);
  const glyph = await icon(node, ink, 72);
  ctx.drawImage(glyph, (W - PAD) * k - 72, H * k - 112 * k - 52);
  return canvas;
}

const NODES = [230, 760, 1290, 1820];
const MAIN = 640;
const NAMES = ["Digital assets", "Conversion", "Routing", "Fiat settlement"];

function drawBack() {
  const { canvas, ctx } = makeCanvas(W, H);
  const fill = LAYERS[3].fill;
  const ink = LAYERS[3].ink;
  box(ctx, 0, 0, W, H, 0, fill);

  text(ctx, "Behind one payment", PAD, 210, `500 76px ${sans()}`, ink);
  text(ctx, "NxtFi", W - PAD, 210, `600 76px ${sans()}`, ink, "right");

  ctx.strokeStyle = "rgba(238,242,240,0.34)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(NODES[0], MAIN);
  ctx.lineTo(NODES[3], MAIN);
  ctx.stroke();

  NODES.forEach((x, i) => {
    ctx.beginPath();
    ctx.arc(x, MAIN, 26, 0, Math.PI * 2);
    ctx.fillStyle = ink;
    ctx.fill();
    text(ctx, NAMES[i], x, MAIN + 430, `500 50px ${sans()}`, ink, "center");
  });

  text(ctx, "ILLUSTRATIVE ROUTE", PAD, H - 76, `500 34px ${mono()}`, "rgba(238,242,240,0.62)");
  return canvas;
}

/** The extra steps. Lit through the emissive channel, so scrolling reveals them on the printed route. */
function drawRoute() {
  const k = 0.5;
  const { canvas, ctx } = makeCanvas(W * k, H * k);
  box(ctx, 0, 0, W * k, H * k, 0, "#000000");
  ctx.scale(k, k);
  ctx.lineCap = "round";
  const stroke = "#58d6ab";

  const arc = (x0: number, y0: number, x1: number, y1: number) => {
    const mid = (x0 + x1) / 2;
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(mid, y0, mid, y1, x1, y1);
  };
  const steps: [number, number, string][] = [
    [495, 400, "Exchange"],
    [495, 880, "Provider"],
    [1025, 400, "Network"],
    [1025, 880, "Network"],
    [1555, 400, "Bank"],
    [1555, 880, "Local rail"],
  ];

  ctx.strokeStyle = stroke;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(NODES[0], MAIN);
  ctx.lineTo(NODES[3], MAIN);
  for (const [i, [x, y]] of steps.entries()) {
    const from = NODES[Math.floor(i / 2)];
    arc(from, MAIN, x, y);
    arc(x, y, from + 530, MAIN);
  }
  ctx.stroke();

  for (const [x, y, name] of steps) {
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fillStyle = stroke;
    ctx.fill();
    const above = y < MAIN;
    text(ctx, name, x, above ? y - 44 : y + 72, `500 40px ${mono()}`, stroke, "center");
  }
  return canvas;
}

const toTexture = (canvas: HTMLCanvasElement) => {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  return tex;
};

let pending: Promise<{ faces: THREE.Texture[]; back: THREE.Texture; route: THREE.Texture }> | undefined;

/** Fonts must be ready before the canvases draw. */
export function cardTextures() {
  pending ??= (async () => {
    await Promise.all([
      document.fonts.load(`500 40px ${sans()}`),
      document.fonts.load(`600 40px ${sans()}`),
      document.fonts.load(`500 40px ${mono()}`),
    ]);
    const faces = await Promise.all([drawFront(), drawLayer(1), drawLayer(2), drawLayer(3)]);
    return { faces: faces.map(toTexture), back: toTexture(drawBack()), route: toTexture(drawRoute()) };
  })();
  return pending;
}
