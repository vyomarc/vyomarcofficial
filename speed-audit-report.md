# Comprehensive Website Page Speed & Performance Audit Report

**Date of Audit:** November 19, 2026  
**Audited Platform:** VYOMARC Technologies Official Web Platform (`vyomarctech.com`)  
**Audit Scope:** 13 key public pages across core landing, marketing, portfolio, tools hub, and blog post templates.

---

## 1. Executive Summary

- **Overall Platform Speed Health:** **MODERATE (Yellow)**  
  The platform benefits from clean static HTML generation and fast initial response times from static hosting. However, significant performance bottlenecks exist on mobile connections and lower-tier network environments due to unminified global stylesheets, an unoptimized global navbar logo, render-blocking stylesheets on specialized subpages, and redundant client-side libraries on pre-rendered articles.

### Top 3 Major Bottlenecks Across the Site:
1. **Unminified Global Stylesheet Overhead (161.4 KB):**  
   The primary global stylesheet (`css/style.css`) is completely unminified (8,174 lines with comments and formatting). It is loaded across all pages, and on tools and founder pages, it acts as a direct render-blocking resource in `<head>`, blocking First Contentful Paint (FCP).
2. **Global Logo Uncompressed PNG Asset (84.0 KB):**  
   The primary brand logo (`images/vyomarc-logo.png`) is an uncompressed 84 KB PNG file loaded eagerly with `fetchpriority="high"` in the navbar on every single page of the website. A 38x38px rendered logo should not exceed 3–5 KB.
3. **Redundant Client-Side Libraries & Multi-Font Stacks:**  
   Pre-rendered blog posts unconditionally load client-side Markdown rendering engines (`marked.umd.js`, 46 KB) and heavy diagram libraries (`mermaid.min.js`, ~250 KB minified / ~800 KB uncompressed) even when posts have already been converted to static HTML at build time. Additionally, the founder portfolio loads four distinct Google Font families (14 variant weights) on a single page.

---

## 2. Global Bottlenecks (Affecting All Pages)

### 2.1 CSS Size & Architecture
- **File:** `css/style.css`
- **Current Size:** **161.4 KB** (Unminified, 8,174 lines)
- **Estimated Minified Size:** **~105–110 KB** (32% reduction)
- **Estimated Gzip/Brotli Transfer Size:** **~22–26 KB**
- **Architecture Note:** The homepage uses an asynchronous deferral technique (`media="print" onload="this.media='all'"`), but secondary pages, tools, and the founder portfolio import the full 161.4 KB stylesheet directly via standard blocking `<link rel="stylesheet">` tags in `<head>`.

### 2.2 JavaScript Size & Execution
- **Root Script:** `script.js` (4.7 KB, unminified). Handles mobile menu toggles, modal dialogs, and smooth scrolling. Loaded with `defer` at the end of `<body>`.
- **Blog Scripts:** `blogs/post-script.js` (26.2 KB) + `blogs/script.js` (18.1 KB).
- **Execution Overhead:** JavaScript execution footprint is generally lightweight on marketing pages, but blog post pages incur parsing and execution penalties from external CDN scripts (`marked.umd.js` and `mermaid.min.js`).

### 2.3 Typography & Web Fonts
- **Google Fonts Implementation:** Preload hints (`rel="preload" as="style"`) with `display=swap` are implemented across marketing pages (Inter + Poppins).
- **Bottlenecks:**
  - `founder/index.html` loads four Google Font families simultaneously: *Dancing Script*, *Inter*, *JetBrains Mono*, and *Playfair Display* (14 weights total), generating massive external CSS font-face requests and delaying text rendering.
  - No self-hosted WOFF2 font files exist; the site relies on third-party Google Fonts domains (`fonts.googleapis.com` and `fonts.gstatic.com`), adding two DNS resolution round-trips.

