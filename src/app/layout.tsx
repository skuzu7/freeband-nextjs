import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

// One family for everything. The private variable is mapped to --font-sans
// in src/design/tokens.ts, so nothing else ever names the font.
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Internacional Freeband',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body className="bg-surface font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
