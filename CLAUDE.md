# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site + internal quoting tool for **Internacional Freeband**, a Brazilian band (est. 1969). All UI copy and domain terms are Brazilian Portuguese: "orçamento" = quote/proposal, "palco" = stage, "arquivo" = the poster archive. The design system is called **"Painel de LED"**: the band plays in front of a wall of blue LED dots with its name in red acrylic, and the whole interface is built from those two facts.

## Commands

- `npm run dev` — dev server (port 3000 is often taken by another local tool; `npx next dev -p 3500` works)
- `npm run build` / `npm start` — production build / runtime
- `npm run lint` — ESLint, **zero warnings** (`--max-warnings 0`)
- `npm run typecheck` — `tsc --noEmit`. After adding or removing a route, `npx next typegen` (or a build) refreshes the generated route types it reads
- `npm test` — Vitest once (jsdom + Testing Library); `npm run test:watch` for watch mode
- Single test file: `npx vitest run src/lib/__tests__/session.test.ts`
- `npm run tokens` — **required after editing `src/design/tokens.ts`**; regenerates `src/styles/tokens.css` (a test fails when it is stale)
- `npm run blur` — **required after adding/re-encoding any image or video poster**; regenerates `src/data/blur.ts` (a test fails without it)
- `npm run smoke` — Puppeteer against a running server, every route at 1440 and 390. Fails on: a route not answering 200, a console error, horizontal overflow, a photograph that did not load, is cropped, sits under another or runs out of its column, a tap target under 44px on the phone, an unknown address not answering 404 inside the site shell, a page that needs JavaScript to show its heading or photographs, an axe-core violation rated serious or critical, the photo viewer not opening over the gallery at the photograph's address (or that address not being a page when loaded cold), a clip playing unasked or two sounding at once, a share card that is missing, not 1200×630 or over 300 KB, the legacy token link not reaching `/orcamento`, the A4 preview collapsing, a 320px phone scrolling sideways, or the portfolio button not producing a real PDF. **Run it against `next start`**, so the production CSP is exercised. Honors `BASE_URL`, `ORCAMENTO_TOKEN`, `PUPPETEER_BROWSER_URL`, `PUPPETEER_EXECUTABLE_PATH`
- `npm run smoke:motion` — Puppeteer with `prefers-reduced-motion: reduce`: no video plays, the WebGL wall stays off, no CSS animation runs, nothing is left behind its cover of dots
- `npm run perf` — performance budget against `next start` with the CPU slowed 4×: JS per route, LCP, CLS, long tasks, canvases, media fetched unasked, the fold's poster
- `npm run social -- <campanha>` (or `--todas`) — renders the Instagram cards of `scripts/social/campanhas/<campanha>.json` into the workspace's `saidas/social/`
- `node scripts/video/analyze.mjs` / `encode.mjs` — contact sheets and loudness maps of the camera masters; the clips with sound (cuts live in `scripts/video/clips.mjs`)
- `node scripts/import-archive.mjs` — brings archive prints into `public/images` (rotation and trim of each one are the table in the script)
- `npm run optimize:images` — recompress large JPEGs in `public/images`

CI (`.github/workflows/ci.yml`) runs `npm audit`, tests, lint, typecheck, build, then both smokes and the performance budget against `next start` on every PR and push to `main`; Vercel deploys automatically from `main`. Node 22.18+ (`engines` in `package.json`).

## Next.js version

Next.js 16 differs from older training data. When unsure, read the guides in `node_modules/next/dist/docs/` (e.g. `params` in server components is a Promise; `next/dynamic` with `ssr: false` is only legal inside a Client Component; the middleware file is `src/proxy.ts`; `next/image` takes `preload`, `priority` is deprecated; an error boundary receives `retry`). `next dev` re-inserts an agent-rules block at the end of this file — commit it with your work.

## Environment variables

See `.env.example`. All three are required for the protected area:

- `ORCAMENTO_TOKEN` — accepted once via legacy `/orcamento/<token>` links (exchanged for a session cookie)
- `ADMIN_PASSWORD` — password for the `/admin` login
- `SESSION_SECRET` — HMAC key that signs the `freeband_admin` session cookie