### 2.4 Image Optimization & Formats
- **Hero & Content Images:** Modern WebP conversion is broadly used for marketing graphics (`hero-vyomarc.webp` at 34.5 KB, case study thumbnails at 50–100 KB).
- **Global Logo:** `images/vyomarc-logo.png` (84.0 KB) is loaded on 100% of pages without WebP/SVG alternatives.
- **Repository Bloat:** The repository contains orphaned uncompressed assets, including `images/saurabh-m-kumar-vyomarc.png` (1,198.4 KB / 1.2 MB) and `images/brand-identity-digital-marketing-bihar.png` (492.4 KB), which risk accidental high-cost imports.

---

## 3. Page-by-Page Audit Table

| # | Page Name | HTML Size | CSS / JS Loaded | Images Loaded | Render-Blocking Elements | LCP Risk | Key Issue Found |
|---|---|---|---|---|---|---|---|
| 1 | **Homepage** (`index.html`) | 133.9 KB | `style.css` (161 KB), `script.js` (4.7 KB), GTM | 15 images (13 WebP, 2 PNG) | None (CSS deferred via print media) | **Medium** | Heavy 134 KB static HTML payload; eager 84 KB PNG logo; unminified global CSS. |
| 2 | **About** (`about.html`) | 55.1 KB | `style.css` (161 KB), `script.js` (4.7 KB) | 2 images (1 WebP, 1 PNG) | `style.css` in `<head>` | **Low** | Full 161 KB stylesheet loaded for a simple text-heavy page; 84 KB PNG logo. |
| 3 | **Contact** (`contactus.html`) | 43.5 KB | `style.css` (161 KB), `script.js` (4.7 KB) | 1 image (1 PNG logo) | `style.css` in `<head>` | **Low** | 161 KB global CSS blocking initial paint for a lightweight contact form. |
| 4 | **Clients** (`clients.html`) | 30.4 KB | `style.css` (161 KB), `script.js` (4.7 KB) | 14 images (10 WebP, 4 PNG) | `style.css` in `<head>` | **Medium** | Client logos (`microsys-logo.png`, 66.1 KB) loaded uncompressed; 84 KB PNG logo. |
| 5 | **Founder Portfolio** (`founder/index.html`) | 47.7 KB | `style.css` (161 KB), `founder/style.css` (50.7 KB), `founder/script.js` (5.3 KB) | 5 images (1 WebP, 4 SVGs) | **2 Blocking CSS files (212 KB total)** + 4 Google Font families | **High** | 212 KB of cumulative render-blocking CSS; 4 font families with 14 variant weights. |
| 6 | **Tools Hub** (`tools/index.html`) | 20.1 KB | `style.css` (161 KB), `tools/style.css` (3.4 KB), `tools/script.js` (0.1 KB) | 1 image (84 KB PNG) | `style.css` (161 KB) in `<head>` | **Medium** | Loads entire 161 KB main site stylesheet unnecessarily for a 20 KB directory page. |
| 7 | **JustDial Scanner** (`tools/justdial-scanner/index.html`) | 31.2 KB | `style.css` (161 KB), `tool style.css` (12.9 KB), `script.js` (4.1 KB) | 1 image (84 KB PNG) | `style.css` (161 KB) in `<head>` | **Medium** | Tool only requires 13 KB styling, but downloads 161 KB global stylesheet first. |
| 8 | **WhatsApp Generator** (`tools/whatsapp-link-generator/index.html`) | 29.4 KB | `style.css` (161 KB), `tool style.css` (12.3 KB), `script.js` (4.5 KB) | 1 image (84 KB PNG) | `style.css` (161 KB) in `<head>` | **Medium** | Heavy global stylesheet blocks form paint; unoptimized navbar logo. |
| 9 | **Commission Calculator** (`tools/commission-calculator/index.html`) | 32.5 KB | `style.css` (161 KB), `tool style.css` (13.4 KB), `script.js` (4.8 KB) | 1 image (84 KB PNG) | `style.css` (161 KB) in `<head>` | **Medium** | 161 KB global CSS blocks calculator input interactive readiness. |
| 10 | **CGPA Converter** (`tools/cgpa-to-percentage-converter/index.html`) | 35.5 KB | `style.css` (161 KB), `tool style.css` (17.3 KB), `script.js` (11.4 KB) | 1 image (84 KB PNG) | `style.css` (161 KB) in `<head>` | **Medium** | 178 KB combined unminified CSS loaded before input fields render. |
| 11 | **Blog Hub** (`blogs/index.html`) | 19.3 KB | `style.css` (161 KB), `blog style.css` (25 KB), `script.js` (18 KB) | 1 image (84 KB PNG) | `style.css` (161 KB) + `blog style.css` (25 KB) in `<head>` | **Medium** | 186 KB of combined unminified stylesheets; dynamic client-side post loading. |
| 12 | **Sample Post: Microsys Case Study** (`blogs/posts/microsys-case-study.html`) | 42.8 KB | `style.css` (161 KB), `blog style.css` (25 KB), `marked.umd.js` (46 KB), `post-script.js` (26 KB) | 10 images (WebP thumbnails + external badge SVGs) | `style.css` + `blog style.css` (186 KB total) in `<head>` | **Medium** | Redundant 46 KB `marked.umd.js` on pre-rendered static HTML; external badge SVGs lack width/height. |
| 13 | **Sample Post: Restaurant WhatsApp** (`blogs/posts/restaurant-whatsapp-ordering-bihar-sharif.html`) | 49.6 KB | `style.css` (161 KB), `blog style.css` (25 KB), `marked.umd.js` (46 KB), `mermaid.min.js` (~250 KB minified), `post-script.js` (26 KB) | 8 images (WebP thumbnails + external badge SVGs) | `style.css` + `blog style.css` (186 KB total) in `<head>` | **High** | Heavy CDN `mermaid.min.js` (~250 KB) loaded in `<head>`; 106.6 KB WebP hero image. |

