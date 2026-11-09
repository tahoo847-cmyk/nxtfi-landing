import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { PINNED } from "@/components/section-02/PaymentChallenge";
import { HANDOFF } from "@/components/section-03/handoff";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export type Target = "home" | "challenge" | "solution" | "contact";

/** Scroll positions for each destination and each change of backdrop. Pinned sections have no in-flow position, so these come from the triggers. */
export function measure() {
  const vh = innerHeight;
  const top = (selector: string) => (document.querySelector(selector)?.getBoundingClientRect().top ?? 0) + scrollY;
  const footer = top("#contact");
  const hero = ScrollTrigger.getById("hero");
  const pin = ScrollTrigger.getById("payment-challenge-pin");

  if (!hero || !pin) {
    const two = top(".section-two");
    const solution = top("#solution");
    const flow = { home: 0, challenge: two, solution, contact: footer };
    return { goTo: flow, challengeFrom: two - vh / 2, solutionFrom: solution - vh / 2, contactFrom: footer - vh / 2, darkFrom: two - vh / 2, darkTo: footer - vh / 2 };
  }

  const wide = innerWidth >= 1024;
  const pinned = wide ? PINNED.desktop : PINNED.compact;
  const k = (wide ? HANDOFF.desktop : HANDOFF.compact) / HANDOFF.desktop;
  const handoff = (n: number) => pin.start + vh * (pinned + n * k);

  return {
    goTo: { home: 0, challenge: pin.start + vh * 0.2, solution: handoff(3.9), contact: footer },
    challengeFrom: pin.start - vh / 2,
    solutionFrom: handoff(2.4),
    contactFrom: footer - vh / 2,
    // The hero's backdrop passes mid-grey here, and Section 03's ivory fade is half done at the end of the range.
    darkFrom: hero.start + (hero.end - hero.start) * 0.62,
    darkTo: handoff(2.2),
  };
}

/** Shared by the navbar and footer links. */
export function scrollToTarget(id: Target) {
  const y = measure().goTo[id];
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, y);
    return;
  }
  const distance = Math.abs(y - scrollY) / innerHeight;
  gsap.to(window, {
    scrollTo: { y, autoKill: true },
    duration: gsap.utils.clamp(1, 2.8, 0.7 + distance * 0.2),
    ease: "power2.inOut",
    overwrite: true,
  });
}
