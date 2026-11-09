import type { IconNode } from "lucide";

export const sans = () => getComputedStyle(document.documentElement).getPropertyValue("--font-geist").trim();
export const mono = () => getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim();

export function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas is unavailable");
  ctx.textBaseline = "alphabetic";
  return { canvas, ctx };
}

export function box(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
  fill?: string, stroke?: string,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function text(
  ctx: CanvasRenderingContext2D,
  value: string, x: number, y: number,
  font: string, color: string,
  align: CanvasTextAlign = "left",
) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(value, x, y);
}

/** Renders a Lucide icon node to a bitmap so it can be stamped into a canvas. */
export async function icon(node: IconNode, color: string, size = 48) {
  const body = node
    .map(([tag, attrs]) => {
      const attr = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(" ");
      return `<${tag} ${attr}/>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const img = new Image();
  img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  await img.decode();
  return img;
}
