// src/components/pdf/portfolio/PdfGallery.tsx
// Portfolio PDF — page 5: editorial photo spread.
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, spacing, pageBase } from "./pdfTheme";
import { pdfImages } from "./pdfImages";

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding },
  header: { marginBottom: spacing.xl },
  title: { ...pageBase.sectionTitle },
  goldLine: { ...pageBase.goldLine },
  subtitle: { ...pageBase.subtitle },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  large: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  medium: {
    width: "48%",
    height: 160,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.border,
  },
  small: {
    width: "31%",
    height: 120,
    objectFit: "cover",
    borderWidth: 2,
    borderColor: colors.border,
  },
  footer: { ...pageBase.footer },
  footerText: { ...pageBase.footerText },
});

export function PdfGallery() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Galeria Visual</Text>
        <View style={styles.goldLine} />
      </View>
      <Text style={styles.subtitle}>
        A energia explosiva e o espetaculo da Internacional Freeband.
      </Text>
      <View style={styles.row}>
        <Image src={pdfImages.festa55} style={styles.large} />
      </View>
      <View style={styles.row}>
        <Image src={pdfImages.festa70} style={styles.medium} />
        <Image src={pdfImages.festa82} style={styles.medium} />
      </View>
      <View style={styles.row}>
        <Image src={pdfImages.img0437} style={styles.small} />
        <Image src={pdfImages.img0679} style={styles.small} />
        <Image src={pdfImages.img0867} style={styles.small} />
      </View>
      <View style={styles.row}>
        <Image src={pdfImages.joao} style={styles.medium} />
        <Image src={pdfImages.img0690} style={styles.medium} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Internacional Freeband</Text>
        <Text style={styles.footerText}>05</Text>
      </View>
    </Page>
  );
}
