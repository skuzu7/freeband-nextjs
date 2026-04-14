# PALCO v3 — State of the Art 2026

> Arquitetado por Claude Opus. Executavel por Gemini ou qualquer agente.
> Objetivo: levar o site da Internacional Freeband ao limite tecnico do que
> Next.js 16 + Vercel + CSS 2026 suportam. Zero dependencias novas salvo nota explicita.
>
> REGRA ABSOLUTA: ler `node_modules/next/dist/docs/` antes de usar qualquer API Next.js.
> REGRA ABSOLUTA: `npm run build` deve passar apos cada tarefa.
> REGRA ABSOLUTA: nao quebrar nada que ja funciona. Cada tarefa e aditiva.

---

## Fase 1 — CSS puro (zero JS, zero risco)

Estas tarefas sao puramente CSS em `src/app/globals.css`. Nao tocam em componentes React.

---

### 1.1 Noise/grain texture overlay

Textura analogica sutil sobre todo o site. Conecta com a historia de 57 anos da banda.

**Onde**: `src/app/globals.css`

**Adicionar** ao final do arquivo:

```css
/* =========================================================================
   Film grain — subtle analog texture over the entire viewport.
   Uses a tiny inline SVG noise fed into a pseudo-element on body.
   Zero network requests, zero JS. Invisible at small sizes, adds
   depth on large screens.
   ========================================================================= */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.035;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

@media (prefers-reduced-motion: reduce) {
  body::after {
    opacity: 0.02;
  }
}
```

**Verificacao**: textura sutil visivel sobre fundos claros. Nao interfere em interacoes (pointer-events: none).

---

### 1.2 @starting-style entry animations

Animacoes de entrada que funcionam no PRIMEIRO paint, nao so no scroll. Complementa os reveal-\* existentes.

**Onde**: `src/app/globals.css`

**Adicionar** apos o bloco de reveal variants (~linha 277):

```css
/* =========================================================================
   @starting-style — CSS-only entry animations on first render.
   Used for elements that are visible on initial viewport (hero content,
   nav) where scroll-driven reveal-* classes don't trigger.
   ========================================================================= */
@media (prefers-reduced-motion: no-preference) {
  @supports (selector(:has(*))) {
    .entry-fade {
      animation: reveal-in 0.8s var(--ease-reveal) both;
      animation-delay: calc(var(--i, 0) * 80ms);
    }

    .entry-slide-up {
      animation: reveal-in 1s var(--ease-stage) both;
      animation-delay: calc(var(--i, 0) * 100ms);
    }

    @starting-style {
      .entry-fade,
      .entry-slide-up {
        opacity: 0;
        transform: translate3d(0, 2rem, 0);
      }
    }
  }
}
```

**Uso nos componentes** (Fase 3 — aplicar classes):

- Hero meta row: `entry-fade` com `--i: 0`
- Hero title: `entry-slide-up` com `--i: 1`
- Hero tagline: `entry-slide-up` com `--i: 2`
- Hero CTA: `entry-fade` com `--i: 3`
- NavBar logo: `entry-fade`

---

### 1.3 interpolate-size para height auto

Permite animar `height: 0` → `height: auto` nativamente. Usado no mobile menu e em accordions futuros.

**Onde**: `src/app/globals.css`

**Adicionar** no bloco `html`:

```css
html {
  scroll-behavior: smooth;
  overflow-x: hidden;
  text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  interpolate-size: allow-keywords; /* <-- ADICIONAR */
}
```

---

### 1.4 content-visibility para performance

Faz o browser pular o layout/paint de secoes off-screen. Ganho significativo em LCP.

**Onde**: `src/app/globals.css`

**Adicionar**:

```css
/* =========================================================================
   content-visibility — skip layout for off-screen sections.
   contain-intrinsic-size prevents layout shift when sections enter view.
   ========================================================================= */
section[id] {
  content-visibility: auto;
  contain-intrinsic-size: auto 100vh;
}
```

**Verificacao**: DevTools > Performance — paint time reduzido. Sem layout shift visivel.

---

### 1.5 has() selector — interacoes parent-aware

Usa `:has()` para estilizar parents baseado no estado dos filhos. Sem JS.

**Onde**: `src/app/globals.css`

