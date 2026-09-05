// scripts/generate-tokens.mjs
// Renders src/app/tokens.css from src/design/tokens.ts. The design tokens
// live in TypeScript so the PDF theme and the contrast test can import them;
// Tailwind needs them as CSS. Run after any change to tokens.ts:
//   npm run tokens
// Node 22.18+/24 strips the types natively; tokens.ts has no imports.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { renderTokensCss } from '../src/design/tokens.ts';

const OUT = 'src/app/tokens.css';
const next = renderTokensCss();
const prev = existsSync(OUT) ? readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : null;

if (prev === next) {
  console.log(`${OUT} already up to date`);
} else {
  writeFileSync(OUT, next);
  console.log(`${OUT} written (${next.split('\n').length} lines)`);
}
