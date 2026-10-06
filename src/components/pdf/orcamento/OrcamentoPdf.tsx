// src/components/pdf/orcamento/OrcamentoPdf.tsx
// The proposal as a PDF: a thin renderer over propostaBlocks()
// (src/lib/proposta.ts). The HTML twin, src/components/orcamento/PrintLayout,
// renders the same blocks in the same order, so the file a client receives is
// the preview the producer saw.
//
// Paper from edge to edge, the portfolio's paper pages without their night
// panels: this one is printed, signed and filed, and a browser printing the
// twin drops dark backgrounds. What it shares with the portfolio is the
// system — the wordmark in red and nothing else in red, the lit dotted rule
// under the letterhead and unlit ones between the parts, labels in LED blue
// caps, and the date of the event on the dot matrix: the portfolio closes on
// "Qual é a data?", the proposal opens with the answer.
import type { ReactNode } from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { bandInfo } from '@/data/band';
import { orcamento } from '@/data/copy/orcamento';
import { buildProposta, propostaBlocks, type PropostaBlock, type PropostaBlockOf } from '@/lib/proposta';
import type { OrcamentoData } from '@/types/orcamento';
import { DotLinePdf, LedNumberPdf } from '../motifs';
import { A4, pdfGround, pdfStyles, pdfTones, pdfType, registerPdfFonts } from '../theme';
import { WordmarkPdf } from '../WordmarkPdf';

const t = pdfTones.paper;
const type = pdfType.paper;

/** 18mm, the print layout's own margin, in points. */
const MARGIN = 51;
const WIDTH = A4.width - MARGIN * 2;
/** The event's facts sit two to a row: a venue's name needs the width. */
const COLUMNS = 2;
/** Height of the date on the matrix: four points a cell, where its slashed zero cannot pass for an eight. */
const DATE_HEIGHT = 28;
/** Space under each part of the document. */
const GAP = 20;

/** A section's name in LED caps over an unlit rule. */
function Section({ title, children, wrap = true }: { title: string; children: ReactNode; wrap?: boolean }) {
  return (
    <View style={{ marginBottom: GAP }} wrap={wrap}>
      <Text style={type.label} minPresenceAhead={40}>
        {title}
      </Text>
      <View style={{ marginTop: 5, marginBottom: 9 }}>
        <DotLinePdf width={WIDTH} color={t.ledDim} />
      </View>
      {children}
    </View>
  );
}

function Header({ block }: { block: PropostaBlockOf<'header'> }) {
  const { date } = block;
  return (
    <View style={{ marginBottom: 22 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View>
          <Text style={type.label}>{block.kicker}</Text>
          <Text style={{ ...type.labelMuted, color: t.ink, fontWeight: 600, marginTop: 12, marginBottom: 5 }}>{block.brandLine}</Text>
          <WordmarkPdf width={150} />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={type.labelMuted}>{date.label}</Text>
          <View style={{ marginTop: 8 }}>
            {date.matrix ? (
              <LedNumberPdf value={date.matrix} height={DATE_HEIGHT} color={t.led} dimColor={t.ledDim} />
            ) : (
              <Text style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.15, color: t.inkMuted }}>{date.text}</Text>
            )}
          </View>
        </View>
      </View>
      <View style={{ marginTop: 16 }}>
        <DotLinePdf width={WIDTH} color={t.led} />
      </View>
    </View>
  );
}

function Client({ block }: { block: PropostaBlockOf<'client'> }) {
  return (
    <View style={{ marginBottom: GAP }}>
      <Text style={type.labelMuted}>{block.label}</Text>
      <Text style={{ marginTop: 4, fontSize: 24, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.15, color: t.ink }}>{block.name}</Text>
    </View>
  );
}

function Facts({ block }: { block: PropostaBlockOf<'facts'> }) {
  return (
    <View style={{ marginBottom: GAP }}>
      <DotLinePdf width={WIDTH} color={t.ledDim} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 12 }}>
        {block.rows.map((row) => (
          <View key={row.label} style={{ width: WIDTH / COLUMNS, paddingRight: 12, marginBottom: 11 }}>
            <Text style={type.labelMuted}>{row.label}</Text>
            <Text style={{ marginTop: 2, fontSize: 10.5, color: t.ink }}>{row.value}</Text>
          </View>
        ))}
      </View>
      <DotLinePdf width={WIDTH} color={t.ledDim} />
    </View>
  );
}