**Adicionar**:

```css
/* =========================================================================
   :has() reactive styles — parent reacts to child state, zero JS.
   ========================================================================= */

/* Nav becomes opaque when any section is scrolled past the hero */
nav:has(~ main section[id='manifesto']:target) {
  --nav-bg: var(--color-bg);
}

/* Form fields: highlight the parent fieldset when any input is focused */
.field-group:has(:focus-visible) {
  border-color: var(--color-brand);
  background-color: color-mix(in oklch, var(--color-brand) 4%, transparent);
}

/* Masonry tile: dim siblings when one is hovered */
.masonry-12:has(button:hover) button:not(:hover) {
  opacity: 0.65;
  transition: opacity 0.5s var(--ease-drift);
}
.masonry-12:has(button:hover) button:hover {
  opacity: 1;
}
```

**Verificacao**: hover em uma foto da galeria escurece as outras. Focus em input de orcamento destaca o grupo.

---

### 1.6 Discrete property animations

Animar `display: none → block` com CSS. Permite transicoes mais suaves no mobile menu sem clip-path hack.

**Onde**: `src/app/globals.css`

**Adicionar**:

```css
/* =========================================================================
   Discrete transitions — animate display + overlay for modal/menu enters.
   ========================================================================= */
@supports (transition-behavior: allow-discrete) {
  .discrete-enter {
    transition:
      opacity 0.4s var(--ease-reveal),
      display 0.4s var(--ease-reveal) allow-discrete,
      overlay 0.4s var(--ease-reveal) allow-discrete;
  }

  @starting-style {
    .discrete-enter {
      opacity: 0;
    }
  }
}
```

---

### 1.7 Subgrid nos feature cards

Alinha titulo + conteudo dos cards "O que esta incluso" (Ato IV) mesmo com alturas diferentes.

**Onde**: `src/app/globals.css`

**Adicionar**:

```css
/* =========================================================================
   Subgrid — feature cards in AtoIV align their internal rows.
   ========================================================================= */
@supports (grid-template-rows: subgrid) {
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }
  .feature-grid > * {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3; /* header + items + spacer */
  }
}
```

**Depois** (Fase 3): adicionar `className="feature-grid"` na `<ul>` dos includedFeatures em AtoIV_Eventos.tsx.

---

### 1.8 Animated gradient mesh background

Substituicao do StageBeams por um mesh gradient animado mais organico (tipo Stripe.com).

**Onde**: `src/app/globals.css`

**Adicionar**:

```css
/* =========================================================================
   Gradient mesh — organic animated background for hero/contact sections.
   Four radial gradients with staggered drift animations. No JS.
   ========================================================================= */
@property --mesh-x1 {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 20%;
}
@property --mesh-y1 {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 30%;
}
@property --mesh-x2 {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 80%;
}
@property --mesh-y2 {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 60%;
}

@keyframes mesh-drift-1 {
  0%,
  100% {
    --mesh-x1: 20%;
    --mesh-y1: 30%;
  }
  33% {
    --mesh-x1: 45%;
    --mesh-y1: 15%;
  }
  66% {
    --mesh-x1: 30%;
    --mesh-y1: 55%;
  }
}
@keyframes mesh-drift-2 {
  0%,
  100% {
    --mesh-x2: 80%;
    --mesh-y2: 60%;
  }
  33% {
    --mesh-x2: 55%;
    --mesh-y2: 80%;
  }
  66% {
    --mesh-x2: 70%;
    --mesh-y2: 35%;
  }
}

.gradient-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(
      ellipse 60% 50% at var(--mesh-x1) var(--mesh-y1),
      oklch(85% 0.12 75 / 0.18),
      transparent
    ),
    radial-gradient(
      ellipse 50% 60% at var(--mesh-x2) var(--mesh-y2),
      oklch(70% 0.15 20 / 0.12),
      transparent
    ),
    radial-gradient(ellipse 70% 50% at 50% 50%, oklch(78% 0.08 195 / 0.08), transparent);
  animation:
    mesh-drift-1 20s var(--ease-drift) infinite,
    mesh-drift-2 28s var(--ease-drift) infinite;
  filter: blur(60px) saturate(1.3);
}

@media (prefers-reduced-motion: reduce) {
  .gradient-mesh {
    animation: none;
  }
}
```

