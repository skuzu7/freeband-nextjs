// src/components/pdf/orcamento/OrcamentoPdf.tsx
// The proposal as a PDF: the same copy (orcamento.doc), the same format
// helpers and the same structure as PrintLayout, so the file a client receives
// matches the preview the producer saw.
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { bandInfo } from '@/data/band';
import { contact } from '@/data/contact';
import { orcamento } from '@/data/copy/orcamento';
import { calcEntrada, calcSaldo, formatCurrency, formatDate } from '@/lib/format';
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

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ width: '50%', marginBottom: 8 }}>
      <Text style={pdfStyles.labelMuted}>{label}</Text>
      <Text style={{ marginTop: 2, fontSize: 10, fontWeight: 500, color: pdfColors.ink }}>{value}</Text>
    </View>
  );
}

interface OrcamentoPdfProps {
  data: OrcamentoData;
}

export function OrcamentoPdf({ data }: OrcamentoPdfProps) {
  registerPdfFonts();
  const hasCache = data.cache !== '';
  const hasEntrada = hasCache && data.entradaPct !== '';
  const saldoPct = data.entradaPct ? 100 - Number(data.entradaPct) : 0;

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
              <Text style={{ ...pdfStyles.label, color: pdfColors.ink }}>Internacional</Text>
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
          <Text style={{ marginTop: 3, fontSize: 20, fontWeight: 600, letterSpacing: -0.4, color: pdfColors.ink }}>
            {data.contratante || doc.empty}
          </Text>
        </View>

        <View style={{ ...pdfStyles.card, flexDirection: 'row', flexWrap: 'wrap', padding: 14, paddingBottom: 6, marginBottom: 20 }}>
          <Cell label={doc.tipoEvento} value={data.tipoEvento || doc.empty} />
          <Cell label={doc.data} value={data.dataEvento ? formatDate(data.dataEvento) : doc.empty} />
          <Cell label={doc.local} value={data.local || doc.empty} />
          <Cell
            label={doc.horario}
            value={
              data.horarioInicio && data.horarioFim ? `${data.horarioInicio} ${doc.horarioJoin} ${data.horarioFim}` : doc.empty
            }
          />
          <Cell label={doc.convidados} value={data.numConvidados ? `${data.numConvidados} ${doc.pessoas}` : doc.empty} />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={sectionTitle}>{doc.investimento}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontSize: 10, color: pdfColors.inkMuted }}>{doc.valorTotal}</Text>
            <Text style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.4, color: pdfColors.ink }}>
              {hasCache ? formatCurrency(data.cache) : doc.empty}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={sectionTitle}>{doc.pagamento}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ ...pdfStyles.card, flex: 1 }}>
              <Text style={pdfStyles.labelMuted}>
                {doc.entrada} ({data.entradaPct || 0}%)
              </Text>
              <Text style={{ marginTop: 3, fontSize: 14, fontWeight: 600, color: pdfColors.ink }}>
                {hasEntrada ? calcEntrada(data.cache, data.entradaPct) : doc.empty}
              </Text>
              {data.entradaData && (
                <Text style={{ marginTop: 2, fontSize: 8, color: pdfColors.inkMuted }}>
                  {doc.ate} {formatDate(data.entradaData)}
                </Text>
              )}
            </View>
            <View style={{ ...pdfStyles.card, flex: 1 }}>
              <Text style={pdfStyles.labelMuted}>
                {doc.saldo} ({saldoPct}%)
              </Text>
              <Text style={{ marginTop: 3, fontSize: 14, fontWeight: 600, color: pdfColors.ink }}>
                {hasEntrada ? calcSaldo(data.cache, data.entradaPct) : doc.empty}
              </Text>
              {data.saldoData && (
                <Text style={{ marginTop: 2, fontSize: 8, color: pdfColors.inkMuted }}>
                  {doc.ate} {formatDate(data.saldoData)}
                </Text>
              )}
            </View>
          </View>
        </View>

        {data.itensInclusos && (
          <View style={{ marginBottom: 20 }}>
            <Text style={sectionTitle}>{doc.itens}</Text>
            <Text style={{ ...pdfStyles.body, color: pdfColors.ink }}>{data.itensInclusos}</Text>
          </View>
        )}

        {data.observacoes && (
          <View style={{ marginBottom: 20 }}>
            <Text style={sectionTitle}>{doc.observacoes}</Text>
            <Text style={{ ...pdfStyles.body, color: pdfColors.ink }}>{data.observacoes}</Text>
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
