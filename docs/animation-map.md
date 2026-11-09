# Animation map

One pinned hero. `ScrollTrigger` scrubs a single GSAP timeline (`scrub: 0.9`), pinned for 4 viewport heights on desktop and 3.2 below 1024px. Lenis drives scrolling. Values live in `components/hero/choreography.ts` and are read by the render loop.

| Progress | Motion |
|---|---|
| Load | Lid opens, headline words rise, supporting text and CTA fade in. Plays once, not scrubbed |
| 0-30% | Three-quarter view, slow push-in, slight rotation. Mouse parallax active |
| 30-44% | Headline block fades and lifts |
| 30-70% | Camera moves in, laptop turns toward the viewer, lens shift centres it |
| 50-78% | Studio light dims from stone to ink. Text colour flips quickly |
| 70-90% | The four payment cards lift off the screen in sequence |
| 86-99% | Pathway draws edge to edge between cards, with nodes |
| 70-100% | Camera settles on the overview |
| 92-100% | Illustrative-data note appears |

Scrolling up reverses everything, since all of it is timeline-driven.

- Phone and tablet: farther camera, no floor reflection, 1K HDRI, 2x2 card layout, shorter pin.
- Reduced motion: no pin, no Lenis, no parallax, no reveals. The CTA switches between the opening and overview states instantly.
- Cleanup: `gsap.matchMedia` reverts triggers and rebuilds at the 1024px and reduced-motion boundaries, and destroys Lenis.

# Section 02: The Payment Challenge

One GSAP timeline, scrubbed (`scrub: 0.9`) from the moment the section's top enters the viewport. A second `ScrollTrigger` pins the section for 6.5 viewport heights on desktop and 5.5 below 1024px. Both use `refreshPriority: -1` so they measure after the hero's pin. Values live in `components/section-02/choreography.ts`.

Times below are viewports of scroll on desktop, counted from the section entering. Below 1024px the pinned part is scaled to fit the shorter pin.

| Scroll | Stage | Motion |
|---|---|---|
| 0-1 | 01 Entry | Card rises from a steep angled view. Headline lines unmask, supporting text and background glows fade in |
| 1-1.4 | 01 Hold | Pin starts. Composition rests |
| 1.4-2.9 | 02 Digital assets | Headline leaves. Card turns toward the viewer. Merchant photo arrives from the right with depth. Statement fades in on the left |
| 2.9-4.5 | 03 Conversion and routing | Card turns over to its back while the camera shifts. First photo recedes, second enters from the left. "Different Networks. Multiple Steps." fades in |
| 4.5-5.9 | 04 Settlement | Camera moves closer. Extra route steps light up through the emissive channel. Three detail rows and the invoicing photo appear |
| 5.9-7.5 | 05 Final reveal | Card completes its turn to the front. Its four layers fan out, each labelled. Closing line fades in |

- Transition: a gradient above the section fades the hero's floor to the section background, and the section opens on the hero's final dark tone.
- Depth: the card is real 3D, and photos use CSS 3D transforms behind the transparent canvas, so the card passes in front of them.
- Phone and tablet: same story in a stacked layout, card in the upper half. The third photo is omitted.
- Reduced motion: no pin, no scrub, no parallax. Content flows as a normal page, with the card shown static in its final fanned state.
- Cleanup: `gsap.matchMedia` and `useGSAP` revert both triggers at the 1024px and reduced-motion boundaries.
- Rendering: the card scene waits until the browser is idle after load, then renders only near the viewport. The hero stops rendering once it has scrolled out of view.

# Section 04: The Bigger Picture

One scrubbed timeline (`scrub: 0.9`) from the section entering, plus a 170vh pin. Lines 1 and 2 unmask, drift at different speeds while navy moves to teal, "already in motion." unmasks and scales to 1.07, then the type lifts and the pin releases into the CTA, which shares the same teal. Reduced motion: no pin, static text.
