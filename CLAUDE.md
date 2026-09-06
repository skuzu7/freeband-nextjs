# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site + internal quoting tool for **Internacional Freeband**, a Brazilian band (est. 1969). All UI copy and domain terms are Brazilian Portuguese: "orçamento" = quote/proposal, "palco" = stage, "arquivo" = the poster archive. The design system is called **"Painel de LED"**: the band plays in front of a wall of blue LED dots with its name in red acrylic, and the whole interface is built from those two facts.

## Commands

- `npm run dev` — dev server at http://localhost:3000 (port 3000 is often taken by another local tool; `npx next dev -p 3100` works)
- `npm run build` / `npm start` — production build / runtime
- `npm run lint` — ESLint, **zero warnings** (`--max-warnings 0`)
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Vitest once (jsdom + Testing Library); `npm run test:watch` for watch mode
- Single test file: `npx vitest run src/lib/__tests__/session.test.ts`
- `npm run tokens` — **required after editing `src/design/tokens.ts`**; regenerates `src/app/tokens.css` (a test fails when it is stale)
- `node scripts/generate-blur.mjs` — **required after adding/re-encoding any image**; regenerates `src/data/blur.ts` (a test fails without it)
- `npm run smoke` — Puppeteer: every route at 1440 and 390, fails on console errors, horizontal overflow, a cropped photograph, or the legacy token link not reaching `/orcamento`. Needs a server up; honors `BASE_URL`, `ORCAMENTO_TOKEN`, `PUPPETEER_BROWSER_URL` (attach to a running Chrome), `PUPPETEER_EXECUTABLE_PATH`
- `npm run smoke:motion` — Puppeteer with `prefers-reduced-motion: reduce`: asserts no video plays, no CSS animation runs, the LED panel is already lit
- `npm run optimize:images` — recompress large JPEGs in `public/images`

CI (`.github/workflows/ci.yml`) runs lint + typecheck + test + build on every PR and push to `main`; Vercel deploys automatically from `main`.

## Next.js version

Next.js 16 differs from older training data. When unsure, read the guides in `node_modules/next/dist/docs/` (e.g. `params` in server components is a Promise; `next/dynamic` with `ssr: false` is only legal inside a Client Component; the middleware file is `src/proxy.ts`). `next dev` re-inserts an agent-rules block at the end of this file — commit it with your work.

## Environment variables

See `.env.example`. All three are required for the protected area:

- `ORCAMENTO_TOKEN` — accepted once via legacy `/orcamento/<token>` links (exchanged for a session cookie)
- `ADMIN_PASSWORD` — password for the `/admin` login
- `SESSION_SECRET` — HMAC key that signs the `freeband_admin` session cookie

To exercise login locally without touching `.env.local`, pass test values as environment variables: they override the file.

## Architecture

Next.js App Router + React 19 + TypeScript, Tailwind CSS 4 (CSS-based config). Path alias `@/*` → `src/*`.

### Routes

| Route | What | Where |
|---|---|---|
| `/` | Home in five blocks: `Fold` (LED panel lights the wordmark over the stage loop), `Caminhao` (the two packages, the rig, the line-up), `Blocos` (thematic blocks, scroll-snap), `Prova` (reels, flyers, names), `Data` (contact) | `src/app/(site)/page.tsx`, `src/components/home/` |
| `/palco` | Full gallery: three acts as plates, wardrobe, rig, four reels with one pause control | `src/components/palco/` |
| `/arquivo` | Nine flyers, category filter with counts, keyboard lightbox | `src/components/arquivo/`, `src/components/media/Lightbox.tsx` |
| `/historia` | 1969 chapter in sepia, five eras, the release, the names | `src/components/historia/` |
| `/portfolio` | Download of the portfolio PDF | `src/components/pdf/portfolio/` |
| `/admin` | Login (server action, rate limit, constant-time compare); outside the `(site)` group, `noindex` | `src/app/admin/` |
| `/orcamento` | Proposal editor on the paper theme: form + scaled A4 preview, print, PDF, logout; gated by `src/proxy.ts` | `src/components/orcamento/` |

The `(site)` route group carries the public shell (`SkipLink`, `Nav`, `Footer`); `/admin` and `/orcamento` sit outside it. `LegacyAnchors` on the home maps the old one-page anchors (`#palco`, `#arquivo`, …) to the new routes.

### Access control

`src/proxy.ts` gates every `/orcamento/*` path: a valid `freeband_admin` cookie passes; `/orcamento/<token>` never has a page — a matching token is exchanged for a cookie and redirected to `/orcamento`, an already-authenticated visitor is redirected there too, anything else goes to `/admin`. The cookie is `"<exp>.<HMAC-SHA256(exp)>"` signed with Web Crypto (`src/lib/session.ts`), so the same code runs in the Edge proxy and Node server actions; 7 days; `secretsMatch` compares secrets in constant time. `src/app/admin/actions.ts` rate-limits failures per IP in memory (per instance on Vercel). The contract is pinned by `src/lib/__tests__/session.test.ts`.

### Single sources of truth

