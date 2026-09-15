// @vitest-environment node
//
// The gate on /orcamento/*: every branch of src/proxy.ts, driven with real
// NextRequest objects. The secrets are set per test through process.env.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy, tokenLimiter } from '@/proxy';
import { SESSION_COOKIE, SESSION_TTL_SECONDS, createSession, verifySession } from '@/lib/session';

const SECRET = 'proxy-test-secret';
const TOKEN = 'share+token/with%odd chars';
const ORIGIN = 'http://localhost:3000';

function request(path: string, init: { cookie?: string; ip?: string } = {}): NextRequest {
  const headers = new Headers();
  if (init.cookie) headers.set('cookie', `${SESSION_COOKIE}=${init.cookie}`);
  if (init.ip) headers.set('x-real-ip', init.ip);
  return new NextRequest(`${ORIGIN}${path}`, { headers });
}

const location = (response: Response) => response.headers.get('location');

let env: { SESSION_SECRET?: string; ORCAMENTO_TOKEN?: string };

beforeEach(() => {
  env = { SESSION_SECRET: process.env.SESSION_SECRET, ORCAMENTO_TOKEN: process.env.ORCAMENTO_TOKEN };
  process.env.SESSION_SECRET = SECRET;
  process.env.ORCAMENTO_TOKEN = TOKEN;
});

afterEach(() => {
  process.env.SESSION_SECRET = env.SESSION_SECRET;
  process.env.ORCAMENTO_TOKEN = env.ORCAMENTO_TOKEN;
});

describe('proxy', () => {
  it('fails closed to /admin when SESSION_SECRET is missing, even with a cookie', async () => {
    delete process.env.SESSION_SECRET;
    const session = await createSession(SECRET);
    const response = await proxy(request('/orcamento', { cookie: session }));
    expect(location(response)).toBe(`${ORIGIN}/admin`);
  });

  it('sends a visitor without a session to /admin', async () => {
    expect(location(await proxy(request('/orcamento')))).toBe(`${ORIGIN}/admin`);
    expect(location(await proxy(request('/orcamento', { cookie: '1' })))).toBe(`${ORIGIN}/admin`);
  });

  it('lets a valid session through without touching the cookie', async () => {
    const session = await createSession(SECRET);
    const response = await proxy(request('/orcamento', { cookie: session }));
    expect(location(response)).toBeNull();
    expect(response.cookies.get(SESSION_COOKIE)).toBeUndefined();
  });

  it('re-issues a session in its last day', async () => {
    const now = Date.now();
    const almostOver = await createSession(SECRET, 60 * 60, now);
    const response = await proxy(request('/orcamento', { cookie: almostOver }));
    const fresh = response.cookies.get(SESSION_COOKIE);
    expect(fresh?.value).toBeDefined();
    expect(fresh?.value).not.toBe(almostOver);
    expect(fresh?.httpOnly).toBe(true);
    expect(fresh?.maxAge).toBe(SESSION_TTL_SECONDS);
    expect(await verifySession(fresh?.value, SECRET)).toBe(true);
  });

  it('redirects an already authenticated visitor from a legacy link to the editor', async () => {
    const session = await createSession(SECRET);
    const response = await proxy(request('/orcamento/anything', { cookie: session }));
    expect(location(response)).toBe(`${ORIGIN}/orcamento`);
  });

  it('exchanges the legacy token for a cookie, decoding what the browser encoded', async () => {
    const response = await proxy(request(`/orcamento/${encodeURIComponent(TOKEN)}`, { ip: '203.0.113.1' }));
    expect(location(response)).toBe(`${ORIGIN}/orcamento`);
    const cookie = response.cookies.get(SESSION_COOKIE);
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.sameSite).toBe('lax');
    expect(cookie?.path).toBe('/');
    expect(await verifySession(cookie?.value, SECRET)).toBe(true);
  });

  it('refuses a wrong token and throttles repeated guesses from one address', async () => {
    const ip = '198.51.100.7';
    for (let i = 0; i < 5; i++) {
      const response = await proxy(request(`/orcamento/wrong-${i}`, { ip }));
      expect(location(response)).toBe(`${ORIGIN}/admin`);
      expect(response.cookies.get(SESSION_COOKIE)).toBeUndefined();
    }
    // The sixth attempt is refused before the token is even compared.
    const right = await proxy(request(`/orcamento/${encodeURIComponent(TOKEN)}`, { ip }));
    expect(location(right)).toBe(`${ORIGIN}/admin`);
    expect(tokenLimiter.isLimited(ip)).toBe(true);
  });

  it('never accepts a legacy token when none is configured', async () => {
    delete process.env.ORCAMENTO_TOKEN;
    const response = await proxy(request('/orcamento/', { ip: '203.0.113.2' }));
    expect(location(response)).toBe(`${ORIGIN}/admin`);
  });
});