**Uso**: adicionar `<div className="gradient-mesh" aria-hidden />` no Hero e AtoV_Contato como alternativa ou complemento ao StageBeams.

---

### 1.9 Custom cursor (desktop only)

Cursor customizado com blend mode pra reforcar a estetica "spotlight".

**Onde**: `src/app/globals.css`

**Adicionar**:

```css
/* =========================================================================
   Custom cursor — dot + ring on desktop, hidden on touch.
   ========================================================================= */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  html {
    cursor: none;
  }

  /* The actual cursor is rendered by a client component (CursorDot.tsx) */
  a,
  button,
  [role='button'],
  input,
  select,
  textarea,
  label {
    cursor: none;
  }
}
```

**Componente** (criar em Fase 3): `src/components/ui/CursorDot.tsx` — um div position:fixed que segue o mouse com rAF. Estrutura igual ao SpotlightCursor.tsx ja existente.

---

## Fase 2 — Dark mode

Cross-cutting: toca CSS + layout + novo componente.

---

### 2.1 Semantic tokens dark

**Onde**: `src/app/globals.css`

**Adicionar** DEPOIS do bloco `[data-theme="paper"]`:

```css
/* =========================================================================
   Dark mode — inverts the semantic layer. Toggled via data-theme="dark"
   on <html> or via prefers-color-scheme when no explicit preference.
   ========================================================================= */
@media (prefers-color-scheme: dark) {
  html:not([data-theme='light']):not([data-theme='paper']) {
    --color-bg: oklch(12% 0.02 240);
    --color-bg-raise: oklch(16% 0.02 240);
    --color-bg-high: oklch(20% 0.02 240);
    --color-border: oklch(90% 0.01 240 / 0.12);
    --color-border-strong: oklch(90% 0.01 240 / 0.24);
    --color-text: oklch(96% 0.005 240);
    --color-text-muted: oklch(70% 0.02 240);
    --color-text-low: oklch(55% 0.02 240);
    color-scheme: dark;
  }
}

[data-theme='dark'] {
  --color-bg: oklch(12% 0.02 240);
  --color-bg-raise: oklch(16% 0.02 240);
  --color-bg-high: oklch(20% 0.02 240);
  --color-border: oklch(90% 0.01 240 / 0.12);
  --color-border-strong: oklch(90% 0.01 240 / 0.24);
  --color-text: oklch(96% 0.005 240);
  --color-text-muted: oklch(70% 0.02 240);
  --color-text-low: oklch(55% 0.02 240);
  color-scheme: dark;
}
```

A **marca** (--color-brand, --color-brand-hot, --color-brand-deep) NAO muda — dourado funciona em ambos os temas.

### 2.2 Ajustar film grain pro dark mode

```css
[data-theme='dark'] body::after,
@media (prefers-color-scheme: dark) {
  html:not([data-theme='light']) body::after {
    mix-blend-mode: screen;
    opacity: 0.03;
  }
}
```

### 2.3 Ajustar marquee fades pro dark mode

O `.marquee-fade::before` e `::after` usam `var(--color-bg)` — ja funciona automaticamente porque os tokens sao semanticos. Verificar visualmente.

### 2.4 Galeria masonry dim — ajustar opacidade

```css
[data-theme='dark'] .masonry-12:has(button:hover) button:not(:hover) {
  opacity: 0.45; /* mais contraste no dark */
}
```

### 2.5 Theme toggle component

**Criar**: `src/components/ui/ThemeToggle.tsx`

```tsx
'use client';

import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setTheme(stored);
      if (stored !== 'system') {
        document.documentElement.dataset.theme = stored;
      }
    }
  }, []);

  const cycle = useCallback(() => {
    const next: Theme = theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system';
    setTheme(next);
    if (next === 'system') {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem('theme');
    } else {
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
    }
  }, [theme]);

  const label = theme === 'system' ? 'Auto' : theme === 'dark' ? 'Escuro' : 'Claro';
  const icon = theme === 'system' ? '◐' : theme === 'dark' ? '●' : '○';

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Tema: ${label}. Clique para alternar.`}
      className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-brand"
    >
      <span aria-hidden>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