- **Design tokens** — `src/design/tokens.ts` (colours in oklch, type scale, tracking, easings, radii, layout). `npm run tokens` writes `src/app/tokens.css`, which the Tailwind `@theme` consumes; the PDFs read the TS directly through `src/components/pdf/theme.ts`. `src/design/__tests__/contrast.test.ts` proves every text/background pair clears WCAG AA; `tokens.test.ts` proves the CSS is current.
- **Copy** — `src/data/band.ts` (identity, line-up, release, timeline, artists, partners), `src/data/packages.ts`, `src/data/contact.ts`, and per-page strings in `src/data/copy/*.ts` (`home`, `palco`, `arquivo`, `historia`, `portfolio` incl. the PDF pages, `admin`, `orcamento` incl. the proposal document, `site` for nav/footer/SEO). Never hardcode copy in components. `releaseShort` in `band.ts` is the band's one-line description reused by the meta description, `/palco` and the release — edit it there only.
- **Media** — `src/data/media/paths.ts` registers every image path; `frames.ts` (14 stage frames in three acts, grouped into plates), `figurinos.ts`, `estrutura.ts`, `reels.ts`, `posters.ts`, `hero.ts`. Every photo declares `aspect` as the file's real `W/H`; `src/data/__tests__/media.test.ts` checks it against disk (±2%), enforces the ≥900px long-edge floor for gallery photos, whitelists `quality` values against `next.config.ts`, and requires a blur entry for everything rendered.

### Photographs are never cropped

Every photo goes through `components/media/Photo.tsx`, whose box takes the file's real aspect, so `object-cover` has nothing to crop. Rows of photos are **plates** (`PlateRow`, `plateLayout()`): equal height, column widths in `fr` proportional to each photo's ratio; portraits stay side by side on phones, anything else stacks. The PDFs follow the same rule with `PlateRowPdf`. The one exception is the fold's stage poster, a backdrop under a scrim, marked `data-backdrop` so the smoke test skips it. Small 600×400 scans and 400×300 flyers exist only for the PDF and the archive.

### The wordmark and the LED motifs

`src/components/brand/Wordmark.tsx` is the logo redrawn as vector on a documented grid (x-height 100, stroke 19, ascender 127, bowls one x-height wide). It paints in `currentColor`; the red (`--color-red`) belongs to the wordmark and the primary CTA only. Never set it in a font. `GLYPHS`/`WORDMARK` are exported for `LedPanel` (lights the same geometry in dots) and `WordmarkPdf` (draws it with react-pdf `Svg/Path/Circle`).

- `LedPanel` — canvas that rasterises text, the wordmark or an image into a dot matrix and lights it once in view (`src/lib/led/rasterize.ts` is the pure, tested part; `sources.ts` the browser adapters). Budget: ≤6 000 dots, one rAF loop only while lighting, then a static frame. Under reduced motion the final frame is drawn at once. `dimDots`/`field` off and `fadeWhenLit` on when it sits over a photograph (the fold).
- `LedNumber` — digits in a real 5×7 matrix (SVG); `ledDots()` is shared with `LedNumberPdf`.
- `DotGrid` (CSS field), `Divider`/`.dot-line` (one row of the panel), `Label` (caps + tracking; the site has no mono face).

### Motion

Two curves: `--ease-light` (a LED coming on: fast attack, long settle) for entrances and interface transitions, `--ease-slide` for panels moving. Everything checks `prefers-reduced-motion` in JS (`useReducedMotion`) and CSS; `npm run smoke:motion` proves nothing moves.

### Video

`public/video/reel-*.mp4` are twelve-second silent 16:9 clips (H.264 1280×720/30, ≤2.3 MB) cut from the band's AVCHD masters (`Desktop/Freeband/*.m2ts`, 1440×1080i anamorphic), each with a `.jpg` poster from its own first frame. `Reel` attaches its source only on intersection and plays only while visible; `ReelGroup` gives a set one pause control (WCAG 2.2.2). The fold's `hero-loop.mp4` attaches on `requestIdleCallback`, never under reduced motion; its poster is the LCP. Re-encode recipe: `-vf "yadif=1,scale=1920:1080,setsar=1,fps=30,scale=1280:720,hqdn3d=2.5:2:5:4" -crf 30 -preset veryslow -an` (raise denoise/crf for glittery backdrops).

### PDFs

`@react-pdf/renderer` must stay out of the SSR module graph: pages import only `PortfolioDownload` / `Preview`, Client Components that load `*DownloadButton` through `next/dynamic` with `{ ssr: false }`. Everything under `src/components/pdf/` is client-only. Fonts are the static Outfit TTFs in `public/fonts` (`registerPdfFonts()`, idempotent; pt-BR diacritics verified). The portfolio is seven pages (`Cover`, `About`, `Timeline`, `Partners`, `Gallery`, `Services`, `Contact`) and must stay seven — a page that overflows silently adds one; `pdf/portfolio/images.ts` lists the frames it prints with their aspects (checked by the media test). `OrcamentoPdf` reads the same copy and `src/lib/format.ts` helpers as `PrintLayout`, so preview, print and PDF never disagree on a number.

### Themes

Dark site (`themes.dark`). `[data-theme='paper']` re-points the semantic variables for `/orcamento` and the PDFs; `[data-theme='sepia']` for the 1969 chapter. Components use only semantic classes (`bg-surface`, `text-ink-muted`, `border-line`, `text-led-text`, `bg-red`…).

### Build note

`next.config.ts` pins `turbopack.root` because a stray `package-lock.json` in the user's home directory breaks Turbopack's workspace detection during production builds. Don't remove it. `images.qualities` is `[75, 90]`; the media test rejects any other literal.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
