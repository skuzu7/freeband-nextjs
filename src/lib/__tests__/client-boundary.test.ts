// @vitest-environment node
//
// What must not reach the browser. src/data/blur.ts is a generated map with a
// placeholder for every image on the site: imported by a Server Component it
// costs nothing, imported by a Client Component — directly or through anything
// that component imports — the whole map ships in the page's JavaScript. A
// Client Component renders PhotoView and takes `blur` as a prop instead.
//
// The same walk keeps @react-pdf/renderer where the PDFs are: nothing outside
// src/components/pdf may import it.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = path.resolve(__dirname, '../..');
const BLUR = path.join(SRC, 'data', 'blur.ts');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return name === '__tests__' ? [] : walk(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

/** The file a specifier points at, for the two forms the repo uses: `@/…` and relative. */
function resolve(from: string, specifier: string): string | null {
  let base: string;
  if (specifier.startsWith('@/')) base = path.join(SRC, specifier.slice(2));
  else if (specifier.startsWith('.')) base = path.resolve(path.dirname(from), specifier);
  else return null;
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Every module a file pulls in at runtime. `import type` is erased and does not count. */
function importsOf(file: string): { files: string[]; packages: string[] } {
  const source = readFileSync(file, 'utf8');
  const files: string[] = [];
  const packages: string[] = [];
  const statement = /^\s*(?:import|export)\s+(type\s+)?(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/gm;
  for (const match of source.matchAll(statement)) {
    if (match[1]) continue;
    const target = resolve(file, match[2]);
    if (target) files.push(target);
    else if (!match[2].startsWith('.') && !match[2].startsWith('@/')) packages.push(match[2]);
  }
  return { files, packages };
}

const isClient = (file: string) => /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/|\s)*['"]use client['"]/.test(readFileSync(file, 'utf8'));
const rel = (file: string) => path.relative(SRC, file).replace(/\\/g, '/');

const sources = walk(SRC);
const clients = sources.filter(isClient);

/** The chain of imports from `start` to `target`, or null if there is none. */
function pathTo(start: string, target: string): string[] | null {
  const seen = new Set<string>([start]);
  const queue: string[][] = [[start]];
  while (queue.length) {
    const trail = queue.shift()!;
    const current = trail[trail.length - 1];
    if (current === target) return trail;
    for (const next of importsOf(current).files) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push([...trail, next]);
    }
  }
  return null;
}

describe('client bundle boundary', () => {
  it('finds the Client Components and the blur map it is guarding', () => {
    expect(existsSync(BLUR)).toBe(true);
    expect(clients.length).toBeGreaterThan(5);
  });

  // The guard below passes when the walk finds nothing; this proves it can find.
  it('sees the map from the Server Component that is allowed to use it', () => {
    const photo = path.join(SRC, 'components', 'media', 'Photo.tsx');
    expect(isClient(photo)).toBe(false);
    expect(pathTo(photo, BLUR)?.map(rel)).toEqual(['components/media/Photo.tsx', 'data/blur.ts']);
    // …and through an intermediate module, not only a direct import.
    const home = path.join(SRC, 'app', '(site)', 'page.tsx');
    expect(pathTo(home, BLUR)?.length).toBeGreaterThan(2);
  });

  it('no Client Component reaches src/data/blur.ts, directly or through what it imports', () => {
    const offenders = clients.flatMap((file) => {
      const trail = pathTo(file, BLUR);
      return trail ? [trail.map(rel).join(' → ')] : [];
    });
    expect(offenders).toEqual([]);
  });

  it('only src/components/pdf imports @react-pdf/renderer', () => {
    const offenders = sources
      .filter((file) => !rel(file).startsWith('components/pdf/'))
      .filter((file) => importsOf(file).packages.some((name) => name.startsWith('@react-pdf/')))
      .map(rel);
    expect(offenders).toEqual([]);
  });
});
