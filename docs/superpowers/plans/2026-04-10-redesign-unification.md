# Internacional Freeband - Redesign & Unification Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify freeband-nextjs and freeband-portfolio into a single Next.js 16 app with a redesigned landing page (luxury+energy), public portfolio PDF, improved orcamento PDF, and Vercel deployment.

**Architecture:** Single Next.js app with three routes: landing page (`/`), public portfolio PDF viewer (`/portfolio`), and token-protected orcamento (`/orcamento/[token]`). Landing page uses Tailwind-only styling. PDFs generated client-side with `@react-pdf/renderer`. All content sourced from a unified `data/content.ts`.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, @react-pdf/renderer (client-side), TypeScript (strict), Vitest

---

## File Map

### New files to create

- `src/components/layout/Footer.tsx` — extracted footer component
- `src/components/pdf/portfolio/PortfolioDocument.tsx` — React-PDF Document root
- `src/components/pdf/portfolio/PdfCover.tsx` — PDF cover page
- `src/components/pdf/portfolio/PdfAbout.tsx` — PDF about page
- `src/components/pdf/portfolio/PdfTimeline.tsx` — PDF timeline page
- `src/components/pdf/portfolio/PdfPartners.tsx` — PDF partners page
- `src/components/pdf/portfolio/PdfGallery.tsx` — PDF gallery page
- `src/components/pdf/portfolio/PdfServices.tsx` — PDF services page
- `src/components/pdf/portfolio/PdfContact.tsx` — PDF contact page
- `src/components/pdf/portfolio/pdfTheme.ts` — PDF theme (colors, fonts, base styles)
- `src/components/pdf/portfolio/pdfImages.ts` — PDF image loader (base64 data URIs)
- `src/components/pdf/orcamento/OrcamentoPdf.tsx` — React-PDF Document for orcamento
- `src/app/portfolio/page.tsx` — portfolio route
- `scripts/convert-video.sh` — ffmpeg video conversion script
- `scripts/optimize-new-images.sh` — optimize new images from BURU root
- `src/__tests__/lib/format.test.ts` — tests for format utilities
- `src/__tests__/lib/token.test.ts` — tests for token validation
- `vitest.config.ts` — vitest configuration

### Files to modify

- `package.json` — add @react-pdf/renderer, @react-pdf/font, vitest, @testing-library/react
- `src/app/globals.css` — update Tailwind theme, add background change
- `src/data/content.ts` — add new images content, unify with portfolio data
- `src/data/images.ts` — add new images
- `src/components/NavBar.tsx` → move to `src/components/layout/NavBar.tsx`, convert to Tailwind
- `src/components/ui/SectionTitle.tsx` — convert to Tailwind
- `src/components/sections/Hero.tsx` — redesign with video + Tailwind
- `src/components/sections/Sobre.tsx` — convert to Tailwind
- `src/components/sections/Historia.tsx` — convert to Tailwind
- `src/components/sections/Galeria.tsx` — Tailwind-only + add new images
- `src/components/sections/Artistas.tsx` — convert to Tailwind
- `src/components/sections/Servicos.tsx` — convert to Tailwind
- `src/components/sections/Parceiros.tsx` — convert to Tailwind
- `src/components/sections/Contato.tsx` — convert to Tailwind
- `src/components/orcamento/OrcamentoForm.tsx` — convert to Tailwind
- `src/components/orcamento/OrcamentoPreview.tsx` — convert to Tailwind, add PDF generation
- `src/components/orcamento/OrcamentoPage.tsx` — convert to Tailwind
- `src/components/orcamento/PrintLayout.tsx` — convert to Tailwind
- `src/app/page.tsx` — extract footer, update imports
- `src/app/layout.tsx` — no changes needed (already clean)

### Files to delete (after migration)

- None in freeband-nextjs (all files are modified in-place)
- freeband-portfolio stays as-is (separate repo, not deleted)

---

## Task 1: Project Setup & Dependencies

**Files:**

- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install new dependencies**

```bash
cd C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs
npm install @react-pdf/renderer @react-pdf/font
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Create vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Add test script to package.json**

Add to `scripts` in `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify setup**

Run: `npx vitest --version`
Expected: version number prints without error

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "feat: add @react-pdf/renderer and vitest dependencies"
```

---

## Task 2: Image Pipeline - Add New Photos

**Files:**

- Create: `scripts/optimize-new-images.sh`
- Modify: `src/data/images.ts`

New images from BURU root that are NOT duplicates of existing ones:

- `FESTA (209).jpg.jpeg` → `festa-209.jpeg`
- `FESTA (308).jpg.jpeg` → `festa-308.jpeg`
- `469156391_...n.jpg.jpeg` → `freeband-social.jpeg`
- `barra bonita.jpg.jpeg` → `barra-bonita.jpeg`
- `freeband antidas 1.jpg.jpeg` → `freeband-antidas.jpeg`
- `freeeband jau.jfif.jpeg` → `freeband-jau.jpeg`
- `reveillom paranapanema.jpg.jpeg` → `reveillom-paranapanema.jpeg`

- [ ] **Step 1: Copy and rename new images**

```bash
cd "C:/Users/anton/OneDrive/Desktop/BURU"
cp "FESTA (209).jpg.jpeg" freeband-nextjs/public/images/festa-209.jpeg
cp "FESTA (308).jpg.jpeg" freeband-nextjs/public/images/festa-308.jpeg
cp "469156391_1024710869670915_255012385516147038_n.jpg.jpeg" freeband-nextjs/public/images/freeband-social.jpeg
cp "barra bonita.jpg.jpeg" freeband-nextjs/public/images/barra-bonita.jpeg
cp "freeband antidas 1.jpg.jpeg" freeband-nextjs/public/images/freeband-antidas.jpeg
cp "freeeband jau.jfif.jpeg" freeband-nextjs/public/images/freeband-jau.jpeg
cp "reveillom paranapanema.jpg.jpeg" freeband-nextjs/public/images/reveillom-paranapanema.jpeg
```

- [ ] **Step 2: Update `src/data/images.ts` with all images**

Replace entire file:

```typescript
// src/data/images.ts
export const images = {
  festa55: "/images/festa-55.jpeg",
  festa70: "/images/festa-70.jpeg",
  festa82: "/images/festa-82.jpeg",
  festa209: "/images/festa-209.jpeg",
  festa308: "/images/festa-308.jpeg",
  anos70: "/images/freeband-anos-70.jpeg",
  anos90: "/images/freeband-anos-90.jpeg",
  antigas: "/images/freeband-antigas.jpeg",
  antidas: "/images/freeband-antidas.jpeg",
  fb2015: "/images/freeband-2015.jpeg",
  fbJau: "/images/freeband-jau.jpeg",
  fbSocial: "/images/freeband-social.jpeg",
  img0437: "/images/img-0437.jpeg",
  img0679: "/images/img-0679.jpeg",
  img0690: "/images/img-0690.jpeg",
  img0867: "/images/img-0867.jpeg",
  joao: "/images/joao.jpeg",
  baileTabatinga: "/images/baile-tabatinga.jpeg",
  barraBonita: "/images/barra-bonita.jpeg",
  reveillomIacanga: "/images/reveillom-iacanga.jpeg",
  reveillomItatinga: "/images/reveillom-itatinga.jpeg",
  reveillomParanapanema: "/images/reveillom-paranapanema.jpeg",
  nauticoAraraquara: "/images/nautico-araraquara.jpeg",
  cartazCosmopolitano: "/images/cartaz-cosmopolitano.jpeg",
} as const;

export const galleryImages = [
  { src: images.festa55, alt: "Show Freeband" },
  { src: images.festa70, alt: "Show com dançarinas" },
  { src: images.festa82, alt: "Show especial" },
  { src: images.festa209, alt: "Apresentação ao vivo" },
  { src: images.festa308, alt: "Performance no palco" },
  { src: images.img0437, alt: "Apresentação ao vivo" },
  { src: images.img0679, alt: "Performance" },
  { src: images.img0867, alt: "Show noturno" },
  { src: images.img0690, alt: "Palco" },
  { src: images.joao, alt: "Músico" },
  { src: images.baileTabatinga, alt: "Baile Tabatinga" },
  { src: images.barraBonita, alt: "Barra Bonita" },
  { src: images.reveillomIacanga, alt: "Reveillon Iacanga" },
  { src: images.reveillomItatinga, alt: "Reveillon Itatinga" },
  { src: images.reveillomParanapanema, alt: "Reveillon Paranapanema" },
  { src: images.nauticoAraraquara, alt: "Clube Náutico Araraquara" },
  { src: images.fbSocial, alt: "Internacional Freeband" },
  { src: images.fbJau, alt: "Freeband em Jaú" },
  { src: images.freeband - antidas, alt: "Freeband vintage" },
];
```

Note: Fix the key `freeband-antidas` to `antidas` in the galleryImages array:

```typescript
  { src: images.antidas, alt: "Freeband vintage" },