To exercise login locally without touching `.env.local`, pass test values as environment variables: they override the file.

## Architecture

Next.js App Router + React 19 + TypeScript, Tailwind CSS 4 (CSS-based config). Path alias `@/*` → `src/*`.

```
src/app          routes; globals.css only imports the sheets in src/styles
src/styles       tokens.css (generated), base, motifs, led, gallery, player, motion, print
src/design       tokens.ts, color.ts, wordmark.ts — plain TypeScript, loadable by Node
src/data         band, contact, packages, copy/*, media/*, blur.ts (generated)
src/lib          led/, gallery/, media/, seo/, og/, plates.ts, session, proposta, format…
src/hooks        useReducedMotion, useInertOutside, useBodyScrollLock
src/components   ui, brand, media (lightbox/, player/), site, home, palco, arquivo, historia, orcamento, pdf
```

### Routes

| Route | What | Where |
|---|---|---|
| `/` | Home in five blocks: `Fold` (server; `HeroLoop` is its one island), `Caminhao`, `Blocos` (scroll-snap), `Prova` (three clips, flyers, the running sign), `Data` | `src/app/(site)/page.tsx`, `src/components/home/` |
| `/palco` | Three acts as plates with an index, wardrobe, rig, four clips with sound | `src/components/palco/` |
| `/arquivo` | Nine flyers, category filter with counts | `src/components/arquivo/` |
| `/historia` | The timeline: the 1969 chapter on sepia, four more eras, each with its album; the release; the names | `src/components/historia/` |
| `/portfolio` | Download of the portfolio PDF | `src/components/pdf/portfolio/` |
| `/palco/foto/[id]`, `/arquivo/cartaz/[id]`, `/historia/foto/[id]` | One photograph on a page of its own (static, `noindex, follow`, the photo as its share image) | `src/components/media/lightbox/PhotoViewer.tsx` |
| `/admin` | Login (server action, rate limit, constant-time compare); outside the `(site)` group, `noindex` | `src/app/admin/` |
| `/orcamento` | Proposal editor on the paper theme: form + scaled A4 preview, print, PDF, logout; gated by `src/proxy.ts` | `src/components/orcamento/` |

