// src/components/pdf/portfolio/pdfTheme.ts
// Shared StyleSheet primitives and tokens used across the portfolio PDF pages.
// Values mirror the Tailwind theme defined in globals.css but rebound to the
// units and APIs supported by @react-pdf/renderer.
import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  bgPrimary: "#000000",
  bgSecondary: "#111111",
  bgCard: "#1a1a1a",
  gold: "#C9A84C",
  goldLight: "#E8CC7A",
  white: "#FFFFFF",
  textSecondary: "#E0E0E0",
  textMuted: "#999999",
  border: "#333333",
} as const;

export const fonts = {
  heading: "Helvetica-Bold",
  body: "Helvetica",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 60,
} as const;

export const pageBase = StyleSheet.create({
  page: {
    backgroundColor: colors.bgPrimary,
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 10,
    padding: 0,
  },
  pageWithPadding: {
    backgroundColor: colors.bgPrimary,
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 10,
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.gold,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  goldLine: {
    width: 80,
    height: 4,
    backgroundColor: colors.gold,
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 1.6,
    marginBottom: spacing.lg,
    letterSpacing: 0.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
