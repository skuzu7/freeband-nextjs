'use server';

// Login/logout server actions, extracted from the page so they can be unit
// tested and shared with the /orcamento logout button.
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE,
  createSession,
  secretsMatch,
  sessionCookieOptions,
} from '@/lib/session';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const FAIL_DELAY_MS = 400;

// Per-instance in-memory rate limit. Enough to blunt online brute force on a
// single-admin site; serverless deployments get one bucket per instance.
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
  return (
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  );
}

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const password = formData.get('password');
  if (typeof password !== 'string' || !password) {
    return { error: 'Informe a senha.' };
  }

  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!expected || !secret) {
    return {
      error: 'Configuração ausente no servidor (ADMIN_PASSWORD/SESSION_SECRET).',
    };
  }

  const now = Date.now();
  const ip = await clientIp();
  if (tooManyAttempts(ip, now)) {
    return { error: 'Muitas tentativas. Aguarde alguns minutos.' };
  }

  if (!(await secretsMatch(password, expected, secret))) {
    registerFailure(ip, now);
    // Fixed delay keeps failed attempts from being free.
    await new Promise((resolve) => setTimeout(resolve, FAIL_DELAY_MS));
    return { error: 'Senha incorreta.' };
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
