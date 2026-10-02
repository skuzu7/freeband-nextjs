// @vitest-environment node
//
// The Content-Security-Policy from next.config.ts. Production keeps the strict
// same-origin policy; only a Vercel preview build opens the few origins the
// Vercel Toolbar loads from, so the toolbar works where it exists and nowhere
// else.
import { afterEach, describe, expect, it, vi } from 'vitest';

async function policy(env: Record<string, string>): Promise<Map<string, string>> {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  const { default: config } = await import('../../../next.config');
  const rules = await config.headers!();
  const value = rules[0].headers.find((h) => h.key === 'Content-Security-Policy')!.value;
  return new Map(
    value.split('; ').map((directive) => {
      const [name, ...sources] = directive.split(' ');
      return [name, sources.join(' ')] as const;
    }),
  );
}

afterEach(() => vi.unstubAllEnvs());

describe('Content-Security-Policy', () => {
  it('allows no third-party origin in production', async () => {
    const csp = await policy({ NODE_ENV: 'production', VERCEL_ENV: 'production' });
    for (const directive of ['script-src', 'style-src', 'img-src', 'font-src', 'connect-src', 'frame-src']) {
      expect(csp.get(directive)).not.toMatch(/https?:|wss:/);
    }
    expect(csp.get('frame-ancestors')).toBe("'none'");
    expect(csp.get('object-src')).toBe("'none'");
  });

  // Without these the PDF layout engine (Yoga, WebAssembly inlined as a data:
  // URL) cannot load and both PDF downloads fail silently in production.
  it('lets the PDF engine compile its WebAssembly, and nothing more', async () => {
    const csp = await policy({ NODE_ENV: 'production', VERCEL_ENV: 'production' });
    expect(csp.get('script-src')).toContain("'wasm-unsafe-eval'");
    expect(csp.get('script-src')).not.toContain("'unsafe-eval'");
    expect(csp.get('connect-src')).toContain('data:');
  });

  it('lets the Vercel Toolbar load on preview deployments', async () => {
    const csp = await policy({ NODE_ENV: 'production', VERCEL_ENV: 'preview' });
    expect(csp.get('script-src')).toContain('https://vercel.live');
    expect(csp.get('connect-src')).toContain('https://vercel.live');
    expect(csp.get('connect-src')).toContain('wss://ws-us3.pusher.com');
    expect(csp.get('frame-src')).toContain('https://vercel.live');
    expect(csp.get('font-src')).toContain('https://assets.vercel.com');
    // The page itself still cannot be framed, previews included.
    expect(csp.get('frame-ancestors')).toBe("'none'");
  });
});
