'use server';

// src/app/admin/actions.ts
// Login and logout. The password is compared in constant time; failures are
// rate-limited per client IP and cost a fixed delay. The limit lives in memory,
// so on a serverless host each instance keeps its own bucket — enough to blunt
// online guessing against a single-admin site, not a substitute for a WAF.
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { admin } from '@/data/copy/admin';
import { SESSION_COOKIE, createSession, secretsMatch, sessionCookieOptions } from '@/lib/session';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const FAIL_DELAY_MS = 400;

const attempts = new Map<string, { count: number; resetAt: number }>();

function tooManyAttempts(ip: string, now: number): boolean {
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) return false;
  return entry.count >= MAX_ATTEMPTS;
}

function registerFailure(ip: string, now: number): void {
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

async function clientIp(): Promise<string> {
  const requestHeaders = await headers();
  return requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export type LoginState = { error: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get('password');
  if (typeof password !== 'string' || !password) return { error: admin.errors.missing };

  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!expected || !secret) return { error: admin.errors.misconfigured };

  const now = Date.now();
  const ip = await clientIp();
  if (tooManyAttempts(ip, now)) return { error: admin.errors.tooMany };

  if (!(await secretsMatch(password, expected, secret))) {
    registerFailure(ip, now);
    await new Promise((resolve) => setTimeout(resolve, FAIL_DELAY_MS));
    return { error: admin.errors.wrong };
  }

  attempts.delete(ip);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createSession(secret), sessionCookieOptions());
  redirect('/orcamento');
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({ name: SESSION_COOKIE, path: '/' });
  redirect('/admin');
}
