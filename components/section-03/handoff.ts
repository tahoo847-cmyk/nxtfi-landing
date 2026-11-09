import gsap from "gsap";
import { card } from "@/components/section-02/choreography";

const TURN = Math.PI * 2;

/** Scroll length of the handoff and Section 03, in viewports. */
export const HANDOFF = { desktop: 7.3, compact: 7.3 * (16.44 / 20.6) };

/** Where the stack comes to rest. `rx` ends one full forward turn from its upright start, less the tilt that leaves it face-up. */
const landed = {
  desktop: { lift: 1, cx: 0, cy: 0, cz: 13.2, px: 0.95, py: -1.6, pz: 0, rx: TURN - 1.0, ry: -TURN, rz: 0.2 },
  compact: { lift: 0.7, cx: 0, cy: 0, cz: 18, px: 0, py: -0.95, pz: 0, rx: TURN - 1.0, ry: -TURN, rz: 0.08 },
};

/**
 * Appends the Section 02 to 03 handoff to Section 02's own scrubbed timeline, so one scroll position drives everything:
 * close, fall with one forward flip, land flat, open the layers, then step through them.
 */
export function addHandoff(tl: gsap.core.Timeline, wide: boolean, start: number) {
  const k = wide ? 1 : HANDOFF.compact / HANDOFF.desktop;
  const x = (n: number) => start + n * k;
  const d = (n: number) => n * k;
  const end = landed[wide ? "desktop" : "compact"];
  const steps = [3.5, 4.3, 5.1, 5.9];

  // Section 02 chrome leaves while the fanned layers rest for a beat.
  tl.to("[data-closing]", { autoAlpha: 0, y: -14, duration: d(0.4), ease: "power1.in" }, x(0.5))
    .to("[data-glow]", { opacity: 0, duration: d(1.4), ease: "sine.inOut" }, x(1.3));

  // 01 Close: the four layers return to one aligned stack.
  tl.to(card, { spread: 0, duration: d(0.7), ease: "power2.inOut" }, x(0.5));

  // 02 + 03 One forward flip while falling. `rx` only ever increases, so the turn happens once and ends flat.
  const fall = x(1.25);
  tl.to(card, { parallax: 0, duration: d(1), ease: "sine.inOut" }, fall)
    .to(card, { rx: end.rx, duration: d(1.85), ease: "power1.inOut" }, fall)
    .to(card, { look: 1, duration: d(1.85), ease: "power1.inOut" }, fall)
    .to(card, { py: end.py, duration: d(1.85), ease: "power2.inOut" }, fall)
    .to(card, { px: end.px, rz: end.rz, duration: d(1.85), ease: "power1.inOut" }, fall)
    .to(card, { cx: end.cx, cy: end.cy, cz: end.cz, duration: d(1.85), ease: "power1.inOut" }, fall);

  // Background warms from dark emerald to ivory and peach during the same fall.
  tl.to("[data-sol-bg]", { autoAlpha: 1, duration: d(1.3), ease: "sine.inOut" }, x(1.6))
    .to(card, { warm: 1, duration: d(1.1), ease: "sine.inOut" }, x(2.1));

  // Headline and supporting text arrive as the stack settles.
  tl.to("[data-sol-line] > span", { yPercent: 0, duration: d(0.5), ease: "power2.out", stagger: d(0.08) }, x(2.65))
    .to("[data-sol-sub]", { autoAlpha: 1, y: 0, duration: d(0.4), ease: "sine.out" }, x(3.0));

  // 04 Reopen, only after the landing has finished at x(3.1).
  tl.to(card, { lift: end.lift, duration: d(1.0), ease: "power2.inOut" }, x(3.2));

  // The structure and its labels hold still from here. One left-side point is active at a time, on this same timeline.
  const tags = gsap.utils.toArray<HTMLElement>("[data-sol-tag]");
  const links = gsap.utils.toArray<SVGGElement>("[data-sol-link]");
  const items = gsap.utils.toArray<HTMLElement>("[data-sol-item]");
  tl.to("[data-sol-list]", { y: wide ? -18 : 0, duration: d(3.0), ease: "none" }, x(3.2));

  tags.forEach((tag, i) => {
    tl.to(tag, { autoAlpha: 1, x: 0, duration: d(0.4), ease: "power2.out" }, x(3.6 + i * 0.12));
    tl.to(links[i], { autoAlpha: 1, duration: d(0.4), ease: "none" }, x(3.6 + i * 0.12));
  });

  items.forEach((item, i) => {
    const at = x(steps[i]);
    tl.to(item, { autoAlpha: 1, x: 0, duration: d(0.4), ease: "power2.out" }, at)
      .to(item, { "--sol-on": 1, duration: d(0.3), ease: "none" }, at);
    if (i > 0) {
      tl.to(items[i - 1], { autoAlpha: wide ? 0.72 : 0, "--sol-on": 0, duration: d(0.3), ease: "none" }, at - d(0.1));
    }
  });

  tl.to({}, { duration: 0 }, x(HANDOFF.desktop));
  return k;
}
