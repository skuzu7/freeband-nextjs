// src/components/pdf/portfolio/chrome.tsx
// What every inner page of the portfolio shares: the page number in the dot
// matrix beside the section's label, a lit rule, the title, and a footer that
// signs the page with the wordmark. A page is set on paper (to be read, and
// printed without drowning a toner cartridge) or on night (to be looked at):
// the choice is the page's, the chrome follows it.
import type { ReactNode } from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { portfolio } from '@/data/copy/portfolio';
import { DotLinePdf, LedNumberPdf } from '../motifs';
import { CONTENT_WIDTH, pdfGround, pdfStyles, pdfTones, pdfType, type PdfPageTone } from '../theme';
import { WordmarkPdf } from '../WordmarkPdf';

export const PAGE_COUNT = 7;

/** Height in points of the page number in the header. */
const NUMBER_HEIGHT = 16;

interface PdfPageProps {
  n: number;
  label: string;
  title: string;
  lead?: string;
  tone?: PdfPageTone;
  /** A one-line title in the size of a lead: for the page whose photographs need the room. */
  compact?: boolean;
  children: ReactNode;
}

export function PdfPage({ n, label, title, lead, tone = 'paper', compact = false, children }: PdfPageProps) {
  const t = pdfTones[tone];
  const type = pdfType[tone];
  return (
    <Page size="A4" style={{ ...pdfStyles.page, backgroundColor: pdfGround[tone], color: t.ink }}>
      <View style={{ marginBottom: compact ? 12 : 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 }}>
          {/* The bare digit, lit cells only: at this size the matrix's slashed
              zero reads as an eight and the unlit cells blur the rest. */}
          <LedNumberPdf value={String(n)} height={NUMBER_HEIGHT} color={t.led} dimColor={null} />
          <Text style={type.label}>{label}</Text>
        </View>
        <DotLinePdf width={CONTENT_WIDTH} color={t.led} />
        {compact ? (
          <Text style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.2, color: t.ink, marginTop: 14 }}>{title}</Text>
        ) : (
          <Text style={{ ...type.h1, marginTop: 18 }}>{title}</Text>
        )}
        {lead && <Text style={{ ...type.lead, marginTop: 8, maxWidth: 400 }}>{lead}</Text>}
      </View>
      {children}
      <PageFooter n={n} tone={tone} />
    </Page>
  );
}

/** The unlit rule, the wordmark, the page count. Fixed: an overflowing page would still be signed. */
export function PageFooter({ n, tone = 'paper' }: { n: number; tone?: PdfPageTone }) {
  const t = pdfTones[tone];
  return (
    <View style={{ ...pdfStyles.footer, flexDirection: 'column', alignItems: 'stretch' }} fixed>
      <DotLinePdf width={CONTENT_WIDTH} color={t.ledDim} />
      <View style={{ marginTop: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <WordmarkPdf width={46} />
        <Text style={pdfType[tone].caption}>{portfolio.pdf.pageOf(n, PAGE_COUNT)}</Text>
      </View>
    </View>
  );
}

/** A lit dot and a line of text: the PDF's list item. */
export function Bullet({ text, tone = 'paper', small = false }: { text: string; tone?: PdfPageTone; small?: boolean }) {
  const t = pdfTones[tone];
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
      <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: t.led, marginTop: small ? 3.9 : 4.6 }} />
      <Text style={{ fontSize: small ? 8 : 9, lineHeight: 1.4, color: small ? t.inkMuted : t.ink, flex: 1 }}>{text}</Text>
    </View>
  );
}
