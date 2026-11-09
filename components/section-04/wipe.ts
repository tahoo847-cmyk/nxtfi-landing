import gsap from "gsap";
import { term, termStart } from "./choreography";

/** Where the wipe sits inside the handoff, in viewports of scroll before `k` scaling. */
const WIPE = 7.1;

/**
 * Appends the one Section 03 to 04 wipe to the shared timeline. The Section 04 layer opens from the right edge with a
 * single clip-path while Section 03 drifts left behind it, each group at its own depth. The terminal arrives with it.
 */
export function addWipe(tl: gsap.core.Timeline, wide: boolean, start: number, k: number) {
  const x = (n: number) => start + n * k;
  const d = (n: number) => n * k;
  const at = x(WIPE);
  const run = d(1.7);
  const ease = "power3.inOut";

  // 01 The four layers stay on screen through x(7.1). Then one wipe, driven by one clip edge.
  tl.to("[data-s4]", { clipPath: "inset(0% 0% 0% 0%)", duration: run, ease }, at);

  // Section 03 slides away behind the edge: background least, then the scene with its labels, copy fastest.
  tl.to("[data-sol-bg]", { x: "-5vw", duration: run, ease }, at)
    .to("[data-stage3d]", { x: wide ? "-13vw" : "-18vw", duration: run, ease }, at)
    .to("[data-sol-label], [data-sol-head], [data-sol-list]", { x: "-26vw", duration: run, ease }, at)
    .to("[data-sol-tags]", { x: wide ? "-13vw" : "-18vw", duration: run, ease }, at);

  // Section 04 settles into place from the opposite side, so the two layers pass each other.
  tl.to("[data-s4-bg]", { xPercent: 0, duration: run, ease }, at)
    .to("[data-s4-stage]", { x: 0, duration: run, ease }, at)
    .to("[data-s4-label], [data-s4-head], [data-s4-note]", { x: 0, duration: run, ease }, at);

  // The terminal: three-quarter view at distance, then a little closer and straighter as the wipe lands.
  tl.to(term, { d: wide ? 1 : 1.6, ry: -0.46, cx: 0.04, duration: run, ease: "power2.inOut" }, at)
    .to(term, { screen: 1, duration: d(0.9), ease: "sine.inOut" }, at + d(0.8));

  // Copy arrives once the edge has crossed most of the frame.
  tl.to("[data-s4-label]", { autoAlpha: 1, y: 0, duration: d(0.35), ease: "power2.out" }, at + d(1.1))
    .to("[data-s4-line] > span", { yPercent: 0, duration: d(0.5), ease: "power2.out", stagger: d(0.08) }, at + d(1.2))
    .to("[data-s4-sub]", { autoAlpha: 1, y: 0, duration: d(0.4), ease: "sine.out" }, at + d(1.5))
    .to("[data-s4-note]", { autoAlpha: 1, y: 0, duration: d(0.45), ease: "power2.out" }, at + d(1.7))
    .to("[data-s4-link]", { autoAlpha: 1, duration: d(0.3), ease: "none" }, at + d(1.85))
    .to("[data-s4-foot]", { autoAlpha: 1, duration: d(0.4), ease: "none" }, at + d(1.6));
}

/** Resting values before the wipe. Called whenever the timeline is rebuilt. */
export function resetWipe(wide: boolean) {
  Object.assign(term, termStart, { lx: 0, ly: 0.018, z: 0, px: wide ? 0.075 : 0, py: 0, cy: wide ? 0.2 : 0.16 });
  gsap.set("[data-s4]", { clipPath: "inset(0% 0% 0% 100%)" });
  gsap.set("[data-s4-bg]", { xPercent: 12 });
  gsap.set("[data-s4-stage]", { x: "14vw" });
  gsap.set("[data-s4-label], [data-s4-head], [data-s4-note]", { x: "30vw" });
  gsap.set("[data-s4-label]", { autoAlpha: 0, y: 14 });
  gsap.set("[data-s4-line] > span", { yPercent: 112 });
  gsap.set("[data-s4-sub]", { autoAlpha: 0, y: 18 });
  gsap.set("[data-s4-note]", { autoAlpha: 0, y: 18 });
  gsap.set("[data-s4-foot], [data-s4-link]", { autoAlpha: 0 });
}
