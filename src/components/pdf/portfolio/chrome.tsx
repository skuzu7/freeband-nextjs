// src/components/pdf/portfolio/chrome.tsx
// What every inner page of the portfolio shares: the kicker + title header
// with its dotted rule, and the footer with the band's name and the page count.
import type { ReactNode } from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { bandInfo } from '@/data/band';
import { portfolio } from '@/data/copy/portfolio';
import { DotLinePdf } from '../motifs';
import { CONTENT_WIDTH, pdfStyles } from '../theme';

export const PAGE_COUNT = 7;

interface PdfPageProps {
  n: number;
  label: string;
  title: string;
  lead?: string;
  children: ReactNode;
}

export function PdfPage({ n, label, title, lead, children }: PdfPageProps) {
  return (
    <Page size="A4" style={pdfStyles.page}>
      <View style={{ marginBottom: 22 }}>
        <Text style={pdfStyles.label}>{label}</Text>
        <Text style={{ ...pdfStyles.h1, marginTop: 8 }}>{title}</Text>
        {lead && <Text style={{ ...pdfStyles.lead, marginTop: 8, maxWidth: 380 }}>{lead}</Text>}
        <View style={{ marginTop: 14 }}>
          <DotLinePdf width={CONTENT_WIDTH} />
        </View>
      </View>
      {children}
      <View style={pdfStyles.footer} fixed>
        <Text style={pdfStyles.footerText}>{bandInfo.name}</Text>
        <Text style={pdfStyles.footerText}>{portfolio.pdf.pageOf(n, PAGE_COUNT)}</Text>
      </View>
    </Page>
  );
}

/** A small caps label above a value, the PDF's version of <dt>/<dd>. */
export function Fact({ label, value, big = false }: { label: string; value: string; big?: boolean }) {
  return (
    <View>
      <Text style={pdfStyles.labelMuted}>{label}</Text>
      <Text style={{ marginTop: 2, fontSize: big ? 13 : 10, fontWeight: big ? 600 : 500, color: pdfStyles.h2.color }}>
        {value}
      </Text>
    </View>
  );
}
