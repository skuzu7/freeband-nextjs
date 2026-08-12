import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { pageCopy } from '@/data/content';
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
  openGraph: {
    title: pageCopy.seo.ogTitle,
    description: pageCopy.seo.ogDescription,
    images: ['/images/festa-55.jpeg'],
    locale: 'pt_BR',
    type: 'website',
  },
  other: {
    'theme-color': '#0a0a0f',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${jetbrainsMono.variable} ${fraunces.variable} ${geist.variable}`}>
      <body className="bg-bg text-text font-sans antialiased">
        <div className="grain" aria-hidden />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
