import dynamic from "next/dynamic";

const TerminalCanvas = dynamic(() => import("./TerminalCanvas"), { ssr: false });

const HEADLINE = ["From Digital", "Assets to Local", "Payments."];

const STEPS = [
  { n: 2, step: "02 — Conversion & Rate Handling", title: "Conversion, With Every Step Accounted For.", body: "NxtFi is building the infrastructure to coordinate digital-asset conversion, liquidity and rate handling." },
  { n: 3, step: "03 — Payment Routing & Risk Controls", title: "Every Payment Needs the Right Path.", body: "Payment orchestration connects transaction routing with risk controls and financial network integrations." },
  { n: 4, step: "04 — Local Settlement & Reconciliation", title: "From Payment to Local Settlement.", body: "NxtFi's infrastructure is designed to connect payment processing with local settlement and reconciliation." },
];

const TAGS: { id: string; side: "r" | "u"; title: string; hint: string }[] = [
  { id: "source", side: "u", title: "Digital asset", hint: "Incoming value" },
  { id: "fiat", side: "u", title: "Local currency", hint: "Converted value" },
  { id: "rate", side: "r", title: "Rate handling", hint: "Recorded at conversion" },
  { id: "risk", side: "u", title: "Risk controls", hint: "Checked on the way" },
  { id: "check", side: "u", title: "Routing checkpoint", hint: "Path selected" },
  { id: "dest", side: "r", title: "Settlement destination", hint: "Local payout side" },
  { id: "record", side: "r", title: "Settlement record", hint: "Sample entry" },
  { id: "status", side: "r", title: "Reconciliation", hint: "Records matched" },
];

/**
 * Section 04. It sits over the pinned frame and is revealed by one clip-path wipe, so no extra section hosts the transition.
 * Under reduced motion it drops out of the overlay and reads as a plain block below Section 03.
 */
