# SEO & Social Sharing Notes

This file documents the **would-be** Open Graph and meta enhancements if the site were deployed to a real domain. The HTML files were intentionally not modified — these are reference copy-paste snippets for whoever picks up the project next.

---

## Per-Page `<head>` Template

Paste this inside `<head>` of each `.html` file, replacing placeholders:

```html
<!-- Primary Meta -->
<title data-i18n="page_title">{PAGE_TITLE}</title>
<meta name="description" content="{PAGE_DESCRIPTION}">
<link rel="canonical" href="https://your-domain.com/{PAGE_SLUG}.html">

<!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Legal Protection Group">
<meta property="og:title" content="{PAGE_TITLE}">
<meta property="og:description" content="{PAGE_DESCRIPTION}">
<meta property="og:url" content="https://your-domain.com/{PAGE_SLUG}.html">
<meta property="og:image" content="https://your-domain.com/img/og-{PAGE_SLUG}.png">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="ar_EG">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{PAGE_TITLE}">
<meta name="twitter:description" content="{PAGE_DESCRIPTION}">
<meta name="twitter:image" content="https://your-domain.com/img/og-{PAGE_SLUG}.png">

<!-- Favicons -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
```

---

## Page-Specific Copy

| Page          | Title                                                            | Description                                                                                      |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `index`       | International Law Firm \| Legal Protection Group                 | An elite international law firm delivering tailored legal counsel with 30+ years of expertise.   |
| `about`       | About Our Firm \| Legal Protection Group                         | Learn how Legal Protection Group operates at the intersection of local knowledge and global standards. |
| `services`    | Our Practice Areas \| Legal Protection Group                     | Corporate, M&A, banking, arbitration, real estate — multi-jurisdictional legal solutions.      |
| `expertise`   | International Expertise \| Legal Protection Group                | Cross-border capability through a vetted network of premier partner firms in major financial hubs. |
| `contact`     | Connect With Us \| Legal Protection Group                        | Request a confidential consultation. HQ in El-Bagour, Menofia, Egypt.                            |

---

## Required Image Assets (Not Bundled)

These should be created before deploying to a real domain:

- `img/og-index.png` — 1200 × 630
- `img/og-about.png` — 1200 × 630
- `img/og-services.png` — 1200 × 630
- `img/og-expertise.png` — 1200 × 630
- `img/og-contact.png` — 1200 × 630
- `favicon.ico`
- `apple-touch-icon.png` — 180 × 180
- `manifest.json` + 192/512 PNG variants (optional PWA support)

---

## Indexability Checklist

- [ ] Add `robots.txt` allowing all crawlers and pointing to `sitemap.xml`
- [ ] Generate `sitemap.xml` listing all 5 pages with `<xhtml:link rel="alternate" hreflang="ar">` for Arabic versions
- [ ] Submit sitemap to Google Search Console and Bing Webmaster Tools
- [ ] Verify domain with both
- [ ] Add `Structured Data` (`LegalService` + `Attorney` schemas) inside `<script type="application/ld+json">` blocks
- [ ] Confirm OG image renders correctly using https://www.opengraph.xyz/

---

## Why This Wasn't Done In-Line

Per the project brief, **no existing source file was modified**. These additions are documented so the maintainer can apply them when transitioning from portfolio piece to live client site.
