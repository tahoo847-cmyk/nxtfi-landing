"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, type IconNode } from "lucide";
import { TEAL } from "@/components/bigger-picture/BiggerPicture";
import { ARCS } from "./arcs";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** No contact address exists in the project yet. Add one after `mailto:` to fill in the recipient. */
const CONTACT_HREF = "mailto:?subject=NxtFi%20enquiry";

const HEADLINE = ["Finance that", "moves business", "forward."];

function Icon({ node }: { node: IconNode }) {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {node.map(([Tag, attrs], i) => (
        <Tag key={i} {...attrs} />
      ))}
    </svg>
  );
}

export function ClosingScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-cl-mask]", { yPercent: 112 });
        gsap.set("[data-cl-fade]", { autoAlpha: 0, y: 18 });
        gsap.set("[data-cl-globe]", { autoAlpha: 0, yPercent: 9, scale: 0.94 });
        gsap.set("[data-cl-arc]", { strokeDashoffset: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "closing-reveal",
            trigger: root.current,
            start: "top 72%",
            end: "top 8%",
            scrub: 0.9,
            refreshPriority: -3,
          },
        });

        tl.to("[data-cl-globe]", { autoAlpha: 1, yPercent: 0, scale: 1, duration: 1, ease: "sine.out" }, 0)
          .to("[data-cl-mask]", { yPercent: 0, duration: 0.5, ease: "power2.out", stagger: 0.09 }, 0.08)
          .to("[data-cl-fade]", { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.08 }, 0.5)
          .to("[data-cl-arc]", { strokeDashoffset: 0, duration: 0.5, ease: "sine.inOut", stagger: 0.06 }, 0.5);

        // A slow drift as the footer comes into view.
        gsap.to("[data-cl-drift]", {
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.9, refreshPriority: -3 },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="closing"
      className="relative isolate flex min-h-[125svh] w-full flex-col overflow-hidden text-[#eef2f0]"
      style={{
        background: `radial-gradient(70% 55% at 88% 82%, rgb(14 107 82 / 0.28), transparent 72%), linear-gradient(180deg, ${TEAL} 0%, #0d1f2b 34%)`,
      }}
    >
      <div
        data-cl-drift
        aria-hidden
        className="pointer-events-none absolute right-[-62vw] bottom-[6svh] -z-10 w-[min(150vw,88svh)] opacity-70 md:right-[-30vw] md:bottom-[-12svh] lg:right-[-13vw] lg:bottom-[-12svh] lg:w-[max(70vw,112svh)] lg:opacity-100"
      >
        <div data-cl-globe className="relative aspect-square w-full">
          <img src="/assets/closing/earth-night.webp" alt="" width={1400} height={1400} decoding="async" className="block h-full w-full" />
          <svg viewBox="0 0 1000 1000" fill="none" className="absolute inset-0 h-full w-full">
            {ARCS.map((d, i) => (
              <g key={d}>
                <path data-cl-arc d={d} pathLength={1} stroke="#7fd6b8" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="1" vectorEffect="non-scaling-stroke" />
                <circle
                  r="3.2"
                  fill="#c9f5e6"
                  className="arc-dot motion-reduce:hidden"
                  style={{ offsetPath: `path("${d}")`, animationDelay: `${i * -1.9}s` }}
                />
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="px-6 pt-[15svh] lg:px-12 lg:pt-[17svh]">
        <p data-cl-fade className="font-mono text-[0.7rem] tracking-[0.14em] text-white/60 uppercase">
          The Next Chapter
        </p>
        <h2
          id="closing"
          aria-label={HEADLINE.join(" ")}
          className="font-display mt-5 text-[min(clamp(2.75rem,6.8vw,6.4rem),14svh)] leading-[1.04] font-light tracking-[-0.022em] lg:mt-6"
        >
          {HEADLINE.map((line, i) => (
            <span key={line} aria-hidden className="block overflow-clip pb-[0.1em]">
              <span data-cl-mask className={`inline-block ${i === 2 ? "text-[#7fd6b8]" : ""}`}>
                {line}
              </span>
            </span>
          ))}
        </h2>
        <p data-cl-fade className="mt-4 max-w-[28rem] text-[0.98rem] leading-relaxed text-white/62 lg:mt-6 lg:text-lg">
          A financial partner for a more connected, borderless business world.
        </p>
        <div data-cl-fade className="mt-7 lg:mt-9">
          <a
            href={CONTACT_HREF}
            className="cta inline-flex h-12 items-center gap-2 rounded-full bg-[#7fd6b8] px-7 text-sm font-medium text-ink hover:bg-[#eef2f0]"
          >
            Get in Touch
            <Icon node={ArrowUpRight} />
          </a>
        </div>
      </div>

      <footer className="mx-6 mt-auto flex flex-col gap-2 border-t border-white/16 py-6 sm:flex-row sm:items-center sm:justify-between lg:mx-12 lg:py-7">
        <span className="text-xl font-semibold tracking-tight">NxtFi</span>
        <p className="text-xs text-white/60">© 2026 NxtFi. Earth imagery: NASA.</p>
      </footer>
    </section>
  );
}
