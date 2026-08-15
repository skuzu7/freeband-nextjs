# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site + internal quoting tool for Internacional Freeband, a Brazilian band (est. 1969). All UI copy, content, and domain terms are Brazilian Portuguese: "orçamento" = quote/proposal, and the homepage sections are named `Ato*` ("act", as in a stage show).

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm test` — run all tests once (Vitest + jsdom + Testing Library; tests live in `src/lib/__tests__/` and `src/components/layout/__tests__/`)
- `npm run test:watch` — watch mode
- Single test file: `npx vitest run src/lib/__tests__/format.test.ts`

Visual checks: `scripts/*.mjs` are ad-hoc Puppeteer screenshot scripts, not wired into Vitest. Run e.g. `node scripts/visual-smoke.mjs` while the dev server is up; they honor `BASE_URL` and `ORCAMENTO_TOKEN` env vars.

## Next.js version

This project uses Next.js 16, which may differ from your training data. When unsure about an API or convention, read the guides shipped in `node_modules/next/dist/docs/` instead of assuming older Next.js behavior (e.g. `params` in server components is a Promise and must be awaited). Heed deprecation notices.

## Environment variables

See `.env.example`. All three are required for the protected area to work:

- `ORCAMENTO_TOKEN` — secret token accepted once via legacy `/orcamento/<token>` links (exchanged for a session cookie)
- `ADMIN_PASSWORD` — password for the `/admin` login
- `SESSION_SECRET` — HMAC key that signs the `freeband_admin` session cookie

## Architecture

Next.js App Router + TypeScript, Tailwind CSS 4. Path alias `@/*` → `src/*`.

### Routes & access control

- `/` — single-page landing: `src/app/page.tsx` composes `Hero` plus `Palco`, `Video`, `Arquivo`, `Historia`, `Pacotes`, and `Contato` from `src/components/sections/`.
- `/portfolio` — public page to download the band's portfolio PDF.
- `/admin` — login form; the `loginAction` server action (`src/app/admin/actions.ts`) rate-limits attempts, compares the password in constant time, sets a signed `freeband_admin` session cookie (HMAC-SHA256, 7 days — see `src/lib/session.ts`, Web Crypto only so it runs in both Edge and Node) and redirects to `/orcamento`.
- `/orcamento` — quote builder (split-pane form + live A4 preview). `src/proxy.ts` gates every `/orcamento` path: a valid signed cookie passes; a legacy `/orcamento/<token>` link whose token equals `ORCAMENTO_TOKEN` is exchanged for a session cookie and redirected to `/orcamento` (the secret leaves the URL); anything else redirects to `/admin`. Logout button in the editor header calls `logoutAction`.

### PDF generation

Two documents are built with `@react-pdf/renderer`: the portfolio (`src/components/pdf/portfolio/PortfolioDocument.tsx`) and the quote (`src/components/pdf/orcamento/OrcamentoPdf.tsx`). Convention: the PDF toolkit must stay out of the SSR module graph — pages reference only the `*DownloadButton` wrappers, loaded through `next/dynamic` with `{ ssr: false }`. Keep that boundary when adding PDF features. The quote page additionally supports `window.print()` via `PrintLayout` and `no-print` classes.

### Content & data

`src/data/content.ts` is the single source of truth for all band copy and metadata (Portuguese, extracted from the official brochure); `src/data/images.ts` maps every image path used on the site and in PDFs, plus the `stageFrames` / `posters` / `figurinos` / `estrutura` / `reels` collections and `heroMedia`. Don't hardcode copy or image paths in components. `RELEASE_SHORT` in `content.ts` is the band's official one-line description — the meta description, the Palco lead and the last paragraph of `release.full` all read from it, so edit the sentence there and nowhere else.

Gallery rules the tests enforce (`src/lib/__tests__/images.test.ts`): every frame's `aspect` is the file's real "W/H" (±2%), web-gallery photographs need ≥900px on the long edge (the old site's 600×400 thumbnails are PDF-only), and every rendered image needs an entry in the generated `src/data/blur.ts` — run `node scripts/generate-blur.mjs` after adding or re-encoding any image. The Palco gallery is a programme in three acts (`pageCopy.palco.acts` ↔ `StageFrame.category`) composed of "plates": equal-height rows via `.plate` in `globals.css`, whose column widths are fr values proportional to each photo's ratio — photographs are NEVER cropped by their boxes. The history section's five eras each carry their own archival photo (`timeline[].image*` fields in `content.ts`); originals live in `Desktop/Freeband/_originais/`, re-encode at q90 with sharp.

### The wordmark

`src/components/ui/Wordmark.tsx` is the band's logo, redrawn as vector from a photograph of its stage backdrop: geometric monoline lowercase on a documented grid (x-height 100, stroke 19, ascender 127, bowls exactly one x-height wide), built from circles, quarter-arcs and stems. It paints in `currentColor` and is the only thing allowed to use `--color-logo-red`; gold stays the interface accent. `src/app/icon.svg` and `apple-icon.png` carry the same `f`. Never set the wordmark in a font — there is no font that matches it.

### Video

`public/video/reel-*.mp4` are twelve-second silent 16:9 clips (H.264 1280×720/30, ≤2.3 MB each) cut from the band's own AVCHD camera masters (`Desktop/Freeband/*.m2ts`, 1440×1080i anamorphic), each with a `.jpg` poster from its own first frame. `Video.tsx` attaches sources only on intersection (`preload="none"` + `data-src`), autoplays muted in view, honours `prefers-reduced-motion`, and exposes one pause control for all four (WCAG 2.2.2). Re-encode recipe for the interlaced masters: `-vf "yadif=1,scale=1920:1080,setsar=1,fps=30,scale=1280:720,hqdn3d=2.5:2:5:4" -crf 30 -preset veryslow -an` (raise denoise/crf for glittery backdrops — they explode the bitrate). `hero-loop.mp4` (~1.8 MB) is the hero background: `HeroMedia.tsx` paints its poster immediately and only attaches the video on `requestIdleCallback`, never under reduced motion.

### Design system ("PALCO")

Tailwind 4 with CSS-based config: all tokens live in the `@theme` block of `src/app/globals.css` — semantic colors (`bg`, `bg-raise`, `bg-high`, `text`, `text-muted`, `brand`, …), a fluid `--text-*` type scale, and six named easing curves each with a distinct purpose (don't fall back to a generic `ease`). The site is dark-first; the orcamento editor is scoped to a light "paper" theme. Fonts are wired in `src/app/layout.tsx` (Google fonts + local files in `src/app/fonts/`).

### Build note

`next.config.ts` pins `turbopack.root` to this project because a stray `package-lock.json` in the user's home directory breaks Turbopack's workspace auto-detection during production builds. Don't remove it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
