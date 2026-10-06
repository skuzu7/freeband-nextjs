// @vitest-environment node
//
// The response headers from next.config.ts, apart from the CSP (csp.test.ts).
// What sits in public/ is cached, but never as immutable: no file name there
// carries a content hash, so a re-encoded photograph has to be able to reach
// a returning visitor.
import { describe, expect, it } from 'vitest';
import config from '../../../next.config';

async function headersFor(source: string): Promise<Map<string, string>> {
  const rules = await config.headers!();
  const rule = rules.find((r) => r.source === source);
  return new Map((rule?.headers ?? []).map((h) => [h.key, h.value]));
}

describe('Cache-Control for public/', () => {
  it.each(['/fonts/:path*', '/images/:path*', '/video/:path*'])('%s is cached and revalidated in the background', async (source) => {
    const value = (await headersFor(source)).get('Cache-Control');
    expect(value).toMatch(/^public, max-age=\d+, stale-while-revalidate=\d+$/);
    expect(value).not.toContain('immutable');
    const [, maxAge, stale] = value!.match(/max-age=(\d+), stale-while-revalidate=(\d+)/)!.map(Number);
    expect(maxAge).toBeGreaterThanOrEqual(86400);
    expect(stale).toBeGreaterThan(maxAge);
  });

  it('keeps an optimised image at least as long as its source', async () => {
    const images = (await headersFor('/images/:path*')).get('Cache-Control')!;
    const maxAge = Number(images.match(/max-age=(\d+)/)![1]);
    expect(config.images?.minimumCacheTTL).toBeGreaterThanOrEqual(maxAge);
  });
});

describe('security headers', () => {
  it('are sent on every path', async () => {
    const all = await headersFor('/:path*');
    expect(all.get('X-Content-Type-Options')).toBe('nosniff');
    expect(all.get('X-Frame-Options')).toBe('DENY');
    expect(all.get('Strict-Transport-Security')).toMatch(/max-age=\d+; includeSubDomains/);
    expect(all.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(all.has('Content-Security-Policy')).toBe(true);
  });

  it('keep the protected area out of search', async () => {
    for (const source of ['/admin', '/orcamento/:path*']) {
      expect((await headersFor(source)).get('X-Robots-Tag')).toBe('noindex, nofollow');
    }
  });
});

describe('build pins', () => {
  it('keeps the Turbopack root and the image qualities the media test whitelists', () => {
    expect(config.turbopack?.root).toBeTruthy();
    expect(config.images?.qualities).toEqual([75, 90]);
  });
});