```

**Integrar** no NavBar: adicionar `<ThemeToggle />` ao lado do CTA "Agendar show" no desktop, e no footer do menu mobile.

### 2.6 Prevenir flash of wrong theme (FOWT)

**Onde**: `src/app/layout.tsx`

Adicionar script inline ANTES do body content pra ler localStorage e setar o tema antes do paint:

```tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){try{var t=localStorage.getItem("theme");if(t&&t!=="system")document.documentElement.dataset.theme=t}catch(e){}})()`,
    }}
  />
</head>
```

**IMPORTANTE**: verificar nos docs do Next.js 16 em `node_modules/next/dist/docs/` qual e a forma correta de injetar scripts no head. A abordagem pode ser diferente do Next 14/15.

---

## Fase 3 — Componentes novos + upgrades

---

### 3.1 CursorDot — custom cursor

**Criar**: `src/components/ui/CursorDot.tsx`

Mesmo padrao do `SpotlightCursor.tsx` existente: client component, rAF-throttled, desabilitado em touch/reduced-motion.

```tsx
'use client';

import { useEffect, useRef } from 'react';

export function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    let raf = 0;
    let mx = 0;
    let my = 0;
    // Ring trails behind the dot with lerp
    let rx = 0;
    let ry = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const shared = 'fixed top-0 left-0 z-[10000] pointer-events-none';

  return (
    <>
      <div
        ref={dotRef}
        className={`${shared} -ml-1 -mt-1 h-2 w-2 rounded-full bg-brand`}
        aria-hidden
      />
      <div
        ref={ringRef}
        className={`${shared} -ml-5 -mt-5 h-10 w-10 rounded-full border border-brand/40`}
        aria-hidden
      />
    </>
  );
}
```

**Integrar** em `src/app/layout.tsx`:

```tsx
import { CursorDot } from '@/components/ui/CursorDot';

// No body, antes de {children}:
<CursorDot />;
```

### 3.2 Aplicar entry-\* classes no Hero

**Onde**: `src/components/sections/Hero.tsx`

Substituir `reveal-hero` por `entry-slide-up` nos elementos acima do fold:

```
Meta row:     className="entry-fade" style={{"--i": 0}}
Wordmark:     className="entry-slide-up" style={{"--i": 1}}
Tagline:      className="entry-slide-up" style={{"--i": 2}}
CTA button:   className="entry-fade" style={{"--i": 3}}
Status bar:   className="entry-fade" style={{"--i": 4}}
```

MANTER `reveal-hero` como fallback (scroll-driven) para browsers sem @starting-style.
Abordagem: aplicar AMBAS as classes: `className="reveal-hero entry-slide-up"`.

### 3.3 Gradient mesh no Hero

**Onde**: `src/components/sections/Hero.tsx`

Adicionar APOS o `<video>` e o frosted glass overlay:

```tsx
{
  /* Gradient mesh — organic animated background */
}
<div aria-hidden className="gradient-mesh absolute inset-0 -z-[5]" />;
```

O z-index `-z-[5]` fica entre o video (`-z-20`) e o frosted overlay (`-z-10`), adicionando cor organica sob o blur.

### 3.4 Gradient mesh no AtoV_Contato

**Onde**: `src/components/sections/AtoV_Contato.tsx`

Adicionar dentro da Section, antes do Container:

```tsx
<div aria-hidden className="gradient-mesh absolute inset-0" />
```

### 3.5 Feature grid subgrid no AtoIV

**Onde**: `src/components/sections/AtoIV_Eventos.tsx`

Na `<ul>` dos includedFeatures (linha ~135), adicionar a classe:

```tsx
<ul className="feature-grid relative z-[2]">
```

Remover as classes grid existentes (`grid gap-5 sm:grid-cols-2`) pois `.feature-grid` no CSS ja define o grid. Manter como fallback com `@supports`:

```tsx
<ul className="feature-grid relative z-[2] grid gap-5 sm:grid-cols-2">
```

O CSS `@supports (grid-template-rows: subgrid)` sobrescreve quando disponivel.

### 3.6 Galeria hover dim (has())

Ja definido no CSS (1.5). Nenhuma mudanca em componente necessaria — `:has()` atua direto no `.masonry-12`.

