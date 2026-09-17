'use server';

// src/app/admin/actions.ts
// Login and logout. The password is compared in constant time; failures are
// rate-limited per client address and across all addresses together, and cost
// a fixed delay. The limiter lives in memory (see src/lib/rateLimit.ts), so on
// a serverless host each instance keeps its own bucket — enough to blunt
// online guessing against a single-admin site, not a substitute for a WAF.
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { admin } from '@/data/copy/admin';
import { FailureLimiter, clientAddress } from '@/lib/rateLimit';
import { createSession, secretsMatch, sessionCookieName, sessionCookieOptions } from '@/lib/session';

const FAIL_DELAY_MS = 400;

const limiter = new FailureLimiter({ maxPerKey: 5, maxTotal: 50, windowMs: 15 * 60 * 1000 });

export type LoginState = { error: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get('password');
  if (typeof password !== 'string' || !password) return { error: admin.errors.missing };

  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!expected || !secret) {
    // The visitor learns only that login is off; which variable is missing
    // is for the deployment's logs.
    console.error('[admin] login unavailable: ADMIN_PASSWORD and SESSION_SECRET must both be set');
    return { error: admin.errors.unavailable };
  }

  const now = Date.now();
  const client = clientAddress(await headers());
  if (limiter.isLimited(client, now)) return { error: admin.errors.tooMany };

  if (!(await secretsMatch(password, expected, secret))) {
    limiter.fail(client, now);
    await new Promise((resolve) => setTimeout(resolve, FAIL_DELAY_MS));
    return { error: admin.errors.wrong };
  }

  limiter.succeed(client);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName(), await createSession(secret), sessionCookieOptions());
  redirect('/orcamento');
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  // Overwritten with the same attributes it was set with, not `delete()`:
  // that serialises without `Secure`, and a browser drops any `__Host-`
  // Set-Cookie lacking it — the session would survive logout in production.
  cookieStore.set(sessionCookieName(), '', { ...sessionCookieOptions(), maxAge: 0 });
  redirect('/admin');
}
