import { ArrowLeftRight, Landmark, Route, Wallet, type IconNode } from "lucide";
import { box, icon, makeCanvas, mono, sans, text } from "./canvasKit";
import { SLOT, colors as c } from "./layout";

type Spec = { node: IconNode; title: string; value: string; label: string; detail: string; status: string };

export const STAGES: Spec[] = [
  { node: Wallet, title: "Digital asset payment", value: "1,250.00 USDC", label: "Transfer", detail: "Stablecoin", status: "Received" },
  { node: ArrowLeftRight, title: "Fiat conversion", value: "€1,148.75", label: "Sample rate", detail: "1 USDC = €0.9190", status: "Converted" },
  { node: Route, title: "Payment routing", value: "SEPA Instant", label: "Corridor", detail: "USDC → EUR", status: "Route selected" },
  { node: Landmark, title: "Local settlement", value: "€1,148.75", label: "Beneficiary", detail: "Local bank ···· 4821", status: "Settled" },
];

const SCALE = 2;

export async function drawPanel(spec: Spec, index: number) {
  const W = SLOT.w * SCALE, H = SLOT.h * SCALE;
  const { canvas, ctx } = makeCanvas(W, H);
  const S = sans();
  const M = mono();
  const pad = 44;

  box(ctx, 0, 0, W, H, 40, c.card);
  box(ctx, 1, 1, W - 2, H - 2, 39, undefined, "rgba(255,255,255,0.16)");

  box(ctx, pad, pad, 76, 76, 20, c.accentDim);
  ctx.drawImage(await icon(spec.node, c.accent, 44), pad + 16, pad + 16, 44, 44);
  text(ctx, spec.title, pad + 100, pad + 50, `500 36px ${S}`, c.text);
  text(ctx, `0${index + 1}`, W - pad, pad + 50, `500 30px ${M}`, c.muted, "right");

  text(ctx, spec.value, pad, 268, `500 70px ${M}`, c.text);

  ctx.fillStyle = c.line;
  ctx.fillRect(pad, 312, W - pad * 2, 2);
  text(ctx, spec.label, pad, 372, `400 30px ${S}`, c.muted);
  text(ctx, spec.detail, W - pad, 372, `500 30px ${S}`, c.text, "right");

  ctx.beginPath();
  ctx.arc(pad + 9, 431, 9, 0, Math.PI * 2);
  ctx.fillStyle = c.accent;
  ctx.fill();
  text(ctx, spec.status, pad + 32, 442, `500 30px ${S}`, c.accent);
  text(ctx, "Sample data", W - pad, 442, `400 28px ${S}`, c.muted, "right");

  return canvas;
}
