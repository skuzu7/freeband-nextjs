// src/components/pdf/portfolio/PdfAbout.tsx
// Portfolio PDF — page 2: release text + stats + values + vintage photo.
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, spacing, pageBase } from "./pdfTheme";
import { release } from "@/data/content";
import { pdfImages } from "./pdfImages";

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding },
  header: { marginBottom: spacing.xl },
  title: { ...pageBase.sectionTitle },
  goldLine: { ...pageBase.goldLine },
  content: { flexDirection: "row", justifyContent: "space-between" },
  leftCol: { width: "55%" },
  rightCol: { width: "40%" },
  releaseText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 1.6,
    textAlign: "justify",
    marginBottom: spacing.lg,
  },
  mainPhoto: {
    width: "100%",
    height: 250,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  highlightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  highlightCard: {
    width: "48%",
    backgroundColor: colors.bgSecondary,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    marginBottom: 15,
  },
  highlightValue: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginBottom: 4,
  },
  highlightLabel: {
    fontSize: 9,
    fontFamily: fonts.heading,
    color: colors.white,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  valuesBox: { marginTop: 20, padding: 20, backgroundColor: colors.gold },
  valuesTitle: {
    color: colors.bgPrimary,
    fontSize: 12,
    fontFamily: fonts.heading,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  valueItem: {
    color: colors.bgPrimary,
    fontFamily: fonts.heading,
    fontSize: 10,
    marginBottom: 6,
  },
  footer: { ...pageBase.footer },
  footerText: { ...pageBase.footerText },
});

export function PdfAbout() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Quem Somos</Text>
        <View style={styles.goldLine} />
      </View>
      <View style={styles.content}>
        <View style={styles.leftCol}>
          <Text style={styles.releaseText}>{release.full}</Text>
          <View style={styles.highlightsGrid}>
            {release.highlights.map((h) => (
              <View key={h.label} style={styles.highlightCard}>
                <Text style={styles.highlightValue}>{h.value}</Text>
                <Text style={styles.highlightLabel}>{h.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.rightCol}>
          <Image src={pdfImages.antigas} style={styles.mainPhoto} />
          <View style={styles.valuesBox}>
            <Text style={styles.valuesTitle}>Nossos Valores</Text>
            {release.values.map((v) => (
              <Text key={v} style={styles.valueItem}>
                + {v}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Internacional Freeband</Text>
        <Text style={styles.footerText}>02</Text>
      </View>
    </Page>
  );
}
