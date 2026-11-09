import gsap from "gsap";
import { journey, STATIONS, term } from "./choreography";

/** Where Section 04's four-scene journey starts inside the handoff, and its length, in viewports before `k` scaling. */
export const JOURNEY_AT = 9.4;
export const JOURNEY = 11.2;

type Pose = { off: number; ly: number; lift: number; cy: number; d: number };

/** Camera at each station. `off` keeps the object right of the copy on desktop; on phones it stays centred. */
const POSES: Record<"wide" | "compact", Pose[]> = {
  wide: [
    { off: 0, ly: 0.018, lift: 0.04, cy: 0.2, d: 0.96 },
    { off: -0.11, ly: -0.035, lift: 0.03, cy: 0.26, d: 1 },
    { off: -0.15, ly: -0.1, lift: -0.08, cy: 0.62, d: 1.16 },
    { off: -0.1, ly: -0.02, lift: 0.02, cy: 0.36, d: 1.04 },
  ],
  compact: [
    { off: 0, ly: 0.018, lift: 0.04, cy: 0.16, d: 1.55 },
    { off: 0, ly: -0.04, lift: 0.02, cy: 0.46, d: 1.95 },
    { off: 0, ly: -0.09, lift: 0, cy: 1.5, d: 3.05 },
    { off: 0, ly: 0.0, lift: 0, cy: 0.5, d: 1.75 },
  ],
};

export function addJourney(tl: gsap.core.Timeline, wide: boolean, start: number, k: number) {
  const x = (n: number) => start + (JOURNEY_AT + n) * k;
  const d = (n: number) => n * k;
  const poses = POSES[wide ? "wide" : "compact"];
  const spot = (i: number) => {
    const p = poses[i];
    return { lx: STATIONS[i].x + p.off, ly: p.ly, cx: STATIONS[i].x + p.off + p.lift, cy: p.cy, z: STATIONS[i].z };
  };

  /** Continuous dolly to the next station: truck across, easing back a little at the midpoint. */
  const fly = (i: number, at: number) => {
    tl.to(term, { ...spot(i), duration: d(1.4), ease: "power2.inOut" }, x(at))
      .to(term, { d: poses[i].d * 1.28, duration: d(0.7), ease: "sine.out" }, x(at))
      .to(term, { d: poses[i].d, duration: d(0.7), ease: "sine.inOut" }, x(at + 0.7));
  };
  const copy = (i: number, at: number) => {
    tl.to(`[data-s4-step="${i}"]`, { autoAlpha: 1, y: 0, duration: d(0.5), ease: "power2.out" }, x(at));
  };
  const leave = (targets: string, at: number) => {
    tl.to(targets, { autoAlpha: 0, y: -22, duration: d(0.4), ease: "power1.in" }, x(at));
  };
  const tag = (id: string, at: number) => {
    tl.to(`[data-s4-tag="${id}"]`, { autoAlpha: 1, duration: d(0.3), ease: "none" }, x(at));
  };
  const untag = (ids: string[], at: number) => {
    tl.to(ids.map((id) => `[data-s4-tag="${id}"]`).join(), { autoAlpha: 0, duration: d(0.25), ease: "none" }, x(at));
  };

  // Scene 01: a slow push-in on the terminal.
  tl.to(term, { d: poses[0].d, duration: d(0.9), ease: "none" }, x(0));

  // The background drifts slower than the camera across all four scenes.
  tl.to("[data-s4-glow]", { x: "-34vw", duration: d(JOURNEY), ease: "none" }, x(0));

  // Scene 02: conversion.
  leave("[data-s4-head], [data-s4-note]", 0.9);
  tl.to("[data-s4-link]", { autoAlpha: 0, duration: d(0.2), ease: "none" }, x(0.9));
  fly(1, 0.9);
  tl.to(journey, { conRy: -0.3, duration: d(1.4), ease: "power2.inOut" }, x(0.9));
  copy(2, 1.8);
  tag("source", 2.3);
  tl.to(journey, { value: 1, duration: d(0.8), ease: "sine.inOut" }, x(2.5));
  tag("rate", 2.8);
  tag("fiat", 3.1);

  // Scene 03: routing. One transaction runs the selected path; each checkpoint lights as it passes.
  untag(["source", "rate", "fiat"], 3.9);
  leave('[data-s4-step="2"]', 3.9);
  fly(2, 3.9);
  tl.to(journey, { conRy: -0.05, duration: d(1.4), ease: "power2.inOut" }, x(3.9))
    .to(journey, { routeRy: 0.14, duration: d(1.4), ease: "power2.inOut" }, x(3.9));
  copy(3, 4.8);
  tl.to(journey, { t: 1, duration: d(2.4), ease: "none" }, x(5.2))
    .to(term, { lx: spot(2).lx + 0.07, cx: spot(2).cx + 0.14, duration: d(2.4), ease: "sine.inOut" }, x(5.2))
    .to(journey, { risk: 1, duration: d(0.2), ease: "none" }, x(5.6))
    .to(journey, { risk: 0.25, duration: d(0.4), ease: "none" }, x(6.1))
    .to(journey, { check: 1, duration: d(0.2), ease: "none" }, x(6.3))
    .to(journey, { check: 0.25, duration: d(0.4), ease: "none" }, x(6.8))
    .to(journey, { dest: 1, duration: d(0.3), ease: "none" }, x(7.3));
  tag("risk", 5.6);
  tag("check", 6.3);
  tag("dest", 7.2);

  // Scene 04: settlement. The record fills in on the page, then reconciliation closes it.
  untag(["risk", "check", "dest"], 7.9);
  leave('[data-s4-step="3"]', 7.9);
  fly(3, 7.9);
  tl.to("[data-s4-warm]", { autoAlpha: 1, duration: d(1.4), ease: "sine.inOut" }, x(7.9))
    .to(journey, { routeRy: 0.3, duration: d(1.4), ease: "power2.inOut" }, x(7.9))
    .to(journey, { docRy: -0.2, duration: d(1.4), ease: "power2.inOut" }, x(7.9));
  copy(4, 8.8);
  tl.to(journey, { rows: 1, duration: d(0.8), ease: "sine.inOut" }, x(9.2));
  tag("record", 9.5);
  tl.to(journey, { recon: 1, duration: d(0.6), ease: "sine.inOut" }, x(10))
    .to(journey, { stamp: 1, duration: d(0.3), ease: "none" }, x(10.5));
  tag("status", 10.6);
  tl.to({}, { duration: 0 }, x(JOURNEY));
}

/** Resting values before the journey. Called whenever the timeline is rebuilt. */
export function resetJourney() {
  Object.assign(journey, { value: 0, t: 0, risk: 0, check: 0, dest: 0, rows: 0, recon: 0, stamp: 0, conRy: -0.72, routeRy: 0.5, docRy: -0.5 });
  gsap.set("[data-s4-step]", { autoAlpha: 0, y: 22 });
  gsap.set("[data-s4-tag]", { autoAlpha: 0 });
  gsap.set("[data-s4-warm]", { autoAlpha: 0 });
  gsap.set("[data-s4-glow]", { x: 0 });
}
