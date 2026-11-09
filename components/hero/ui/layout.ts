/** Display and pipeline geometry shared by the 2D screen drawing and the 3D panels. */
export const SCREEN = { w: 2048, h: 1184, worldW: 2.94, worldH: 1.7 };
export const PX = SCREEN.worldW / SCREEN.w;

export const SLOT = { w: 396, h: 250, gap: 28, x: 340, y: 140 };

export const slotCentre = (i: number) => {
  const px = SLOT.x + SLOT.w / 2 + i * (SLOT.w + SLOT.gap);
  const py = SLOT.y + SLOT.h / 2;
  return [(px - SCREEN.w / 2) * PX, (SCREEN.h / 2 - py) * PX] as const;
};

export const PANEL_W = SLOT.w * PX;
export const PANEL_H = SLOT.h * PX;

export const colors = {
  bg: "#0b100f",
  rail: "#0e1412",
  card: "#131b19",
  line: "rgba(255,255,255,0.08)",
  text: "#eef2f0",
  muted: "#8d9c97",
  accent: "#3ecb9f",
  accentDim: "rgba(62,203,159,0.14)",
};
