# PALCO v2 — Plano de Evolucao

> Arquitetado por Claude Opus. Executavel pelo Gemini ou qualquer agente.
> Cada tarefa e independente salvo dependencias explicitas.
> REGRA: ler `node_modules/next/dist/docs/` antes de qualquer API Next.js.

---

## Indice

1. [SEO & Meta](#1-seo--meta)
2. [Favicon, Manifest & PWA](#2-favicon-manifest--pwa)
3. [Skip-to-content & a11y](#3-skip-to-content--a11y)
4. [Nova secao: Depoimentos (Ato VI)](#4-nova-secao-depoimentos-ato-vi)
5. [Nova secao: Repertorio (Ato VII)](#5-nova-secao-repertorio-ato-vii)
6. [Redesign /portfolio](#6-redesign-portfolio)
7. [Lazy video + performance](#7-lazy-video--performance)
8. [Sitemap & robots.txt](#8-sitemap--robotstxt)
9. [Ajustes finais](#9-ajustes-finais)

---

## 1. SEO & Meta

### O que

Adicionar JSON-LD structured data (`MusicGroup` schema) no layout root e Open Graph melhorado em cada rota.

### Onde

- Editar: `src/app/layout.tsx`

### Como

Adicionar um `<script type="application/ld+json">` no `<head>` via metadata API do Next.js ou diretamente no body.

```ts
// Dados para o JSON-LD — usar bandInfo e contact de src/data/content.ts
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: bandInfo.name,
  foundingDate: '1969',
  foundingLocation: {
    '@type': 'Place',
    name: 'Jau, Sao Paulo, Brazil',
  },
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
  knowsAbout: ['Casamentos', 'Formaturas', 'Eventos Corporativos', 'Shows Municipais'],
};
```

Inserir no layout:

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

### Padrao existente a seguir

- Metadata ja existe em `layout.tsx:17-30` — expandir, nao substituir.
- Importar `bandInfo`, `contact`, `bandLineup` de `@/data/content`.

### Verificacao

- Rodar `npx next build` sem erros.
- Colar URL em https://search.google.com/test/rich-results (manual).

---

## 2. Favicon, Manifest & PWA

### O que

Adicionar favicon, apple-touch-icon e web manifest basico.

### Onde

- Criar: `public/favicon.ico` (converter de `public/images/logo-freeband.png`)
- Criar: `public/icon-192.png` e `public/icon-512.png` (resize do logo)
- Criar: `src/app/manifest.ts` (Next.js App Router convencao)

### Como

**manifest.ts** (convencao do App Router — gera `/manifest.webmanifest` automaticamente):

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

**Favicon**: usar `sharp` (ja esta em devDependencies) para gerar os icones:

```bash
npx sharp -i public/images/logo-freeband.png -o public/icon-192.png resize 192 192
npx sharp -i public/images/logo-freeband.png -o public/icon-512.png resize 512 512
```

Para o favicon.ico, adicionar `src/app/icon.tsx` ou colocar `favicon.ico` em `src/app/`.

### Padrao existente a seguir

- `next.config.ts` ja existe — nao precisa mudar.
- Verificar convencao de icones em `node_modules/next/dist/docs/01-app/03-api-reference/`.

### Verificacao

- `curl http://localhost:3000/manifest.webmanifest` retorna JSON valido.
- Favicon visivel na aba do browser.

---

## 3. Skip-to-content & a11y

### O que

Adicionar link "Skip to content" e melhorar landmarks ARIA.

### Onde

- Editar: `src/app/page.tsx`
- Editar: `src/components/layout/NavBar.tsx`

### Como

Em `page.tsx`, adicionar antes do `<NavBar />`:

```tsx
<a
  href="#manifesto"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-brand focus:px-6 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-ink-950"
>
  Ir para o conteudo
</a>
```

No `<main>`, adicionar `id="main"` e `role="main"`.

No `NavBar.tsx`, a `<nav>` ja tem semantica correta. Adicionar `aria-label="Navegacao principal"`.

### Padrao existente a seguir

- Usar classes `sr-only` do Tailwind (ja disponiveis).
- Cor `bg-brand` + `text-ink-950` segue o padrao do CTA na NavBar.

### Verificacao

- Tab no topo da pagina mostra o link "Ir para o conteudo".
- Lighthouse Accessibility > 95.

---

## 4. Nova secao: Depoimentos (Ato VI)

### O que

Secao de social proof com depoimentos de clientes. Horizontal scroll-snap como os service cards do Ato IV.

### Onde

- Criar: `src/components/sections/AtoVI_Depoimentos.tsx`
- Editar: `src/data/content.ts` — adicionar array `testimonials`
- Editar: `src/app/page.tsx` — inserir entre AtoV_Contato e Footer

### Dados (adicionar em content.ts)

```ts
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
```

> NOTA: estes sao depoimentos placeholder. O dono do projeto deve substituir por depoimentos reais.

### Estrutura do componente

Seguir EXATAMENTE o padrao do `AtoIV_Eventos.tsx`:

- Server component (nao precisa de "use client" se nao tiver interacao)
  - Mas se usar SnapProgress (scroll-snap), precisa ser "use client" — avaliar
- `Section` variant="ink" pad="xl"
- `Container` + `Eyebrow` number="VI"
- Titulo com `serif-italic text-brand` no destaque
- Cards em `.h-snap` (mesmo scroll-snap horizontal do Ato IV)
- Cada card: borda, hover:border-brand, aspas estilizadas

### Template do card

```tsx
<article className="group relative flex h-full flex-col justify-between gap-8 border border-border bg-bg-raise p-[clamp(1.5rem,2.5vi,2.5rem)] transition-colors duration-500 hover:border-brand">
  {/* Aspas decorativas */}
  <span
    aria-hidden
    className="font-display text-brand leading-none"
    style={{ fontSize: 'var(--text-5xl)' }}
  >
    "
  </span>
  <blockquote className="flex flex-col gap-6">
    <p className="text-text text-pretty" style={{ fontSize: 'var(--text-lg)', lineHeight: 1.55 }}>
      {testimonial.quote}
    </p>
    <footer className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
      <cite
        className="font-display font-semibold text-text not-italic -tracking-[0.01em]"
        style={{ fontSize: 'var(--text-base)' }}
      >
        {testimonial.author}
      </cite>
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-brand">
        {testimonial.event} · {testimonial.year}
      </span>
    </footer>
  </blockquote>
</article>
```

### Integracao em page.tsx

```tsx
import { AtoVI_Depoimentos } from '@/components/sections/AtoVI_Depoimentos';

// Inserir DEPOIS de AtoV_Contato, ANTES de Footer:
<AtoVI_Depoimentos />;
```

### Verificacao

- Secao renderiza sem erros.
- Scroll horizontal funciona no mobile e desktop.
- `prefers-reduced-motion: reduce` desabilita animacoes.

---

## 5. Nova secao: Repertorio (Ato VII)

### O que

Mostrar a versatilidade musical da banda. Grid categorizado de generos com visual editorial.

### Onde

- Criar: `src/components/sections/AtoVII_Repertorio.tsx`
- Editar: `src/data/content.ts` — adicionar array `repertoire`
- Editar: `src/app/page.tsx` — inserir entre AtoIII_Palcos e AtoIV_Eventos

### Dados (adicionar em content.ts)

```ts
export const repertoire = [
  {
    genre: 'Pop & Rock Nacional',
    artists: ['Skank', 'Jota Quest', 'Charlie Brown Jr', 'Paralamas', 'Titas', 'Legiao Urbana'],
  },
  {
    genre: 'Pop & Rock Internacional',
    artists: ['Queen', 'U2', 'Coldplay', 'Bruno Mars', 'Michael Jackson'],
  },
  {
    genre: 'Sertanejo & Country',
    artists: ['Jorge & Mateus', 'Henrique e Juliano', 'Gusttavo Lima', 'Cristian e Ralf', 'Daniel'],
  },
  {
    genre: 'Samba & Pagode',
    artists: ['Jorge Aragao', 'Beth Carvalho', 'Zeca Pagodinho', 'Thiaguinho', 'Grupo Revelacao'],
  },
  {
    genre: 'MPB & Classicos',
    artists: ['Tim Maia', 'Erasmo Carlos', 'Roberto Carlos', 'Djavan', 'Gilberto Gil'],
  },
  {
    genre: 'Dance & Flashback',
    artists: ['Donna Summer', 'ABBA', 'Bee Gees', 'Kool & The Gang', 'Earth Wind & Fire'],
  },
];
```

> NOTA: repertorio placeholder — substituir pelos generos reais da banda.

### Estrutura

Server component. Layout editorial vertical:

```
Eyebrow "IV" > "Repertorio"
Titulo: "Todos os ritmos, um so palco."
Subtitulo explicativo

Grid 2-3 colunas de cards de genero:
  Cada card:
    - Nome do genero em font-display
    - Lista de artistas em font-mono menor
    - Borda + hover:border-brand (padrao do projeto)
```

### IMPORTANTE: renumeracao

Se esta secao entrar entre Ato III e Ato IV, os numeros dos Atos subsequentes mudam:

- Ato III: Palcos (fica)
- **Ato IV: Repertorio (NOVO)**
- Ato V: Eventos (era IV)
- Ato VI: Contato (era V)
- **Ato VII: Depoimentos (NOVO)**

**OU** — manter a numeracao original e adicionar as novas secoes sem numero (sem Eyebrow number). Decisao do dono do projeto.

**RECOMENDACAO**: manter numeracao I-V original intacta. Novas secoes ficam sem numero romano, posicionadas assim:

```
Hero
Ato I  — Manifesto
Ato II — Galeria
Ato III — Palcos
[Repertorio — sem numero, entre Palcos e Eventos]
Ato IV — Eventos
Ato V  — Contato
[Depoimentos — sem numero, entre Contato e Footer]
Footer
```

Isso evita quebrar NavBar links, IDs de secao e a11y existentes.

### Verificacao

- Grid responsivo: 1 col mobile, 2 cols tablet, 3 cols desktop.
- Todos os textos em portugues.

---

## 6. Redesign /portfolio

### O que

A pagina `/portfolio` atual e minimalista demais — so tem um botao de download PDF. Redesenhar como uma landing page completa que mostra o conteudo do portfolio antes de oferecer o download.

### Onde

- Reescrever: `src/app/portfolio/page.tsx`

### Estrutura nova

```
Header com logo + link "Voltar ao site"

Hero compacto:
  - Eyebrow "Portfolio Digital"
  - Titulo: "Mais de 57 anos em cada palco"
  - Subtitulo + CTA download

Secao "Quem Somos" (resumo de release.full, 1-2 paragrafos)

Galeria compacta (6 fotos selecionadas de curatedGallery, sem lightbox)

Secao "O que oferecemos" (services cards simplificados)

Secao "Contato" (phone + whatsapp + email)

Footer compacto
```

### Padrao

- "use client" no topo (precisa do dynamic import pro PDF download).
- Reusar `Container`, `Eyebrow`, `Section`, `Button`, `CinematicImage` existentes.
- Importar dados de `@/data/content` e `@/data/images`.
- Manter o `dynamic(() => import(...PortfolioDownloadButton), { ssr: false })` para o botao PDF.

### Verificacao

- Pagina renderiza com dados reais.
- Botao de PDF funciona.
- Layout coerente com o site principal.

---

## 7. Lazy video + performance

### O que

O hero carrega `hero.mp4` imediatamente. Em mobile, isso desperdiça banda. Adicionar lazy loading inteligente.

### Onde

- Editar: `src/components/sections/Hero.tsx`

### Como

Usar `preload="none"` no `<video>` e um `IntersectionObserver` para trocar para `preload="auto"` quando visível. Ou, mais simples: usar `preload="metadata"` que carrega apenas os primeiros frames.

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata" // <-- adicionar (antes era implicitamente "auto")
  poster="/images/hero-poster.jpeg"
  className="absolute inset-0 -z-20 h-full w-full object-cover"
>
  <source src="/video/hero.mp4" type="video/mp4" />
</video>
```

### Verificacao

- DevTools Network: video nao carrega inteiro no first load.
- Video ainda toca normalmente ao rolar.

---

## 8. Sitemap & robots.txt

### O que

Gerar sitemap.xml e robots.txt automaticos via convencoes do App Router.

### Onde

- Criar: `src/app/sitemap.ts`
- Criar: `src/app/robots.ts`

### Como

**sitemap.ts**:

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

**robots.ts**:

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/orcamento/' },
    sitemap: 'https://freeband.com.br/sitemap.xml',
  };
}
```

### Padrao existente a seguir

- Verificar as convencoes em `node_modules/next/dist/docs/01-app/03-api-reference/` antes de implementar.
- A rota `/orcamento/` e privada (token-protected), entao deve ser bloqueada no robots.

### Verificacao

- `curl http://localhost:3000/sitemap.xml` retorna XML valido.
- `curl http://localhost:3000/robots.txt` retorna regras corretas.

---

## 9. Ajustes finais

### 9a. NavBar — atualizar links se novas secoes tiverem IDs

Se as novas secoes (Repertorio, Depoimentos) ganharem IDs navegaveis, atualizar o array `LINKS` em `src/components/layout/NavBar.tsx` e `FOOTER_LINKS` em `src/components/layout/Footer.tsx`.

**RECOMENDACAO**: NAO adicionar ao NavBar. Manter os 5 links originais limpos. As novas secoes sao descobertas pelo scroll, nao pela nav.

### 9b. Footer — year ribbon

O array `YEAR_RIBBON` em `Footer.tsx:3` esta hardcoded com "2026". Tornar dinamico:

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

### 9c. Open Graph images

A imagem OG atual (`/images/festa-55.jpeg`) e generica. Criar uma imagem OG dedicada (1200x630) com o logo + tagline da Freeband. Salvar como `public/images/og-freeband.jpg` e atualizar em `layout.tsx`.

---

## Ordem de execucao recomendada

```
Fase 1 (infraestrutura, sem risco visual):
  1. SEO & Meta (tarefa 1)
  2. Sitemap & robots (tarefa 8)
  3. Skip-to-content (tarefa 3)
  4. Lazy video (tarefa 7)
  5. Ajustes finais (tarefa 9)

Fase 2 (conteudo novo):
  6. Dados em content.ts (testimonials + repertoire)
  7. AtoVI_Depoimentos (tarefa 4)
  8. AtoVII_Repertorio (tarefa 5) — depende de 6

Fase 3 (redesign):
  9. Portfolio page (tarefa 6)
```

## Regras para o agente executor

1. **Ler `AGENTS.md` antes de comecar** — Next.js 16 tem APIs diferentes.
2. **Ler docs em `node_modules/next/dist/docs/`** antes de usar qualquer API do Next.js.
3. **NAO inventar APIs** — se nao encontrar nos docs, perguntar.
4. **Reusar componentes existentes** — `Section`, `Container`, `Eyebrow`, `Button`, `CinematicImage`, `Marquee`, `SnapProgress`.
5. **Seguir os padroes visuais** — classes, spacing, tipografia, motion sao todos documentados em `globals.css`.
6. **Testar**: `npm run build` deve passar sem erros apos cada tarefa.
7. **Nao mudar o que funciona** — cada tarefa e aditiva, nao destrutiva.
8. **Portugues no conteudo, ingles no codigo**.
