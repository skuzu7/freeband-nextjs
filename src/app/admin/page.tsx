import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginForm } from './login-form';

async function loginAction(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  'use server';

  const password = formData.get('password');

  if (typeof password !== 'string' || !password) {
    return { error: 'Informe a senha.' };
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return { error: 'Senha incorreta.' };
  }

  const cookieStore = await cookies();
  cookieStore.set('freeband_admin', '1', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  const token = process.env.ORCAMENTO_TOKEN;
  redirect(`/orcamento/${token}`);
}

export default function AdminPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[oklch(6%_0.015_270)]">
      <div className="w-full max-w-sm px-6">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold italic leading-none text-wordmark-red">Freeband</h1>
          <p className="text-xs font-mono uppercase tracking-[0.3em] mt-1 text-wordmark-blue">
            Produções
          </p>
          <p className="text-xs font-mono text-text-low mt-4">Acesso à produção</p>
        </div>

        {/* Form */}
        <LoginForm action={loginAction} />
      </div>
    </div>
  );
}
