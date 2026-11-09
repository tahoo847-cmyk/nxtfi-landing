# NxtFi hero: asset manifest

| Asset | Source | Creator | License | Local path | Status |
|---|---|---|---|---|---|
| Laptop 3D model (GLB, 2K textures, 8.3k triangles, 528 kB) | https://sketchfab.com/3d-models/laptop-7d870e900889481395b4a575b9fa8c3e | Aullwen | CC BY 4.0. Commercial use allowed, credit required | `public/assets/models/laptop.glb` | Downloaded from the official Sketchfab dialog. Used |
| Studio Small 02 HDRI (2K and 1K .hdr) | https://polyhaven.com/a/studio_small_02 | Greg Zaal | CC0 | `public/assets/hdr/` | Downloaded. 2K on desktop, 1K below 1024px |
| Lucide icons | https://lucide.dev/icons/ (npm `lucide`) | Lucide contributors | ISC | npm dependency | Used in the screen and panel UI |
| shadcn-fintech dashboard | https://github.com/abderrahimghazali/shadcn-fintech | Abderrahim Ghazali | MIT | Not copied | Reference for dashboard patterns only. No source code included |
| Fintech Website Free UIKit (Figma) | https://djectstudio.com/store/fintech-website-free-uikit | DjectStudio | Not stated beyond "free to download" | Not downloaded | Polar checkout asks for an email address, which was not submitted. Nothing in the site depends on it |
| NxtFi logo | Not supplied | | | None | The name is set as plain text. No logo was invented |

## Required credit

"Laptop" by Aullwen (https://sketchfab.com/Aullwen), licensed under CC BY 4.0
(https://creativecommons.org/licenses/by/4.0/). Materials changed: PBR metal and roughness
derived from the base map, display replaced with the NxtFi interface.

The credit is visible in the hero's bottom-right corner. Keep it there or move it to the site footer.

## Modifications

The GLB file itself is unmodified. Materials are replaced at runtime in `components/hero/scene/Laptop.tsx`.

## Fonts

Newsreader, Geist and Geist Mono via `next/font/google` (SIL Open Font License).

---

# Section 02: asset manifest

Downloaded through Claude in Chrome, from each site's own download control or file link, in the signed-in browser session.

| Asset | Source | Creator | License | Local path | Status |
|---|---|---|---|---|---|
| Credit card 3D model (GLB, 1.6 MB) | https://sketchfab.com/3d-models/credit-card-4c4117d766f342cc9e0fa3d79e9de654 | Ayat Djadja | CC BY 4.0. Commercial use allowed, credit required | `public/assets/section-02/models/nxtfi-card-base.glb` (4 kB, stripped) | Used. Only the body outline remains. Original kept at `E:\credit_card.glb`, not in the project |
| Credit card free (primary option) | https://sketchfab.com/3d-models/credit-card-free-50ab7125eb624efda610b6060ed3b218 | apleesee | CC BY 4.0 | Not downloaded | Rejected. 48 triangles, branded artwork. The alternative has a better body |
| Merchant payment photo (3464x5196) | https://unsplash.com/photos/payment-is-being-made-with-a-credit-card-AAYpF9Vx7Ek | SumUp | Unsplash License | `public/assets/section-02/images/merchant-payment.webp` (900x1124, 32 kB) | Used in Stage 02 |
| Financial operations photo (2160x3840) | https://www.pexels.com/photo/a-person-working-using-a-laptop-6779339/ | Artem Podrez | Pexels License | `public/assets/section-02/images/financial-operations.webp` (1000x800, 36 kB) | Used in Stage 03 |
| Business invoicing photo (6192x4128) | https://unsplash.com/photos/a-person-sitting-at-a-desk-using-a-laptop-computer-ru18KXzFA4E | SumUp | Unsplash License | `public/assets/section-02/images/business-invoicing.webp` (1000x751, 38 kB) | Used in Stage 04, desktop only. Cropped to remove the SumUp logo on the paper |
| Cross-border commerce photo | https://www.pexels.com/photo/woman-in-black-jacket-holding-black-tablet-computer-6169659/ | Tima Miroshnichenko | Pexels License | Not downloaded | Skipped. A warehouse logistics scene that does not fit the payment story |
| White Studio 02 HDRI (1K .hdr, 1.3 MB) | https://polyhaven.com/a/white_studio_02 | Grzegorz Wronkowski | CC0 | `public/assets/section-02/hdr/white_studio_02_1k.hdr` | Used for card reflections |
| Brushed roughness map (1024x1024) | Generated for this project | | | `public/assets/section-02/textures/brushed-roughness.webp` (29 kB) | Used on the card |
| Lucide icons | https://lucide.dev/icons/ (npm `lucide`, already installed) | Lucide contributors | ISC | npm dependency | Wallet, ArrowLeftRight, Route, Landmark, Eye |

Original photos are in `public/assets/section-02/images/originals/`. The page does not reference them, so leave them out of a deployment if preferred.

## Required credit

"Credit card" by Ayat Djadja (https://sketchfab.com/ayadja1977), licensed under CC BY 4.0
(https://creativecommons.org/licenses/by/4.0/). Changes: all textures and materials removed, along with
the embossed number and name, chip, stripe and signature panel. The outline is rebuilt at runtime as a
bevelled four-layer body with new NxtFi artwork.

The credit is visible at the bottom of Section 02. Keep it there or move it to the site footer. Unsplash and Pexels do not require credit; it is given as a courtesy.

## Trademarks and product claims

The source model reproduces Standard Chartered and Visa artwork. CC BY does not grant trademark rights, so none of that artwork is in this project.
The chip, card number, stripe and network mark were removed so the object does not read as an NxtFi-issued payment card, and the page says so in its footnote.

---

# Section 04: asset manifest

| Asset | Source | Creator | License | Local path | Status |
|---|---|---|---|---|---|
| POS Terminal - Digital Cash Register (GLB, 3.9 MB, 86.6k triangles) | https://sketchfab.com/3d-models/pos-terminal-digital-cash-register-dd3b0ff62c044d8ebe59c8cdab2c6fc9 | dg samples | CC BY 4.0, credit required | `public/assets/section-04/models/pos-terminal.glb` | Downloaded through Claude in Chrome, verified to load. Used. Credit is in the Section 04 footnote |
| Payment terminal (GLB, 0.76 MB) | https://sketchfab.com/3d-models/payment-terminal-12376a29b015453da5f7a0deede21dd8 | nofurion | CC BY 4.0 | Removed | Rejected: an old counter unit with a thin LCD strip and a printer, no screen that can show a payment interface |
| Studio HDRI | Reuses `public/assets/section-02/hdr/white_studio_02_1k.hdr` (CC0) | Grzegorz Wronkowski | CC0 | Existing | `story_studio_02` was not downloaded, since an equivalent studio HDRI is already in the project |

---

# Closing scene

| Asset | Source | Creator | License | Local path | Status |
|---|---|---|---|---|---|
| Earth at night map (3600x1800, 780 kB) | https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg | NASA Earth Observatory | Public domain, credit requested | `public/assets/closing/earth-night.webp` (rendered sphere) | Used |

The three Section 02 photos are no longer rendered. Their files remain in `public/assets/section-02/images/` and can be deleted before deployment.