### 3.7 Scroll-velocity reactive header

**Onde**: `src/components/layout/NavBar.tsx`

Adicionar logica que detecta velocidade de scroll e esconde a nav quando rolando rapido pra baixo, mostra quando rolando pra cima.

```tsx
useEffect(() => {
  let lastY = window.scrollY;
  let lastT = performance.now();
  let hidden = false;

  const handleScroll = () => {
    const y = window.scrollY;
    const t = performance.now();
    const dt = t - lastT;
    const dy = y - lastY;
    const velocity = dt > 0 ? dy / dt : 0; // px/ms

    setScrolled(y > 32);

    // Hide nav on fast downward scroll, show on any upward scroll
    if (velocity > 1.5 && y > 200) {
      hidden = true;
    } else if (dy < 0) {
      hidden = false;
    }

    // Apply via CSS transform (no layout thrash)
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.transform = hidden ? 'translate3d(0, -100%, 0)' : 'translate3d(0, 0, 0)';
    }

    lastY = y;
    lastT = t;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

NOTA: a nav ja tem `transition-[padding,background,backdrop-filter]` — adicionar `transform` a essa lista.

---

## Fase 4 — Novas secoes

---

### 4.1 Dados em content.ts

**Onde**: `src/data/content.ts`

Adicionar ao FINAL do arquivo:

```ts
// Depoimentos de clientes — PLACEHOLDER, substituir por reais.
export const testimonials = [
  {
    quote:
      'A Freeband transformou nosso casamento em um show inesquecivel. Profissionalismo impecavel do inicio ao fim.',
    author: 'Maria e Pedro',
    event: 'Casamento',
    year: '2024',
  },
  {
    quote:
      'Terceiro ano consecutivo contratando para a formatura. Os alunos ja pedem a Freeband por nome.',
    author: 'Coordenacao Unesp',
    event: 'Formatura',
    year: '2025',
  },
  {
    quote:
      'Som, luz, pontualidade — tudo impecavel. Melhor investimento que fizemos para o reveillon da cidade.',
    author: 'Prefeitura de Iacanga',
    event: 'Reveillon Municipal',
    year: '2024',
  },
  {
    quote:
      'A estrutura propria deles faz toda a diferenca. Nada terceirizado, tudo no padrao premium.',
    author: 'Clube Nautico Araraquara',
    event: 'Baile de Gala',
    year: '2023',
  },
];

// Repertorio da banda — PLACEHOLDER, substituir pelos generos reais.
export const repertoire = [
  {
    genre: 'Pop & Rock Nacional',
    examples: ['Skank', 'Jota Quest', 'Charlie Brown Jr', 'Paralamas', 'Titas', 'Legiao Urbana'],
  },
  {
    genre: 'Pop & Rock Internacional',
    examples: ['Queen', 'U2', 'Coldplay', 'Bruno Mars', 'Michael Jackson'],
  },
  {
    genre: 'Sertanejo & Country',
    examples: ['Jorge & Mateus', 'Henrique e Juliano', 'Gusttavo Lima', 'Daniel'],
  },
  {
    genre: 'Samba & Pagode',
    examples: ['Jorge Aragao', 'Beth Carvalho', 'Zeca Pagodinho', 'Thiaguinho'],
  },
  {
    genre: 'MPB & Classicos',
    examples: ['Tim Maia', 'Erasmo Carlos', 'Roberto Carlos', 'Djavan'],
  },
  {
    genre: 'Dance & Flashback',
    examples: ['Donna Summer', 'ABBA', 'Bee Gees', 'Kool & The Gang'],
  },
];
```

### 4.2 Secao Repertorio

**Criar**: `src/components/sections/Repertorio.tsx`

SEM numero romano (preserva navegacao existente). Posicionar entre Ato III (Palcos) e Ato IV (Eventos).

```tsx
import { repertoire } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';