function Total({ block }: { block: PropostaBlockOf<'total'> }) {
  return (
    <View style={{ marginBottom: 16 }} wrap={false}>
      <Text style={type.label}>{block.title}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 10.5, color: t.inkMuted, marginBottom: 5 }}>{block.label}</Text>
        <Text style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.8, lineHeight: 1.1, color: t.ink }}>{block.value}</Text>
      </View>
    </View>
  );
}

function Payments({ block }: { block: PropostaBlockOf<'payments'> }) {
  return (
    <Section title={block.title} wrap={false}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {block.parts.map((part) => (
          <View key={part.label} style={{ flex: 1, backgroundColor: t.raise, borderWidth: 0.75, borderColor: t.line, paddingVertical: 11, paddingHorizontal: 14 }}>
            <Text style={type.labelMuted}>{part.label}</Text>
            <Text style={{ marginTop: 3, fontSize: 16, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.2, color: t.ink }}>{part.value}</Text>
            {part.due && <Text style={{ marginTop: 1, fontSize: 8.5, lineHeight: 1.4, color: t.inkMuted }}>{part.due}</Text>}
          </View>
        ))}
      </View>
    </Section>
  );
}

function List({ block }: { block: PropostaBlockOf<'list'> }) {
  return (
    <Section title={block.title}>
      <View style={{ gap: 4 }}>
        {block.items.map((item, i) => (
          <View key={`${i}-${item}`} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }} wrap={false}>
            <View style={{ width: 3.4, height: 3.4, borderRadius: 1.7, backgroundColor: t.led, marginTop: 5 }} />
            <Text style={{ flex: 1, fontSize: 10, lineHeight: 1.35, color: t.ink }}>{item}</Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

function Paragraphs({ block }: { block: PropostaBlockOf<'text'> }) {
  return (
    <Section title={block.title}>
      <View style={{ gap: 4 }}>
        {block.paragraphs.map((paragraph, i) => (
          <Text key={`${i}-${paragraph.slice(0, 24)}`} style={{ fontSize: 10, lineHeight: 1.45, color: t.ink }}>
            {paragraph}
          </Text>
        ))}
      </View>
    </Section>
  );
}

/** Fixed: a proposal that runs to a second page signs that one too. */
function Footer({ block }: { block: PropostaBlockOf<'footer'> }) {
  return (
    <View style={{ ...pdfStyles.footer, left: MARGIN, right: MARGIN, bottom: 34, flexDirection: 'column', alignItems: 'stretch' }} fixed>
      <DotLinePdf width={WIDTH} color={t.ledDim} />
      <View style={{ marginTop: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ gap: 2 }}>
          {block.terms.map((line) => (
            <Text key={line} style={type.caption}>
              {line}
            </Text>
          ))}
          <Text style={{ fontSize: 7, lineHeight: 1.4, color: t.inkMuted }}>{block.links}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          {block.signature.map((line) => (
            <Text key={line} style={type.caption}>
              {line}
            </Text>
          ))}
          <Text style={{ ...type.caption, color: t.ink }}>{block.phone}</Text>
        </View>
      </View>
    </View>
  );
}

function Block({ block }: { block: PropostaBlock }) {
  switch (block.kind) {
    case 'header':
      return <Header block={block} />;
    case 'client':
      return <Client block={block} />;
    case 'facts':
      return <Facts block={block} />;
    case 'total':
      return <Total block={block} />;
    case 'payments':
      return <Payments block={block} />;
    case 'list':
      return <List block={block} />;
    case 'text':
      return <Paragraphs block={block} />;
    case 'footer':
      return <Footer block={block} />;
  }
}

interface OrcamentoPdfProps {
  data: OrcamentoData;
}

export function OrcamentoPdf({ data }: OrcamentoPdfProps) {
  registerPdfFonts();
  const blocks = propostaBlocks(buildProposta(data));
  return (
    <Document title={orcamento.preview.docTitle(data.contratante)} author={bandInfo.name} language="pt-BR">
      <Page
        size="A4"
        style={{ ...pdfStyles.page, backgroundColor: pdfGround.paper, color: t.ink, paddingTop: 46, paddingBottom: 88, paddingHorizontal: MARGIN }}
      >
        {blocks.map((block) => (
          <Block key={block.kind} block={block} />
        ))}
      </Page>
    </Document>
  );
}