export function ProcessLayer({ mount, active }: { mount: boolean; active: boolean }) {
  return (
    <div
      data-s4
      className="s4 pointer-events-none z-30 overflow-hidden motion-safe:absolute motion-safe:inset-0 motion-reduce:pointer-events-auto motion-reduce:relative motion-reduce:rounded-lg motion-reduce:px-6 motion-reduce:py-12"
    >
      <div aria-hidden data-s4-bg className="s4-bg absolute inset-y-0 -left-[20%] w-[120%] motion-reduce:inset-0 motion-reduce:left-0 motion-reduce:w-full" />

      <div aria-hidden data-s4-warm className="s4-warm absolute inset-0 motion-reduce:hidden" />
      <div aria-hidden data-s4-glow className="s4-glow absolute inset-y-0 left-[10vw] w-[150vw] motion-reduce:hidden" />

      <div data-s4-stage aria-hidden className="absolute inset-0 motion-reduce:hidden">
        {mount && <TerminalCanvas active={active} />}
        <div className="absolute inset-0 overflow-hidden max-lg:hidden">
          {TAGS.map(({ id, side, title, hint }) => (
            <div key={id} data-s4-tag={id} data-side={side} className="s4-tag absolute top-0 left-0 size-0">
              <div className="s4-tag-box rounded-lg px-3 py-2">
                <p className="font-mono text-[max(0.66rem,min(0.76vw,1.5svh))] tracking-[0.08em] whitespace-nowrap uppercase">{title}</p>
                <p className="mt-0.5 text-[max(0.7rem,min(0.8vw,1.55svh))] whitespace-nowrap opacity-80">{hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p
        data-s4-label
        className="relative font-mono text-[0.7rem] tracking-[0.14em] uppercase text-(--s4-soft) motion-safe:absolute motion-safe:top-6 motion-safe:left-6 lg:motion-safe:top-9 lg:motion-safe:left-12"
      >
        04 / How It Works
      </p>

      <div
        data-s4-head
        className="relative mt-6 motion-safe:absolute motion-safe:top-[9svh] motion-safe:right-6 motion-safe:left-6 motion-safe:mt-0 lg:motion-safe:top-[13svh] lg:motion-safe:right-auto lg:motion-safe:left-[6vw] lg:motion-safe:w-[40vw]"
      >
        <h2
          aria-label="From Digital Assets to Local Payments."
          className="font-display text-[clamp(2.1rem,9.2vw,3.4rem)] leading-[1.04] font-light tracking-[-0.022em] text-(--s4-ink) lg:text-[min(4.3vw,8.2svh)]"
        >
          {HEADLINE.map((line, i) => (
            <span key={line} data-s4-line aria-hidden className="block overflow-clip pb-[0.1em]">
              <span className={i === 2 ? "inline-block text-[#0e6b52]" : "inline-block"}>{line}</span>
            </span>
          ))}
        </h2>
        <p data-s4-sub className="mt-5 max-w-[31rem] lg:max-w-[33vw] text-[0.98rem] leading-relaxed text-(--s4-soft) max-lg:hidden lg:text-[max(0.88rem,min(1.1vw,2.1svh))]">
          Explore how NxtFi is building infrastructure to connect digital-asset transactions with conversion, payment routing and local settlement.
        </p>
      </div>

      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full max-lg:hidden motion-reduce:hidden">
        <g data-s4-link className="s4-link">
          <line />
          <circle r="3.5" />
        </g>
      </svg>

      <div
        data-s4-note
        className="s4-note relative mt-8 rounded-xl px-5 py-4 motion-safe:absolute motion-safe:right-6 motion-safe:bottom-[15svh] motion-safe:left-6 motion-safe:mt-0 lg:motion-safe:right-auto lg:motion-safe:bottom-auto lg:motion-safe:left-[6vw] lg:motion-safe:top-[60svh] lg:motion-safe:w-[25vw] lg:px-[1.4vw] lg:py-[2svh]"
      >
        <p className="font-mono text-[0.68rem] tracking-[0.1em] text-[#0e6b52] uppercase lg:text-[max(0.68rem,min(0.8vw,1.55svh))]">01 — Digital Asset Payment</p>
        <p className="mt-2 text-sm leading-snug text-(--s4-ink) lg:text-[max(0.85rem,min(1vw,2svh))]">
          An incoming digital-asset payment begins the journey toward local fiat settlement.
        </p>
      </div>

      {STEPS.map(({ n, step, title, body }) => (
        <section
          key={n}
          data-s4-step={n}
          aria-label={step}
          className="relative mt-10 flex flex-col justify-between gap-6 motion-safe:absolute motion-safe:inset-x-6 motion-safe:top-[9svh] motion-safe:bottom-[12svh] motion-safe:mt-0 lg:block lg:motion-safe:inset-x-auto lg:motion-safe:top-[13svh] lg:motion-safe:bottom-auto lg:motion-safe:left-[6vw] lg:motion-safe:w-[37vw]"
        >
          <div>
            <p className="font-mono text-[0.68rem] tracking-[0.1em] text-[#0e6b52] uppercase lg:text-[max(0.68rem,min(0.8vw,1.55svh))]">{step}</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,8.4vw,3.1rem)] leading-[1.06] font-light tracking-[-0.022em] text-(--s4-ink) lg:text-[min(3.6vw,6.8svh)]">
              {title}
            </h2>
          </div>
          <p className="s4-card text-sm leading-snug text-(--s4-ink) lg:mt-6 lg:text-[max(0.88rem,min(1.1vw,2.1svh))] lg:leading-relaxed lg:text-(--s4-soft)">
            {body}
          </p>
        </section>
      ))}

      <div
        data-s4-foot
        className="relative mt-8 flex flex-col gap-1 text-[0.62rem] leading-snug text-(--s4-soft) motion-safe:absolute motion-safe:inset-x-6 motion-safe:bottom-3 motion-safe:mt-0 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:motion-safe:inset-x-12 lg:motion-safe:bottom-6"
      >
        <p>Illustrative scenario with fictional values. NxtFi does not manufacture payment terminals. Sample screen, not a payment address.</p>
        <p className="credit lg:max-w-[46vw] lg:text-right">
          3D base:{" "}
          <a href="https://sketchfab.com/3d-models/pos-terminal-digital-cash-register-dd3b0ff62c044d8ebe59c8cdab2c6fc9" target="_blank" rel="noreferrer">
            POS Terminal - Digital Cash Register
          </a>{" "}
          by{" "}
          <a href="https://sketchfab.com/dgsamples" target="_blank" rel="noreferrer">
            dg samples
          </a>
          ,{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
            CC BY 4.0
          </a>
          , geometry, materials and screen changed.
        </p>
      </div>
    </div>
  );
}
