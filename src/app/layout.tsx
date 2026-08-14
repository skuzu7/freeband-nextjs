import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { bandInfo, contact, pageCopy, release } from '@/data/content';
import './globals.css';

// Each font exposes a private variable (--font-fraunces/--font-geist/
// --font-jetbrains); the semantic tokens (--font-display/--font-sans/
// --font-mono) are mapped once in globals.css @theme. Never assign a
// semantic token directly here — two definitions racing on CSS injection
// order is how Inter and Fraunces ended up disputing --font-display.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const fraunces = localFont({
  src: [
    { path: './fonts/Fraunces-Variable.woff2', style: 'normal' },
    { path: './fonts/Fraunces-Italic-Variable.woff2', style: 'italic' },
  ],
  weight: '100 900',
  variable: '--font-fraunces',
  display: 'swap',
});

const geist = localFont({
  src: './fonts/Geist-Variable.woff2',
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://freeband.com.br'),
  title: pageCopy.seo.title,
  description: pageCopy.seo.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: pageCopy.seo.ogTitle,
    description: pageCopy.seo.ogDescription,
    // /og.jpg is generated from the wordmark and the hero frame — a 1200×630
    // card, not a raw show photo cropped by whoever is rendering the preview.
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: pageCopy.seo.ogTitle }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageCopy.seo.ogTitle,
    description: pageCopy.seo.ogDescription,
    images: ['/og.jpg'],
  },
  other: {
    'theme-color': '#0a0a0f',
  },
};

// Structured data for search: a MusicGroup with the facts the page already
// states — founding year, base, contact, Instagram. Built from the same
// content module as the visible copy, so the two can never disagree.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: bandInfo.name,
  alternateName: 'Freeband',
  description: release.short,
  foundingDate: String(bandInfo.founded),
  foundingLocation: { '@type': 'City', name: bandInfo.foundedCity },
  url: 'https://freeband.com.br',
  image: 'https://freeband.com.br/og.jpg',
  logo: 'https://freeband.com.br/icon.svg',
  email: contact.email,
  telephone: '+55 16 99773-2749',
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.address,
    addressLocality: 'Trabiju',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
  sameAs: [contact.instagramUrl],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${jetbrainsMono.variable} ${fraunces.variable} ${geist.variable}`}>
      <body className="bg-bg text-text font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="grain" aria-hidden />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
