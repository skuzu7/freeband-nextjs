import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { toHex } from '@/design/color';
import { tokens } from '@/design/tokens';
import { contact } from '@/data/contact';
import { site } from '@/data/copy/site';
import { homeSocialMetadata } from '@/lib/seo/metadata';
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
  // The home's card, as the default for any route that sets none. A page that
  // sets either object replaces this one whole, so it rebuilds it from the
  // same parts (src/lib/seo/metadata.ts). The picture is not named here: each
  // route's opengraph-image.tsx supplies it.
  ...homeSocialMetadata(),
};

export const viewport: Viewport = {
  themeColor: toHex(tokens.palette['night-950']),
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior tells the router the smooth scrolling in base.css is
    // deliberate, so it turns it off for the jump a navigation makes.
    <html lang="pt-BR" className={outfit.variable} data-scroll-behavior="smooth">
      <body className="bg-surface font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
