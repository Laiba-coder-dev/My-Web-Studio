# My Web Studio — Business Website

The official website of **My Web Studio**, a digital studio that designs and builds websites, apps and brand systems. Built with **HTML5, CSS3 and vanilla JavaScript** — no frameworks, no build step, no dependencies. Open it locally or drop the folder on any static host.

The site is a premium digital-agency portfolio: bold editorial typography, realistic in-browser product mockups, a white / navy / electric-blue / cyan / violet palette, and a responsive layout that keeps its side-by-side structure down to 375px.

---

## Pages

| Page | File | Highlights |
|------|------|------------|
| Home | `index.html` | Hero with device mockup + typing headline, stat strip, bento capability grid, case-study rows with live metrics, process, client logos, testimonials, CTA |
| About | `about.html` | Story collage, decade-of-results counters, values, timeline, team grid, CTA |
| Services | `services.html` | Six service rows with mockups, pricing, FAQ accordion, CTA |
| Portfolio | `portfolio.html` | Filterable case-study grid + detail modal with project facts |
| Contact | `contact.html` | Validated contact form, contact cards, studio details, quick answers |

Every nav item, button, filter, modal, accordion and form control is functional, and each page cross-links to the other four.

## Interactive features (13)

| # | Feature | Where | Implementation |
|---|---------|-------|----------------|
| 1 | **Dark mode** (persisted in `localStorage`, system preference on first visit, no flash of wrong colours) | All pages | `initTheme()` + inline head script |
| 2 | **Responsive navigation** (hamburger panel, body scroll lock, ESC to close, active-link highlight) | All pages | `initNav()` |
| 3 | **Scroll-to-top button** (appears past 420px, smooth scroll, focus management) | All pages | `initToTop()` |
| 4 | **Scroll progress bar** | All pages | `initProgress()` |
| 5 | **Hero parallax** (pointer/scroll depth on the hero mockup) | Home | `initHeroParallax()` |
| 6 | **Slider** (auto-play, cross-fade, dots, arrows, keyboard + swipe) | Home | `initSlider()` |
| 7 | **Typing animation** (word cycle in the headline) | Home hero | `initTyping()` |
| 8 | **Animated counters** (IntersectionObserver + eased count-up) | Home, About | `initCounters()` |
| 9 | **Accordion** (single-open, animated height, `aria-expanded`/`aria-controls`) | Services, Contact | `initAccordion()` |
| 10 | **Portfolio filter + modal** (category filtering, live count, dialog with focus return) | Portfolio | `initPortfolio()` |
| 11 | **Form validation** (inline errors, blur + submit, email/phone/min-length/checkbox rules, success state) | Contact, newsletter | `initForms()` |
| 12 | **Scroll reveal** (sections fade/slide in on entry) | All pages | `initReveal()` |
| 13 | **Footer year auto-update** | All pages | `initYear()` |

## Design system

- **Colour**: paper white `#FFFFFF` / navy ink `#050B1F`, electric blue `#2563FF`, cyan `#22D3EE`, violet `#7C3AED`, blue→violet gradients — all CSS custom properties, re-declared for `[data-theme="dark"]` with contrast-safe per-theme foregrounds.
- **Identity**: abstract double-chevron mark in a blue→cyan tile (`assets/images/logo.svg`, `favicon.svg`), gradient wordmark `Tech`+`vora` with a lighter `Solutions`.
- **Type**: Space Grotesk (display), Inter (body), Instrument Serif italic (accents), system monospace (eyebrows, labels, metrics). Fluid `clamp()` heading scale.
- **Layout**: 1260px container, `minmax()` grids, bento capability grid, mockups rendered as HTML/CSS browser chrome.
- **Motion**: one shared easing curve, reveal-on-scroll, fully disabled under `prefers-reduced-motion`.
- **Breakpoints**: `1080px`, `980px` (hero stacks, nav → hamburger), `760px`, `700px`, `520px`, `460px`, `440px` — content-driven, with fluid spacing (`clamp()`) instead of fixed sizes.

## Responsive behaviour

The layout adapts rather than collapses:

- Multi-column sections stay side-by-side wherever content fits (2-column grids, compact 2×2 stat/process blocks, horizontal filter and stat strips).
- Heroes compactify; buttons stay inline instead of stretching full-width.
- Case-study rows, service rows and the contact grid stack only when they genuinely run out of room.
- On phones and small tablets (≤900px) body paragraphs are justified to both edges with automatic hyphenation, while headings, lists, forms and controls keep their normal alignment.
- No horizontal scrolling from 375px to desktop, and no content is hidden to make a layout fit.

Verified at **375 / 390 / 430 / 768 / 1024 / 1440px**.

## Folder structure

```
├── index.html          # Home
├── about.html
├── services.html
├── portfolio.html
├── contact.html
├── README.md
├── css/
│   └── style.css       # tokens, base, components, sections, motion, responsive layer
├── js/
│   └── main.js         # all 13 interactive features (modular IIFEs)
└── assets/
    └── images/         # 30 self-hosted images: 19 photographs (JPG), 9 SVG marks, 2 PNG brand icons
```

All imagery is local, so the site runs fully offline (Google Fonts fall back to the system stack when offline).

## Run locally

```bash
python -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly from disk also works — no fetch/XHR is used.

## Deploy

**GitHub Pages**
1. Push the folder to a GitHub repository.
2. Repo → *Settings* → *Pages* → Source: `main` / root → *Save*.
3. Live at `https://<username>.github.io/<repo>/`.

**Netlify**
1. Drag-and-drop the folder onto https://app.netlify.com/drop, **or**
2. Connect the repo — build command: *(empty)*, publish directory: `/`.

No environment variables, packages or build step required.

## SEO & social sharing

- Unique `<title>` and meta description per page, plus Open Graph and Twitter card metadata.
- A branded 1200×630 share card (`assets/images/og-image.jpg`) used by search results and share previews (WhatsApp, Slack, X, LinkedIn).
- Cache-busted SVG favicon (`favicon.svg?v=2`) so browsers always load the current mark, backed by a PNG `apple-touch-icon` for iOS and tool fallbacks.
- JSON-LD `Organization` structured data (name, logo, Pakistan address, contact email) for rich results.

## Quality checks

- **Lighthouse — Accessibility 100 · Best Practices 100 · SEO 100 on all five pages**, with zero failing audits.
- **axe-core — zero violations** on every page (full rule set).
- Zero console errors and zero failed requests on every page.
- No horizontal overflow at 375 / 390 / 430 / 768 / 1024 / 1440px.
- Semantic landmarks (`header`/`nav`/`main`/`footer`), skip link, visible focus rings, single `h1` per page, labelled controls, `aria-live` form status.
- Every internal link and asset path resolves; all 30 images are referenced.