export function Repertorio() {
  return (
    <Section id="repertorio" variant="ink-deep" pad="xl" className="overflow-hidden">
      <Container>
        <Eyebrow>Repertorio</Eyebrow>
        <h2
          className="reveal-lead mt-6 font-display -tracking-[0.02em] text-balance max-w-3xl"
          style={{ fontSize: 'var(--text-5xl)', lineHeight: 0.92 }}
        >
          Todos os ritmos, um so <span className="serif-italic text-brand">palco</span>.
        </h2>
        <p
          className="reveal-mid mt-6 max-w-[54ch] text-text-muted"
          style={{ fontSize: 'var(--text-base)' }}
        >
          De Tim Maia a Coldplay, de Jorge Aragao a Queen — versatilidade e repertorio para todas as
          idades e momentos do evento.
        </p>

        <div className="reveal-mid mt-[clamp(3rem,6vi,5rem)] grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {repertoire.map((cat, i) => (
            <div
              key={cat.genre}
              className="group flex flex-col gap-4 border border-border bg-bg-raise p-[clamp(1.25rem,2vi,2rem)] transition-colors duration-500 hover:border-brand"
              style={{ ['--i' as string]: i } as React.CSSProperties}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3
                  className="font-display font-semibold -tracking-[0.01em] text-text"
                  style={{ fontSize: 'var(--text-lg)', lineHeight: 1.15 }}
                >
                  {cat.genre}
                </h3>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-brand">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="text-[0.85rem] leading-[1.6] text-text-muted">
                {cat.examples.join(' · ')}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(3rem,5vi,4rem)] flex items-center gap-4 border-t border-border pt-8 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
          <span aria-hidden className="inline-block h-px w-10 bg-brand" />
          <span>Repertorio sob medida para cada evento</span>
        </div>
      </Container>
    </Section>
  );
}
```

### 4.3 Secao Depoimentos

**Criar**: `src/components/sections/Depoimentos.tsx`

SEM numero romano. Posicionar entre Ato V (Contato) e Footer.

```tsx
'use client';

import { useRef } from 'react';
import { testimonials } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SnapProgress } from '@/components/ui/SnapProgress';

export function Depoimentos() {
  const snapRef = useRef<HTMLDivElement | null>(null);

  return (
    <Section id="depoimentos" variant="ink" pad="xl" className="overflow-hidden">
      <Container>
        <Eyebrow>Quem ja contratou</Eyebrow>
        <h2
          className="reveal-lead mt-6 font-display -tracking-[0.02em] text-balance max-w-3xl"
          style={{ fontSize: 'var(--text-5xl)', lineHeight: 0.92 }}
        >
          A prova esta no <span className="serif-italic text-brand">palco</span>.
        </h2>
      </Container>

      <div
        ref={snapRef}
        className="h-snap reveal-mid mt-[clamp(3rem,5vi,5rem)] pb-10"
        style={{
          paddingInline: 'clamp(1.25rem, 4vw, 3.5rem)',
          gridAutoColumns: 'min(85vw, 520px)',
        }}
        tabIndex={0}
        role="region"
        aria-label="Depoimentos de clientes"
      >
        {testimonials.map((t, i) => (
          <article
            key={i}
            className="group relative flex h-full flex-col justify-between gap-8 border border-border bg-bg-raise p-[clamp(1.5rem,2.5vi,2.5rem)] transition-colors duration-500 hover:border-brand"
          >
            <span
              aria-hidden
              className="font-display text-brand leading-none"
              style={{ fontSize: 'var(--text-5xl)' }}
            >
              &ldquo;
            </span>
            <blockquote className="flex flex-col gap-6">
              <p
                className="text-text text-pretty"
                style={{ fontSize: 'var(--text-lg)', lineHeight: 1.55 }}
              >
                {t.quote}
              </p>
              <footer className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
                <cite
                  className="font-display font-semibold text-text not-italic -tracking-[0.01em]"
                  style={{ fontSize: 'var(--text-base)' }}
                >
                  {t.author}
                </cite>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-brand">
                  {t.event} &middot; {t.year}
                </span>
              </footer>
            </blockquote>
          </article>
        ))}
      </div>

      <Container>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <SnapProgress
            targetRef={snapRef}
            count={testimonials.length}
            labels={testimonials.map((t) => t.event)}
          />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
            &larr; Arraste ou use as setas
          </span>
        </div>
      </Container>
    </Section>
  );
}
```

### 4.4 Integrar novas secoes em page.tsx

**Onde**: `src/app/page.tsx`

```tsx
import { Repertorio } from '@/components/sections/Repertorio';
import { Depoimentos } from '@/components/sections/Depoimentos';

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main id="main" role="main">
        <Hero />
        <AtoI_Manifesto />
        <AtoII_Galeria />
        <AtoIII_Palcos />
        <Repertorio /> {/* NOVO — entre Palcos e Eventos */}
        <AtoIV_Eventos />
        <AtoV_Contato />
        <Depoimentos /> {/* NOVO — entre Contato e Footer */}
      </main>
      <Footer />
    </>
  );
}
```

---

## Fase 5 — Infraestrutura

---

### 5.1 JSON-LD structured data

**Onde**: `src/app/layout.tsx`

Adicionar no body, antes de `{children}`:

```tsx
import { bandInfo, contact, bandLineup } from '@/data/content';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: bandInfo.name,
  foundingDate: '1969',
  foundingLocation: { '@type': 'Place', name: 'Jau, Sao Paulo, Brazil' },
  description: bandInfo.taglineLong,
  url: `https://${bandInfo.website}`,
  telephone: contact.phone,
  email: contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.address,
    addressLocality: 'Trabiju',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
  sameAs: [contact.instagramUrl],
  numberOfEmployees: { '@type': 'QuantitativeValue', value: bandLineup.total },
};

