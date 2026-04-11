# Internacional Freeband - Redesign + Unification

## Context

The Internacional Freeband project currently exists as two separate codebases:

- `freeband-nextjs` - Next.js 16 landing page + budget generator (orcamento)
- `freeband-portfolio` - React-PDF based portfolio/proposal generator

The owner wants a single project deployed on Vercel with a redesigned landing page, public portfolio PDF, and improved budget/proposal generator. The current Next.js codebase has inconsistent styling (mix of inline styles, Tailwind classes, and inline `<style>` tags) and needs a full cleanup.

## Goals

1. **Unify** both projects into a single Next.js app
2. **Redesign** the landing page with a luxury + energy hybrid visual
3. **Standardize** all styling to Tailwind (zero inline styles on web pages)
4. **Portfolio PDF** available publicly at `/portfolio` (client-side @react-pdf/renderer)
5. **Orcamento PDF** at `/orcamento/[token]` with improved PDF generation
6. **Deploy** on Vercel

## Architecture

### Project Structure

```
freeband-nextjs/
  src/
    app/
      page.tsx                      # Landing page
      layout.tsx                    # Root layout (fonts, metadata, OG)
      globals.css                   # Tailwind @theme + global styles
      portfolio/
        page.tsx                    # Portfolio PDF viewer (public)
      orcamento/
        [token]/
          page.tsx                  # Orcamento (token-protected)
    components/
      ui/                           # Reusable: SectionTitle, Button, Container, GoldLine
      layout/
        NavBar.tsx                  # Navigation
        Footer.tsx                  # Footer (extracted from page.tsx)
      sections/                     # Landing: Hero, Sobre, Historia, Galeria, Artistas, Servicos, Parceiros, Contato
      pdf/
        portfolio/                  # React-PDF components for portfolio
        orcamento/                  # React-PDF components for orcamento (Form, Preview, PrintLayout)
    data/
      content.ts                    # Single source of truth (landing + PDFs)
      images.ts                     # Image catalog for web
    lib/
      token.ts                      # Token validation
      format.ts                     # Currency/date formatting
    types/
      orcamento.ts                  # Orcamento types
  public/
    images/                         # All optimized photos
    video/
      hero.mp4                      # Converted from .m2ts
  scripts/
    convert-video.sh                # ffmpeg: .m2ts -> .mp4 (720p, H.264, ~5-8MB)
```

### Routing

| Route                | Access          | Purpose                         |
| -------------------- | --------------- | ------------------------------- |
| `/`                  | Public          | Landing page                    |
| `/portfolio`         | Public          | Portfolio PDF viewer + download |
| `/orcamento/[token]` | Token-protected | Budget form + PDF generator     |

### Data Flow

```
data/content.ts (single source of truth)
  |
  +-- Landing page sections (React components + Tailwind)
  |
  +-- Portfolio PDF (React-PDF components)
  |
  +-- Orcamento PDF (React-PDF components + form data overlay)
```

## Visual Design

### Theme: Luxury + Energy Hybrid

**Palette:**

- Background: `#0A0A0A` (deep black with subtle gradients)
- Primary accent: `#C9A84C` (gold)
- Secondary accent: `#E8CC7A` (light gold, hovers)
- Text primary: `#FFFFFF`
- Text secondary: `#9CA3AF`
- Borders: `#1F1F1F`

**Typography:**

- Display: Playfair Display (serif - elegance)
- Body: Inter (sans - readability)

### Sections

| Section       | Design                                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hero**      | Fullscreen video autoplay muted loop + dark gradient overlay + large title + gold CTA + animated scroll indicator. Fallback: static image for no-JS/mobile |
| **Sobre**     | 60/40 grid (text + vintage photo with grayscale filter + gold border). 4-column stat grid with large gold numbers                                          |
| **Historia**  | Vertical timeline with gold markers, interleaved photos, potential scroll animation                                                                        |
| **Galeria**   | Masonry grid with ALL available photos (root directory + portfolio assets). Lightbox on click                                                              |
| **Artistas**  | 2-column list with gold divider and arrow markers                                                                                                          |
| **Servicos**  | Cards with gold border-bottom, icons, responsive 3+2 grid                                                                                                  |
| **Parceiros** | Horizontal list with gold separators                                                                                                                       |
| **Contato**   | Background image + dark overlay + large WhatsApp button + contact details                                                                                  |
| **Footer**    | Extracted to own component. Simple copyright bar                                                                                                           |

## Styling Rules

- **Zero** inline `style={}` on landing page components
- **Zero** inline `<style>` tags
- Responsive via Tailwind classes (`md:`, `lg:`)
- Theme colors defined in `globals.css` via `@theme` directive
- All components use **named exports**
- Standard container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Colors referenced as Tailwind theme variables: `text-gold`, `bg-bg-card`, etc.

## Portfolio PDF (`/portfolio`)

- Public page with "Download PDF" button
- Client-side generation using `@react-pdf/renderer`
- PDF pages: Cover, About, Timeline, Gallery, Services, Partners, Contact
- Theme: black + gold (Helvetica font, react-pdf limitation)
- Data sourced from `data/content.ts`
- Images loaded as data URI base64 for PDF embedding

## Orcamento (`/orcamento/[token]`)

- Token-protected route (existing pattern, kept)
- Split layout: form (left) + live preview (right)
- Form fields: contratante, tipo evento, data, local, horarios, convidados, cache, entrada %, datas pagamento, itens inclusos, observacoes, validade
- **New: "Generate PDF" button** using @react-pdf/renderer client-side
- PDF output: branded Freeband proposal with professional formatting
- Replaces the old `freeband-portfolio` proposta comercial

## Images

All photos from the BURU root directory + portfolio assets:

1. Optimized (sharp or script for size/quality)
2. Copied to `public/images/`
3. Referenced in `data/images.ts`
4. Used across gallery and relevant sections

Available images:

- FESTA (55, 70, 82, 209, 308).jpg - show photos
- IMG_0437, 0679, 0690, 0867 - performance photos
- joao.jpg - musician photo
- baile tabatinga, barra bonita, nautico araraquara - venue photos
- cartaz cosmopolitano, freeband 2015 - promotional
- freeband anos 70, anos 90, antigas, antidas 1 - vintage
- freeeband jau - historical
- reveillom iacanga, itatinga, paranapanema - New Year events
- FOLDER FREEBAND - promotional material
- Orcamento exclusivo para eventos Premium - pricing visual

## Video

- Source: `20251019080704.m2ts` (42MB)
- Script: `scripts/convert-video.sh` using ffmpeg
  - Output: `public/video/hero.mp4`
  - Target: 720p, H.264, CRF 28, ~5-8MB
- Hero: `<video autoPlay muted loop playsInline>` with poster image fallback

## Verification

1. `npm run dev` - all pages render without errors
2. Landing page: all 8 sections render with Tailwind-only styling, zero inline styles
3. Hero video plays with fallback image
4. Gallery shows all available photos with working lightbox
5. `/portfolio` - generates and downloads PDF with correct content
6. `/orcamento/[token]` - form works, preview updates live, PDF generates correctly
7. `npm run build` - builds without errors (Vercel-ready)
8. Mobile responsive: all sections work on 375px-1440px
9. No console.log in production code