---

## 4. Specific Issues Found (Detailed Breakdown)

### 4.1 Image Bloat & Format Deficiencies
1. **`images/vyomarc-logo.png` (84.0 KB):**
   - **Issue:** Used as the primary brand emblem across every header and footer. Being rendered at 38x38px, an 84 KB PNG represents an approximate 20x data overhead.
   - **Impact:** ~80 KB of unnecessary transfer on 100% of unique page visits.
   - **Solution:** Convert to SVG (< 4 KB) or WebP (< 5 KB).
2. **`images/clients/microsys-logo.png` (66.1 KB):**
   - **Issue:** Loaded 3 times on `clients.html` as badge and pill icons at small dimensions.
   - **Solution:** Convert to compressed WebP or SVG format (< 8 KB).
3. **External Shields.io Badges Missing Dimensions:**
   - **Issue:** Blog posts embed badge shields (`https://img.shields.io/badge/...`) without explicit `width` and `height` attributes.
   - **Impact:** Cumulative Layout Shift (CLS) as badges load and expand text blocks dynamically.
4. **Orphaned Large Assets in `images/` Directory:**
   - `images/saurabh-m-kumar-vyomarc.png`: **1,198.4 KB (1.2 MB)**.
   - `images/brand-identity-digital-marketing-bihar.png`: **492.4 KB**.
   - These raw files remain on the web server storage and risk accidental referencing.

### 4.2 Render-Blocking Assets in `<head>`
1. **Direct Blocking Stylesheets on Tools and Subpages:**
   - While `index.html` leverages non-blocking deferred CSS loading (`media="print" onload="this.media='all'"`), all subpages in `tools/`, `founder/`, and `blogs/` use direct blocking `<link rel="stylesheet">` tags in `<head>`.
   - On `founder/index.html`, this blocks initial paint by loading **212 KB** of uncompressed CSS (`/css/style.css` + `founder/style.css`).
2. **CDN Scripts in Blog Post Templates:**
   - `blogs/posts/*.html` templates import `https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js` (46 KB) and `https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js` (approx. 250 KB gzip, 800 KB uncompressed).
   - Even though articles are already statically pre-rendered to HTML at build time, `marked.umd.js` is still downloaded by the browser on every post view.

