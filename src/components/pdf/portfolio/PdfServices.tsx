// src/components/pdf/portfolio/PdfServices.tsx
// Portfolio PDF — page 6: service cards, included items checklist and event photos.
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, spacing, pageBase } from "./pdfTheme";
import { services, serviceIncludes } from "@/data/content";
import { pdfImages } from "./pdfImages";

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding },
  header: { marginBottom: spacing.lg },
  title: { ...pageBase.sectionTitle },
  goldLine: { ...pageBase.goldLine },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  card: {
    width: "48%",
    backgroundColor: colors.bgSecondary,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    marginBottom: 15,
  },
  cardFull: {
    width: "100%",
    backgroundColor: colors.gold,
    padding: 15,
    marginBottom: 15,
  },
  icon: { fontSize: 24, color: colors.gold, marginBottom: 8 },
  iconDark: { fontSize: 24, color: colors.bgPrimary, marginBottom: 8 },
  cardTitle: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.white,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  cardTitleDark: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.bgPrimary,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  desc: { fontSize: 10, color: colors.textSecondary, lineHeight: 1.5 },
  descDark: { fontSize: 10, color: colors.bgPrimary, lineHeight: 1.5 },
  includes: {
    backgroundColor: colors.bgSecondary,
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    marginBottom: spacing.lg,
  },
  includesTitle: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginBottom: spacing.md,
    textTransform: "uppercase",
  },
  includeItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  check: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginRight: 10,
  },
  includeText: { fontSize: 10, color: colors.white },
  photosRow: { flexDirection: "row", justifyContent: "space-between" },
  eventPhoto: {
    width: "31%",
    height: 120,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: colors.textMuted,
  },
});

export function PdfServices() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Nossos Servicos</Text>
        <View style={styles.goldLine} />
      </View>
      <View style={styles.grid}>
        {services.map((s, i) => {
          const isLast = i === services.length - 1;
          return (
            <View key={s.title} style={isLast ? styles.cardFull : styles.card}>
              <Text style={isLast ? styles.iconDark : styles.icon}>
                {s.icon}
              </Text>
              <Text style={isLast ? styles.cardTitleDark : styles.cardTitle}>
                {s.title}
              </Text>
              <Text style={isLast ? styles.descDark : styles.desc}>
                {s.description}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.includes}>
        <Text style={styles.includesTitle}>Estrutura Completa Inclusa</Text>
        {serviceIncludes.map((item) => (
          <View key={item} style={styles.includeItem}>
            <Text style={styles.check}>&#10095;</Text>
            <Text style={styles.includeText}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={styles.photosRow}>
        <Image src={pdfImages.reveillomIacanga} style={styles.eventPhoto} />
        <Image src={pdfImages.baileTabatinga} style={styles.eventPhoto} />
        <Image src={pdfImages.reveillomItatinga} style={styles.eventPhoto} />
      </View>
      <Text style={styles.pageNumber}>06</Text>
    </Page>
  );
}
