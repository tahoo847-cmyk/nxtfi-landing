"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Eye, Landmark, Route, type IconNode } from "lucide";
import type { Mode } from "@/components/hero/choreography";
import { card, keys } from "./choreography";
import { SolutionLayer } from "@/components/section-03/SolutionLayer";
import { addHandoff, HANDOFF } from "@/components/section-03/handoff";

const CardCanvas = dynamic(() => import("./CardCanvas"), { ssr: false });

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const PINNED = { desktop: 6.5, compact: 5.5 };
const HEADLINE = ["One Payment.", "Too Many Moving Parts."];
const DETAILS: { title: string; body: string; node: IconNode }[] = [
  { title: "Fiat settlement", body: "Funds still have to arrive in the right local currency and account.", node: Landmark },
  { title: "Transaction routing", body: "Each payment needs a path across networks that were built separately.", node: Route },
  { title: "Payment visibility", body: "Status sits in several systems, so one payment takes several views to follow.", node: Eye },
];

function Icon({ node }: { node: IconNode }) {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {node.map(([Tag, attrs], i) => (
        <Tag key={i} {...attrs} />
      ))}
    </svg>
  );
}

export function PaymentChallenge() {
  const root = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  // Waits for the hero's load and lid animation, so the card's shader compile cannot interrupt them.
  useEffect(() => {
    const start = () => setMounted(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(start, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(start, 2500);
    return () => clearTimeout(id);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          any: "(min-width: 0px)",
          wide: "(min-width: 1024px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { wide, reduce } = ctx.conditions as { wide: boolean; reduce: boolean };
          const mode: Mode = wide ? "desktop" : "compact";
          const [entry, s1, s2, s3, s4, s5] = keys[mode];

          if (reduce) {
            Object.assign(card, s5, { spread: 1, route: 0, parallax: 0, lift: 0, look: 0, warm: 0 });
            return;
          }

          Object.assign(card, entry, { spread: 0, route: 0, parallax: 1, lift: 0, look: 0, warm: 0 });
          const pinned = wide ? PINNED.desktop : PINNED.compact;
          const handoff = wide ? HANDOFF.desktop : HANDOFF.compact;
          const k = handoff / HANDOFF.desktop;
          const u = pinned / PINNED.desktop;

          gsap.set("[data-line] > span", { yPercent: 112 });
          gsap.set("[data-sub], [data-closing]", { autoAlpha: 0, y: 18 });
          gsap.set("[data-beat]", { autoAlpha: 0, y: 26, yPercent: wide ? -50 : 0 });
          gsap.set("[data-detail]", { autoAlpha: 0, x: -18 });
          gsap.set("[data-sol-bg]", { autoAlpha: 0 });
          gsap.set("[data-sol-line] > span", { yPercent: 112 });
          gsap.set("[data-sol-sub]", { autoAlpha: 0, y: 18 });
          gsap.set("[data-sol-item]", { autoAlpha: 0, x: -18, "--sol-on": 0 });
          gsap.set("[data-sol-tag]", { autoAlpha: 0, x: 24 });
          gsap.set("[data-sol-link]", { autoAlpha: 0 });
          gsap.set("[data-sol-list]", { y: 0 });
          gsap.set("[data-glow='a']", { xPercent: -50, yPercent: -50, x: 0, y: "34svh", opacity: 0, scale: 0.8 });
          gsap.set("[data-glow='b']", { xPercent: -50, yPercent: -50, x: "26vw", y: "-30svh", opacity: 0 });

          // One unit is one viewport of scroll. The first unit is the entry, before the pin takes hold.
          const at = (t: number) => (t <= 1 ? t : 1 + (t - 1) * u);
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "payment-challenge-scrub",
              trigger: root.current,
              start: "top bottom",
              end: () => `+=${innerHeight * (1 + pinned + handoff)}`,
              scrub: 0.9,
              refreshPriority: -1,
            },
          });

          // Stage 01: entry
          tl.to(card, { ...s1, duration: 1, ease: "power2.out" }, 0)
            .to("[data-glow='a']", { opacity: 1, scale: 1, duration: 0.9, ease: "sine.out" }, 0.1)
            .to("[data-glow='b']", { opacity: 1, duration: 0.9, ease: "sine.out" }, 0.3)
            .to("[data-line] > span", { yPercent: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0.4)
            .to("[data-sub]", { autoAlpha: 1, y: 0, duration: 0.3, ease: "sine.out" }, 0.72);

          // Stage 02: digital assets
          tl.to(card, { ...s2, duration: 1.5 * u, ease: "power1.inOut" }, at(1.4))
            .to("[data-intro]", { autoAlpha: 0, y: -30, duration: 0.42 * u, ease: "power1.in" }, at(1.45))
            .to("[data-beat='one']", { autoAlpha: 1, y: 0, duration: 0.45 * u, ease: "power2.out" }, at(2.05))
            .to("[data-glow='a']", { x: "22vw", y: "6svh", duration: 1.5 * u, ease: "sine.inOut" }, at(1.4));

          // Stage 03: conversion and routing
          tl.to(card, { ...s3, duration: 1.6 * u, ease: "power1.inOut" }, at(2.9))
            .to("[data-beat='one']", { autoAlpha: 0, y: -22, duration: 0.3 * u, ease: "power1.in" }, at(2.9))
            .to("[data-beat='two']", { autoAlpha: 1, y: 0, duration: 0.45 * u, ease: "power2.out" }, at(3.55))
            .to("[data-glow='a']", { x: "-24vw", y: "-4svh", duration: 1.6 * u, ease: "sine.inOut" }, at(2.9))
            .to("[data-glow='b']", { x: "-10vw", y: "28svh", duration: 1.6 * u, ease: "sine.inOut" }, at(2.9));

          // Stage 04: settlement
          tl.to(card, { ...s4, duration: 1.4 * u, ease: "power1.inOut" }, at(4.5))
            .to("[data-beat='two']", { autoAlpha: 0, y: -22, duration: 0.3 * u, ease: "power1.in" }, at(4.5))
            .to(card, { route: 1, duration: 0.8 * u, ease: "sine.inOut" }, at(4.95))
            .to("[data-detail]", { autoAlpha: 1, x: 0, duration: 0.34 * u, ease: "power2.out", stagger: 0.16 * u }, at(5.0))
            .to("[data-glow='a']", { x: "16vw", y: "0svh", scale: 1.2, duration: 1.4 * u, ease: "sine.inOut" }, at(4.5));

          // Stage 05: final reveal
          tl.to(card, { ...s5, duration: 1.3 * u, ease: "power2.inOut" }, at(5.9))
            .to("[data-detail]", { autoAlpha: 0, x: -14, duration: 0.26 * u, ease: "power1.in", stagger: 0.04 * u }, at(5.9))
            .to(card, { route: 0, duration: 0.5 * u, ease: "sine.inOut" }, at(5.95))
            .to(card, { spread: 1, duration: 0.8 * u, ease: "power2.inOut" }, at(6.5))
            .to("[data-closing]", { autoAlpha: 1, y: 0, duration: 0.3 * u, ease: "power2.out" }, at(7.0))
            .to("[data-glow='a']", { x: 0, y: "6svh", scale: 1.1, duration: 1.3 * u, ease: "sine.inOut" }, at(5.9))
            .to("[data-glow='b']", { x: "20vw", y: "-30svh", duration: 1.3 * u, ease: "sine.inOut" }, at(5.9))
            .to({}, { duration: 0 }, 1 + pinned);

          addHandoff(tl, wide, 1 + pinned);

          ScrollTrigger.create({
            id: "payment-challenge-pin",
            trigger: root.current,
            start: "top top",
            end: () => `+=${innerHeight * (pinned + handoff)}`,
            pin: true,
            refreshPriority: -1,
          });
          ScrollTrigger.sort();
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <>
    {/* Fades the hero's studio floor into this section's background, so no edge shows between them. */}
    <div aria-hidden className="pointer-events-none relative z-20 h-0">
      <div className="absolute inset-x-0 bottom-0 h-[42svh] bg-linear-to-b from-transparent to-[#0a0e0d]" />
    </div>
    <section
      ref={root}
      aria-labelledby="payment-challenge"
      data-ready={ready}
      className="section-two relative isolate w-full overflow-hidden bg-[#0a0e0d] text-[#eef2f0] motion-safe:h-svh motion-reduce:flex motion-reduce:flex-col motion-reduce:gap-10 motion-reduce:px-6 motion-reduce:py-16 lg:motion-reduce:px-12"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden motion-reduce:hidden">
        <div data-glow="a" className="glow glow-a absolute top-1/2 left-1/2" />
        <div data-glow="b" className="glow glow-b absolute top-1/2 left-1/2" />
      </div>

      <div
        data-intro
        className="z-20 motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-[11svh] motion-safe:px-6 lg:text-center lg:motion-safe:top-[10svh]"
      >
        <h2
          id="payment-challenge"
          aria-label={HEADLINE.join(" ")}
          className="font-display text-[clamp(2.5rem,10.5vw,4rem)] leading-[1.04] font-light tracking-[-0.022em] lg:text-[min(6vw,12svh)]"
        >
          {HEADLINE.map((line) => (
            <span key={line} data-line aria-hidden className="block overflow-clip pb-[0.08em]">
              <span className="inline-block">{line}</span>
            </span>
          ))}
        </h2>
        <p data-sub className="mt-4 max-w-[34rem] text-[0.98rem] leading-relaxed text-white/62 lg:mx-auto lg:mt-5 lg:text-lg">
          Moving between digital assets and traditional payment systems introduces complexity at every step.
        </p>
      </div>

      <div data-beat="one" className="z-20 motion-safe:absolute motion-safe:inset-x-6 motion-safe:top-[57svh] lg:motion-safe:right-auto lg:motion-safe:left-12 lg:motion-safe:top-1/2 lg:motion-safe:w-[23vw]">
        <p className="font-mono text-[0.68rem] tracking-[0.14em] text-[#7fd6b8] uppercase">Digital assets</p>
        <p className="font-display mt-3 text-[1.5rem] leading-[1.16] font-light lg:text-[min(2.5vw,4.6svh)]">
          The payment starts on one system and has to finish on another.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/62 max-lg:[@media(max-height:760px)]:hidden lg:mt-4 lg:text-[0.95rem]">
          Blockchains and bank networks were built apart, with separate formats, hours and rules.
        </p>
      </div>

      <div data-beat="two" className="z-20 motion-safe:absolute motion-safe:inset-x-6 motion-safe:top-[57svh] lg:motion-safe:right-12 lg:motion-safe:left-auto lg:motion-safe:top-1/2 lg:motion-safe:w-[22vw]">
        <p className="font-mono text-[0.68rem] tracking-[0.14em] text-[#7fd6b8] uppercase">Conversion and routing</p>
        <h3 className="font-display mt-3 text-[1.7rem] leading-[1.1] font-light lg:text-[min(3vw,5.6svh)]">
          Different Networks.
          <br />
          Multiple Steps.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/62 max-lg:[@media(max-height:760px)]:hidden lg:mt-4 lg:text-[0.95rem]">
          Value changes form and changes hands before it reaches a local payment network.
        </p>
      </div>

      <ul className="z-20 flex flex-col gap-4 motion-safe:absolute motion-safe:inset-x-6 motion-safe:top-[45svh] lg:gap-7 lg:motion-safe:right-auto lg:motion-safe:left-12 lg:motion-safe:top-1/2 lg:motion-safe:w-[26vw] lg:motion-safe:-translate-y-1/2">
        {DETAILS.map(({ title, body, node }) => (
          <li key={title} data-detail className="flex gap-3 border-t border-white/16 pt-3 lg:pt-4">
            <span className="mt-0.5 text-[#7fd6b8]">
              <Icon node={node} />
            </span>
            <div>
              <h3 className="text-[0.98rem] font-medium lg:text-lg">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/62">{body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div data-stage3d className="z-10 motion-safe:absolute motion-safe:inset-0 motion-reduce:relative motion-reduce:h-[70svh]">
        {mounted && <CardCanvas onReady={onReady} />}
      </div>

      <p
        data-closing
        className="font-display z-20 text-[1.6rem] leading-tight font-light motion-safe:absolute motion-safe:inset-x-6 motion-safe:top-[71svh] lg:text-center lg:text-[min(2.6vw,5svh)] lg:motion-safe:top-[10.5svh]"
      >
        Four stages behind one payment.
      </p>

      <SolutionLayer />
    </section>
    </>
  );
}
