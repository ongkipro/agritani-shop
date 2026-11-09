# DESIGN.md

## Direction
Picked-by: owner 2026-11-07 (direction A of 3)
Surface/job: Direct-response high-ROAS mobile landing pages for Indonesian agricultural farmers and growers.
References: internal high-converting templates (`obat-sawit-buah-cengkeh-landak`, `penakluk-sawit-ganoderma`, `pertolongan-keracunan-obat`).
Sections:
1. Hero Fold: Emergency Problem, Brutal Overclaim H1, Product Pack Shot, Value Checklist, Above-the-fold CTA.
2. Visual Problem: 2 Macro Symptom cards with field photographs matching farmer panic.
3. Contrast & Timeline: Before vs After cards (`Tanpa Produk` vs `Dengan Produk`) and 3-stage recovery timeline.
4. Product Pillars: Hologram anti-counterfeit guarantee box, bottle hero, and 3 sharp mechanism pillars.
5. SOP Field Guide: 3-step application formula (dosage per 16L tank / drenching, method, interval).
6. Social Proof: 3 real farmer testimonials with verified location, harvest photo, and high-contrast pull quotes.
7. COD Checkout: Direct single-page order form with 1 Liter / Combo default checked.
Feel in 3 words: Urgent, Authentic, Irresistible.
Photo style: High-clarity real Indonesian agricultural field photography, real farmer hands, visible crop symptoms, authentic lush harvests, natural lighting.
Motion profile: subtle (quick transition to checkout, smooth scroll anchor).
3 "won't do": No generic Western stock photos, no laboratory academic formulas, no low-ticket 500ml default selection.

### Composition contract
C1: Mobile direct-response column fixed at `max-w-[480px]` with zero horizontal overflow.
C2: 7-section narrative hierarchy structured to answer objections sequentially before reaching checkout.
C3: High-contrast green brush (`hl-brush`) and red brush (`hl-brush-red`) highlights on focal claim phrases.
C4: Sticky Bottom CTA Bar (`StickyLandingCtaBar`) that floats smoothly into viewport once hero scrolls away.
C5: Native `1 Liter` or `2-Bottle Combo` default radio button checked to anchor AOV at >= Rp 215.000 - Rp 275.000.

## Tokens

### Colour
- Primary Canvas: `#FFFFFF`
- Problem/Alert Background: `#FEF2F2` (red-50/40) & `#FFFBEB` (amber-50/40)
- Trust/Success Background: `#F0FDF4` (emerald-50/50)
- Primary Text / Deep Ink: `#020617` (slate-950)
- Secondary Body: `#334155` (slate-700)
- Accent Success / Action: `#14532D` (emerald-900) & `#16A34A` (green-600)
- Accent Urgent / Alert: `#DC2626` (red-600) & `#991B1B` (red-800)

### Type
- Primary Family: system-ui, -apple-system, sans-serif (fast loading on 3G rural mobile)
- Scale: Hero H1 25-28px (extrabold, leading-tight), Section H2 22-24px (bold), Body 13-15px (regular/medium), Badges 10-12px (extrabold tracking-wide)

### Radius
- Cards & Images: 12px (`rounded-xl`)
- Badges & Pills: 9999px (`rounded-full`)
- Buttons & Inputs: 8px (`rounded-lg`)

### Spacing
- Base: 4px
- Section padding: `px-5 py-6` to `px-5 py-8`
- Stack gap: 12px to 16px (`space-y-3` / `space-y-4`)

### Motion
- Transition: 150ms ease-out on buttons and checkout focus
- Reduced motion: static layout with zero disruptive layout shifts

## Allow
allow: primary-actions — Direct response landing page provides hero CTA anchor and bottom form submit button.
allow: section-count — 7 narrative conversion sections required for high-ticket Indonesian agricultural direct-response.
allow: hero-height — Hero section requires problem image and immediate overclaim checklist on mobile viewports.
allow: h1-length — Indonesian agricultural direct-response requires explicit problem and transformation headline.
allow: first-viewport-words — Above-the-fold conversion architecture includes problem badge, headline, and overclaim checklist.
allow: body-size — Mobile direct-response 480px column optimized with 13-14px body text for dense field readability.
allow: emphasis — Direct response copy strategically bolds active ingredients, dosages, and key proof figures.
allow: marker-count — Trust signals and guarantee badges displayed together to eliminate farmer skepticism before checkout.
allow: duplicate-href — Direct response page provides multiple smooth-scroll jump links pointing to the bottom checkout form.
allow: numbered-labels — 3 formula mechanism pillars and 3 SOP application steps guide the user through product efficacy.
allow: card-in-card — Checklist card and symptom cards nested inside themed background containers.
allow: display-tracking — Direct-response display headlines use compact letter spacing for visual punch.
allow: transition-all — Storefront button interactive states use transition animations.