// No body:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
```

### 5.2 Speculation Rules

**Onde**: `src/app/layout.tsx`

Adicionar no body, apos o JSON-LD:

```tsx
<script
  type="speculationrules"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      prerender: [{ where: { href_matches: '/portfolio' }, eagerness: 'moderate' }],
      prefetch: [{ where: { href_matches: '/orcamento/*' }, eagerness: 'conservative' }],
    }),
  }}
/>
```

Isso faz o browser pre-renderizar `/portfolio` quando o usuario provavelmente vai clicar, resultando em navegacao instantanea.

### 5.3 Sitemap + robots.txt

**Criar**: `src/app/sitemap.ts`

```ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://freeband.com.br';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    {
      url: `${base}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
```

**Criar**: `src/app/robots.ts`

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/orcamento/' },
    sitemap: 'https://freeband.com.br/sitemap.xml',
  };
}
```

**IMPORTANTE**: verificar a API de MetadataRoute em `node_modules/next/dist/docs/01-app/03-api-reference/` — Next.js 16 pode ter mudado a convencao.

### 5.4 Manifest + favicon

**Criar**: `src/app/manifest.ts`

```ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Internacional Freeband',
    short_name: 'Freeband',
    description: 'Experiencias musicais de alto padrao para eventos inesqueciveis',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#D4AF37',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
```

Gerar icones com sharp (ja em devDependencies):

```bash
npx sharp -i public/images/logo-freeband.png -o public/icon-192.png resize 192 192
npx sharp -i public/images/logo-freeband.png -o public/icon-512.png resize 512 512
```

### 5.5 Skip-to-content

**Onde**: `src/app/page.tsx`

Adicionar ANTES de `<NavBar />`:

```tsx
<a
  href="#main"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-brand focus:px-6 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-white"
>
  Ir para o conteudo
</a>
```

### 5.6 Lazy video

**Onde**: `src/components/sections/Hero.tsx`

Adicionar `preload="metadata"` no `<video>`:

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster="/images/hero-poster.jpeg"
  ...
>
```

### 5.7 Footer year ribbon dinamico

**Onde**: `src/components/layout/Footer.tsx` linha 3

Substituir:

```ts
const YEAR_RIBBON = ['1969', '1979', '1989', '1999', '2009', '2019', '2026'];
```

Por:

```ts
const YEAR_RIBBON = [
  '1969',
  '1979',
  '1989',
  '1999',
  '2009',
  '2019',
  String(new Date().getFullYear()),
];
```

---

## Fase 6 — View Transitions entre rotas

A cereja do bolo. Transicao cinematografica entre paginas.

---

### 6.1 Verificar suporte no Next.js 16

**ANTES DE IMPLEMENTAR**: ler `node_modules/next/dist/docs/01-app/03-api-reference/` e buscar por "viewTransition", "view transition", ou "transition". Next.js 16 pode ter suporte nativo.

Se NAO tiver suporte nativo, a abordagem e:

### 6.2 CSS view-transition-name

**Onde**: `src/app/globals.css`

