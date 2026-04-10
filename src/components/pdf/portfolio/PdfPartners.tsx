// src/components/pdf/portfolio/PdfPartners.tsx
// Portfolio PDF — page 4: artists sharing the stage + partner clubs.
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, spacing, pageBase } from "./pdfTheme";
import { partners, artists } from "@/data/content";
import { pdfImages } from "./pdfImages";

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding },
  header: { marginBottom: spacing.xl },
  title: { ...pageBase.sectionTitle },
  goldLine: { ...pageBase.goldLine },
  container: { flexDirection: "row", justifyContent: "space-between" },
  leftCol: { width: "48%" },
  rightCol: { width: "48%" },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 2,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: 5,
  },
  artistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  artistItem: {
    width: "48%",
    backgroundColor: colors.bgSecondary,
    padding: 8,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
  },
  artistText: { fontSize: 9, fontFamily: fonts.heading, color: colors.white },
  partnerItem: {
    backgroundColor: colors.bgSecondary,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  partnerText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.heading,
    textTransform: "uppercase",
  },
  photosRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  photo: {
    width: "48%",
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

export function PdfPartners() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Parceiros & Palcos</Text>
        <View style={styles.goldLine} />
      </View>
      <View style={styles.container}>
        <View style={styles.leftCol}>
          <Text style={styles.sectionTitle}>Dividimos o palco com</Text>
          <View style={styles.artistGrid}>
            {artists.map((artist) => (
              <View key={artist} style={styles.artistItem}>
                <Text style={styles.artistText}>{artist}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.sectionTitle}>Clubes & Parceiros</Text>
          {partners.map((partner) => (
            <View key={partner} style={styles.partnerItem}>
              <Text style={styles.partnerText}>{partner}</Text>
            </View>
          ))}
          <View style={styles.photosRow}>
            <Image src={pdfImages.nauticoAraraquara} style={styles.photo} />
            <Image src={pdfImages.cartazCosmopolitano} style={styles.photo} />
          </View>
        </View>
      </View>
      <Text style={styles.pageNumber}>04</Text>
    </Page>
  );
}
