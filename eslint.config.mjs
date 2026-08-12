import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // @react-pdf/renderer's <Image> renders into a PDF, not the DOM — the
    // jsx-a11y alt rule doesn't apply there.
    files: ["src/components/pdf/**"],
    rules: {
      "jsx-a11y/alt-text": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Ad-hoc puppeteer/node scripts, not part of the Next.js app.
    "scripts/**",
  ]),
]);

export default eslintConfig;
