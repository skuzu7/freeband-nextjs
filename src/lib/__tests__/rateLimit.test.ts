// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { FailureLimiter, clientAddress } from '../rateLimit';

const options = { maxPerKey: 3, maxTotal: 5, windowMs: 1000 };

describe('FailureLimiter', () => {
  it('refuses a key after its own failures, and forgets after the window', () => {
    const limiter = new FailureLimiter(options);
    const t0 = 1_000_000;
    expect(limiter.isLimited('a', t0)).toBe(false);
    limiter.fail('a', t0);
    limiter.fail('a', t0 + 1);
    expect(limiter.isLimited('a', t0 + 2)).toBe(false);
    limiter.fail('a', t0 + 3);
    expect(limiter.isLimited('a', t0 + 4)).toBe(true);
    expect(limiter.isLimited('a', t0 + 1001)).toBe(false);
  });

  it('refuses everyone once the shared bucket is full, whatever the key', () => {
    const limiter = new FailureLimiter(options);
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) limiter.fail(`spoofed-${i}`, t0);
    expect(limiter.isLimited('fresh-key', t0 + 1)).toBe(true);
    expect(limiter.isLimited('fresh-key', t0 + 1001)).toBe(false);
  });

  it('drops expired buckets instead of keeping every key ever seen', () => {
    const limiter = new FailureLimiter(options);
    const t0 = 1_000_000;
    for (let i = 0; i < 100; i++) limiter.fail(`k${i}`, t0);
    expect(limiter.size).toBe(101);
    limiter.isLimited('any', t0 + 1001);
    expect(limiter.size).toBe(0);
  });

  it('clears the key on success but keeps the shared count', () => {
    const limiter = new FailureLimiter(options);
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i++) limiter.fail('a', t0);
    expect(limiter.isLimited('a', t0 + 1)).toBe(true);
    limiter.succeed('a');
    expect(limiter.isLimited('a', t0 + 2)).toBe(false);
    limiter.fail('b', t0 + 3);
    limiter.fail('b', t0 + 4);
    expect(limiter.isLimited('c', t0 + 5)).toBe(true);
  });
});

describe('clientAddress', () => {
  const headers = (map: Record<string, string>) => ({ get: (name: string) => map[name] ?? null });

  it('prefers the platform-verified address over the forwarded chain', () => {
    expect(clientAddress(headers({ 'x-real-ip': '203.0.113.9', 'x-forwarded-for': '198.51.100.1, 203.0.113.9' }))).toBe(
      '203.0.113.9',
    );
    expect(clientAddress(headers({ 'x-forwarded-for': ' 198.51.100.1 , 10.0.0.1' }))).toBe('198.51.100.1');
    expect(clientAddress(headers({}))).toBe('unknown');
  });
});
