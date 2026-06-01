# Freeband

A business website built with Next.js: visual portfolio gallery, a quote builder that exports PDFs, and an admin area.

## Features

- **Portfolio gallery** with a fullscreen lightbox
- **Quote builder** (`/orcamento`) that generates downloadable PDF estimates
- **Admin area** for managing content
- Smooth page transitions and animations

## Tech stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **PDF:** @react-pdf/renderer
- **Gallery:** yet-another-react-lightbox
- **Icons:** lucide-react

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Project structure

```
src/
  app/          routes: portfolio, orcamento (quotes), admin
  components/   UI components
  data/         static content
  lib/ utils/   helpers
  middleware.ts route protection
```