import type { Mode } from "@/components/hero/choreography";

const TURN = Math.PI * 2;

/** Scroll-driven values for the card. GSAP writes them, the render loop reads them. */
export const card = {
  cx: 0, cy: 0, cz: 9,
  px: 0, py: 0, pz: 0,
  rx: 0, ry: 0, rz: 0,
  spread: 0,
  route: 0,
  parallax: 1,
  // Section 03 handoff. `lift` opens the stack along its own thickness, `look` swaps the faces while they point away,
  // `warm` lights and grounds the scene once the ivory background is in.
  lift: 0,
  look: 0,
  warm: 0,
};

type Key = Pick<typeof card, "cx" | "cy" | "cz" | "px" | "py" | "pz" | "rx" | "ry" | "rz">;

/** Entry, then the five stages. The card makes one full turn: front, back for the route detail, front again. */
export const keys: Record<Mode, Key[]> = {
  desktop: [
    { cx: 0, cy: 0, cz: 9.4, px: 0.3, py: -1.9, pz: -1, rx: -1.15, ry: 0.5, rz: 0.34 },
    { cx: 0, cy: 0, cz: 9, px: 0, py: -0.98, pz: 0, rx: -0.92, ry: 0.14, rz: 0.14 },
    { cx: 0, cy: 0.1, cz: 7.8, px: 0.86, py: 0, pz: 0, rx: -0.16, ry: -0.5, rz: -0.08 },
    { cx: -0.12, cy: -0.05, cz: 7.8, px: -0.72, py: 0, pz: 0, rx: 0.12, ry: -Math.PI - 0.4, rz: 0.08 },
    { cx: 0.3, cy: 0, cz: 6, px: 0.78, py: 0, pz: 0, rx: 0.05, ry: -Math.PI - 0.1, rz: 0.02 },
    { cx: 0, cy: 0, cz: 10, px: 0, py: -0.02, pz: 0, rx: -0.03, ry: -TURN, rz: 0 },
  ],
  compact: [
    { cx: 0, cy: 0, cz: 16.6, px: 0.3, py: -4, pz: -1, rx: -1.15, ry: 0.4, rz: 0.3 },
    { cx: 0, cy: 0, cz: 16, px: 0, py: -1.92, pz: 0, rx: -0.92, ry: 0.12, rz: 0.12 },
    { cx: 0, cy: 0.05, cz: 16, px: 0, py: 1, pz: 0, rx: -0.12, ry: -0.42, rz: -0.06 },
    { cx: 0.1, cy: 0, cz: 16, px: 0, py: 1, pz: 0, rx: 0.1, ry: -Math.PI - 0.36, rz: 0.06 },
    { cx: 0, cy: 0, cz: 14.6, px: 0, py: 1.72, pz: 0, rx: 0.04, ry: -Math.PI - 0.08, rz: 0.01 },
    { cx: 0, cy: 0, cz: 16, px: 0, py: 0.42, pz: 0, rx: -0.03, ry: -TURN, rz: 0 },
  ],
};
