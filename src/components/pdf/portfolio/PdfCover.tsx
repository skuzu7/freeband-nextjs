// src/components/pdf/portfolio/PdfCover.tsx
// Portfolio PDF — page 1: cover with hero image, band name and tagline.
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts } from "./pdfTheme";
import { bandInfo } from "@/data/content";
import { pdfImages } from "./pdfImages";

const styles = StyleSheet.create({
  page: { backgroundColor: colors.bgPrimary },
  bgContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  bgImage: { width: "100%", height: "100%", objectFit: "cover" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  content: {
    flex: 1,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    borderWidth: 4,
    borderColor: colors.gold,
    padding: 40,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "100%",
  },
  bandName: {
    fontSize: 48,
    fontFamily: fonts.heading,
    color: colors.white,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 10,
    lineHeight: 1.1,
  },
  freeband: { color: colors.gold },
  tagline: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.gold,
    textAlign: "center",
    letterSpacing: 2,
    marginTop: 20,
    textTransform: "uppercase",
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.bgPrimary,
    letterSpacing: 4,
    textTransform: "uppercase",
    backgroundColor: colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});

export function PdfCover() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.bgContainer}>
        <Image src={pdfImages.festa55} style={styles.bgImage} />
        <View style={styles.overlay} />
      </View>
      <View style={styles.content}>
        <View style={styles.frame}>
          <Text style={styles.bandName}>
            Internacional{"\n"}
            <Text style={styles.freeband}>Freeband</Text>
          </Text>
          <Text style={styles.tagline}>{bandInfo.tagline}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{bandInfo.subtitle}</Text>
      </View>
    </Page>
  );
}
