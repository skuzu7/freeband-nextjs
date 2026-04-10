// src/components/pdf/orcamento/OrcamentoPdf.tsx
// @react-pdf/renderer version of the proposal, generated client-side and
// streamed through PDFDownloadLink inside OrcamentoPreview.
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { OrcamentoData } from "@/types/orcamento";
import {
  formatCurrency,
  formatDate,
  calcEntrada,
  calcSaldo,
} from "@/lib/format";

const gold = "#C9A84C";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "#1a1a1a",
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
  },
  header: {
    borderBottomWidth: 3,
    borderBottomColor: gold,
    paddingBottom: 24,
    marginBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerLeft: {},
  headerLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 4,
  },
  headerName: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    lineHeight: 1.1,
  },
  headerNameGold: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: gold,
    lineHeight: 1.1,
  },
  headerRight: { textAlign: "right", fontSize: 12, color: "#666" },
  headerPhone: { marginTop: 4, color: gold },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#888",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: gold,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e0ce",
    paddingBottom: 8,
    marginBottom: 16,
    fontFamily: "Helvetica-Bold",
  },
  contratante: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#f9f7f2",
    borderWidth: 1,
    borderColor: "#e8e0ce",
    padding: 20,
    marginBottom: 24,
  },
  infoItem: { width: "50%", marginBottom: 12 },
  infoLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#888",
    marginBottom: 2,
  },
  infoValue: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 14, color: "#444" },
  totalValue: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  paymentGrid: { flexDirection: "row", justifyContent: "space-between" },
  paymentCard: {
    width: "48%",
    backgroundColor: "#f9f7f2",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e8e0ce",
  },
  paymentLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 4,
  },
  paymentValue: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  paymentDate: { fontSize: 11, color: "#666", marginTop: 4 },
  bodyText: { fontSize: 13, lineHeight: 1.8, color: "#333" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 2,
    borderTopColor: gold,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 11,
    color: "#888",
  },
  footerRight: { textAlign: "right" },
  footerPhone: { color: gold },
});

interface OrcamentoPdfProps {
  data: OrcamentoData;
}

export function OrcamentoPdf({ data }: OrcamentoPdfProps) {
  const hasCache = data.cache !== "";
  const hasEntrada = hasCache && data.entradaPct !== "";
  const saldoPct = data.entradaPct ? 100 - Number(data.entradaPct) : 0;

  return (
    <Document
      title={`Proposta - ${data.contratante || "Freeband"}`}
      author="Internacional Freeband"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLabel}>Proposta Comercial</Text>
            <Text style={styles.headerName}>Internacional</Text>
            <Text style={styles.headerNameGold}>Freeband</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Desde 1969</Text>
            <Text>Trabiju, SP</Text>
            <Text style={styles.headerPhone}>(16) 99171-2996</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Proposta para</Text>
          <Text style={styles.contratante}>{data.contratante || "\u2014"}</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tipo de Evento</Text>
            <Text style={styles.infoValue}>{data.tipoEvento || "\u2014"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data</Text>
            <Text style={styles.infoValue}>
              {data.dataEvento ? formatDate(data.dataEvento) : "\u2014"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Local</Text>
            <Text style={styles.infoValue}>{data.local || "\u2014"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Horario</Text>
            <Text style={styles.infoValue}>
              {data.horarioInicio && data.horarioFim
                ? `${data.horarioInicio} as ${data.horarioFim}`
                : "\u2014"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Convidados</Text>
            <Text style={styles.infoValue}>
              {data.numConvidados ? `${data.numConvidados} pessoas` : "\u2014"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investimento</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Valor Total</Text>
            <Text style={styles.totalValue}>
              {hasCache ? formatCurrency(data.cache) : "\u2014"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condicoes de Pagamento</Text>
          <View style={styles.paymentGrid}>
            <View style={styles.paymentCard}>
              <Text style={styles.paymentLabel}>
                Entrada ({data.entradaPct || 0}%)
              </Text>
              <Text style={styles.paymentValue}>
                {hasEntrada
                  ? calcEntrada(data.cache, data.entradaPct)
                  : "\u2014"}
              </Text>
              {data.entradaData ? (
                <Text style={styles.paymentDate}>
                  ate {formatDate(data.entradaData)}
                </Text>
              ) : null}
            </View>
            <View style={styles.paymentCard}>
              <Text style={styles.paymentLabel}>Saldo ({saldoPct}%)</Text>
              <Text style={styles.paymentValue}>
                {hasEntrada ? calcSaldo(data.cache, data.entradaPct) : "\u2014"}
              </Text>
              {data.saldoData ? (
                <Text style={styles.paymentDate}>
                  ate {formatDate(data.saldoData)}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {data.itensInclusos ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itens Inclusos</Text>
            <Text style={styles.bodyText}>{data.itensInclusos}</Text>
          </View>
        ) : null}

        {data.observacoes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observacoes</Text>
            <Text style={styles.bodyText}>{data.observacoes}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <View>
            {data.validade ? (
              <Text>Proposta valida ate {formatDate(data.validade)}</Text>
            ) : null}
          </View>
          <View style={styles.footerRight}>
            <Text>Internacional Freeband</Text>
            <Text style={styles.footerPhone}>(16) 99171-2996</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
