import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { toHex } from '@/design/color';
import { tokens } from '@/design/tokens';
import { bandInfo, release } from '@/data/band';
import { contact } from '@/data/contact';
import { site } from '@/data/copy/site';
import './globals.css';

// One family for everything. The private variable is mapped to --font-sans
// in src/design/tokens.ts, so nothing else ever names the font.
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(contact.siteUrl),
  title: { default: site.seo.title, template: site.seo.titleTemplate },
  description: site.seo.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: site.seo.ogTitle,
    description: site.seo.ogDescription,
    // /og.jpg is a 1200×630 card built from the wordmark and the stage frame.
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: site.seo.ogTitle }],
    locale: 'pt_BR',
    type: 'website',
    siteName: bandInfo.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.seo.ogTitle,
    description: site.seo.ogDescription,
    images: ['/og.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: toHex(tokens.palette['night-950']),
  colorScheme: 'dark',
};

// Structured data for search: a MusicGroup with the facts the page already
// states, built from the same data modules as the visible copy.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: bandInfo.name,
  alternateName: 'Freeband',
  description: release.short,
  foundingDate: String(bandInfo.founded),
  foundingLocation: { '@type': 'City', name: bandInfo.foundedCity },
  url: contact.siteUrl,
  image: `${contact.siteUrl}/og.jpg`,
  logo: `${contact.siteUrl}/icon.svg`,
  email: contact.email,
  telephone: contact.phoneIntl,
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
    <html lang="pt-BR" className={outfit.variable}>
      <body className="bg-surface font-sans text-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
