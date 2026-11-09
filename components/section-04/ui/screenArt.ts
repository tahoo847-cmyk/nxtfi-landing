import * as THREE from "three";
import { box, makeCanvas, mono, sans, text } from "@/components/hero/ui/canvasKit";

// The model's panel UVs only show u 0.02-0.98, v 0.17-0.83, so the interface must stay inside this window of a square canvas.
const SIZE = 1560;
const VIEW = { x: 30, y: 265, w: 1500, h: 1030 };

/** Deterministic noise. The modules are decoration: the pattern encodes nothing and no address. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleCode(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const n = 29;
  const cell = size / n;
  const rand = rng(20261030);
  const corner = (i: number, j: number) => (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9);
  ctx.fillStyle = "#101a16";
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      if (corner(i, j)) continue;
      if (rand() > 0.52) ctx.fillRect(x + i * cell, y + j * cell, cell * 0.92, cell * 0.92);
    }
  }
  for (const [fx, fy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
    const px = x + fx * cell;
    const py = y + fy * cell;
    ctx.fillStyle = "#101a16";
    ctx.fillRect(px, py, cell * 7, cell * 7);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px + cell, py + cell, cell * 5, cell * 5);
    ctx.fillStyle = "#101a16";
    ctx.fillRect(px + cell * 2, py + cell * 2, cell * 3, cell * 3);
  }
}

function draw() {
  const { canvas, ctx } = makeCanvas(SIZE, SIZE);
  ctx.fillStyle = "#050706";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.translate(VIEW.x, VIEW.y);

  const x0 = 26;
  const y0 = 26;
  const w = VIEW.w - x0 * 2;
  const h = VIEW.h - y0 * 2;
  const bg = ctx.createLinearGradient(x0, y0, x0 + w, y0 + h);
  bg.addColorStop(0, "#f7f9f5");
  bg.addColorStop(1, "#e2ebe5");
  box(ctx, x0, y0, w, h, 30);
  ctx.fillStyle = bg;
  ctx.fill();

  const pad = 72;
  const left = x0 + pad;
  const right = x0 + w - pad;
  text(ctx, "NxtFi", left, y0 + 104, `600 46px ${sans()}`, "#0e6b52");
  box(ctx, right - 250, y0 + 58, 250, 60, 30, "rgba(14,107,82,0.1)");
  text(ctx, "ILLUSTRATIVE", right - 125, y0 + 98, `500 25px ${mono()}`, "#0e6b52", "center");

  text(ctx, "Digital Asset Payment", left, y0 + 236, `500 60px ${sans()}`, "#101a16");
  text(ctx, "AMOUNT DUE", left, y0 + 340, `500 28px ${mono()}`, "rgba(16,26,22,0.58)");
  text(ctx, "48.50", left, y0 + 490, `600 158px ${sans()}`, "#101a16");
  text(ctx, "USD", left + 462, y0 + 490, `500 44px ${mono()}`, "rgba(16,26,22,0.58)");
  text(ctx, "Pay with a digital asset.", left, y0 + 588, `400 38px ${sans()}`, "rgba(16,26,22,0.76)");
  text(ctx, "Merchant settles in local currency.", left, y0 + 640, `400 38px ${sans()}`, "rgba(16,26,22,0.76)");

  const status = y0 + h - 186;
  box(ctx, left, status, 540, 104, 52, "#0e6b52");
  ctx.beginPath();
  ctx.arc(left + 56, status + 52, 12, 0, Math.PI * 2);
  ctx.fillStyle = "#9be4c8";
  ctx.fill();
  text(ctx, "Waiting for payment", left + 96, status + 66, `500 40px ${sans()}`, "#eef6f1");

  const card = 540;
  const cx = right - card;
  const cy = y0 + 150;
  box(ctx, cx, cy, card, card, 28, "#ffffff", "rgba(16,26,22,0.1)");
  sampleCode(ctx, cx + 46, cy + 46, card - 92);
  text(ctx, "Scan to pay", cx + card / 2, cy + card + 72, `500 42px ${sans()}`, "#101a16", "center");
  text(ctx, "SAMPLE. NOT A PAYMENT ADDRESS", cx + card / 2, cy + card + 122, `500 24px ${mono()}`, "rgba(16,26,22,0.58)", "center");
  return canvas;
}

let pending: Promise<THREE.CanvasTexture> | undefined;

export function screenTexture() {
  pending ??= (async () => {
    await Promise.all([
      document.fonts.load(`500 40px ${sans()}`),
      document.fonts.load(`600 40px ${sans()}`),
      document.fonts.load(`400 40px ${sans()}`),
      document.fonts.load(`500 40px ${mono()}`),
    ]);
    const tex = new THREE.CanvasTexture(draw());
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  })();
  return pending;
}
