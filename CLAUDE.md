# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site + internal quoting tool for Internacional Freeband, a Brazilian band (est. 1969). All UI copy, content, and domain terms are Brazilian Portuguese: "orçamento" = quote/proposal, and the homepage sections are named `Ato*` ("act", as in a stage show).

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm test` — run all tests once (Vitest + jsdom + Testing Library; tests live in `src/lib/__tests__/`)
- `npm run test:watch` — watch mode
- Single test file: `npx vitest run src/lib/__tests__/format.test.ts`

Visual checks: `scripts/*.mjs` are ad-hoc Puppeteer screenshot scripts, not wired into Vitest. Run e.g. `node scripts/visual-smoke.mjs` while the dev server is up; they honor `BASE_URL` and `ORCAMENTO_TOKEN` env vars.

## Next.js version

This project uses Next.js 16, which may differ from your training data. When unsure about an API or convention, read the guides shipped in `node_modules/next/dist/docs/` instead of assuming older Next.js behavior (e.g. `params` in server components is a Promise and must be awaited). Heed deprecation notices.

## Environment variables

- `ORCAMENTO_TOKEN` — secret URL token that unlocks `/orcamento/[token]`
- `ADMIN_PASSWORD` — password for the `/admin` login

## Architecture

Next.js App Router + TypeScript, Tailwind CSS 4, Framer Motion. Path alias `@/*` → `src/*`.

### Routes & access control

- `/` — single-page landing: `src/app/page.tsx` composes `Hero` plus the `Ato*` sections from `src/components/sections/`.
- `/portfolio` — public page to download the band's portfolio PDF.
- `/admin` — login form; a server action checks `ADMIN_PASSWORD`, sets the `freeband_admin` cookie (7 days), and redirects to `/orcamento/{ORCAMENTO_TOKEN}`.
- `/orcamento/[token]` — quote builder (split-pane form + live A4 preview). `src/middleware.ts` gates every `/orcamento` path: requests pass with the admin cookie or when the URL token equals `ORCAMENTO_TOKEN`; anything else redirects to `/admin`. The route page re-validates the token via `src/lib/token.ts` and redirects home on mismatch.

### PDF generation

Two documents are built with `@react-pdf/renderer`: the portfolio (`src/components/pdf/portfolio/PortfolioDocument.tsx`) and the quote (`src/components/pdf/orcamento/OrcamentoPdf.tsx`). Convention: the PDF toolkit must stay out of the SSR module graph — pages reference only the `*DownloadButton` wrappers, loaded through `next/dynamic` with `{ ssr: false }`. Keep that boundary when adding PDF features. The quote page additionally supports `window.print()` via `PrintLayout` and `no-print` classes.

### Content & data

`src/data/content.ts` is the single source of truth for all band copy and metadata (Portuguese, extracted from the official brochure); `src/data/images.ts` maps every image path used on the site and in PDFs. Don't hardcode copy or image paths in components.

### Design system ("PALCO")

Tailwind 4 with CSS-based config: all tokens live in the `@theme` block of `src/app/globals.css` — semantic colors (`bg`, `bg-raise`, `bg-high`, `text`, `text-muted`, `brand`, …), a fluid `--text-*` type scale, and six named easing curves each with a distinct purpose (don't fall back to a generic `ease`). The site is dark-first; the orcamento editor is scoped to a light "paper" theme. Fonts are wired in `src/app/layout.tsx` (Google fonts + local files in `src/app/fonts/`).

### Build note

`next.config.ts` pins `turbopack.root` to this project because a stray `package-lock.json` in the user's home directory breaks Turbopack's workspace auto-detection during production builds. Don't remove it.
