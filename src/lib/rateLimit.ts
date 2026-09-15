// src/lib/rateLimit.ts
// A fixed-window counter of failures per key, plus one bucket shared by every
// key, so rotating the key (a spoofed forwarded address) cannot buy more
// attempts. It lives in process memory: on a serverless host every instance
// keeps its own, which blunts online guessing against a single-admin site but
// is not a substitute for a durable store or a WAF.

export interface RateLimitOptions {
  /** Failures one key may accumulate inside a window before it is refused. */
  maxPerKey: number;
  /** Failures every key together may accumulate inside a window. */
  maxTotal: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export const GLOBAL_KEY = '*';

export class FailureLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly options: RateLimitOptions) {}

  /** True when this key, or everyone together, has failed too often lately. */
  isLimited(key: string, now = Date.now()): boolean {
    this.sweep(now);
    return this.over(key, this.options.maxPerKey, now) || this.over(GLOBAL_KEY, this.options.maxTotal, now);
  }

  /** Records one failure for the key and for the shared bucket. */
  fail(key: string, now = Date.now()): void {
    this.sweep(now);
    this.bump(key, now);
    this.bump(GLOBAL_KEY, now);
  }

  /** A success clears the key's own count; the shared bucket keeps counting. */
  succeed(key: string): void {
    this.buckets.delete(key);
  }

  /** Buckets currently held, for tests. */
  get size(): number {
    return this.buckets.size;
  }

  private over(key: string, max: number, now: number): boolean {
    const bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= now) return false;
    return bucket.count >= max;
  }

  private bump(key: string, now: number): void {
    const bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.options.windowMs });
      return;
    }
    bucket.count += 1;
  }

  /** Drops every expired window, so the map never outgrows the live keys. */
  private sweep(now: number): void {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }
}

/**
 * The address the limiter keys on. Vercel writes the verified client address
 * to `x-real-ip` (and the same value first in `x-forwarded-for`); behind any
 * other proxy the trust boundary is that proxy's, and the shared bucket is
 * what holds when the header is forged.
 */
export function clientAddress(headers: { get(name: string): string | null }): string {
  return (
    headers.get('x-real-ip')?.trim() ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}
