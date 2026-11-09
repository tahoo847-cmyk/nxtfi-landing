# QA report

Tested on the production build (`npm run build && npm run start`) in Chromium via Playwright, on the local NVIDIA RTX 3050, at device pixel ratio 1.

| Check | Result | Evidence |
|---|---|---|
| Build and typecheck | PASS | `next build` and `tsc --noEmit` clean |
| Assets load | PASS | No failed requests. GLB and 2K HDRI on desktop, 1K HDRI below 1024px |
| Console errors | PASS | None. One warning, `THREE.Clock` deprecated, comes from inside React Three Fiber |
| Forward and reverse scroll | PASS | Wheel down and back up across the pinned range. Opening state restored |
| Scroll performance, 1440x900 | PASS | 60fps, 17ms worst frame over 9 seconds of wheel scrolling |
| Load time, warm | PASS | Scene ready in about 1.9s |
| Load time, cold browser | NOTE | 6.6s once, mostly first-run GPU start and shader compile. The headline and a loading line show meanwhile |
| Composition at 1440x900, 1280x640, 820x1180, 390x844 | PASS | `docs/screenshots/` |
| Horizontal overflow | PASS | 0px at 390, 820 and 1440 wide |
| Reduced motion | PASS | No pin, no Lenis, CTA switches states instantly |
| CTA | PASS | Keyboard focus and Enter scroll to the end of the sequence |
| No WebGL | PASS | Headline and CTA remain, with a plain notice |

## Not tested

- Real phones or tablets. Mobile layouts were checked at emulated sizes on a desktop GPU, so mobile frame rate is unknown.
- Safari and Firefox.
- High-DPI displays. Desktop rendering allows up to 2x, and `PerformanceMonitor` lowers it if frame rate drops.
- Integrated graphics. Desktop uses a floor reflection pass, which is the first thing to remove if a slower laptop struggles.

## Known limitations

- The laptop is an 8.3k-triangle low-poly model. It holds up well at this framing, but close inspection shows simple edges.
- `next/font/google` needs network access at build time.

# Section 02 QA

Tested on the production build in Chromium via Playwright, on the same RTX 3050, at device pixel ratio 1. Frames: `docs/screenshots/section-02-*.png`.

| Check | Result | Evidence |
|---|---|---|
| Build and typecheck | PASS | `next build` and `tsc --noEmit` clean |
| Assets load | PASS | No failed requests at any size |
| Console errors | PASS | None. The `THREE.Clock` warning from React Three Fiber remains |
| Full scroll, hero through Section 02 | PASS | Wheel input to the end of the page and back to the top |
| Scroll reversal | PASS | Stage 01 and the hero's opening state restored after scrolling back. Stage 03 frames from separate passes match visually (they stop a few pixels apart, so not pixel-identical) |
| Hero to Section 02 transition | PASS | No visible edge or jump between sections |
| Scroll performance, 1440x900 | PASS | 60fps average, 16.8ms 95th percentile, one frame over 33ms (66.6ms) of 2,359 |
| Composition at 1440x900, 1280x640, 1024x768, 820x1180, 390x844 | PASS | All five stages reviewed on four sizes. At 1024x768, Stage 02 and Stage 05 were captured but not reviewed by eye |
| Horizontal overflow | PASS | 0px at 390, 820, 1024, 1280 and 1440 wide |
| Reduced motion | PASS | No pin, static layout, card renders in its final state, no errors |
| No WebGL | PASS | Section copy and photos stay available, with a plain notice in place of the card |

## Not tested

- Real phones or tablets. Mobile frame rate is unknown, and the page now has two WebGL scenes, though only one renders at a time.
- Safari and Firefox.
- High-DPI displays and integrated graphics.
- Touch scrolling. Phone layouts were driven with a mouse wheel at emulated sizes.

## Known limitations

- The frame-rate run predates the final change, a size cap for the card below 1024px, which does not affect desktop.
- Reduced motion places the card after the text rather than beside it.
- The section ends the page for now. Its pin releases at the end of the document until Section 03 exists.
