"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Viewports of scroll the section stays pinned for. */
const PINNED = 1.7;

/** Dark teal the section ends on, shared with the CTA so no edge shows between them. */
export const TEAL = "#0c3a3c";

export function BiggerPicture() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-bp-mask]", { yPercent: 112 });
        gsap.set("[data-bp-sub], [data-bp-label]", { autoAlpha: 0 });
        gsap.set("[data-bp-ivory]", { autoAlpha: 1 });
        gsap.set("[data-bp-teal]", { autoAlpha: 0 });
        gsap.set("[data-bp-main]", { transformOrigin: "0% 60%" });

        // One timeline from the section entering. Unit one is the entry, the rest is the pin.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "bigger-picture-scrub",
            trigger: root.current,
            start: "top bottom",
            end: () => `+=${innerHeight * (1 + PINNED)}`,
            scrub: 0.9,
            refreshPriority: -2,
          },
        });

        // Opens in Section 03's ivory, so no colour edge shows, and settles into navy before the pin.
        tl.to("[data-bp-ivory]", { autoAlpha: 0, duration: 0.3, ease: "sine.inOut" }, 0.7)
          .to("[data-bp-label]", { autoAlpha: 1, duration: 0.15 }, 0.9);

        // Phase 01: the first two lines rise from their masks.
        tl.to('[data-bp-line="1"] [data-bp-mask]', { yPercent: 0, duration: 0.36, ease: "power2.out" }, 1)
          .to('[data-bp-line="2"] [data-bp-mask]', { yPercent: 0, duration: 0.36, ease: "power2.out" }, 1.1);

        // Phase 02: the lines drift at different speeds while navy moves to dark teal.
        tl.to('[data-bp-line="1"]', { yPercent: -34, duration: 1.05 }, 1.3)
          .to('[data-bp-line="2"]', { yPercent: -17, duration: 1.05 }, 1.3)
          .to("[data-bp-teal]", { autoAlpha: 1, duration: 1.2, ease: "sine.inOut" }, 1.2);

        // Phase 03: the main moment.
        tl.to('[data-bp-line="3"] [data-bp-mask]', { yPercent: 0, duration: 0.5, ease: "power3.out" }, 1.65)
          .to("[data-bp-main]", { scale: 1.07, duration: 0.85, ease: "sine.out" }, 1.65)
          .to("[data-bp-sub]", { autoAlpha: 1, duration: 0.2 }, 2.05);

        // Phase 04: type lifts, then the pin releases and the page carries it the rest of the way.
        tl.to("[data-bp-type]", { y: () => -innerHeight * 0.14, duration: 0.35, ease: "power1.in" }, 1 + PINNED - 0.35);

        ScrollTrigger.create({
          id: "bigger-picture-pin",
          trigger: root.current,
          start: "top top",
          end: () => `+=${innerHeight * PINNED}`,
          pin: true,
          refreshPriority: -2,
        });
        ScrollTrigger.sort();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const line = "block overflow-clip pb-[0.12em]";
  const size = "text-[min(clamp(2.5rem,7vw,6.5rem),13svh)]";

  return (
    <>
      {/* Fades Section 03's backdrop into this section's opening colour. */}
      <div aria-hidden className="pointer-events-none relative z-20 h-0 motion-reduce:hidden">
        <div className="absolute inset-x-0 bottom-0 h-[34svh] bg-linear-to-b from-transparent to-[#f1e5d6]" />
      </div>
      <section
        ref={root}
        aria-labelledby="bigger-picture"
        className="relative isolate flex min-h-svh w-full flex-col justify-center overflow-hidden bg-[#0d1f2b] px-6 py-24 text-[#eef2f0] motion-safe:h-svh lg:px-12"
      >
        <div data-bp-teal aria-hidden className="absolute inset-0 -z-10 opacity-100 motion-reduce:hidden" style={{ background: TEAL }} />
        <div data-bp-ivory aria-hidden className="absolute inset-0 -z-10 hidden bg-[#f1e5d6] motion-safe:block" />

        <p data-bp-label className="absolute top-6 left-6 font-mono text-[0.7rem] tracking-[0.14em] text-white/60 uppercase lg:top-9 lg:left-12">
          04 / The Bigger Picture
        </p>

        <div data-bp-type>
          <h2 id="bigger-picture" className="font-display leading-[1.04] font-light tracking-[-0.022em]">
            <span data-bp-line="1" className={`${line} ${size}`}>
              <span data-bp-mask className="inline-block">The next chapter</span>
            </span>
            <span data-bp-line="2" className={`${line} ${size}`}>
              <span data-bp-mask className="inline-block">of finance is</span>
            </span>
            <span data-bp-main className="block">
              <span data-bp-line="3" className={`${line} text-[min(clamp(2.5rem,10.4vw,10rem),18svh)] text-[#7fd6b8]`}>
                <span data-bp-mask className="inline-block">already in motion.</span>
              </span>
            </span>
          </h2>
          <p data-bp-sub className="mt-5 text-[0.98rem] text-white/62 lg:mt-7 lg:text-lg">
            Built for what&rsquo;s next.
          </p>
        </div>
      </section>
    </>
  );
}
