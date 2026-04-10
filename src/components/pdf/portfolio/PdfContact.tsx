// src/components/pdf/portfolio/PdfContact.tsx
// Portfolio PDF — page 7: booking / contact call-to-action.
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, spacing, pageBase } from "./pdfTheme";
import { contact, bandInfo } from "@/data/content";

const styles = StyleSheet.create({
  page: { ...pageBase.pageWithPadding, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: spacing.xxl },
  title: {
    fontSize: 40,
    fontFamily: fonts.heading,
    color: colors.gold,
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.md,
    letterSpacing: 2,
    textTransform: "uppercase",
    backgroundColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xxl,
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: colors.gold,
    padding: 30,
  },
  contactInfo: { width: "100%" },
  contactItem: { marginBottom: 25 },
  label: {
    fontSize: 10,
    fontFamily: fonts.heading,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.white,
    letterSpacing: 1,
  },
  valueGold: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.gold,
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: colors.border,
    paddingTop: 20,
  },
  footerName: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginBottom: 8,
    letterSpacing: 6,
  },
  footerTagline: {
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});

export function PdfContact() {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>BOOKING</Text>
        <Text style={styles.subtitle}>Garanta a Freeband no seu evento</Text>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Text style={styles.label}>WhatsApp Exclusivo</Text>
            <Text style={styles.valueGold}>{contact.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{contact.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.label}>Link WhatsApp</Text>
            <Text style={styles.valueGold}>{contact.whatsappLink}</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerName}>INTERNACIONAL FREEBAND</Text>
        <Text style={styles.footerTagline}>{bandInfo.tagline}</Text>
      </View>
    </Page>
  );
}