### 4.3 Typography & Multi-Family Font Loading
1. **Founder Page Font Loading Penalty:**
   - The founder page references:
     - `Dancing Script` (weights 600, 700)
     - `Inter` (weights 300, 400, 500, 600, 700)
     - `JetBrains Mono` (weights 400, 500, 600)
     - `Playfair Display` (weights 400, 600, italic 400, italic 600)
   - Totaling **14 font variants** across 4 distinct typeface families on a single landing page.

---

## 5. Actionable Recommendations (Prioritized Plan)

### Priority 1: High Impact (Immediate Performance Boost)
1. **Compress & Convert Global Logo (`vyomarc-logo.png`):**
   - Replace the 84 KB PNG logo in the navigation header across all pages with an optimized SVG or WebP version (target size: < 5 KB).
   - *Impact:* Saves ~80 KB per page load across all 13+ pages for every first-time visitor.
2. **Minify Global Stylesheets (`style.css`):**
   - Run a CSS minification pass on `css/style.css` (reducing from 161.4 KB to ~105 KB) and `founder/style.css` (reducing from 50.7 KB to ~35 KB).
   - Apply minified output with version hashes (`style.min.css?v=12`).
   - *Impact:* Reduces render-blocking payload by 30–35% across the entire website.
3. **Remove Redundant `marked.umd.js` from Static Blog Post Templates:**
   - Since `blogs/build/prerender.js` already compiles Markdown into static HTML during build, remove the client-side `marked.umd.js` script tag from pre-rendered blog HTML.
   - Keep dynamic Markdown fetching only on `blogs/post.html` fallback.
   - *Impact:* Instantly cuts 46.1 KB of third-party script execution from every blog post.

### Priority 2: Medium Impact (Next Phase Optimizations)
1. **Modularize Tool Stylesheets (Isolate Tool CSS):**
   - Tool pages (`tools/*`) currently load the entire 161 KB global marketing stylesheet to render basic navigation and forms.
   - Extract shared navigation/footer styles into a compact `base.css` (~18 KB), allowing tools to load only `base.css` + their local tool stylesheet (~30 KB total instead of 178 KB).
   - *Impact:* Accelerates Tool First Contentful Paint (FCP) and Time to Interactive (TTI) by up to 60% on mobile devices.
2. **Streamline Founder Portfolio Typography:**
   - Reduce the founder page typography stack from 4 font families (14 variants) down to 2 font families (e.g., *Inter* for body and *Playfair Display* for headlines with 3–4 essential weights).
   - *Impact:* Eliminates 10 unnecessary web font network requests and prevents layout shifting during font swap.
3. **Pre-render Mermaid Diagrams at Build Time:**
   - In `blogs/build/prerender.js`, compile Mermaid diagram code blocks into static inline SVGs during the build step using `@mermaid-js/mermaid-cli` or server-side rendering.
   - Remove the client-side `mermaid.min.js` (~250 KB) script completely from the client runtime.
   - *Impact:* Eliminates the heaviest script on the blog, cutting post load weight by over 50%.

### Priority 3: Low Impact (Housekeeping & Fine-Tuning)
1. **Remove Orphaned High-Resolution PNG Assets:**
   - Delete or archive `images/saurabh-m-kumar-vyomarc.png` (1.2 MB) and `images/brand-identity-digital-marketing-bihar.png` (492 KB) from production directories to avoid accidental imports.
2. **Add Explicit Width & Height Attributes to Shields.io Badges:**
   - Add explicit dimensions (`width="160" height="28"`) to external SVG badges in blog posts to completely eradicate badge-induced Cumulative Layout Shift (CLS).
3. **Self-Host Core Web Fonts:**
   - Download subsetted WOFF2 files for *Inter* and *Poppins* and serve them directly from `/fonts/` with immutable caching headers, eliminating external connection overhead to Google Fonts servers.
