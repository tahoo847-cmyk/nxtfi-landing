import * as THREE from "three";
import { ArrowLeftRight, Landmark, Route, Wallet, type IconNode } from "lucide";
import { icon, makeCanvas, mono, sans, text } from "@/components/hero/ui/canvasKit";

export type SolutionSpec = {
  label: string;
  node: IconNode;
  ink: string;
  soft: string;
  edge: string;
  metalness: number;
  roughness: number;
  opacity: number;
};

/** Graphite, satin silver, deep emerald and frosted glass: one material per payment layer, top to bottom. */
export const SOLUTION: SolutionSpec[] = [
  { label: "Digital Assets", node: Wallet, ink: "#f1ede6", soft: "rgba(241,237,230,0.6)", edge: "#2a2b2d", metalness: 0.55, roughness: 0.34, opacity: 1 },
  { label: "Conversion", node: ArrowLeftRight, ink: "#1c1d1f", soft: "rgba(28,29,31,0.55)", edge: "#a9adb2", metalness: 0.9, roughness: 0.3, opacity: 1 },
  { label: "Payment Routing", node: Route, ink: "#e6efe9", soft: "rgba(230,239,233,0.6)", edge: "#0b4a39", metalness: 0.4, roughness: 0.38, opacity: 1 },
  { label: "Local Settlement", node: Landmark, ink: "#2a2622", soft: "rgba(42,38,34,0.55)", edge: "#dcd6cc", metalness: 0.05, roughness: 0.22, opacity: 0.72 },
];

const W = 1536;
const H = 952;
const PAD = 96;

function base(i: number) {
  const { canvas, ctx } = makeCanvas(W, H);
  const g = ctx.createLinearGradient(0, 0, W, H);
  const stops: [string, string, string][] = [
    ["#3a3b3e", "#18191b", "#0f1011"],
    ["#e9ebee", "#c3c7cc", "#9da2a8"],
    ["#1a8567", "#0f6149", "#093d2e"],
    ["#f4f1ec", "#e3dfd8", "#d4d0c8"],
  ];
  g.addColorStop(0, stops[i][0]);
  g.addColorStop(0.55, stops[i][1]);
  g.addColorStop(1, stops[i][2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Fine brushed grain, so the satin and graphite faces read as metal rather than flat colour.
  if (i < 3) {
    ctx.globalAlpha = i === 1 ? 0.07 : 0.05;
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = y % 6 === 0 ? "#ffffff" : "#000000";
      ctx.fillRect(0, y, W, 1);
    }
    ctx.globalAlpha = 1;
  }
  return { canvas, ctx };
}

async function glyphAt(ctx: CanvasRenderingContext2D, i: number, x: number, y: number, size: number) {
  const { node, ink, soft } = SOLUTION[i];
  ctx.beginPath();
  ctx.arc(x, y, size * 0.82, 0, Math.PI * 2);
  ctx.strokeStyle = soft;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.drawImage(await icon(node, ink, size), x - size / 2, y - size / 2);
}

function footer(ctx: CanvasRenderingContext2D, i: number) {
  const { label, ink, soft } = SOLUTION[i];
  text(ctx, `0${i + 1}`, PAD, H - 84, `500 40px ${mono()}`, soft);
  text(ctx, label.toUpperCase(), PAD + 96, H - 84, `500 40px ${mono()}`, ink);
}

async function drawDigital() {
  const { canvas, ctx } = base(0);
  const { ink, soft } = SOLUTION[0];
  text(ctx, "NxtFi", W - PAD, 250, `600 150px ${sans()}`, ink, "right");
  text(ctx, "DIGITAL TRANSACTION", W - PAD, 330, `500 34px ${mono()}`, soft, "right");
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.roundRect(PAD, 190, 150, 112, 18);
  ctx.fill();
  await glyphAt(ctx, 0, 420, 520, 120);
  footer(ctx, 0);
  return canvas;
}

async function drawConversion() {
  const { canvas, ctx } = base(1);
  const { soft } = SOLUTION[1];
  ctx.strokeStyle = soft;
  ctx.lineWidth = 3;
  for (let r = 150; r < 520; r += 92) {
    ctx.beginPath();
    ctx.arc(W / 2, H / 2 - 40, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  await glyphAt(ctx, 1, W / 2, H / 2 - 40, 140);
  footer(ctx, 1);
  return canvas;
}

async function drawRouting() {
  const { canvas, ctx } = base(2);
  const { soft, ink } = SOLUTION[2];
  const pts: [number, number][] = [[260, 600], [620, 360], [980, 560], [1290, 300]];
  ctx.strokeStyle = soft;
  ctx.lineWidth = 4;
  ctx.setLineDash([2, 16]);
  ctx.lineCap = "round";
  ctx.beginPath();
  pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  ctx.setLineDash([]);
  pts.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fillStyle = ink;
    ctx.fill();
  });
  await glyphAt(ctx, 2, 770, 470, 110);
  footer(ctx, 2);
  return canvas;
}

async function drawSettlement() {
  const { canvas, ctx } = base(3);
  const { soft } = SOLUTION[3];
  ctx.strokeStyle = soft;
  ctx.lineWidth = 3;
  ctx.strokeRect(PAD + 40, 150, W - PAD * 2 - 80, H - 400);
  await glyphAt(ctx, 3, W / 2, H / 2 - 30, 140);
  footer(ctx, 3);
  return canvas;
}

const toTexture = (canvas: HTMLCanvasElement) => {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  return tex;
};

let pending: Promise<THREE.Texture[]> | undefined;

/** Faces for the four layers once the stack has landed. Fonts must be ready before the canvases draw. */
export function solutionTextures() {
  pending ??= (async () => {
    await Promise.all([
      document.fonts.load(`500 40px ${sans()}`),
      document.fonts.load(`600 40px ${sans()}`),
      document.fonts.load(`500 40px ${mono()}`),
    ]);
    const faces = await Promise.all([drawDigital(), drawConversion(), drawRouting(), drawSettlement()]);
    return faces.map(toTexture);
  })();
  return pending;
}