The `(site)` route group carries the public shell (`LedStage`, `SkipLink`, `Nav`, `Footer`, the band's JSON-LD) and the `@lightbox` parallel slot; `/admin` and `/orcamento` sit outside it. Each public page wraps its content in `RouteTransition` and states what it is with `JsonLd` (`src/lib/seo/jsonld.ts`). The root `not-found.tsx` composes the shell itself (the root layout has none); `(site)/error.tsx` and `global-error.tsx` are the error boundaries. `LegacyAnchors` on the home maps the old one-page anchors to the new routes.

**Metadata.** A page that sets `openGraph`/`twitter` replaces the layout's object whole, so every inner page builds them with `socialMetadata()` from `src/lib/seo/metadata.ts`. The picture is never named there: each route has an `opengraph-image.tsx` (rendered by `src/lib/og/card.tsx`, ≤ 300 KB, pinned by a test), and Next only uses it when the segment's metadata sets no `openGraph.images`.

### The photo viewer

Every photograph on `/palco`, `/arquivo` and `/historia` is a link (`PhotoLink`) to its own address. Inside the site that navigation is **intercepted** (`src/app/(site)/@lightbox/(.)…`) and the viewer opens as a dialog over the page, which becomes inert; loaded cold, the same address is a static page. `src/data/media/gallery.ts` holds the three sets, in reading order — an id is the last segment of a URL people share and must never change. Zoom stops at the file's native resolution (read from `aspect`); gestures are a pure state machine (`src/lib/gallery/gesture.ts`). A step inside the dialog is `<Link replace>`; on the photo's own page it is a full load, because every soft navigation to that path would be intercepted.

### Access control

`src/proxy.ts` gates every `/orcamento/*` path: a valid session cookie passes (and is re-issued in its last day); `/orcamento/<token>` never has a page — a matching token (percent-decoded first) is exchanged for a cookie and redirected to `/orcamento`, an already-authenticated visitor is redirected there too, anything else goes to `/admin`. `src/app/orcamento/page.tsx` verifies the cookie again: the proxy is the first gate, not the only one. The cookie is `"<exp>.<HMAC-SHA256(exp)>"` signed with Web Crypto (`src/lib/session.ts`), so the same code runs in the Edge proxy and Node server actions; named `__Host-freeband_admin` in production, `freeband_admin` elsewhere; 7 days; logout expires it through `expiredSessionCookieOptions()`; `secretsMatch` compares secrets in constant time. Wrong passwords and wrong tokens both go through `src/lib/rateLimit.ts`. Security headers, the static CSP and the cache lifetimes of `public/` live in `next.config.ts` (`csp.test.ts`, `headers.test.ts`); nothing in `public/` is marked immutable, because no file name there carries a hash. `docs/THREAT_MODEL.md` describes the same system.

### Single sources of truth

- **Design tokens** — `src/design/tokens.ts` (colours in oklch plus the acrylic's red ramp, type scale, tracking, easings, radii, layout incl. `nav-h` and `tap-min`). `npm run tokens` writes `src/styles/tokens.css`; the PDFs read the TS through `src/components/pdf/theme.ts`. `contrast.test.ts` proves every text/background pair clears WCAG AA.
- **The wordmark** — `src/design/wordmark.ts`: the eight glyphs and the construction grid, as data. The site, the PDFs, the share cards, the social pipeline and the promo reel all draw from it.
- **Copy** — `src/data/band.ts` (identity, line-up, release, `timeline`, artists, partners), `packages.ts`, `contact.ts`, and per-page strings in `src/data/copy/*.ts` (`system.ts` holds the 404, the error boundary and the manifest; `player.ts` the player's labels). Never hardcode copy in components. `releaseShort` in `band.ts` is reused in three places — edit it there only. Copy that counts from today's date is rendered on the server only (`revalidate = 86400` on the `(site)` layout).
- **Media** — `src/data/media/paths.ts` registers every image path; `frames.ts` (33 stage frames in three acts), `figurinos.ts`, `estrutura.ts`, `posters.ts`, `videos.ts` (the four clips), `hero.ts`, `gallery.ts` (the viewer's sets). An era of `timeline` has a `lead` (one photograph or a pair — what the PDF prints) and an optional `album` of plates. Every photo declares `aspect` as the file's real `W/H`; `media.test.ts` checks it against disk (±2%), enforces the resolution floors, whitelists `quality` values, requires a blur entry for everything rendered and holds the clips to their byte budgets.

### Photographs are never cropped

Every photo goes through `Photo` / `PhotoView`, whose box takes the file's real aspect, so `object-cover` has nothing to crop. Rows of photos are **plates** (`PlateRow`, `src/lib/plates.ts`): equal height, column widths in `fr` proportional to each photo's ratio; portraits stay side by side on phones, anything else stacks. The PDFs follow the same rule with `PlateRowPdf`. The one exception is the fold's stage poster, a backdrop under a scrim, marked `data-backdrop`. A small scan (five flyers are 400×300) is shown at its own size, never enlarged.

`Photo` looks the blur placeholder up and belongs to Server Components; a Client Component renders `PhotoView` and takes `blur` as a prop — `client-boundary.test.ts` fails if any `'use client'` file reaches `src/data/blur.ts`, directly or through an import.

### The LED wall

One idea carries every motif (`src/styles/led.css`): **the wall is a mask**. A grid of round holes over anything turns it into dots; taking the grid away resolves it into the thing itself. Content is therefore always in the HTML and visible without JavaScript; the dots are only how it arrives.

- `LedStage` — the wall behind every public page: light under a dot mask. `LedStageDriver` moves the light with `transform`/`opacity` only (pointer, the level of what is playing, a sweep on route change).
- `.led-resolve` (`Photo led`, `SectionHeader`) — a cover of the page colour pierced by dots, fading on a scroll-driven animation.
- `LedWordmark` — the fold: the mark in dots, computed on the server from the vector (`src/lib/led/glyphs.ts`, `svg.ts`), then the acrylic takes over on a CSS keyframe.
- `LedNumber` — digits in a 5×7 matrix as two SVG paths (`src/lib/led/matrix.ts`; the zero is an open oval — slashed, it read as an eight when small). `LedSign` — the running names behind fixed dots.
- `HeroLoop` + `src/lib/led/wall.ts` — the one canvas on the site: a WebGL2 fragment shader over the fold that draws the stage loop as dots, resolves into the picture, and breaks back into dots under the pointer and as the fold scrolls away. It starts on idle and fails closed to the poster (no WebGL2, lost context, reduced motion, Save-Data).

`Wordmark.tsx` paints in `currentColor`; the red belongs to the wordmark and the primary CTA only. Its acrylic gradient is in **user space** — one measured against each shape's bounding box is dropped for the straight strokes.

### Motion

Two curves: `--ease-light` (a LED coming on: fast attack, long settle) for entrances and interface transitions, `--ease-slide` for panels moving (a photograph travelling into the viewer, the lit dot under the current route, the mobile menu). View transitions go through `ui/Transition.tsx` (React's `ViewTransition` where it exists, a fragment under Vitest). Everything checks `prefers-reduced-motion` in JS (`useReducedMotion`) and CSS (`src/styles/motion.css`); `npm run smoke:motion` proves nothing moves.

### Video

`public/video/<id>.av1.mp4`, `<id>.mp4` (H.264), `<id>.jpg` and `<id>.levels.json` are the four clips with sound, cut from the band's AVCHD masters in the workspace's `fontes/video/masters/` (1440×1080i anamorphic, AC-3 5.1) by `scripts/video/encode.mjs`: deinterlaced with `bwdif`, 1920×1080, AAC stereo at −16 LUFS, H.264 ≤ 10 MB and AV1 ≤ 5 MB each. LED backdrops and smoke are expensive to encode: a clip over budget gets its own `crf` in `clips.mjs`. The player (`src/components/media/player/`) ships native controls in the server HTML and replaces them after hydration; it never plays without a press, lets one clip sound at a time (`audioFocus.ts`), pauses out of view and publishes the clip's level to the LED wall from the pre-computed envelope (`src/lib/media/level.ts`), so there is no Web Audio and no CSP change. `hero-loop.mp4` is the fold's silent 720p loop, attached on idle, never under reduced motion; its poster is the LCP.

### PDFs

`@react-pdf/renderer` must stay out of the SSR module graph: pages import only `PortfolioDownload` / `Preview`, Client Components that load `*DownloadButton` through `next/dynamic` with `{ ssr: false }`. Everything under `src/components/pdf/` is client-only. The layout engine is WebAssembly inlined as a `data:` URL, so the CSP needs `'wasm-unsafe-eval'` in `script-src` and `data:` in `connect-src`. The portfolio is seven pages (`Cover`, `About`, `Timeline`, `Partners`, `Gallery`, `Services`, `Contact`) and must stay seven and under 5 MB — a page that overflows silently adds one; react-pdf hands the page's line height down as a fixed 13.8pt box, so any type set larger needs its own `lineHeight`. Dots are zero-length path segments with round caps (`LedWallPdf`, `motifs.tsx`). The proposal is one document described once: `propostaBlocks()` in `src/lib/proposta.ts` feeds both `OrcamentoPdf` and the HTML `PrintLayout`, over `buildProposta` and the `format.ts` helpers, so preview, print and PDF never disagree. `PDF_OUT_DIR=<dir> npx vitest run src/components/pdf` writes both PDFs to disk for a look.

### Themes

Dark site (`themes.dark`). `[data-theme='paper']` re-points the semantic variables for `/orcamento` and the PDFs; `[data-theme='sepia']` for the founding chapter. Components use only semantic classes (`bg-surface`, `text-ink-muted`, `border-line`, `text-led-text`, `bg-red`…). Every sheet in `src/styles` sits in a cascade layer, so a utility class always beats the motif it is set on.

### Build note

`next.config.ts` pins `turbopack.root` because a stray `package-lock.json` in the user's home directory breaks Turbopack's workspace detection during production builds. Don't remove it. `images.qualities` is `[75, 90]`; the media test rejects any other literal.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
