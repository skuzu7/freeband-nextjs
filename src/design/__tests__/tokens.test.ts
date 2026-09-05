// @vitest-environment node
//
// src/app/tokens.css is generated from src/design/tokens.ts by
// scripts/generate-tokens.mjs. This test fails the moment the two drift, the
// same way the blur test polices blur.ts.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderTokensCss, tokens, themes } from '../tokens';

const CSS_PATH = path.resolve(__dirname, '../../app/tokens.css');

describe('tokens.css', () => {
  it('is up to date with tokens.ts (run `npm run tokens`)', () => {
    const onDisk = readFileSync(CSS_PATH, 'utf8').replace(/\r\n/g, '\n');
    expect(onDisk).toBe(renderTokensCss());
  });

  it('declares every semantic color in the dark theme', () => {
    const semantic = Object.keys(themes.dark);
    for (const name of semantic) {
      expect(renderTokensCss()).toContain(`--color-${name}:`);
    }
  });

  it('every theme override points at a known palette color or a literal', () => {
    const palette = Object.keys(tokens.palette);
    for (const [theme, map] of Object.entries(themes)) {
      for (const [name, value] of Object.entries(map)) {
        const ok =
          palette.includes(value) || /^(#|oklch\(|rgb\()/.test(value);
        expect(ok, `${theme}.${name} = ${value}`).toBe(true);
      }
    }
  });
});
