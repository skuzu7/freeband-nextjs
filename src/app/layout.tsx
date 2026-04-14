import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { pageCopy } from '@/data/content';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const fraunces = localFont({
  src: './fonts/Fraunces-Variable.ttf',
  variable: '--font-display',
  display: 'swap',
});

const geist = localFont({
  src: './fonts/Geist-Variable.woff2',
  variable: '--font-sans',
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
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable} ${geist.variable}`}>
      <body className="bg-bg text-text font-sans antialiased">
        <div className="grain" aria-hidden />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
