"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { keys, stage, type Mode } from "./choreography";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADLINE = ["Connecting", "Digital Assets", "to Real-World", "Payments."];
const STAGES = ["Digital asset payment", "Fiat conversion", "Payment routing", "Local settlement"];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const master = useRef<gsap.core.Timeline | null>(null);
  const lenis = useRef<Lenis | null>(null);
  const reduced = useRef(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useGSAP(
    () => {
      ScrollTrigger.config({ ignoreMobileResize: true });
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
          const [k0, k1, k2, k3] = keys[mode];
          reduced.current = reduce;
          Object.assign(stage, k0, { dark: 0, panels: 0, path: 0, parallax: reduce ? 0 : 1 });

          const paint = gsap.utils.interpolate("#0f1614", "#eef2f0");
          const soft = gsap.utils.interpolate("rgba(15,22,20,0.66)", "rgba(238,242,240,0.62)");
          const tl = gsap.timeline({
            paused: reduce,
            defaults: { ease: "none" },
            onUpdate: () => {
              // Flips quickly so text never matches the backdrop as it passes through mid-grey.
              const flip = gsap.utils.clamp(0, 1, (stage.dark - 0.3) / 0.16);
              root.current?.style.setProperty("--fg", paint(flip));
              root.current?.style.setProperty("--fg-soft", soft(flip));
            },
          });

          tl.to(stage, { ...k1, duration: 0.3, ease: "sine.inOut" }, 0)
            .to(stage, { ...k2, duration: 0.4, ease: "power1.inOut" }, 0.3)
            .to(stage, { ...k3, duration: 0.3, ease: "power2.out" }, 0.7)
            .to(stage, { dark: 1, duration: 0.28, ease: "sine.inOut" }, 0.5)
            .to(stage, { panels: 1, duration: 0.2, ease: "power1.inOut" }, 0.7)
            .to(stage, { path: 1, duration: 0.13, ease: "sine.inOut" }, 0.86)
            .to("[data-copy]", { autoAlpha: 0, y: -28, duration: 0.14, ease: "power1.in" }, 0.3)
            .to("[data-hint]", { autoAlpha: 0, duration: 0.06 }, 0.04)
            .to("[data-note]", { autoAlpha: 1, duration: 0.08 }, 0.92);

          master.current = tl;

          if (reduce) {
            tl.progress(0.2);
            return;
          }

          const instance = new Lenis({ lerp: 0.085 });
          lenis.current = instance;
          instance.on("scroll", ScrollTrigger.update);
          const tick = (time: number) => instance.raf(time * 1000);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);

          ScrollTrigger.create({
            id: "hero",
            trigger: root.current,
            start: "top top",
            end: () => `+=${innerHeight * (wide ? 4 : 3.2)}`,
            pin: true,
            scrub: 0.9,
            animation: tl,
            anticipatePin: 1,
          });

          return () => {
            gsap.ticker.remove(tick);
            instance.destroy();
            lenis.current = null;
            master.current = null;
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (reduced.current) {
        stage.lid = 1;
        return;
      }
      gsap.to(".word > span", { y: 0, duration: 1.15, ease: "power3.out", stagger: 0.055, delay: 0.1 });
      gsap.to(".fade-in", { opacity: 1, duration: 0.9, ease: "power2.out", stagger: 0.1, delay: 0.75 });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!ready) return;
      ScrollTrigger.refresh();
      if (reduced.current) return;
      gsap.to(stage, { lid: 1, duration: 1.9, ease: "power3.inOut", delay: 0.15 });
    },
    { dependencies: [ready], scope: root },
  );

  const explore = () => {
    const tl = master.current;
    if (reduced.current && tl) {
      tl.progress(tl.progress() > 0.5 ? 0.2 : 1);
      return;
    }
    const trigger = ScrollTrigger.getById("hero");
    if (trigger) lenis.current?.scrollTo(trigger.end, { duration: 3.2, easing: (t) => 1 - (1 - t) ** 3 });
  };

  return (
    <section ref={root} aria-label="NxtFi" data-ready={ready} className="hero relative h-svh w-full overflow-hidden bg-stone">
      <HeroCanvas onReady={onReady} />
      <div aria-hidden className="vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="loader absolute right-6 top-1/2 z-10 h-px w-[28vw] lg:right-[16vw]" />

      <div
        data-copy
        className="absolute inset-x-0 top-[13svh] z-10 px-6 lg:top-1/2 lg:w-[54vw] lg:-translate-y-1/2 lg:px-12"
      >
        <h1
          aria-label={HEADLINE.join(" ")}
          className="font-display text-[clamp(2.6rem,10.5vw,4.2rem)] leading-[1.03] font-light tracking-[-0.022em] lg:text-[min(5.5vw,11.5svh)]"
        >
          {HEADLINE.map((line) => (
            <span key={line} aria-hidden className="block">
              {line.split(" ").map((word, i) => (
                <span key={i} className="word mr-[0.24em]">
                  <span>{word}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="fade-in mt-5 max-w-[28rem] text-[0.98rem] leading-relaxed text-(--fg-soft) lg:mt-7 lg:text-lg">
          Building the infrastructure that connects digital asset transactions with local payment networks.
        </p>
        <button
          type="button"
          onClick={explore}
          className="cta fade-in mt-6 inline-flex h-12 cursor-pointer items-center rounded-full bg-ink px-7 text-sm font-medium text-stone hover:bg-accent lg:mt-9"
        >
          Explore NxtFi
        </button>
      </div>

      <div data-hint aria-hidden className="absolute bottom-7 left-6 z-10 lg:left-12">
        <p className="fade-in font-mono text-[0.7rem] tracking-[0.14em] text-(--fg-soft) uppercase">Scroll</p>
      </div>

      <p
        data-note
        className="invisible absolute inset-x-6 top-[4.75rem] z-10 text-xs text-(--fg-soft) opacity-0 lg:top-[5.75rem] lg:left-auto lg:right-12 lg:text-right"
      >
        Illustrative interface with sample data. Not a live product or a verified transaction.
      </p>

      <ol className="sr-only" aria-label="Illustrative payment flow">
        {STAGES.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>

      <p className="credit absolute right-6 bottom-6 z-10 max-w-[46vw] text-right text-[0.65rem] leading-snug text-(--fg-soft) lg:right-12">
        3D model:{" "}
        <a href="https://sketchfab.com/3d-models/laptop-7d870e900889481395b4a575b9fa8c3e" target="_blank" rel="noreferrer">
          Laptop
        </a>{" "}
        by{" "}
        <a href="https://sketchfab.com/Aullwen" target="_blank" rel="noreferrer">
          Aullwen
        </a>
        ,{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
          CC BY 4.0
        </a>
        , materials modified.
      </p>
    </section>
  );
}
