import {
  ArrowLeftRight, ChartColumn, Landmark, LayoutDashboard, Route, Search, Wallet,
} from "lucide";
import { box, icon, makeCanvas, mono, sans, text } from "./canvasKit";
import { SCREEN, SLOT, colors as c } from "./layout";

const NAV = [
  [LayoutDashboard, "Overview"],
  [Wallet, "Digital assets"],
  [ArrowLeftRight, "Conversion"],
  [Route, "Routing"],
  [Landmark, "Settlement"],
  [ChartColumn, "Reports"],
] as const;

const SERIES = [38, 44, 41, 52, 49, 58, 63, 57, 66, 72, 69, 78, 84, 80, 91, 96];

const ROWS = [
  ["USDC → EUR", "SEPA Instant", "€1,148.75", "Settled"],
  ["USDT → GBP", "Faster Payments", "£842.10", "Settled"],
  ["USDC → PKR", "Local rail", "PKR 182,400", "Routing"],
  ["USDC → AED", "Local rail", "AED 3,672", "Converting"],
  ["USDT → EUR", "SEPA Instant", "€2,310.00", "Settled"],
  ["USDC → GBP", "Faster Payments", "£1,205.40", "Settled"],
];

export async function drawScreen() {
  const { canvas, ctx } = makeCanvas(SCREEN.w, SCREEN.h);
  const S = sans();
  const M = mono();

  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, SCREEN.w, SCREEN.h);

  // Sidebar
  ctx.fillStyle = c.rail;
  ctx.fillRect(0, 0, 300, SCREEN.h);
  ctx.fillStyle = c.line;
  ctx.fillRect(300, 0, 2, SCREEN.h);
  text(ctx, "NxtFi", 44, 92, `600 44px ${S}`, c.text);

  for (const [i, [node, label]] of NAV.entries()) {
    const y = 160 + i * 74;
    const on = i === 0;
    if (on) box(ctx, 24, y, 252, 60, 14, "rgba(255,255,255,0.06)");
    ctx.drawImage(await icon(node, on ? c.text : c.muted, 30), 44, y + 15, 30, 30);
    text(ctx, label, 90, y + 40, `500 26px ${S}`, on ? c.text : c.muted);
  }

  // Header
  text(ctx, "Payment infrastructure", SLOT.x, 76, `500 36px ${S}`, c.text);
  text(ctx, "Digital asset to local settlement", SLOT.x, 112, `400 24px ${S}`, c.muted);
  box(ctx, 1500, 44, 276, 58, 14, c.card, c.line);
  ctx.drawImage(await icon(Search, c.muted, 26), 1518, 60, 26, 26);
  text(ctx, "Search payments", 1556, 82, `400 24px ${S}`, c.muted);
  box(ctx, 1796, 44, 212, 58, 29, c.accentDim);
  text(ctx, "Illustrative UI", 1902, 82, `500 24px ${S}`, c.accent, "center");

  // Empty slots left behind when the pipeline cards lift off the screen
  for (let i = 0; i < 4; i++) {
    const x = SLOT.x + i * (SLOT.w + SLOT.gap);
    ctx.setLineDash([10, 10]);
    box(ctx, x, SLOT.y, SLOT.w, SLOT.h, 20, "rgba(255,255,255,0.015)", "rgba(255,255,255,0.1)");
    ctx.setLineDash([]);
  }

  // Volume chart
  const cx = SLOT.x, cy = 416, cw = 1020, ch = 728;
  box(ctx, cx, cy, cw, ch, 20, c.card, c.line);
  text(ctx, "Settled volume", cx + 36, cy + 62, `500 28px ${S}`, c.muted);
  text(ctx, "€4.82M", cx + 36, cy + 138, `500 66px ${M}`, c.text);
  text(ctx, "Sample data, last 16 weeks", cx + 36, cy + 182, `400 24px ${S}`, c.muted);

  const px = cx + 36, py = cy + 240, pw = cw - 72, ph = ch - 300;
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    const y = py + (ph / 4) * i;
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.lineTo(px + pw, y);
    ctx.stroke();
  }
  const pts = SERIES.map((v, i) => [px + (pw / (SERIES.length - 1)) * i, py + ph - (v / 100) * ph] as const);
  const trace = () => {
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      const mx = (pts[i - 1][0] + pts[i][0]) / 2;
      ctx.bezierCurveTo(mx, pts[i - 1][1], mx, pts[i][1], pts[i][0], pts[i][1]);
    }
  };
  const area = ctx.createLinearGradient(0, py, 0, py + ph);
  area.addColorStop(0, "rgba(62,203,159,0.22)");
  area.addColorStop(1, "rgba(62,203,159,0)");
  ctx.beginPath();
  trace();
  ctx.lineTo(px + pw, py + ph);
  ctx.lineTo(px, py + ph);
  ctx.closePath();
  ctx.fillStyle = area;
  ctx.fill();
  ctx.beginPath();
  trace();
  ctx.strokeStyle = c.accent;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Payments table
  const tx = cx + cw + 24, tw = 2008 - tx;
  box(ctx, tx, cy, tw, ch, 20, c.card, c.line);
  text(ctx, "Recent payments", tx + 32, cy + 62, `500 28px ${S}`, c.muted);
  ROWS.forEach(([pair, rail, amount, status], i) => {
    const y = cy + 124 + i * 100;
    if (i) {
      ctx.fillStyle = c.line;
      ctx.fillRect(tx + 32, y - 44, tw - 64, 2);
    }
    text(ctx, pair, tx + 32, y, `500 26px ${S}`, c.text);
    text(ctx, rail, tx + 32, y + 34, `400 22px ${S}`, c.muted);
    text(ctx, amount, tx + tw - 32, y, `500 25px ${M}`, c.text, "right");
    text(ctx, status, tx + tw - 32, y + 34, `400 22px ${S}`, status === "Settled" ? c.accent : c.muted, "right");
  });

  return canvas;
}
