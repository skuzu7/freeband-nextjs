// src/components/pdf/portfolio/PdfTimeline.tsx
// Portfolio PDF — page 3: vertical timeline with year badges and photos.
import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, spacing, pageBase } from "./pdfTheme";
import { timeline } from "@/data/content";
import { pdfImages } from "./pdfImages";

// Maps the relative image path stored in data/content.ts to the absolute
// URL the PDF fetcher understands.
const timelineImageMap: Record<string, string> = {
  "/images/freeband-anos-70.jpeg": pdfImages.anos70,
  "/images/freeband-anos-90.jpeg": pdfImages.anos90,
  "/images/freeband-antigas.jpeg": pdfImages.antigas,
  "/images/freeband-2015.jpeg": pdfImages.fb2015,
  "/images/festa-55.jpeg": pdfImages.festa55,
};

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding },
  header: { marginBottom: spacing.lg },
  title: { ...pageBase.sectionTitle },
  goldLine: { ...pageBase.goldLine },
  container: { flexDirection: "column", paddingLeft: 10 },
  item: { flexDirection: "row", marginBottom: 20, minHeight: 110 },
  line: { width: 30, alignItems: "center", position: "relative" },
  dot: {
    width: 14,
    height: 14,
    backgroundColor: colors.gold,
    marginTop: 5,
    zIndex: 1,
  },
  vertLine: {
    position: "absolute",
    top: 19,
    left: 14,
    width: 2,
    height: "100%",
    backgroundColor: colors.border,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 15,
  },
  textContent: { width: "55%" },
  yearBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  yearText: {
    fontSize: 12,
    fontFamily: fonts.heading,
    color: colors.bgPrimary,
    letterSpacing: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.white,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  itemDesc: { fontSize: 10, color: colors.textSecondary, lineHeight: 1.6 },
  imageContainer: { width: "40%" },
  itemImage: {
    width: "100%",
    height: 90,
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

export function PdfTimeline() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Nossa Historia</Text>
        <View style={styles.goldLine} />
      </View>
      <View style={styles.container}>
        {timeline.map((item, index) => (
          <View key={item.year} style={styles.item} wrap={false}>
            <View style={styles.line}>
              <View style={styles.dot} />
              {index < timeline.length - 1 && <View style={styles.vertLine} />}
            </View>
            <View style={styles.itemContent}>
              <View style={styles.textContent}>
                <View style={styles.yearBadge}>
                  <Text style={styles.yearText}>{item.year}</Text>
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  src={timelineImageMap[item.image]}
                  style={styles.itemImage}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.pageNumber}>03</Text>
    </Page>
  );
}
