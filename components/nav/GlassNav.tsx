"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { measure, scrollToTarget, type Target } from "./scroll";
import "./nav.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINKS: { id: Target; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "#top" },
  { id: "challenge", label: "The Challenge", href: "#payment-challenge" },
  { id: "solution", label: "Our Solution", href: "#solution" },
];

export function GlassNav() {
  const list = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const marks = useRef<ReturnType<typeof measure> | null>(null);
  const [active, setActive] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState({ x: 0, w: 0 });

  useGSAP(() => {
    const read = (y: number) => {
      const m = marks.current;
      if (!m) return;
      setDark(y >= m.darkFrom && y < m.darkTo);
      setActive(y >= m.contactFrom ? -1 : y >= m.solutionFrom ? 2 : y >= m.challengeFrom ? 1 : 0);
    };
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -9,
      onRefresh: (self) => {
        marks.current = measure();
        read(self.scroll());
      },
      onUpdate: (self) => read(self.scroll()),
    });
    return () => trigger.kill();
  });

  const shown = hover ?? active;

  useLayoutEffect(() => {
    const link = list.current?.querySelectorAll<HTMLElement>("a")[shown];
    if (link) setPill({ x: link.offsetLeft, w: link.offsetWidth });
  }, [shown]);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const outside = (e: PointerEvent) => {
      if (!(e.target as Element).closest(".nav-mobile")) setOpen(false);
    };
    window.addEventListener("keydown", close);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  const go = useCallback((e: MouseEvent, id: Target) => {
    e.preventDefault();
    setOpen(false);
    scrollToTarget(id);
  }, []);

  const logo = (
    <a href="#top" onClick={(e) => go(e, "home")} className="px-2 text-base font-semibold tracking-tight lg:text-xl">
      NxtFi
    </a>
  );

  return (
    <nav aria-label="Main" data-theme={dark ? "dark" : "light"} className="nav fixed inset-x-0 top-0 z-50">
      <div className="hidden lg:block">
        <div className="nav-glass absolute top-4 right-12 flex h-[3.25rem] items-center gap-6 rounded-full py-1.5 pr-1.5 pl-4 xl:right-auto xl:left-1/2 xl:-translate-x-1/2">
          {logo}
          <div ref={list} className="relative flex items-center" onMouseLeave={() => setHover(null)}>
            <span
              aria-hidden
              className="nav-pill absolute top-0 left-0 h-full rounded-full"
              style={{ width: pill.w, transform: `translateX(${pill.x}px)`, opacity: shown < 0 ? 0 : 1 }}
            />
            {LINKS.map(({ id, label, href }, i) => (
              <a
                key={id}
                href={href}
                aria-current={active === i ? "true" : undefined}
                onClick={(e) => go(e, id)}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="nav-link relative rounded-full px-4 py-2 text-sm whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </div>
          <a href="#contact" onClick={(e) => go(e, "contact")} className="nav-cta inline-flex h-10 items-center rounded-full px-5 text-sm font-medium whitespace-nowrap">
            Get in Touch
          </a>
        </div>
      </div>

      <div className="nav-mobile absolute top-3 right-3 flex flex-col items-end gap-2 lg:hidden">
        <div className="nav-glass flex h-11 items-center rounded-full py-1 pr-0.5 pl-1.5">
          {logo}
          <button
            ref={toggle}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full"
          >
            <span className="nav-bar block h-[1.5px] w-4 bg-current" style={{ transform: open ? "translateY(3.25px) rotate(45deg)" : undefined }} />
            <span className="nav-bar block h-[1.5px] w-4 bg-current" style={{ transform: open ? "translateY(-3.25px) rotate(-45deg)" : undefined }} />
          </button>
        </div>
        <div id="nav-menu" data-open={open} inert={!open} className="nav-glass nav-menu flex w-56 flex-col gap-1 rounded-3xl p-2">
          {LINKS.map(({ id, label, href }, i) => (
            <a
              key={id}
              href={href}
              aria-current={active === i ? "true" : undefined}
              onClick={(e) => go(e, id)}
              className="nav-link rounded-2xl px-4 py-3 text-[0.95rem]"
            >
              {label}
            </a>
          ))}
          <a href="#contact" onClick={(e) => go(e, "contact")} className="nav-cta mt-1 inline-flex h-12 items-center justify-center rounded-full text-sm font-medium">
            Get in Touch
          </a>
        </div>
      </div>
    </nav>
  );
}
