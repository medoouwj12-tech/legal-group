# Case Study — Legal Protection Group Website

> A walkthrough of the design decisions, engineering choices, and trade-offs behind a 5-page multilingual law firm site built with vanilla web technologies.

---

## Context

The brief was: *build a digital storefront for a fictional international law firm that holds up to scrutiny from corporate clients and from senior engineers.* Two non-negotiable constraints shaped every decision:

1. **Must read as credible to a law firm buyer.** Their audience is conservative, expects polish, and notices shortcuts.
2. **Must not pretend to be more than it is.** No fake framework names, no webpack config hiding, no "built with" badges that misrepresent the stack.

The deliverable is five fully-built pages (`index`, `about`, `services`, `expertise`, `contact`), a complete bilingual translation dictionary, and a single CSS file housing the entire design system.

---

## The Engineering Challenges That Mattered

### 1. Bidirectional Content Without A Framework

Most "multilingual" portfolio sites copy-paste two HTML files per language. That breaks search indexing, doubles maintenance, and forces every new string to be translated in two places.

Instead, this project uses **runtime locale resolution**:

- One HTML file per page
- Every translatable element carries `data-i18n="some_key"`
- A single `translations.js` dictionary maps keys → strings for both `en` and `ar`
- A `mutations` walker replaces `textContent`, `placeholder`, and `option` content based on element type
- `document.documentElement` swaps both `lang` *and* `dir` in one pass

```js
document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
document.documentElement.setAttribute("lang", lang);
```

A `[dir="rtl"]` CSS selector then overrides the font stack — Cairo replaces Playfair Display for headings, and `font-family: 'Cairo', sans-serif` takes over for body copy.

The result: **one source of truth**, one URL per page, and a translator-friendly key-value dictionary they could eventually hand off to a CMS.

### 2. Counter Animations Done Right

A trivial implementation increments a number on a `setInterval`. That looks fine but doesn't pause, doesn't ease, and re-runs every time the element re-enters the viewport.

This version uses:

- `requestAnimationFrame` for paint-aligned updates
- A `progress = (timestamp - start) / duration` curve normalised to `[0, 1]`
- An **ease-out cubic** curve (`1 - Math.pow(1 - progress, 3)`) — the same curve CSS uses for `ease-out`
- An `IntersectionObserver` with `threshold: 0.1` so the counter only triggers when the hero is genuinely visible
- `observer.unobserve(entry.target)` to guarantee it never re-plays

```js
const easeProgress = 1 - Math.pow(1 - progress, 3);
const currentVal = Math.floor(easeProgress * target);
```

If `IntersectionObserver` isn't supported, the counter initialises immediately. **No JavaScript disabled state silently loses the counter** — it just runs once on load.

### 3. Design Tokens As A System, Not As Variables

The CSS has ~80 lines of `:root` declarations before any component rule. That was a deliberate decision. By having `--bg-primary`, `--color-gold`, `--border-glass`, and `--transition-smooth` defined centrally, swapping the entire palette from "dark gold" to "navy + silver" would be a one-file change.

This is the same approach used inside production design systems (Tailwind, Radix, Material Design tokens) — codified once, consumed everywhere.

### 4. RTL Without Component Reordering

A common mistake in bilingual UI is shipping separate CSS for RTL. That doubles the surface area and doubles the bug count.

Here, the only RTL-specific rule is:

```css
[dir="rtl"] {
  --font-heading: 'Cairo', sans-serif;
  --font-body: 'Cairo', sans-serif;
}
```

Everything else — flexbox, grid, logical properties (`margin-inline-start` instead of `margin-left`) — already mirrors correctly when the `dir` attribute changes. The browser does the work.

---

## What I Would Add Next

If this were a client engagement rather than a portfolio piece:

- A static-site generator (11ty or Astro) to pull shared partials (header, footer, nav) into one place
- Per-page Open Graph tags for rich link previews on LinkedIn / WhatsApp
- A 404 page that's on-brand rather than server-default
- `prefers-reduced-motion` checks on all animations
- Real `sitemap.xml` and `robots.txt` for SEO indexability

These are omitted here on purpose — the project demonstrates *what it claims to demonstrate* and doesn't sneak in features that would mislead a reviewer about scope.

---

## What This Project Tells A Reviewer

If you're a hiring manager or a technical reviewer, the things this code demonstrates:

- I read browser docs and use native APIs (`IntersectionObserver`, `URLSearchParams`, `requestAnimationFrame`)
- I think about content as data, not as markup
- I make design decisions defensible to non-engineers
- I can ship a real-looking product, not a Lorem Ipsum skeleton
- I write code where someone else can read it without my commentary

If you're a non-technical reviewer: the screenshots below show what it feels like to use.