```

- [ ] **Step 3: Verify images are accessible**

Run: `ls -la C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs/public/images/ | wc -l`
Expected: 24+ files

- [ ] **Step 4: Commit**

```bash
cd C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs
git add public/images/ src/data/images.ts
git commit -m "feat: add all gallery images from portfolio and root directory"
```

---

## Task 3: Video Pipeline

**Files:**

- Create: `scripts/convert-video.sh`
- Source video: `C:/Users/anton/OneDrive/Desktop/BURU/20251019080704.m2ts`

- [ ] **Step 1: Check ffmpeg availability**

```bash
ffmpeg -version 2>/dev/null || echo "ffmpeg not installed"
```

If ffmpeg is not installed, install via: `winget install ffmpeg` or download from https://ffmpeg.org/download.html

- [ ] **Step 2: Create video conversion script**

Create `scripts/convert-video.sh`:

```bash
#!/bin/bash
# Convert .m2ts to web-optimized .mp4 for hero section
set -e

INPUT="../../20251019080704.m2ts"
OUTPUT="../public/video/hero.mp4"
POSTER="../public/video/hero-poster.jpeg"

mkdir -p "$(dirname "$OUTPUT")"

echo "Converting video to web-optimized mp4..."
ffmpeg -i "$INPUT" \
  -vcodec libx264 \
  -crf 28 \
  -preset medium \
  -vf "scale=1280:-2" \
  -an \
  -movflags +faststart \
  -y "$OUTPUT"

echo "Extracting poster frame..."
ffmpeg -i "$OUTPUT" \
  -vframes 1 \
  -q:v 2 \
  -y "$POSTER"

echo "Done!"
ls -lh "$OUTPUT" "$POSTER"
```

- [ ] **Step 3: Run conversion**

```bash
cd C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs/scripts
bash convert-video.sh
```

Expected: `public/video/hero.mp4` (~5-10MB) and `public/video/hero-poster.jpeg`

- [ ] **Step 4: Commit**

```bash
cd C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs
git add scripts/convert-video.sh public/video/
git commit -m "feat: add hero video converted from m2ts source"
```

---

## Task 4: Tailwind Theme & Global Styles

**Files:**

- Modify: `src/app/globals.css`

- [ ] **Step 1: Update globals.css with full theme**

Replace entire `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0a;
  --color-bg-2: #111111;
  --color-bg-card: #1a1a1a;
  --color-gold: #c9a84c;
  --color-gold-light: #e8cc7a;
  --color-white: #ffffff;
  --color-text-2: #9ca3af;
  --color-border: #1f1f1f;
  --color-green-wa: #25d366;

  --font-display: "Playfair Display", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-white);
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

@keyframes bounce-arrow {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}
```

- [ ] **Step 2: Verify dev server starts**

```bash
cd C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs
npm run dev
```

Expected: compiles without errors. Check http://localhost:3000 loads.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: update Tailwind theme with full design tokens"
```

---

## Task 5: Utility Components - Tailwind Conversion

**Files:**

- Modify: `src/components/ui/SectionTitle.tsx`

- [ ] **Step 1: Convert SectionTitle to Tailwind**

Replace entire `src/components/ui/SectionTitle.tsx`:

```tsx
interface SectionTitleProps {
  children: React.ReactNode;
  light?: boolean;
}

export function SectionTitle({ children, light = false }: SectionTitleProps) {
  return (
    <div className="mb-10">
      <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3rem)] font-bold text-white uppercase tracking-wider leading-tight">
        {children}
      </h2>
      <div className={`w-20 h-1 mt-3 ${light ? "bg-gold-light" : "bg-gold"}`} />
    </div>
  );
}
```

- [ ] **Step 2: Verify rendering**

