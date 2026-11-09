/** Scroll-driven values for the payment terminal. GSAP writes them, the render loop reads them. */
export const term = {
  d: 1.9,
  ry: -0.75,
  px: 0.1,
  py: 0,
  cx: -0.05,
  cy: 0.1,
  lx: 0,
  ly: 0.018,
  z: 0,
  screen: 0,
};

/** One long table: the camera travels between these, so each object stays put in a shared world. */
export const STATIONS = [
  { x: 0, z: 0 },
  { x: 1.1, z: -0.3 },
  { x: 2.2, z: 0.05 },
  { x: 3.3, z: -0.2 },
];

export const journey = {
  value: 0,
  t: 0,
  risk: 0,
  check: 0,
  dest: 0,
  rows: 0,
  recon: 0,
  stamp: 0,
  conRy: -0.72,
  routeRy: 0.5,
  docRy: -0.5,
};

export const termStart = { d: 1.9, ry: -0.75, cx: -0.05, screen: 0 };
