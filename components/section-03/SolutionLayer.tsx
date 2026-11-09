import { ArrowLeftRight, Landmark, Route, Wallet, type IconNode } from "lucide";

const HEADLINE = ["Bringing Every", "Payment Layer", "Together."];

const LAYERS: { title: string; body: string; tag: string; hint: string; node: IconNode }[] = [
  { title: "Digital Assets", body: "Connecting digital asset payments with financial infrastructure.", tag: "Digital Assets", hint: "Multiple assets, one connection", node: Wallet },
  { title: "Conversion", body: "Supporting the transition from digital assets to local currencies.", tag: "Conversion", hint: "Controlled conversion steps", node: ArrowLeftRight },
  { title: "Payment Routing", body: "Connecting payment processes across financial networks.", tag: "Payment Routing", hint: "Clear paths across networks", node: Route },
  { title: "Local Settlement", body: "Bringing payments toward their intended local destinations.", tag: "Local Settlement", hint: "Funds toward local accounts", node: Landmark },
];

function Icon({ node }: { node: IconNode }) {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {node.map(([Tag, attrs], i) => (
        <Tag key={i} {...attrs} />
      ))}
    </svg>
  );
}

/** Section 03 copy. It shares Section 02's pinned frame, so the cards stay in one scene and these layers only fade in over it. */
export function SolutionLayer() {
  return (
    <div className="sol motion-safe:contents motion-reduce:mt-10 motion-reduce:flex motion-reduce:flex-col motion-reduce:gap-8">
      <div
        aria-hidden
        data-sol-bg
        className="sol-bg pointer-events-none absolute inset-0 z-[1] motion-reduce:hidden"
      />

      <div id="solution" data-sol-head className="z-20 motion-safe:absolute motion-safe:top-[9svh] motion-safe:left-6 motion-safe:right-6 lg:motion-safe:top-[11svh] lg:motion-safe:left-[6vw] lg:motion-safe:right-auto lg:motion-safe:w-[38vw]">
        <h2
          aria-label={HEADLINE.join(" ")}
          className="font-display text-[clamp(2.1rem,9.2vw,3.4rem)] leading-[1.04] font-light tracking-[-0.022em] text-(--sol-ink) lg:text-[min(4.3vw,7.4svh)]"
        >
          {HEADLINE.map((line, i) => (
            <span key={line} data-sol-line aria-hidden className="block overflow-clip pb-[0.1em]">
              <span className={i === 2 ? "inline-block text-[#b48a62]" : "inline-block"}>{line}</span>
            </span>
          ))}
        </h2>
        <p data-sol-sub className="mt-5 max-w-[30rem] lg:max-w-[35vw] text-[0.98rem] leading-relaxed text-(--sol-soft) max-lg:hidden lg:text-[max(0.88rem,min(1.1vw,2.1svh))] lg:leading-relaxed">
          NxtFi connects digital asset transactions with conversion, routing and local settlement through one clearer financial flow.
        </p>
      </div>

      <ol
        data-sol-list
        className="z-20 motion-safe:absolute motion-safe:inset-x-6 motion-safe:bottom-[7svh] motion-safe:h-[18svh] lg:motion-safe:inset-x-auto lg:motion-safe:bottom-[9svh] lg:motion-safe:left-[3.4vw] lg:motion-safe:h-auto lg:motion-safe:w-[36vw] lg:flex lg:flex-col lg:gap-[2.2svh]"
      >
        {LAYERS.map(({ title, body, node }, i) => (
          <li
            key={title}
            data-sol-item
            className="sol-item flex items-start gap-4 max-lg:absolute max-lg:inset-x-0 max-lg:top-0 lg:gap-5"
          >
            <span className="mt-[1.1svh] hidden w-9 shrink-0 items-center gap-3 font-mono text-[0.68rem] text-(--sol-soft) lg:flex">
              0{i + 1}
              <i className="sol-dot block size-1.5 rounded-full" />
            </span>
            <span className="tile grid size-12 shrink-0 place-items-center rounded-xl border text-(--sol-ink) lg:size-[min(4.4vw,7.4svh)]">
              <Icon node={node} />
            </span>
            <div>
              <h3 className="text-[1.15rem] leading-tight font-normal text-(--sol-ink) lg:text-[max(1rem,min(1.5vw,2.9svh))]">
                <span className="mr-2 font-mono text-[0.68rem] text-(--sol-soft) lg:hidden">0{i + 1}</span>
                {title}
              </h3>
              <p className="mt-1 text-sm leading-snug text-(--sol-soft) lg:text-[max(0.8rem,min(0.95vw,1.9svh))]">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div data-sol-tags aria-hidden className="pointer-events-none z-20 motion-safe:absolute motion-safe:inset-0 max-lg:hidden motion-reduce:hidden">
        <svg className="absolute inset-0 size-full">
          {LAYERS.map(({ tag }) => (
            <g key={tag} data-sol-link className="sol-link">
              <line />
              <circle r="3" />
            </g>
          ))}
        </svg>
        {LAYERS.map(({ tag, hint }, i) => (
          <div
            key={tag}
            data-sol-tag
            className="sol-tag absolute top-0 right-[3vw] w-[min(19vw,36svh)] rounded-lg px-[1.1vw] py-[1.5svh] backdrop-blur-[2px]"
          >
            <p className="flex justify-between font-mono text-[max(0.68rem,min(0.8vw,1.55svh))] tracking-[0.08em] uppercase">
              <span>{tag}</span>
              <span className="opacity-60">0{i + 1}</span>
            </p>
            <p className="mt-1 text-[max(0.68rem,min(0.8vw,1.55svh))] opacity-85">{hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
