import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted variable fonts. No build-time network fetch, no runtime
// requests to Google, stable across environments. See src/app/fonts/.

const fraunces = localFont({
  src: [
    {
      path: "./fonts/Fraunces-Variable.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/Fraunces-Italic-Variable.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Variable.ttf",
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freeband.com.br"),
  title: "Internacional Freeband — Desde 1969",
  description:
    "Uma banda feita no palco. Cinquenta e seis anos fazendo réveillon, casamento, formatura e show municipal Brasil afora.",
  openGraph: {
    title: "Internacional Freeband",
    description:
      "Desde 1969 dividindo o mesmo pulso com o Brasil — réveillon, casamento, formatura, show municipal.",
    images: ["/images/festa-55.jpeg"],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${geist.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
