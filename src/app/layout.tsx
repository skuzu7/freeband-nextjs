import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freeband.com.br"),
  title: "Internacional Freeband | Desde 1969",
  description:
    "Banda de eventos premium com mais de 55 anos de história. Casamentos, formaturas, corporativo e shows municipais.",
  openGraph: {
    title: "Internacional Freeband",
    description: "Banda de eventos premium com mais de 55 anos de história.",
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
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
