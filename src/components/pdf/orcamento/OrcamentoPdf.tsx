// src/components/pdf/orcamento/OrcamentoPdf.tsx
// The proposal as a PDF: the same copy (orcamento.doc), the same format
// helpers and the same structure as PrintLayout, so the file a client receives
// matches the preview the producer saw.
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { bandInfo } from '@/data/band';
import { contact } from '@/data/contact';
import { orcamento } from '@/data/copy/orcamento';
import { formatDate } from '@/lib/format';
import { buildProposta } from '@/lib/proposta';
import type { OrcamentoData } from '@/types/orcamento';
import { pdfColors, pdfStyles, registerPdfFonts } from '../theme';
import { WordmarkPdf } from '../WordmarkPdf';

const doc = orcamento.doc;

const sectionTitle = {
  ...pdfStyles.label,
  paddingBottom: 5,
  marginBottom: 8,
  borderBottomWidth: 0.75,
  borderBottomColor: pdfColors.line,
} as const;
const bigValue = { fontSize: 20, fontWeight: 600, letterSpacing: -0.4, color: pdfColors.ink } as const;
const bodyBlock = { ...pdfStyles.body, color: pdfColors.ink } as const;

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ width: '50%', marginBottom: 8 }}>
      <Text style={pdfStyles.labelMuted}>{label}</Text>
      <Text style={{ marginTop: 2, fontSize: 10, color: pdfColors.ink }}>{value}</Text>
    </View>
  );
}

function PaymentCard({ label, value, date }: { label: string; value: string; date: string }) {
  return (
    <View style={{ ...pdfStyles.card, flex: 1 }}>
      <Text style={pdfStyles.labelMuted}>{label}</Text>
      <Text style={{ marginTop: 3, fontSize: 14, fontWeight: 600, color: pdfColors.ink }}>{value}</Text>
      {date && (
        <Text style={{ marginTop: 2, fontSize: 8, color: pdfColors.inkMuted }}>
          {doc.ate} {formatDate(date)}
        </Text>
      )}
    </View>
  );
}

interface OrcamentoPdfProps {
  data: OrcamentoData;
}

export function OrcamentoPdf({ data }: OrcamentoPdfProps) {
  registerPdfFonts();
  const v = buildProposta(data);

  return (
    <Document title={orcamento.preview.docTitle(data.contratante)} author={bandInfo.name} language="pt-BR">
      <Page size="A4" style={{ ...pdfStyles.page, backgroundColor: pdfColors.high, paddingTop: 48, paddingBottom: 72 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderBottomWidth: 1.5,
            borderBottomColor: pdfColors.red,
            paddingBottom: 16,
            marginBottom: 26,
          }}
        >
          <View style={{ gap: 8 }}>
            <Text style={pdfStyles.labelMuted}>{doc.kicker}</Text>
            <View style={{ gap: 4 }}>
              <Text style={{ ...pdfStyles.label, color: pdfColors.ink }}>{bandInfo.brandLine}</Text>
              <WordmarkPdf width={120} />
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <Text style={pdfStyles.caption}>{doc.since(bandInfo.founded)}</Text>
            <Text style={pdfStyles.caption}>{contact.address}</Text>
            <Text style={pdfStyles.caption}>{contact.city}</Text>
            <Text style={{ ...pdfStyles.caption, color: pdfColors.ink, marginTop: 2 }}>{contact.phone}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={pdfStyles.labelMuted}>{doc.para}</Text>
          <Text style={{ marginTop: 3, ...bigValue }}>
            {data.contratante || doc.empty}
          </Text>
        </View>

        <View style={{ ...pdfStyles.card, flexDirection: 'row', flexWrap: 'wrap', padding: 14, paddingBottom: 6, marginBottom: 20 }}>
          {v.rows.map(([label, value]) => (
            <Cell key={label} label={label} value={value} />
          ))}
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={sectionTitle}>{doc.investimento}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontSize: 10, color: pdfColors.inkMuted }}>{doc.valorTotal}</Text>
            <Text style={bigValue}>{v.total}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={sectionTitle}>{doc.pagamento}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <PaymentCard label={v.entradaLabel} value={v.entradaValor} date={data.entradaData} />
            <PaymentCard label={v.saldoLabel} value={v.saldoValor} date={data.saldoData} />
          </View>
        </View>

        {data.itensInclusos && (
          <View style={{ marginBottom: 20 }}>
            <Text style={sectionTitle}>{doc.itens}</Text>
            <Text style={bodyBlock}>{data.itensInclusos}</Text>
          </View>
        )}

        {data.observacoes && (
          <View style={{ marginBottom: 20 }}>
            <Text style={sectionTitle}>{doc.observacoes}</Text>
            <Text style={bodyBlock}>{data.observacoes}</Text>
          </View>
        )}

        <View style={{ ...pdfStyles.footer, bottom: 36, alignItems: 'flex-end' }} fixed>
          <View style={{ gap: 2 }}>
            {data.validade && (
              <Text style={pdfStyles.footerText}>
                {doc.validade} {formatDate(data.validade)}
              </Text>
            )}
            <Text style={pdfStyles.footerText}>
              {doc.cnpj} {bandInfo.cnpj}
            </Text>
            <Text style={{ fontSize: 7, color: pdfColors.inkMuted }}>
              {contact.instagram} · {contact.website}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <Text style={pdfStyles.footerText}>{bandInfo.name}</Text>
            <Text style={{ ...pdfStyles.footerText, color: pdfColors.ink }}>{contact.phone}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
