import type { Metadata } from 'next';
import { loginAction } from './actions';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Acesso à produção — Internacional Freeband',
  robots: { index: false, follow: false },
};

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
