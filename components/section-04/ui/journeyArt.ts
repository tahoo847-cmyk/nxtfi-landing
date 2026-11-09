import * as THREE from "three";
import { makeCanvas, mono, sans, text } from "@/components/hero/ui/canvasKit";

const INK = "#1b1f1c";
const SOFT = "rgba(27,31,28,0.62)";
const MINT = "#9be4c8";
const EMERALD = "#0e6b52";

function panel(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const { canvas, ctx } = makeCanvas(w, h);
  ctx.fillStyle = "#0b100e";
  ctx.fillRect(0, 0, w, h);
  draw(ctx);
  return canvas;
}

function value(label: string, amount: string, note: string, color: string) {
  return panel(640, 340, (ctx) => {
    text(ctx, label, 44, 74, `500 30px ${mono()}`, MINT);
    text(ctx, amount, 42, 226, `500 132px ${sans()}`, color);
    text(ctx, note, 44, 292, `500 26px ${mono()}`, "rgba(238,242,240,0.62)");
  });
}

function rate(state: string, note: string) {
  return panel(1000, 150, (ctx) => {
    text(ctx, "RATE", 40, 92, `500 34px ${mono()}`, MINT);
    text(ctx, state, 170, 74, `500 38px ${sans()}`, "#eef2f0");
    text(ctx, note, 170, 118, `500 25px ${mono()}`, "rgba(238,242,240,0.62)");
  });
}

const PAGE = { w: 1024, h: 1440, pad: 96 };

function row(ctx: CanvasRenderingContext2D, y: number, label: string, val: string) {
  text(ctx, label, PAGE.pad, y, `400 34px ${sans()}`, SOFT);
  text(ctx, val, PAGE.w - PAGE.pad, y, `500 34px ${sans()}`, INK, "right");
  ctx.strokeStyle = "rgba(27,31,28,0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAGE.pad, y + 28);
  ctx.lineTo(PAGE.w - PAGE.pad, y + 28);
  ctx.stroke();
}

/** Laid paper: base colour with fine fibres, printed title block. */
function paper() {
  const { canvas, ctx } = makeCanvas(PAGE.w, PAGE.h);
  ctx.fillStyle = "#f5f1e8";
  ctx.fillRect(0, 0, PAGE.w, PAGE.h);
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = i % 2 ? "rgba(120,104,80,0.05)" : "rgba(255,255,255,0.3)";
    ctx.fillRect((i * 7919) % PAGE.w, (i * 104729) % PAGE.h, 12 + (i % 26), 1);
  }
  text(ctx, "NxtFi", PAGE.pad, 224, `600 148px ${sans()}`, "rgba(27,31,28,0.07)");
  text(ctx, "Settlement Statement", PAGE.pad, 318, `500 62px ${sans()}`, INK);
  text(ctx, "ILLUSTRATIVE EXAMPLE. FICTIONAL VALUES.", PAGE.pad, 376, `500 27px ${mono()}`, EMERALD);
  return canvas;
}

/** Height map for the raised wordmark and the sheet's tooth. */
function emboss() {
  const { canvas, ctx } = makeCanvas(PAGE.w / 2, PAGE.h / 2);
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, PAGE.w / 2, PAGE.h / 2);
  for (let i = 0; i < 3000; i++) {
    ctx.fillStyle = i % 2 ? "#8c8c8c" : "#747474";
    ctx.fillRect((i * 6151) % (PAGE.w / 2), (i * 12289) % (PAGE.h / 2), 2, 2);
  }
  text(ctx, "NxtFi", PAGE.pad / 2, 112, `600 74px ${sans()}`, "#ffffff");
  return canvas;
}

function overlay(draw: (ctx: CanvasRenderingContext2D) => void) {
  const { canvas, ctx } = makeCanvas(PAGE.w, PAGE.h);
  draw(ctx);
  return canvas;
}

const toTexture = (canvas: HTMLCanvasElement, srgb = true) => {
  const tex = new THREE.CanvasTexture(canvas);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
};

function draw() {
  const record = overlay((ctx) => {
    text(ctx, "SETTLEMENT RECORD", PAGE.pad, 500, `500 28px ${mono()}`, SOFT);
    row(ctx, 572, "Reference", "SAMPLE-0001");
    row(ctx, 658, "Payment value", "48.50 USD");
    row(ctx, 744, "Conversion", "Recorded");
    row(ctx, 830, "Routing", "Selected path");
    row(ctx, 916, "Local settlement", "48.50 USD");
  });
  const recon = overlay((ctx) => {
    text(ctx, "RECONCILIATION", PAGE.pad, 1040, `500 28px ${mono()}`, SOFT);
    row(ctx, 1112, "Payment record", "Matched");
    row(ctx, 1198, "Settlement record", "Matched");
  });
  const stamp = overlay((ctx) => {
    ctx.strokeStyle = EMERALD;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(PAGE.w - PAGE.pad - 330, 1262, 330, 84, 42);
    ctx.stroke();
    text(ctx, "RECONCILED", PAGE.w - PAGE.pad - 165, 1318, `500 36px ${mono()}`, EMERALD, "center");
  });
  const strip = panel(1000, 130, (ctx) => {
    text(ctx, "RECONCILIATION", 44, 58, `500 30px ${mono()}`, MINT);
    text(ctx, "Records matched. Sample data.", 44, 104, `500 34px ${sans()}`, "#eef2f0");
  });

  return {
    source: toTexture(value("DIGITAL ASSET", "48.50", "SAMPLE VALUE", "#eef2f0")),
    pending: toTexture(value("LOCAL CURRENCY", "- - -", "PENDING", "rgba(238,242,240,0.5)")),
    settled: toTexture(value("LOCAL CURRENCY", "48.50", "USD. SAMPLE VALUE", "#eef2f0")),
    rateOpen: toTexture(rate("Awaiting rate handling", "ILLUSTRATIVE")),
    rateDone: toTexture(rate("Applied at conversion", "ILLUSTRATIVE. NOT A LIVE RATE")),
    paper: toTexture(paper()),
    bump: toTexture(emboss(), false),
    record: toTexture(record),
    recon: toTexture(recon),
    stamp: toTexture(stamp),
    strip: toTexture(strip),
  };
}

let pending: Promise<ReturnType<typeof draw>> | undefined;

export function journeyTextures() {
  pending ??= (async () => {
    await Promise.all([
      document.fonts.load(`400 40px ${sans()}`),
      document.fonts.load(`500 40px ${sans()}`),
      document.fonts.load(`600 40px ${sans()}`),
      document.fonts.load(`500 40px ${mono()}`),
    ]);
    return draw();
  })();
  return pending;
}
