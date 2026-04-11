# Moderno & Clean Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a clean, modern, and light theme redesign for the Internacional Freeband website.

**Architecture:** Update CSS variables, swap out serif fonts for sans-serif globally, adjust layout configurations for Hero and Navbar to implement "frosted glass" and scroll-based visibility. Apply the new color scheme across all sections.

**Tech Stack:** Next.js 14+, React, Tailwind CSS v4, TypeScript

---

### Task 1: Update Global CSS Variables & Fonts

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update CSS Variables in globals.css**
```css
@import "tailwindcss";

@theme {
  /* Palette: Modern & Clean (Light theme) */
  --color-bg: #FAFAFA;
  --color-bg-2: #F1F5F9;
  --color-bg-card: #FFFFFF;
  --color-gold: #C9A84C;
  --color-gold-light: #E8CC7A;
  --color-text-main: #0f172a;
  --color-text-2: #475569;
  --color-border: #E2E8F0;
  --color-green-wa: #25D366;

  /* Fonts — Only Inter (sans-serif) */
  --font-display: var(--font-inter), "Inter", system-ui, sans-serif;
  --font-sans: var(--font-inter), "Inter", system-ui, sans-serif;

  /* Scroll indicator animation */
  --animate-bounce-arrow: bounce-arrow 2s ease-in-out infinite;

  @keyframes bounce-arrow {
    0%,
    100% {
      transform: translateY(0);
      opacity: 1;
    }
    50% {
      transform: translateY(10px);
      opacity: 0.6;
    }
  }
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
  color: var(--color-text-main);
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}
```

- [ ] **Step 2: Remove Playfair Font from layout.tsx**
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freeband.com.br"),
  title: "Internacional Freeband | Desde 1969",
  description:
    "Banda de eventos premium com mais de 55 anos de história. Casamentos, formaturas, corporativo e shows municipais.",
  openGraph: {
    title: "Internacional Freeband",
    description: "Banda de eventos premium com mais de 55 anos de história.",
    images: ["/images/festa-55.jpeg"],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className="bg-bg text-text-main font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Run Dev Server and Verify**
Run: `npm run dev`
Expected: The site should load with a white background and dark text. Playfair font should be gone.

- [ ] **Step 4: Commit**
```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "refactor: implement light theme variables and remove serif fonts"
```

### Task 2: Update Navbar Component

**Files:**
- Modify: `src/components/layout/NavBar.tsx`

- [ ] **Step 1: Update Navbar logic and styling**
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
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClasses = [
    "fixed inset-x-0 top-0 z-50 transition-all duration-300",
    scrolled
      ? "translate-y-0 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm"
      : "-translate-y-full opacity-0 pointer-events-none" // Hidden at top
  ].join(" ");

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="font-bold tracking-widest text-slate-900 md:text-lg uppercase"
        >
          Internacional Freeband
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase font-medium tracking-widest text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            className="bg-slate-900 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-slate-800"
          >
            Agendar
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="text-2xl text-slate-900 md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? "\u2715" : "\u2630"}
        </button>
      </div>

      {open ? (
        <div className="flex flex-col gap-4 bg-white px-6 pb-6 pt-2 md:hidden shadow-lg border-b border-slate-100">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium tracking-wide text-slate-600"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="mt-4 bg-slate-900 px-5 py-3 rounded-full text-center text-sm font-bold uppercase tracking-widest text-white"
          >
            Agendar Show
          </a>
        </div>
      ) : null}
    </header>
  );
}
```

- [ ] **Step 2: Run Dev Server and Verify**
Run: `npm run dev`
Expected: Navbar should be hidden at the very top. Scrolling down should reveal a white, blurred navbar with dark text and a rounded, dark button.

- [ ] **Step 3: Commit**
```bash
git add src/components/layout/NavBar.tsx
git commit -m "refactor: update navbar to hidden-at-top pattern with modern light styling"
```

### Task 3: Update Hero Section

**Files:**
- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Apply Frosted Glass overlay and typography updates**
```tsx
import { bandInfo } from "@/data/content";

export function Hero() {
  return (
    <section className="relative flex h-screen min-h-[640px] items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster="/images/hero-poster.jpeg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Frosted Glass / Light Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-8 inline-block rounded-full bg-slate-900/5 px-6 py-2 text-[0.75rem] font-bold uppercase tracking-[0.3em] text-slate-900 backdrop-blur-md border border-slate-900/10">
          Desde {bandInfo.founded}
        </div>

        <h1 className="mb-6 font-display font-bold leading-[1.05] text-slate-900">
          <span className="block text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Internacional
          </span>
          <span className="block text-5xl tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Freeband
          </span>
        </h1>

        <p className="mb-10 text-sm font-medium tracking-[0.2em] text-slate-600 sm:text-base uppercase">
          {bandInfo.tagline}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#contato"
            className="inline-block rounded-full bg-slate-900 px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl hover:bg-slate-800"
          >
            Agendar Show
          </a>
          <a
            href="/portfolio"
            className="inline-block rounded-full bg-white/50 backdrop-blur-md px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-900 border border-slate-900/20 transition-all hover:bg-white hover:shadow-md"
          >
            Ver Portfólio
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-arrow text-2xl text-slate-900"
        aria-hidden="true"
      >
        &darr;
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run Dev Server and Verify**
Run: `npm run dev`
Expected: Hero should show video with a frosted white overlay. Texts should be dark slate. Buttons should be pill-shaped (rounded).

- [ ] **Step 3: Commit**
```bash
git add src/components/sections/Hero.tsx
git commit -m "refactor: apply frosted glass light overlay to hero and modern typography"
```

### Task 4: Global Section Cleanup (Text colors & Backgrounds)

**Files:**
- Note: This task targets general sections to ensure they adapt to the light theme. Since we modified global variables, much of it might inherit well, but we need to ensure specific hardcoded dark tailwind classes are removed.
- *For brevity in the plan, I will target the most likely culprits. The agent executing this should use search to fix any remaining hardcoded dark backgrounds or text.*

- [ ] **Step 1: Check and fix any dark classes in the main sections**
*Instruction for the executing agent: Use grep to search for `text-white`, `text-text-2`, `bg-bg`, `bg-[#0a0a0a]` in `src/components/sections/` and replace them with their light equivalents or remove them if they rely on globals.*

```bash
# Agent should replace specific classes in components like Sobre, Galeria, Contato.
# Example command to search:
# grep -rn "text-white" src/components/sections/
```

- [ ] **Step 2: Run Dev Server and Verify**
Run: `npm run dev`
Expected: Scrolling through the page, all sections should be legible with dark text on light backgrounds.

- [ ] **Step 3: Commit**
```bash
# git add src/components/sections/*.tsx
# git commit -m "style: remove hardcoded dark mode classes from sections"
```
