# Legal Protection Group — Corporate Law Firm Website

A premium, multilingual landing experience for an elite international law firm. Built as a **portfolio piece** to showcase production-grade vanilla front-end work — no frameworks, no build step, no shortcuts.

![Status](https://img.shields.io/badge/status-portfolio-0B0B0B?style=flat-square)
![Stack](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-D4AF37?style=flat-square)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20AR%20(RTL)-D4AF37?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-D4AF37?style=flat-square)

---

## Preview

> Live demo: `https://your-demo-url.netlify.app` *(replace after deploying)*
> Screenshots: see [`/screenshots`](./screenshots/)

---

## What This Project Demonstrates

This is not a "static website with five pages." It is a demonstration of building a **production-shaped product surface** with careful attention to:

- Real content architecture (5 fully-built pages)
- Internationalization with **bidirectional layout support** (EN ⇄ AR)
- Motion design that respects `prefers-reduced-motion` and progressive enhancement
- Mobile-first responsive layout using `clamp()` and grid
- Semantic HTML, accessible navigation, keyboard-friendly interactive elements
- A design-token system in CSS (`--bg-*`, `--color-gold-*`) that scales across themes

---

## Highlights

### Bidirectional Localization (EN ⇄ AR)

Every translatable string is annotated with `data-i18n` and resolved at runtime against a single `translations.js` dictionary.

```
- 120+ translation keys
- URL parameter override (?lang=ar)
- localStorage persistence
- Document `dir` + `lang` attribute swap
- CSS `[dir="rtl"]` selector flips typography stack
```

### Motion Design

- **Animated counters** with eased timing (`ease-out cubic`) triggered via `IntersectionObserver`
- **Scroll-reveal** entrance animations with graceful fallback (`reveal-active` class flips in)
- **Sticky navbar** that compacts on scroll
- **Burger drawer** with body scroll lock

### Design Tokens

All colors, borders, and fonts live in CSS custom properties under `:root`. The brand palette is dark obsidian (#0B0B0B) + brushed gold (#D4AF37) — a deliberate choice for the "established legal practice" tone.

### Accessibility Considerations

- `aria-label` on icon-only links and the burger toggle
- `loading="lazy"` on below-the-fold images
- Semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`)
- Decorative SVGs use `aria-hidden`-friendly patterns
- Keyboard-operable language switcher

---

## Tech Stack

| Layer       | Choice                  | Why                                                 |
| ----------- | ----------------------- | --------------------------------------------------- |
| Markup      | HTML5                   | Semantic, accessible, framework-free                |
| Styling     | CSS3 + Custom Properties | Tokens, RTL-swap, no preprocessor overhead          |
| Behavior    | Vanilla JavaScript      | No jQuery, no React — proven browser APIs only     |
| Fonts       | Cairo, Outfit, Playfair Display | Multi-script coverage (AR + EN + Serif accents) |
| Icons       | Inline SVG              | Stylable via `currentColor`, zero HTTP requests     |

**No build tools. No npm install. No transpilation.** Open `index.html` and it works.

---

## Project Structure

```
.
├── index.html              # Home — Hero + About + Services + Why-Us + Team + Global Reach
├── about.html              # Firm story + values
├── services.html           # 6 detailed practice areas
├── expertise.html          # International capability narrative
├── contact.html            # Consultation form + map
├── css/
│   └── style.css           # 1,561 lines — design tokens + components + RTL
├── js/
│   ├── main.js             # i18n, scroll, counters, forms, burger menu
│   └── translations.js     # EN + AR dictionaries
└── img/                    # Logo, hero, attorney portraits, abstract map
```

---

## How To Run

```bash
# Option 1 — open directly
open index.html

# Option 2 — local server (recommended for ?lang= override testing)
python -m http.server 8000
# or
npx serve .
```

Then visit `http://localhost:8000`.

---

## Deployment

The repo is pre-wired for **Netlify** (drag-and-drop deployment, free HTTPS, custom domain support). See `netlify.toml`.

Other zero-config hosts that work: **Vercel, GitHub Pages, Cloudflare Pages, Render Static**.

---

## Author

**Mohamed** — Front-end engineer focused on performance, accessibility, and design systems.

- Portfolio: `https://your-portfolio.com`
- LinkedIn: `linkedin.com/in/your-profile`
- Email: `your@email.com`

---

## License

MIT — see [`LICENSE`](./LICENSE). Use it, fork it, learn from it.

> All firm names, attorney names, and statistics shown in the design are fictional and used for portfolio demonstration only.
