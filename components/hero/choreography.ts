export type Mode = "desktop" | "compact";

/** Scroll-driven values. GSAP writes them, the render loop reads them, so React never re-renders on scroll. */
export const stage = {
  cx: 0, cy: 2.4, cz: 9.6,
  tx: 0, ty: 0.85, tz: 0,
  ry: -0.62,
  shiftX: 0, shiftY: 0,
  dark: 0,
  panels: 0,
  path: 0,
  lid: 0,
  parallax: 1,
};

type Key = Pick<typeof stage, "cx" | "cy" | "cz" | "tx" | "ty" | "tz" | "ry" | "shiftX" | "shiftY">;

export const keys: Record<Mode, [Key, Key, Key, Key]> = {
  desktop: [
    { cx: 0, cy: 2.45, cz: 9.9, tx: 0, ty: 0.82, tz: -0.1, ry: -0.62, shiftX: 0.17, shiftY: 0.01 },
    { cx: 0, cy: 2.35, cz: 9.2, tx: 0, ty: 0.84, tz: -0.1, ry: -0.55, shiftX: 0.17, shiftY: 0.01 },
    { cx: 0.1, cy: 1.8, cz: 6.3, tx: 0, ty: 1.0, tz: -0.7, ry: -0.13, shiftX: 0, shiftY: 0 },
    { cx: 0, cy: 1.55, cz: 6.55, tx: 0, ty: 1.12, tz: -0.6, ry: 0, shiftX: 0, shiftY: 0 },
  ],
  compact: [
    { cx: 0, cy: 2.5, cz: 16.4, tx: 0, ty: 0.8, tz: -0.1, ry: -0.42, shiftX: 0, shiftY: 0.25 },
    { cx: 0, cy: 2.45, cz: 16, tx: 0, ty: 0.82, tz: -0.1, ry: -0.38, shiftX: 0, shiftY: 0.25 },
    { cx: 0, cy: 2.05, cz: 10.6, tx: 0, ty: 1.0, tz: -0.7, ry: -0.1, shiftX: 0, shiftY: 0.05 },
    { cx: 0, cy: 1.75, cz: 10, tx: 0, ty: 1.1, tz: -0.6, ry: 0, shiftX: 0, shiftY: -0.03 },
  ],
};