Run dev server, check that section titles render correctly on the page.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/SectionTitle.tsx
git commit -m "refactor: convert SectionTitle to Tailwind"
```

---

## Task 6: Layout - NavBar Tailwind Conversion

**Files:**

- Modify: `src/components/NavBar.tsx` (move to `src/components/layout/NavBar.tsx`)

- [ ] **Step 1: Create layout directory and move NavBar**

```bash
mkdir -p C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs/src/components/layout
mv C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs/src/components/NavBar.tsx C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs/src/components/layout/NavBar.tsx
```

- [ ] **Step 2: Rewrite NavBar with Tailwind**

Replace entire `src/components/layout/NavBar.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Sobre", href: "#sobre" },
  { label: "História", href: "#historia" },
  { label: "Galeria", href: "#galeria" },
  { label: "Serviços", href: "#servicos" },
  { label: "Contato", href: "#contato" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(13,13,13,0.95)] backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="no-underline">
          <span className="font-[family-name:var(--font-display)] text-lg text-gold font-bold tracking-wider">
            Internacional Freeband
          </span>
        </a>

        <nav className="hidden md:flex gap-8 items-center">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-text-2 no-underline text-sm tracking-widest uppercase hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contato"
            className="bg-gold text-[#0D0D0D] px-5 py-2 text-xs font-bold tracking-widest uppercase no-underline hover:bg-gold-light transition-colors"
          >
            Agendar
          </a>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden bg-transparent border-none cursor-pointer text-white text-2xl"
          aria-label="Menu"
        >
          {open ? "\u2715" : "\u2630"}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[rgba(13,13,13,0.98)] px-6 pb-6 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-white no-underline text-base tracking-wider"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="bg-gold text-[#0D0D0D] py-3 px-5 font-bold text-center no-underline tracking-widest uppercase"
          >
            Agendar Show
          </a>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: Update import in page.tsx**

In `src/app/page.tsx`, change:

```typescript
import { NavBar } from "@/components/NavBar";
```

to:

```typescript
import { NavBar } from "@/components/layout/NavBar";
```

- [ ] **Step 4: Verify**

Run dev server, check NavBar renders, responsive menu works on mobile.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/NavBar.tsx src/app/page.tsx
git rm src/components/NavBar.tsx 2>/dev/null || true
git commit -m "refactor: move NavBar to layout/ and convert to Tailwind"
```

---

## Task 7: Layout - Extract Footer

**Files:**

- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Footer component**

Create `src/components/layout/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="bg-black border-t border-border py-8 text-center">
      <p className="text-text-2 text-sm">
        &copy; {new Date().getFullYear()} Internacional Freeband. Todos os
        direitos reservados.
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Update page.tsx**

Replace entire `src/app/page.tsx`:

```tsx
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { Historia } from "@/components/sections/Historia";
import { Galeria } from "@/components/sections/Galeria";
import { Artistas } from "@/components/sections/Artistas";
import { Servicos } from "@/components/sections/Servicos";
import { Parceiros } from "@/components/sections/Parceiros";
import { Contato } from "@/components/sections/Contato";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <Sobre />
        <Historia />
        <Galeria />
        <Artistas />
        <Servicos />
        <Parceiros />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
```

Note: The section components still use old styling at this point. They will be converted in subsequent tasks. Imports will need updating as default exports are changed to named exports.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx src/app/page.tsx
git commit -m "refactor: extract Footer to its own component"
```

---

## Task 8: Section - Hero with Video

**Files:**

- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Rewrite Hero with video and Tailwind**

Replace entire `src/components/sections/Hero.tsx`:

```tsx
import { bandInfo } from "@/data/content";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/video/hero-poster.jpeg"
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.2)] via-[rgba(10,10,10,0.6)] to-bg" />

      <div className="relative z-10 text-center px-6 max-w-[900px]">
        <div className="inline-block border border-gold text-gold text-xs font-bold tracking-[0.2em] uppercase px-5 py-1.5 mb-8">
          Desde 1969
        </div>

        <h1 className="font-[family-name:var(--font-display)] font-bold leading-none mb-6">
          <span className="block text-[clamp(2.5rem,8vw,5rem)] text-white tracking-wider uppercase">
            Internacional
          </span>
          <span className="block text-[clamp(3rem,10vw,6.5rem)] text-gold tracking-wide uppercase">
            Freeband
          </span>
        </h1>

        <p className="text-text-2 text-[clamp(0.9rem,2vw,1.1rem)] tracking-widest uppercase mb-10">
          {bandInfo.tagline}
        </p>

        <a
          href="#contato"
          className="inline-block bg-gold text-[#0D0D0D] px-10 py-4 font-bold text-sm tracking-[0.15em] uppercase no-underline hover:bg-gold-light transition-colors"
        >
          Agendar Show
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold text-2xl animate-[bounce-arrow_2s_infinite]">
        &#8595;
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run dev server. Hero should show video background (or poster if video not yet converted). Check that gradient overlay, text, and CTA render correctly.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: redesign Hero with video background and Tailwind"
```

---

## Task 9: Section - Sobre

**Files:**

- Modify: `src/components/sections/Sobre.tsx`

- [ ] **Step 1: Rewrite Sobre with Tailwind**

Replace entire `src/components/sections/Sobre.tsx`:

```tsx
import Image from "next/image";
import { release } from "@/data/content";
import { images } from "@/data/images";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Sobre() {
  return (
    <section id="sobre" className="py-20 px-6 lg:px-20 bg-bg">
      <div className="max-w-7xl mx-auto">
        <SectionTitle>Quem Somos</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-[60%_38%] gap-12 mb-12">
          <div>
            {release.full.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="text-text-2 text-lg leading-relaxed mb-5 text-justify"
              >
                {para}
              </p>
            ))}
          </div>

          <div className="relative min-h-[350px]">
            <Image
              src={images.anos70}
              alt="Freeband anos 70"
              fill
              className="object-cover grayscale contrast-110 border-2 border-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
          {release.highlights.map((h, i) => (
            <div key={i} className="bg-bg-card p-8 text-center">
              <div className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,3.5rem)] font-bold text-gold leading-none mb-2">
                {h.value}
              </div>
              <div className="text-xs text-text-2 uppercase tracking-[0.12em] font-semibold">
                {h.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Check Sobre section renders: text paragraphs, image with grayscale filter, stat cards.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Sobre.tsx
git commit -m "refactor: convert Sobre to Tailwind"
```

---

## Task 10: Section - Historia

**Files:**

- Modify: `src/components/sections/Historia.tsx`

- [ ] **Step 1: Rewrite Historia with Tailwind**

Replace entire `src/components/sections/Historia.tsx`:

```tsx
import Image from "next/image";
import { timeline } from "@/data/content";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Historia() {
  return (
    <section id="historia" className="py-20 px-6 lg:px-20 bg-bg-2">
      <div className="max-w-[900px] mx-auto">
        <SectionTitle>Nossa História</SectionTitle>

        <div className="relative">
          <div className="absolute left-[15px] top-5 bottom-5 w-0.5 bg-border" />

          {timeline.map((item, index) => (
            <div
              key={index}
              className={`flex gap-8 relative ${
                index < timeline.length - 1 ? "mb-10" : ""
              }`}
            >
              <div className="shrink-0 pt-1">
                <div className="w-8 h-8 bg-gold relative z-10" />
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-[55%_40%] gap-4 items-start">
                <div>
                  <div className="inline-block bg-gold text-[#0D0D0D] text-xs font-bold tracking-widest px-3 py-1 mb-3">
                    {item.year}
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-white uppercase tracking-wider mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-2 text-[0.95rem] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="relative h-[180px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover border-2 border-gold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Check timeline renders with gold markers, year badges, images.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Historia.tsx
git commit -m "refactor: convert Historia to Tailwind"
```

---

## Task 11: Section - Galeria

**Files:**

- Modify: `src/components/sections/Galeria.tsx`

- [ ] **Step 1: Rewrite Galeria with Tailwind and all images**

Replace entire `src/components/sections/Galeria.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { galleryImages } from "@/data/images";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Galeria() {
  const [index, setIndex] = useState(-1);

  const slides = galleryImages.map((img) => ({ src: img.src }));

  return (
    <section id="galeria" className="py-20 px-6 lg:px-20 bg-bg">
      <div className="max-w-7xl mx-auto">
        <SectionTitle>Galeria Visual</SectionTitle>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={img.src}
              className="relative mb-4 overflow-hidden cursor-pointer group break-inside-avoid"
              onClick={() => setIndex(i)}
            >
              <div
                className="relative w-full"
                style={{
                  paddingBottom:
                    i % 3 === 0 ? "75%" : i % 3 === 1 ? "120%" : "100%",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-[rgba(201,168,76,0.25)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          index={index}
          slides={slides}
        />
      </div>
    </section>
  );
}
```

Note: The `paddingBottom` for aspect ratio variation still uses inline style because the values are computed dynamically. This is acceptable for dynamic values.

- [ ] **Step 2: Verify**

Check gallery renders all images in masonry layout. Click to open lightbox.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Galeria.tsx
git commit -m "refactor: convert Galeria to Tailwind with all photos"
```

---

## Task 12: Section - Artistas

**Files:**

- Modify: `src/components/sections/Artistas.tsx`

- [ ] **Step 1: Rewrite Artistas with Tailwind**

Replace entire `src/components/sections/Artistas.tsx`:

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import { artists } from "@/data/content";

export function Artistas() {
  const half = Math.ceil(artists.length / 2);
  const col1 = artists.slice(0, half);
  const col2 = artists.slice(half);

  return (
    <section id="artistas" className="py-20 px-6 lg:px-20 bg-bg-2">
      <div className="max-w-7xl mx-auto">
        <SectionTitle>Já tocamos ao lado de</SectionTitle>

        <div className="flex mt-12">
          <div className="flex-1 flex flex-col gap-4">
            {col1.map((artist) => (
              <div key={artist} className="flex items-center gap-3">
                <span className="text-gold font-bold">&#10095;</span>
                <span className="text-lg text-white">{artist}</span>
              </div>
            ))}
          </div>

          <div className="w-px bg-gold mx-8 opacity-40" />

          <div className="flex-1 flex flex-col gap-4">
            {col2.map((artist) => (
              <div key={artist} className="flex items-center gap-3">
                <span className="text-gold font-bold">&#10095;</span>
                <span className="text-lg text-white">{artist}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Artistas.tsx
git commit -m "refactor: convert Artistas to Tailwind with named export"
```

---

## Task 13: Section - Servicos

**Files:**

- Modify: `src/components/sections/Servicos.tsx`

- [ ] **Step 1: Rewrite Servicos with Tailwind**

Replace entire `src/components/sections/Servicos.tsx`:

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import { services, serviceIncludes } from "@/data/content";

export function Servicos() {
  return (
    <section id="servicos" className="py-20 px-6 lg:px-20 bg-bg">
      <div className="max-w-7xl mx-auto">
        <SectionTitle>Nossos Serviços</SectionTitle>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="p-8 bg-bg-card border border-border border-b-[3px] border-b-gold transition-all duration-300"
            >
              <div className="text-4xl text-gold mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-3">
                {service.title}
              </h3>
              <p className="text-text-2 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gold text-center uppercase tracking-widest mb-8">
            Incluso em todos os eventos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {serviceIncludes.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-xl text-gold mt-0.5 shrink-0">
                  &#10003;
                </span>
                <span className="text-white leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Servicos.tsx
git commit -m "refactor: convert Servicos to Tailwind with named export"
```

---

## Task 14: Section - Parceiros

**Files:**

- Modify: `src/components/sections/Parceiros.tsx`

- [ ] **Step 1: Rewrite Parceiros with Tailwind**

Replace entire `src/components/sections/Parceiros.tsx`:

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import { partners } from "@/data/content";

export function Parceiros() {
  return (
    <section id="parceiros" className="py-20 px-6 lg:px-20 bg-bg-2">
      <div className="max-w-7xl mx-auto">
        <SectionTitle>Nossos Parceiros</SectionTitle>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {partners.map((partner, i) => (
            <div key={partner} className="flex items-center gap-4">
              <span className="text-lg font-medium text-white tracking-wide text-center">
                {partner}
              </span>
              {i < partners.length - 1 && (
                <span className="text-2xl font-thin text-gold">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Parceiros.tsx
git commit -m "refactor: convert Parceiros to Tailwind with named export"
```

---

## Task 15: Section - Contato

**Files:**

- Modify: `src/components/sections/Contato.tsx`

- [ ] **Step 1: Rewrite Contato with Tailwind**

Replace entire `src/components/sections/Contato.tsx`:

```tsx
import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { contact } from "@/data/content";
import { images } from "@/data/images";

export function Contato() {
  return (
    <section
      id="contato"
      className="relative overflow-hidden min-h-[70vh] flex items-center"
    >
      <Image
        src={images.festa82}
        alt="Show Internacional Freeband"
        fill
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.6)] to-[rgba(0,0,0,0.85)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center w-full">
        <SectionTitle>
          Vamos criar uma experiência inesquecível juntos
        </SectionTitle>

        <a
          href={contact.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 mt-10 px-10 py-5 text-xl font-bold rounded-full bg-green-wa text-white shadow-[0_8px_32px_rgba(37,211,102,0.35)] transition-transform duration-300 hover:scale-105"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Agendar via WhatsApp
        </a>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-lg">
          <span className="text-text-2">{contact.phone}</span>
          <span className="text-gold opacity-50">|</span>
          <a
            href={`mailto:${contact.email}`}
            className="text-text-2 hover:text-white transition-colors"
          >
            {contact.email}
          </a>
          <span className="text-gold opacity-50">|</span>
          <span className="text-text-2">{contact.city}</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Contato.tsx
git commit -m "refactor: convert Contato to Tailwind with named export"
```

---

## Task 16: Update page.tsx Imports

**Files:**

- Modify: `src/app/page.tsx`

All section components are now named exports. Update page.tsx imports.

- [ ] **Step 1: Update imports in page.tsx**

The page.tsx was already updated in Task 7 with named imports. Verify all sections use named exports now. The imports should be:

```tsx
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { Historia } from "@/components/sections/Historia";
import { Galeria } from "@/components/sections/Galeria";
import { Artistas } from "@/components/sections/Artistas";
import { Servicos } from "@/components/sections/Servicos";
import { Parceiros } from "@/components/sections/Parceiros";
import { Contato } from "@/components/sections/Contato";
```

- [ ] **Step 2: Verify full landing page**

```bash
cd C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs
npm run dev
```

Check all 8 sections render at http://localhost:3000 with no inline styles.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: update page imports for named exports"
```

---

## Task 17: Tests - Utility Functions

**Files:**

- Create: `src/__tests__/lib/format.test.ts`
- Create: `src/__tests__/lib/token.test.ts`

- [ ] **Step 1: Write format utility tests**

Create `src/__tests__/lib/format.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  calcEntrada,
  calcSaldo,
} from "@/lib/format";

describe("formatCurrency", () => {
  it("should format valid currency string", () => {
    const result = formatCurrency("150000");
    expect(result).toBe("R$\u00a01.500,00");
  });

  it("should return placeholder for empty input", () => {
    expect(formatCurrency("")).toBe("R$ —");
  });

  it("should return placeholder for non-numeric input", () => {
    expect(formatCurrency("abc")).toBe("R$ —");
  });
});

describe("formatDate", () => {
  it("should format YYYY-MM-DD to DD/MM/YYYY", () => {
    expect(formatDate("2026-03-15")).toBe("15/03/2026");
  });

  it("should return dash for empty input", () => {
    expect(formatDate("")).toBe("—");
  });
});

describe("calcEntrada", () => {
  it("should calculate entrance value from total and percentage", () => {
    const result = calcEntrada("1000000", "50");
    expect(result).toBe("R$\u00a05.000,00");
  });

  it("should return placeholder for invalid inputs", () => {
    expect(calcEntrada("", "50")).toBe("R$ —");
    expect(calcEntrada("1000", "")).toBe("R$ —");
  });
});

describe("calcSaldo", () => {
  it("should calculate remaining balance", () => {
    const result = calcSaldo("1000000", "50");
    expect(result).toBe("R$\u00a05.000,00");
  });

  it("should return placeholder for invalid inputs", () => {
    expect(calcSaldo("", "50")).toBe("R$ —");
  });
});
```

- [ ] **Step 2: Write token utility tests**

Create `src/__tests__/lib/token.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { validateToken } from "@/lib/token";

describe("validateToken", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return true for matching token", () => {
    process.env.ORCAMENTO_TOKEN = "secret123";
    expect(validateToken("secret123")).toBe(true);
  });

  it("should return false for wrong token", () => {
    process.env.ORCAMENTO_TOKEN = "secret123";
    expect(validateToken("wrong")).toBe(false);
  });

  it("should return false when env var is not set", () => {
    delete process.env.ORCAMENTO_TOKEN;
    expect(validateToken("anything")).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
cd C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/
git commit -m "test: add unit tests for format and token utilities"
```

---

## Task 18: Portfolio PDF - Theme & Image Loader

**Files:**

- Create: `src/components/pdf/portfolio/pdfTheme.ts`
- Create: `src/components/pdf/portfolio/pdfImages.ts`

- [ ] **Step 1: Create PDF theme**

Create `src/components/pdf/portfolio/pdfTheme.ts`:

```typescript
import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  bgPrimary: "#000000",
  bgSecondary: "#111111",
  bgCard: "#1a1a1a",
  gold: "#C9A84C",
  goldLight: "#E8CC7A",
  white: "#FFFFFF",
  textSecondary: "#E0E0E0",
  textMuted: "#999999",
  border: "#333333",
};

export const fonts = {
  heading: "Helvetica-Bold",
  body: "Helvetica",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 60,
};

export const pageBase = StyleSheet.create({
  page: {
    backgroundColor: colors.bgPrimary,
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 10,
    padding: 0,
  },
  pageWithPadding: {
    backgroundColor: colors.bgPrimary,
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 10,
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  goldLine: {
    width: 80,
    height: 4,
    backgroundColor: colors.gold,
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 1.6,
    marginBottom: spacing.lg,
    letterSpacing: 0.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
```

- [ ] **Step 2: Create PDF image loader**

The PDF needs images as URLs. When running client-side in the browser, we can use regular image URLs since @react-pdf/renderer supports fetching them.

Create `src/components/pdf/portfolio/pdfImages.ts`:

```typescript
// For client-side PDF generation, @react-pdf/renderer can fetch images from URLs.
// We use the same paths as the web images, prefixed with the origin.

const prefix = typeof window !== "undefined" ? window.location.origin : "";

function img(path: string): string {
  return `${prefix}${path}`;
}

export const pdfImages = {
  festa55: img("/images/festa-55.jpeg"),
  festa70: img("/images/festa-70.jpeg"),
  festa82: img("/images/festa-82.jpeg"),
  img0437: img("/images/img-0437.jpeg"),
  img0679: img("/images/img-0679.jpeg"),
  img0690: img("/images/img-0690.jpeg"),
  img0867: img("/images/img-0867.jpeg"),
  joao: img("/images/joao.jpeg"),
  anos70: img("/images/freeband-anos-70.jpeg"),
  anos90: img("/images/freeband-anos-90.jpeg"),
  antigas: img("/images/freeband-antigas.jpeg"),
  fb2015: img("/images/freeband-2015.jpeg"),
  nautico: img("/images/nautico-araraquara.jpeg"),
  cosmopolitano: img("/images/cartaz-cosmopolitano.jpeg"),
  reveillomIacanga: img("/images/reveillom-iacanga.jpeg"),
  reveillomItatinga: img("/images/reveillom-itatinga.jpeg"),
  baileTabatinga: img("/images/baile-tabatinga.jpeg"),
};
```

- [ ] **Step 3: Commit**

```bash
git add src/components/pdf/portfolio/
git commit -m "feat: add PDF theme and image loader for portfolio"
```

---

## Task 19: Portfolio PDF - Document Components

**Files:**

- Create: `src/components/pdf/portfolio/PdfCover.tsx`
- Create: `src/components/pdf/portfolio/PdfAbout.tsx`
- Create: `src/components/pdf/portfolio/PdfTimeline.tsx`
- Create: `src/components/pdf/portfolio/PdfPartners.tsx`
- Create: `src/components/pdf/portfolio/PdfGallery.tsx`
- Create: `src/components/pdf/portfolio/PdfServices.tsx`
- Create: `src/components/pdf/portfolio/PdfContact.tsx`
- Create: `src/components/pdf/portfolio/PortfolioDocument.tsx`

These components are ported from `freeband-portfolio/src/pages/` but use the unified `data/content.ts` and `pdfImages.ts`.

- [ ] **Step 1: Create PdfCover**

Create `src/components/pdf/portfolio/PdfCover.tsx`:

```tsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts } from "./pdfTheme";
import { bandInfo } from "@/data/content";
import { pdfImages } from "./pdfImages";

const styles = StyleSheet.create({
  page: { backgroundColor: colors.bgPrimary },
  bgContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  bgImage: { width: "100%", height: "100%", objectFit: "cover" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  content: {
    flex: 1,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    borderWidth: 4,
    borderColor: colors.gold,
    padding: 40,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "100%",
  },
  bandName: {
    fontSize: 48,
    fontFamily: fonts.heading,
    color: colors.white,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 10,
    lineHeight: 1.1,
  },
  freeband: { color: colors.gold },
  tagline: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.gold,
    textAlign: "center",
    letterSpacing: 2,
    marginTop: 20,
    textTransform: "uppercase",
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.bgPrimary,
    letterSpacing: 4,
    textTransform: "uppercase",
    backgroundColor: colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});

export function PdfCover() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.bgContainer}>
        <Image src={pdfImages.festa55} style={styles.bgImage} />
        <View style={styles.overlay} />
      </View>
      <View style={styles.content}>
        <View style={styles.frame}>
          <Text style={styles.bandName}>
            Internacional{"\n"}
            <Text style={styles.freeband}>Freeband</Text>
          </Text>
          <Text style={styles.tagline}>{bandInfo.tagline}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{bandInfo.subtitle}</Text>
      </View>
    </Page>
  );
}
```

- [ ] **Step 2: Create PdfAbout**

Create `src/components/pdf/portfolio/PdfAbout.tsx`:

```tsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, spacing, pageBase } from "./pdfTheme";
import { release } from "@/data/content";
import { pdfImages } from "./pdfImages";

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding },
  header: { marginBottom: spacing.xl },
  title: { ...pageBase.sectionTitle },
  goldLine: { ...pageBase.goldLine },
  content: { flexDirection: "row", justifyContent: "space-between" },
  leftCol: { width: "55%" },
  rightCol: { width: "40%" },
  releaseText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 1.6,
    textAlign: "justify",
    marginBottom: spacing.lg,
  },
  mainPhoto: {
    width: "100%",
    height: 250,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  highlightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  highlightCard: {
    width: "48%",
    backgroundColor: colors.bgSecondary,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    marginBottom: 15,
  },
  highlightValue: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginBottom: 4,
  },
  highlightLabel: {
    fontSize: 9,
    fontFamily: fonts.heading,
    color: colors.white,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  valuesBox: { marginTop: 20, padding: 20, backgroundColor: colors.gold },
  valuesTitle: {
    color: colors.bgPrimary,
    fontSize: 12,
    fontFamily: fonts.heading,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  valueItem: {
    color: colors.bgPrimary,
    fontFamily: fonts.heading,
    fontSize: 10,
    marginBottom: 6,
  },
  footer: { ...pageBase.footer },
  footerText: { ...pageBase.footerText },
});

export function PdfAbout() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Quem Somos</Text>
        <View style={styles.goldLine} />
      </View>
      <View style={styles.content}>
        <View style={styles.leftCol}>
          <Text style={styles.releaseText}>{release.full}</Text>
          <View style={styles.highlightsGrid}>
            {release.highlights.map((h, i) => (
              <View key={i} style={styles.highlightCard}>
                <Text style={styles.highlightValue}>{h.value}</Text>
                <Text style={styles.highlightLabel}>{h.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.rightCol}>
          <Image src={pdfImages.antigas} style={styles.mainPhoto} />
          <View style={styles.valuesBox}>
            <Text style={styles.valuesTitle}>Nossos Valores</Text>
            {release.values.map((v, i) => (
              <Text key={i} style={styles.valueItem}>
                + {v}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Internacional Freeband</Text>
        <Text style={styles.footerText}>02</Text>
      </View>
    </Page>
  );
}
```

- [ ] **Step 3: Create PdfTimeline**

Create `src/components/pdf/portfolio/PdfTimeline.tsx`:

```tsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, spacing, pageBase } from "./pdfTheme";
import { timeline } from "@/data/content";
import { pdfImages } from "./pdfImages";

const timelineImageMap: Record<string, string> = {
  "/images/freeband-anos-70.jpeg": pdfImages.anos70,
  "/images/freeband-anos-90.jpeg": pdfImages.anos90,
  "/images/freeband-antigas.jpeg": pdfImages.antigas,
  "/images/freeband-2015.jpeg": pdfImages.fb2015,
  "/images/festa-55.jpeg": pdfImages.festa55,
};

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding },
  header: { marginBottom: spacing.lg },
  title: { ...pageBase.sectionTitle },
  goldLine: { ...pageBase.goldLine },
  container: { flexDirection: "column", paddingLeft: 10 },
  item: { flexDirection: "row", marginBottom: 20, minHeight: 110 },
  line: { width: 30, alignItems: "center", position: "relative" },
  dot: {
    width: 14,
    height: 14,
    backgroundColor: colors.gold,
    marginTop: 5,
    zIndex: 1,
  },
  vertLine: {
    position: "absolute",
    top: 19,
    left: 14,
    width: 2,
    height: "100%",
    backgroundColor: colors.border,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 15,
  },
  textContent: { width: "55%" },
  yearBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  yearText: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.bgPrimary,
    letterSpacing: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.white,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  itemDesc: { fontSize: 10, color: colors.textSecondary, lineHeight: 1.6 },
  imageContainer: { width: "40%" },
  itemImage: {
    width: "100%",
    height: 90,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: colors.textMuted,
  },
});

export function PdfTimeline() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Nossa Historia</Text>
        <View style={styles.goldLine} />
      </View>
      <View style={styles.container}>
        {timeline.map((item, index) => (
          <View key={index} style={styles.item} wrap={false}>
            <View style={styles.line}>
              <View style={styles.dot} />
              {index < timeline.length - 1 && <View style={styles.vertLine} />}
            </View>
            <View style={styles.itemContent}>
              <View style={styles.textContent}>
                <View style={styles.yearBadge}>
                  <Text style={styles.yearText}>{item.year}</Text>
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  src={timelineImageMap[item.image]}
                  style={styles.itemImage}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.pageNumber}>03</Text>
    </Page>
  );
}
```

- [ ] **Step 4: Create PdfPartners, PdfGallery, PdfServices, PdfContact**

Create `src/components/pdf/portfolio/PdfGallery.tsx`:

```tsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, spacing, pageBase } from "./pdfTheme";
import { pdfImages } from "./pdfImages";

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding },
  header: { marginBottom: spacing.xl },
  title: { ...pageBase.sectionTitle },
  goldLine: { ...pageBase.goldLine },
  subtitle: { ...pageBase.subtitle },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  large: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  medium: {
    width: "48%",
    height: 160,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.border,
  },
  small: {
    width: "31%",
    height: 120,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.border,
  },
  footer: { ...pageBase.footer },
  footerText: { ...pageBase.footerText },
});

export function PdfGallery() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Galeria Visual</Text>
        <View style={styles.goldLine} />
      </View>
      <Text style={styles.subtitle}>
        A energia explosiva e o espetaculo da Internacional Freeband.
      </Text>
      <View style={styles.row}>
        <Image src={pdfImages.festa55} style={styles.large} />
      </View>
      <View style={styles.row}>
        <Image src={pdfImages.festa70} style={styles.medium} />
        <Image src={pdfImages.festa82} style={styles.medium} />
      </View>
      <View style={styles.row}>
        <Image src={pdfImages.img0437} style={styles.small} />
        <Image src={pdfImages.img0679} style={styles.small} />
        <Image src={pdfImages.img0867} style={styles.small} />
      </View>
      <View style={styles.row}>
        <Image src={pdfImages.joao} style={styles.medium} />
        <Image src={pdfImages.img0690} style={styles.medium} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Internacional Freeband</Text>
        <Text style={styles.footerText}>05</Text>
      </View>
    </Page>
  );
}
```

Create `src/components/pdf/portfolio/PdfPartners.tsx`:

```tsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, spacing, pageBase } from "./pdfTheme";
import { partners, artists } from "@/data/content";
import { pdfImages } from "./pdfImages";

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding },
  header: { marginBottom: spacing.xl },
  title: { ...pageBase.sectionTitle },
  goldLine: { ...pageBase.goldLine },
  container: { flexDirection: "row", justifyContent: "space-between" },
  leftCol: { width: "48%" },
  rightCol: { width: "48%" },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 2,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: 5,
  },
  artistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  artistItem: {
    width: "48%",
    backgroundColor: colors.bgSecondary,
    padding: 8,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
  },
  artistText: { fontSize: 9, fontFamily: fonts.heading, color: colors.white },
  partnerItem: {
    backgroundColor: colors.bgSecondary,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  partnerText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.heading,
    textTransform: "uppercase",
  },
  photosRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  photo: {
    width: "48%",
    height: 120,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: colors.textMuted,
  },
});

export function PdfPartners() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Parceiros & Palcos</Text>
        <View style={styles.goldLine} />
      </View>
      <View style={styles.container}>
        <View style={styles.leftCol}>
          <Text style={styles.sectionTitle}>Dividimos o palco com</Text>
          <View style={styles.artistGrid}>
            {artists.map((artist, i) => (
              <View key={i} style={styles.artistItem}>
                <Text style={styles.artistText}>{artist}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.sectionTitle}>Clubes & Parceiros</Text>
          {partners.map((partner, i) => (
            <View key={i} style={styles.partnerItem}>
              <Text style={styles.partnerText}>{partner}</Text>
            </View>
          ))}
          <View style={styles.photosRow}>
            <Image src={pdfImages.nautico} style={styles.photo} />
            <Image src={pdfImages.cosmopolitano} style={styles.photo} />
          </View>
        </View>
      </View>
      <Text style={styles.pageNumber}>04</Text>
    </Page>
  );
}
```

Create `src/components/pdf/portfolio/PdfServices.tsx`:

```tsx
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, spacing, pageBase } from "./pdfTheme";
import { services, serviceIncludes } from "@/data/content";
import { pdfImages } from "./pdfImages";

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding },
  header: { marginBottom: spacing.lg },
  title: { ...pageBase.sectionTitle },
  goldLine: { ...pageBase.goldLine },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  card: {
    width: "48%",
    backgroundColor: colors.bgSecondary,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    marginBottom: 15,
  },
  cardFull: {
    width: "100%",
    backgroundColor: colors.gold,
    padding: 15,
    marginBottom: 15,
  },
  icon: { fontSize: 24, color: colors.gold, marginBottom: 8 },
  iconDark: { fontSize: 24, color: colors.bgPrimary, marginBottom: 8 },
  cardTitle: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.white,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  cardTitleDark: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.bgPrimary,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  desc: { fontSize: 10, color: colors.textSecondary, lineHeight: 1.5 },
  descDark: { fontSize: 10, color: colors.bgPrimary, lineHeight: 1.5 },
  includes: {
    backgroundColor: colors.bgSecondary,
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    marginBottom: spacing.lg,
  },
  includesTitle: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginBottom: spacing.md,
    textTransform: "uppercase",
  },
  includeItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  check: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginRight: 10,
  },
  includeText: { fontSize: 10, color: colors.white },
  photosRow: { flexDirection: "row", justifyContent: "space-between" },
  eventPhoto: {
    width: "31%",
    height: 120,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: colors.textMuted,
  },
});

export function PdfServices() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Nossos Servicos</Text>
        <View style={styles.goldLine} />
      </View>
      <View style={styles.grid}>
        {services.map((s, i) => {
          const isLast = i === services.length - 1;
          return (
            <View key={i} style={isLast ? styles.cardFull : styles.card}>
              <Text style={isLast ? styles.iconDark : styles.icon}>
                {s.icon}
              </Text>
              <Text style={isLast ? styles.cardTitleDark : styles.cardTitle}>
                {s.title}
              </Text>
              <Text style={isLast ? styles.descDark : styles.desc}>
                {s.description}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.includes}>
        <Text style={styles.includesTitle}>Estrutura Completa Inclusa</Text>
        {serviceIncludes.map((item, i) => (
          <View key={i} style={styles.includeItem}>
            <Text style={styles.check}>&#10095;</Text>
            <Text style={styles.includeText}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={styles.photosRow}>
        <Image src={pdfImages.reveillomIacanga} style={styles.eventPhoto} />
        <Image src={pdfImages.baileTabatinga} style={styles.eventPhoto} />
        <Image src={pdfImages.reveillomItatinga} style={styles.eventPhoto} />
      </View>
      <Text style={styles.pageNumber}>06</Text>
    </Page>
  );
}
```

Create `src/components/pdf/portfolio/PdfContact.tsx`:

```tsx
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, spacing, pageBase } from "./pdfTheme";
import { contact, bandInfo } from "@/data/content";

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: spacing.xxl },
  title: {
    fontSize: 40,
    fontFamily: fonts.heading,
    color: colors.gold,
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.md,
    letterSpacing: 2,
    textTransform: "uppercase",
    backgroundColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xxl,
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: colors.gold,
    padding: 30,
  },
  contactInfo: { width: "100%" },
  contactItem: { marginBottom: 25 },
  label: {
    fontSize: 10,
    fontFamily: fonts.heading,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.white,
    letterSpacing: 1,
  },
  valueGold: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.gold,
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: colors.border,
    paddingTop: 20,
  },
  footerName: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginBottom: 8,
    letterSpacing: 6,
  },
  footerTagline: {
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});

export function PdfContact() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>BOOKING</Text>
        <Text style={styles.subtitle}>Garanta a Freeband no seu evento</Text>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Text style={styles.label}>WhatsApp Exclusivo</Text>
            <Text style={styles.valueGold}>{contact.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{contact.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.label}>WhatsApp</Text>
            <Text style={styles.valueGold}>{contact.whatsappLink}</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerName}>INTERNACIONAL FREEBAND</Text>
        <Text style={styles.footerTagline}>{bandInfo.tagline}</Text>
      </View>
    </Page>
  );
}
```

- [ ] **Step 5: Create PortfolioDocument root**

Create `src/components/pdf/portfolio/PortfolioDocument.tsx`:

```tsx
import { Document } from "@react-pdf/renderer";
import { PdfCover } from "./PdfCover";
import { PdfAbout } from "./PdfAbout";
import { PdfTimeline } from "./PdfTimeline";
import { PdfPartners } from "./PdfPartners";
import { PdfGallery } from "./PdfGallery";
import { PdfServices } from "./PdfServices";
import { PdfContact } from "./PdfContact";

export function PortfolioDocument() {
  return (
    <Document
      title="Internacional Freeband - Portfolio & Servicos"
      author="Internacional Freeband"
      subject="Portfolio profissional da banda Internacional Freeband"
    >
      <PdfCover />
      <PdfAbout />
      <PdfTimeline />
      <PdfPartners />
      <PdfGallery />
      <PdfServices />
      <PdfContact />
    </Document>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/pdf/portfolio/
git commit -m "feat: add all portfolio PDF components"
```

---

## Task 20: Portfolio Route

**Files:**

- Create: `src/app/portfolio/page.tsx`

- [ ] **Step 1: Create portfolio page**

Create `src/app/portfolio/page.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false },
);

const PortfolioDocument = dynamic(
  () =>
    import("@/components/pdf/portfolio/PortfolioDocument").then((mod) => ({
      default: mod.PortfolioDocument,
    })),
  { ssr: false },
);

export default function PortfolioPage() {
  const [ready, setReady] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="text-xs uppercase tracking-[0.15em] text-text-2 mb-2">
          Internacional Freeband
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-gold mb-4">
          Portfolio Digital
        </h1>
        <p className="text-text-2 mb-10 leading-relaxed">
          Baixe nosso portfolio completo com historia, galeria, servicos e
          informacoes de contato.
        </p>

        {!ready ? (
          <button
            onClick={() => setReady(true)}
            className="bg-gold text-[#0D0D0D] px-10 py-4 font-bold text-sm tracking-[0.15em] uppercase cursor-pointer border-none hover:bg-gold-light transition-colors"
          >
            Preparar PDF
          </button>
        ) : (
          <PDFDownloadLink
            document={<PortfolioDocument />}
            fileName="Internacional-Freeband-Portfolio.pdf"
            className="inline-block bg-gold text-[#0D0D0D] px-10 py-4 font-bold text-sm tracking-[0.15em] uppercase no-underline hover:bg-gold-light transition-colors"
          >
            {({ loading }) =>
              loading ? "Gerando PDF..." : "Baixar Portfolio PDF"
            }
          </PDFDownloadLink>
        )}

        <div className="mt-8">
          <a
            href="/"
            className="text-text-2 text-sm no-underline hover:text-white transition-colors"
          >
            &larr; Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
}
```

Note: We use `dynamic` import with `ssr: false` because `@react-pdf/renderer` does not work in server-side rendering. The two-step flow (Preparar -> Baixar) avoids loading the heavy PDF library until the user wants it.

- [ ] **Step 2: Verify**

```bash
npm run dev
```

Navigate to http://localhost:3000/portfolio. Click "Preparar PDF", then "Baixar Portfolio PDF". A PDF should download.

- [ ] **Step 3: Commit**

```bash
git add src/app/portfolio/page.tsx
git commit -m "feat: add portfolio PDF download route"
```

---

## Task 21: Orcamento - Convert Form to Tailwind

**Files:**

- Modify: `src/components/orcamento/OrcamentoForm.tsx`

- [ ] **Step 1: Rewrite OrcamentoForm with Tailwind**

Replace entire `src/components/orcamento/OrcamentoForm.tsx`:

```tsx
"use client";

import { OrcamentoData } from "@/types/orcamento";

interface OrcamentoFormProps {
  data: OrcamentoData;
  onChange: (data: OrcamentoData) => void;
}

const inputClasses =
  "w-full py-3 px-4 bg-bg-card border border-border text-white rounded text-[0.95rem] outline-none focus:border-gold transition-colors";
const labelClasses =
  "block mb-1.5 text-xs uppercase tracking-wider text-text-2";
const fieldClasses = "mb-5";

export function OrcamentoForm({ data, onChange }: OrcamentoFormProps) {
  function set(field: keyof OrcamentoData, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="p-8">
      <h2 className="text-2xl font-[family-name:var(--font-display)] text-gold font-bold mb-8">
        Dados da Proposta
      </h2>

      <div className={fieldClasses}>
        <label className={labelClasses}>Nome do Contratante</label>
        <input
          className={inputClasses}
          type="text"
          value={data.contratante}
          onChange={(e) => set("contratante", e.target.value)}
          placeholder="Nome completo"
        />
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Tipo de Evento</label>
        <select
          className={`${inputClasses} cursor-pointer`}
          value={data.tipoEvento}
          onChange={(e) => set("tipoEvento", e.target.value)}
        >
          <option value="">Selecione...</option>
          <option>Casamento</option>
          <option>Formatura</option>
          <option>Evento Corporativo</option>
          <option>Festa Premium</option>
          <option>Show Municipal</option>
          <option>Outro</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelClasses}>Data do Evento</label>
          <input
            className={inputClasses}
            type="date"
            value={data.dataEvento}
            onChange={(e) => set("dataEvento", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Local / Cidade</label>
          <input
            className={inputClasses}
            type="text"
            value={data.local}
            onChange={(e) => set("local", e.target.value)}
            placeholder="Cidade, UF"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <label className={labelClasses}>Inicio</label>
          <input
            className={inputClasses}
            type="time"
            value={data.horarioInicio}
            onChange={(e) => set("horarioInicio", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Fim</label>
          <input
            className={inputClasses}
            type="time"
            value={data.horarioFim}
            onChange={(e) => set("horarioFim", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Convidados</label>
          <input
            className={inputClasses}
            type="number"
            value={data.numConvidados}
            onChange={(e) => set("numConvidados", e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Valor do Cache (R$)</label>
        <input
          className={inputClasses}
          type="number"
          value={data.cache}
          onChange={(e) => set("cache", e.target.value)}
          placeholder="0,00"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelClasses}>Entrada (%)</label>
          <input
            className={inputClasses}
            type="number"
            min="0"
            max="100"
            value={data.entradaPct}
            onChange={(e) => set("entradaPct", e.target.value)}
            placeholder="50"
          />
        </div>
        <div>
          <label className={labelClasses}>Data da Entrada</label>
          <input
            className={inputClasses}
            type="date"
            value={data.entradaData}
            onChange={(e) => set("entradaData", e.target.value)}
          />
        </div>
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Data do Saldo</label>
        <input
          className={inputClasses}
          type="date"
          value={data.saldoData}
          onChange={(e) => set("saldoData", e.target.value)}
        />
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Itens Inclusos</label>
        <textarea
          className={`${inputClasses} min-h-[100px] resize-y`}
          value={data.itensInclusos}
          onChange={(e) => set("itensInclusos", e.target.value)}
        />
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Observacoes</label>
        <textarea
          className={`${inputClasses} min-h-[80px] resize-y`}
          value={data.observacoes}
          onChange={(e) => set("observacoes", e.target.value)}
        />
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Validade da Proposta</label>
        <input
          className={inputClasses}
          type="date"
          value={data.validade}
          onChange={(e) => set("validade", e.target.value)}
        />
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/orcamento/OrcamentoForm.tsx
git commit -m "refactor: convert OrcamentoForm to Tailwind with named export"
```

---

## Task 22: Orcamento - Convert Page & Preview to Tailwind + PDF Generation

**Files:**

- Modify: `src/components/orcamento/OrcamentoPage.tsx`
- Modify: `src/components/orcamento/OrcamentoPreview.tsx`
- Create: `src/components/pdf/orcamento/OrcamentoPdf.tsx`

- [ ] **Step 1: Create OrcamentoPdf React-PDF document**

Create `src/components/pdf/orcamento/OrcamentoPdf.tsx`:

```tsx
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { OrcamentoData } from "@/types/orcamento";
import {
  formatCurrency,
  formatDate,
  calcEntrada,
  calcSaldo,
} from "@/lib/format";

const gold = "#C9A84C";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "#1a1a1a",
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
  },
  header: {
    borderBottomWidth: 3,
    borderBottomColor: gold,
    paddingBottom: 24,
    marginBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerLeft: {},
  headerLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 4,
  },
  headerName: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    lineHeight: 1.1,
  },
  headerNameGold: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: gold,
    lineHeight: 1.1,
  },
  headerRight: { textAlign: "right", fontSize: 12, color: "#666" },
  headerPhone: { marginTop: 4, color: gold },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#888",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: gold,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e0ce",
    paddingBottom: 8,
    marginBottom: 16,
    fontFamily: "Helvetica-Bold",
  },
  contratante: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#f9f7f2",
    borderWidth: 1,
    borderColor: "#e8e0ce",
    padding: 20,
    marginBottom: 24,
  },
  infoItem: { width: "50%", marginBottom: 12 },
  infoLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#888",
    marginBottom: 2,
  },
  infoValue: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 14, color: "#444" },
  totalValue: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
  paymentGrid: { flexDirection: "row", justifyContent: "space-between" },
  paymentCard: {
    width: "48%",
    backgroundColor: "#f9f7f2",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e8e0ce",
  },
  paymentLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 4,
  },
  paymentValue: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  paymentDate: { fontSize: 11, color: "#666", marginTop: 4 },
  bodyText: { fontSize: 13, lineHeight: 1.8, color: "#333" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 2,
    borderTopColor: gold,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 11,
    color: "#888",
  },
  footerRight: { textAlign: "right" },
  footerPhone: { color: gold },
});

interface OrcamentoPdfProps {
  data: OrcamentoData;
}

export function OrcamentoPdf({ data }: OrcamentoPdfProps) {
  const hasCache = data.cache !== "";
  const hasEntrada = hasCache && data.entradaPct !== "";

  return (
    <Document
      title={`Proposta - ${data.contratante || "Freeband"}`}
      author="Internacional Freeband"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLabel}>Proposta Comercial</Text>
            <Text style={styles.headerName}>Internacional</Text>
            <Text style={styles.headerNameGold}>Freeband</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Desde 1969</Text>
            <Text>Trabiju, SP</Text>
            <Text style={styles.headerPhone}>(16) 99171-2996</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Proposta para</Text>
          <Text style={styles.contratante}>{data.contratante || "\u2014"}</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tipo de Evento</Text>
            <Text style={styles.infoValue}>{data.tipoEvento || "\u2014"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data</Text>
            <Text style={styles.infoValue}>
              {data.dataEvento ? formatDate(data.dataEvento) : "\u2014"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Local</Text>
            <Text style={styles.infoValue}>{data.local || "\u2014"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Horario</Text>
            <Text style={styles.infoValue}>
              {data.horarioInicio && data.horarioFim
                ? `${data.horarioInicio} as ${data.horarioFim}`
                : "\u2014"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Convidados</Text>
            <Text style={styles.infoValue}>
              {data.numConvidados ? `${data.numConvidados} pessoas` : "\u2014"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investimento</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Valor Total</Text>
            <Text style={styles.totalValue}>
              {hasCache ? formatCurrency(data.cache) : "\u2014"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condicoes de Pagamento</Text>
          <View style={styles.paymentGrid}>
            <View style={styles.paymentCard}>
              <Text style={styles.paymentLabel}>
                Entrada ({data.entradaPct || 0}%)
              </Text>
              <Text style={styles.paymentValue}>
                {hasEntrada
                  ? calcEntrada(data.cache, data.entradaPct)
                  : "\u2014"}
              </Text>
              {data.entradaData ? (
                <Text style={styles.paymentDate}>
                  ate {formatDate(data.entradaData)}
                </Text>
              ) : null}
            </View>
            <View style={styles.paymentCard}>
              <Text style={styles.paymentLabel}>
                Saldo ({data.entradaPct ? 100 - Number(data.entradaPct) : 0}%)
              </Text>
              <Text style={styles.paymentValue}>
                {hasEntrada ? calcSaldo(data.cache, data.entradaPct) : "\u2014"}
              </Text>
              {data.saldoData ? (
                <Text style={styles.paymentDate}>
                  ate {formatDate(data.saldoData)}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {data.itensInclusos ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itens Inclusos</Text>
            <Text style={styles.bodyText}>{data.itensInclusos}</Text>
          </View>
        ) : null}

        {data.observacoes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observacoes</Text>
            <Text style={styles.bodyText}>{data.observacoes}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <View>
            {data.validade ? (
              <Text>Proposta valida ate {formatDate(data.validade)}</Text>
            ) : null}
          </View>
          <View style={styles.footerRight}>
            <Text>Internacional Freeband</Text>
            <Text style={styles.footerPhone}>(16) 99171-2996</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
```

- [ ] **Step 2: Rewrite OrcamentoPreview with Tailwind + PDF download**

Replace entire `src/components/orcamento/OrcamentoPreview.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PrintLayout } from "./PrintLayout";
import { OrcamentoData } from "@/types/orcamento";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false },
);

const OrcamentoPdf = dynamic(
  () =>
    import("@/components/pdf/orcamento/OrcamentoPdf").then((mod) => ({
      default: mod.OrcamentoPdf,
    })),
  { ssr: false },
);

interface OrcamentoPreviewProps {
  data: OrcamentoData;
  onPrint: () => void;
}

export function OrcamentoPreview({ data, onPrint }: OrcamentoPreviewProps) {
  const [pdfReady, setPdfReady] = useState(false);

  return (
    <div className="sticky top-8">
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={onPrint}
          className="py-3 px-8 bg-border text-white font-bold text-sm tracking-wider uppercase border-none cursor-pointer rounded-sm hover:bg-bg-card transition-colors"
        >
          Imprimir
        </button>
        {!pdfReady ? (
          <button
            onClick={() => setPdfReady(true)}
            className="py-3 px-8 bg-gold text-[#000] font-bold text-sm tracking-wider uppercase border-none cursor-pointer rounded-sm hover:bg-gold-light transition-colors"
          >
            Gerar PDF
          </button>
        ) : (
          <PDFDownloadLink
            document={<OrcamentoPdf data={data} />}
            fileName={`Proposta-Freeband-${data.contratante || "cliente"}.pdf`}
            className="py-3 px-8 bg-gold text-[#000] font-bold text-sm tracking-wider uppercase no-underline rounded-sm hover:bg-gold-light transition-colors inline-block"
          >
            {({ loading }) => (loading ? "Gerando..." : "Baixar PDF")}
          </PDFDownloadLink>
        )}
      </div>

      <div className="border border-border overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="origin-top-left scale-[0.85] w-[117.6%]">
          <PrintLayout data={data} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite OrcamentoPage with Tailwind**

Replace entire `src/components/orcamento/OrcamentoPage.tsx`:

```tsx
"use client";

import { useState } from "react";
import { OrcamentoForm } from "./OrcamentoForm";
import { OrcamentoPreview } from "./OrcamentoPreview";
import { OrcamentoData, defaultOrcamento } from "@/types/orcamento";

export function OrcamentoPage() {
  const [data, setData] = useState<OrcamentoData>(defaultOrcamento);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-bg text-white">
      <div className="border-b border-border py-6 px-8 bg-black flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.15em] text-text-2">
            Internacional Freeband
          </div>
          <div className="text-xl font-[family-name:var(--font-display)] text-gold font-bold">
            Gerador de Proposta
          </div>
        </div>
        <a
          href="/"
          className="text-sm text-text-2 no-underline hover:text-white transition-colors"
        >
          &larr; Voltar ao site
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        <div className="border-r border-border overflow-y-auto max-h-[calc(100vh-80px)]">
          <OrcamentoForm data={data} onChange={setData} />
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(100vh-80px)] bg-bg-2">
          <OrcamentoPreview data={data} onPrint={handlePrint} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update orcamento route import**

In `src/app/orcamento/[token]/page.tsx`, change:

```typescript
import OrcamentoPage from "@/components/orcamento/OrcamentoPage";
```

to:

```typescript
import { OrcamentoPage } from "@/components/orcamento/OrcamentoPage";
```

- [ ] **Step 5: Convert PrintLayout to Tailwind**

Replace entire `src/components/orcamento/PrintLayout.tsx` — convert all inline styles to Tailwind classes. The PrintLayout is the HTML preview (for print/screen), while OrcamentoPdf is the React-PDF version. Keep PrintLayout for the live preview but use Tailwind:

```tsx
import { OrcamentoData } from "@/types/orcamento";
import {
  formatCurrency,
  formatDate,
  calcEntrada,
  calcSaldo,
} from "@/lib/format";

interface PrintLayoutProps {
  data: OrcamentoData;
}

export function PrintLayout({ data }: PrintLayoutProps) {
  const entradaStr = calcEntrada(data.cache, data.entradaPct);
  const saldoStr = calcSaldo(data.cache, data.entradaPct);
  const hasCache = data.cache !== "";
  const hasEntrada = hasCache && data.entradaPct !== "";

  return (
    <div
      id="print-area"
      className="bg-white text-[#1a1a1a] font-serif p-10 min-h-[297mm] w-[210mm] max-w-full"
    >
      {/* Header */}
      <div className="border-b-[3px] border-gold pb-6 mb-8 flex justify-between items-end">
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-1">
            Proposta Comercial
          </div>
          <div className="text-[28px] font-bold text-[#1a1a1a] leading-none">
            Internacional
          </div>
          <div className="text-[28px] font-bold text-gold leading-none">
            Freeband
          </div>
        </div>
        <div className="text-right text-xs text-[#666]">
          <div>Desde 1969</div>
          <div>Trabiju, SP</div>
          <div className="mt-1 text-gold">(16) 99171-2996</div>
        </div>
      </div>

      {/* Contratante */}
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-widest text-[#888] mb-1">
          Proposta para
        </div>
        <div className="text-[22px] font-semibold text-[#1a1a1a]">
          {data.contratante || "\u2014"}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 bg-[#f9f7f2] border border-[#e8e0ce] p-5 mb-6">
        {(
          [
            ["Tipo de Evento", data.tipoEvento || "\u2014"],
            ["Data", data.dataEvento ? formatDate(data.dataEvento) : "\u2014"],
            ["Local", data.local || "\u2014"],
            [
              "Horario",
              data.horarioInicio && data.horarioFim
                ? `${data.horarioInicio} as ${data.horarioFim}`
                : "\u2014",
            ],
            [
              "Convidados",
              data.numConvidados ? `${data.numConvidados} pessoas` : "\u2014",
            ],
          ] as const
        ).map(([label, value]) => (
          <div key={label}>
            <div className="text-[10px] uppercase tracking-widest text-[#888] mb-0.5">
              {label}
            </div>
            <div className="text-sm font-medium">{value}</div>
          </div>
        ))}
      </div>

      {/* Investment */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-gold border-b border-[#e8e0ce] pb-2 mb-4 font-semibold">
          Investimento
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[#444]">Valor Total</span>
          <span className="text-[22px] font-bold text-[#1a1a1a]">
            {hasCache ? formatCurrency(data.cache) : "\u2014"}
          </span>
        </div>
      </div>

      {/* Payment */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-gold border-b border-[#e8e0ce] pb-2 mb-4 font-semibold">
          Condicoes de Pagamento
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f9f7f2] p-3 border border-[#e8e0ce]">
            <div className="text-[10px] uppercase text-[#888] mb-1">
              Entrada ({data.entradaPct || 0}%)
            </div>
            <div className="text-lg font-bold">
              {hasEntrada ? entradaStr : "\u2014"}
            </div>
            {data.entradaData && (
              <div className="text-[11px] text-[#666] mt-1">
                ate {formatDate(data.entradaData)}
              </div>
            )}
          </div>
          <div className="bg-[#f9f7f2] p-3 border border-[#e8e0ce]">
            <div className="text-[10px] uppercase text-[#888] mb-1">
              Saldo ({data.entradaPct ? 100 - Number(data.entradaPct) : 0}%)
            </div>
            <div className="text-lg font-bold">
              {hasEntrada ? saldoStr : "\u2014"}
            </div>
            {data.saldoData && (
              <div className="text-[11px] text-[#666] mt-1">
                ate {formatDate(data.saldoData)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Itens inclusos */}
      {data.itensInclusos && (
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-gold border-b border-[#e8e0ce] pb-2 mb-4 font-semibold">
            Itens Inclusos
          </div>
          <div className="text-[13px] leading-[1.8] text-[#333] whitespace-pre-line">
            {data.itensInclusos}
          </div>
        </div>
      )}

      {/* Observacoes */}
      {data.observacoes && (
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-gold border-b border-[#e8e0ce] pb-2 mb-4 font-semibold">
            Observacoes
          </div>
          <div className="text-[13px] leading-[1.8] text-[#333] whitespace-pre-line">
            {data.observacoes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto border-t-2 border-gold pt-4 flex justify-between items-end text-[11px] text-[#888]">
        <div>
          {data.validade && (
            <span>Proposta valida ate {formatDate(data.validade)}</span>
          )}
        </div>
        <div className="text-right">
          <div>Internacional Freeband</div>
          <div className="text-gold">(16) 99171-2996</div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/orcamento/ src/components/pdf/orcamento/ src/app/orcamento/
git commit -m "feat: convert orcamento to Tailwind, add PDF generation with @react-pdf"
```

---

## Task 23: Final Verification

- [ ] **Step 1: Build**

```bash
cd C:/Users/anton/OneDrive/Desktop/BURU/freeband-nextjs
npm run build
```

Expected: builds without errors.

- [ ] **Step 2: Run tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 3: Manual verification checklist**

Run `npm run dev` and check:

1. **Landing page** (`/`): All 8 sections render. No inline `style={}` in source. Video plays in hero (or poster shows). All gallery images display. Lightbox works. Mobile responsive (375px-1440px).
2. **Portfolio** (`/portfolio`): "Preparar PDF" button works. PDF downloads with all 7 pages.
3. **Orcamento** (`/orcamento/[token]`): Form fills correctly. Live preview updates. "Gerar PDF" produces a clean PDF. Token protection works (invalid token redirects to `/`).
4. **No console.log** in any component.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```

---

## Verification Summary

| Check                      | Command/Action                                     |
| -------------------------- | -------------------------------------------------- |
| Build passes               | `npm run build`                                    |
| Tests pass                 | `npx vitest run`                                   |
| Landing page renders       | Visit http://localhost:3000                        |
| All sections Tailwind-only | Inspect source - zero inline `style={}` on landing |
| Hero video plays           | Check video autoplay on `/`                        |
| Gallery shows all photos   | Count images in gallery section                    |
| Lightbox works             | Click any gallery image                            |
| Portfolio PDF downloads    | Visit `/portfolio`, click download                 |
| Orcamento form works       | Visit `/orcamento/[token]`, fill form              |
| Orcamento PDF generates    | Click "Gerar PDF" in orcamento                     |
| Token protection works     | Visit `/orcamento/invalid` - should redirect       |
| Mobile responsive          | Resize to 375px width                              |
| No console.log             | Grep for `console.log` in src/                     |
