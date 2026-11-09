"use client";

import { useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Globe, Mail, type IconNode } from "lucide";
import { scrollToTarget, type Target } from "@/components/nav/scroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EMAIL = "hello@nxtfi.com";
const SITE = "nxtfi.com";

const LINKS: { id: Target; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "#top" },
  { id: "challenge", label: "The Challenge", href: "#payment-challenge" },
  { id: "solution", label: "Our Solution", href: "#solution" },
];

function Icon({ node, size = 18 }: { node: IconNode; size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {node.map(([Tag, attrs], i) => (
        <Tag key={i} {...attrs} />
      ))}
    </svg>
  );
}

export function SiteFooter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-ft-mask]", { yPercent: 112 });
        gsap.set("[data-ft-fade]", { autoAlpha: 0, y: 14 });
        gsap.set("[data-ft-mark]", { autoAlpha: 0, y: 34 });
        gsap.set("[data-ft-wave]", { autoAlpha: 0 });

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 62%", once: true, refreshPriority: -2 } })
          .to("[data-ft-mask]", { yPercent: 0, duration: 1.1, ease: "power3.out", stagger: 0.09 })
          .to("[data-ft-fade]", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.08 }, 0.45)
          .to("[data-ft-wave]", { autoAlpha: 1, duration: 1.4, ease: "sine.out" }, 0.5)
          .to("[data-ft-mark]", { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0.55);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const go = (e: MouseEvent, id: Target) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  return (
    <>
      {/* Fades Section 03's backdrop into the footer's cream, so no edge shows between them. */}
      <div aria-hidden className="pointer-events-none relative z-20 h-0 motion-reduce:hidden">
        <div className="absolute inset-x-0 bottom-0 h-[34svh] bg-linear-to-b from-transparent to-[#f1e5d6]" />
      </div>
      <footer
        id="contact"
        ref={root}
        className="relative isolate flex min-h-svh w-full flex-col overflow-clip px-6 pt-16 text-[#241d17] lg:px-[clamp(3rem,6vw,6.5rem)] lg:pt-[9svh]"
        style={{
          background:
            "radial-gradient(70% 55% at 100% 100%, rgb(240 208 176 / 0.6), transparent 72%), radial-gradient(60% 50% at 96% 8%, rgb(232 226 220 / 0.7), transparent 70%), linear-gradient(180deg, #f1e5d6 0%, #fbeee3 16%, #fbeee3 100%)",
        }}
      >
        <div className="relative z-20 flex flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-12">
          <div>
            <p className="flex items-center gap-4 font-mono text-[0.7rem] tracking-[0.14em] text-[#241d17]/76 uppercase">
              <span aria-hidden className="h-px w-9 bg-[#0e6b52]" />
              Have something in mind?
            </p>
            <h2
              aria-label={"Let’s build what’s next in global payments."}
              className="font-display mt-5 text-[clamp(2rem,8.4vw,4rem)] leading-[1.04] font-light tracking-[-0.022em] lg:mt-6 lg:text-[min(5.6vw,12.5svh,6.2rem)]"
            >
              <span aria-hidden className="block overflow-clip pb-[0.12em]">
                <span data-ft-mask className="inline-block">Let&rsquo;s build what&rsquo;s next</span>
              </span>
              <span aria-hidden className="block overflow-clip pb-[0.12em]">
                <span data-ft-mask className="inline-block">
                  in <em className="text-[#b48a62]">global payments.</em>
                </span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col items-start justify-center gap-6 lg:mt-10 lg:max-w-[27vw] lg:border-l lg:border-[#241d17]/16 lg:pl-[3.4vw]">
            <p data-ft-fade className="font-display text-[1.2rem] leading-snug text-[#241d17]/76 lg:text-[min(1.65vw,3.4svh)]">
              A financial partner for a more connected, borderless business world.
            </p>
            <a
              data-ft-fade
              href={`mailto:${EMAIL}`}
              className="cta inline-flex h-13 items-center gap-3 rounded-full bg-[#0e6b52] px-8 text-[0.95rem] font-medium text-[#f1e5d6] hover:bg-[#241d17]"
            >
              Get in Touch
              <Icon node={ArrowUpRight} />
            </a>
          </div>
        </div>

        <div className="relative z-20 mt-10 flex flex-col gap-7 border-t border-[#241d17]/20 pt-7 lg:mt-[5svh] lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-[#0f3d2e]">NxtFi</p>
            <p className="mt-1 text-sm leading-snug text-[#241d17]/76">
              Digital payments
              <br />
              without boundaries.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-2 text-sm lg:gap-x-12">
            {LINKS.map(({ id, label, href }) => (
              <a key={id} href={href} onClick={(e) => go(e, id)} className="cta hover:text-[#0e6b52]">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm lg:justify-end lg:gap-x-8">
            <a href={`mailto:${EMAIL}`} className="cta inline-flex items-center gap-2.5 hover:text-[#0e6b52]">
              <Icon node={Mail} />
              {EMAIL}
            </a>
            <span aria-hidden className="hidden h-8 w-px bg-[#241d17]/20 sm:block" />
            <a href={`https://${SITE}`} target="_blank" rel="noreferrer" className="cta inline-flex items-center gap-2.5 hover:text-[#0e6b52]">
              <Icon node={Globe} />
              {SITE}
            </a>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none relative mt-auto pt-8 lg:pt-[3svh]">
          <div className="@container mx-auto w-full lg:w-[70%]">
            <p
              data-ft-mark
              className="font-display text-center text-[calc(100cqw/2.28)] leading-[0.92] font-normal tracking-[-0.03em] whitespace-nowrap [font-variant-ligatures:none]"
            >
              <span
                className="-mt-[0.12em] inline-block bg-clip-text px-[0.03em] pt-[0.12em] text-transparent"
                style={{ backgroundImage: "linear-gradient(180deg, #123f2f 12%, #2f6a50 46%, rgb(120 150 125 / 0.5) 74%, rgb(214 206 182 / 0.06) 96%)" }}
              >
                NxtFi
              </span>
            </p>
          </div>
        </div>

        <svg
          data-ft-wave
          aria-hidden
          viewBox="0 0 1672 400"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[13svh] w-full lg:h-[38svh]"
        >
          <defs>
            <linearGradient id="ft-wave-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fbeee3" stopOpacity="0.62" />
              <stop offset="1" stopColor="#f6dfc9" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="ft-wave-b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fdf4ea" stopOpacity="0.42" />
              <stop offset="1" stopColor="#f7e2cf" stopOpacity="0.96" />
            </linearGradient>
          </defs>
          <path d="M0 100C200 80 350 150 520 250S800 390 1000 340 1450 180 1672 50V400H0Z" fill="url(#ft-wave-a)" />
          <path d="M0 205C180 160 300 180 420 230S760 380 960 365 1300 210 1672 195V400H0Z" fill="url(#ft-wave-b)" />
          <path d="M0 205C180 160 300 180 420 230S760 380 960 365 1300 210 1672 195" fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <path d="M0 100C200 80 350 150 520 250S800 390 1000 340 1450 180 1672 50" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </footer>
    </>
  );
}