```css
/* =========================================================================
   Cross-document view transitions.
   Requires @view-transition at-rule + view-transition-name on shared elements.
   ========================================================================= */
@view-transition {
  navigation: auto;
}

/* Elements that persist across routes get a transition name */
nav {
  view-transition-name: navbar;
}

/* Animate the page swap */
::view-transition-old(root) {
  animation: 0.3s var(--ease-reveal) fade-out;
}
::view-transition-new(root) {
  animation: 0.3s var(--ease-reveal) fade-in;
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.98);
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(1.02);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

Isso ativa view transitions automaticas em navegacoes MPA (Multi-Page App) — funciona em Chrome/Edge sem JS. A nav persiste sem re-animar.

---

## Fase 7 — Redesign /portfolio

**Reescrever**: `src/app/portfolio/page.tsx`

Landing completa em vez de so botao de download. Reusar componentes existentes. Mostrar conteudo do portfolio antes de oferecer download.

```
Estrutura:
  - Header compacto (logo + voltar)
  - Hero: Eyebrow + titulo + subtitulo + CTA download
  - "Quem Somos" (release.full resumido)
  - Galeria compacta (6 fotos de curatedGallery)
  - "O que oferecemos" (services)
  - Contato (phone + whatsapp + email)
  - Footer compacto
```

Reusar: `Container`, `Eyebrow`, `Section`, `Button`, `CinematicImage`.
Importar dados de `@/data/content` e `@/data/images`.
Manter `dynamic(() => import(...PortfolioDownloadButton), { ssr: false })`.

---

## Ordem de execucao

```
Fase 1 (CSS puro — zero risco):
  1.1 Noise/grain
  1.2 @starting-style
  1.3 interpolate-size
  1.4 content-visibility
  1.5 has() selector
  1.6 Discrete animations
  1.7 Subgrid
  1.8 Gradient mesh
  1.9 Custom cursor CSS
  → npm run build

Fase 2 (Dark mode):
  2.1-2.4 CSS tokens dark
  2.5 ThemeToggle component
  2.6 FOWT prevention script
  → npm run build + verificar visual light/dark

Fase 3 (Componentes):
  3.1 CursorDot
  3.2 Entry classes no Hero
  3.3-3.4 Gradient mesh no Hero e Contato
  3.5 Subgrid no AtoIV
  3.7 Scroll-velocity nav
  → npm run build

Fase 4 (Conteudo):
  4.1 Dados em content.ts
  4.2 Repertorio
  4.3 Depoimentos
  4.4 Integrar em page.tsx
  → npm run build

Fase 5 (Infra):
  5.1 JSON-LD
  5.2 Speculation Rules
  5.3 Sitemap + robots
  5.4 Manifest + favicon
  5.5 Skip-to-content
  5.6 Lazy video
  5.7 Footer fix
  → npm run build

Fase 6 (View Transitions):
  6.1 Verificar docs Next.js 16
  6.2 CSS @view-transition
  → npm run build + testar navegacao entre rotas

Fase 7 (Portfolio redesign):
  Reescrever portfolio/page.tsx
  → npm run build
```

## Regras para o agente executor

1. **Ler `AGENTS.md` ANTES de comecar** — Next.js 16 tem APIs diferentes.
2. **Ler `node_modules/next/dist/docs/`** antes de usar qualquer API do Next.js.
3. **NAO inventar APIs** — se nao encontrar nos docs, perguntar.
4. **Reusar componentes existentes**: Section, Container, Eyebrow, Button, CinematicImage, Marquee, SnapProgress, NumberScrub, MagneticField, SpotlightCursor.
5. **Seguir padroes visuais** de `globals.css`: easings, duracoes, tipografia, cores.
6. **`npm run build`** apos CADA fase.
7. **NAO mudar o que funciona** — cada tarefa e aditiva.
8. **Portugues no conteudo, ingles no codigo**.
9. **`prefers-reduced-motion: reduce`** deve ser respeitado em TUDO que adicionar.
10. **`pointer: coarse`** desabilita cursor effects em touch.
11. **Progressive enhancement**: sempre `@supports` guard para features novas.
12. **Semantic tokens**: usar `var(--color-*)` em vez de cores hardcoded.
