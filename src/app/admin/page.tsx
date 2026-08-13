import type { Metadata } from 'next';
import { Wordmark } from '@/components/ui/Wordmark';
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
        <div className="mb-10 flex flex-col items-center">
          <h1>
            <Wordmark className="h-9 w-auto text-logo-red" title="Freeband Produções" />
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-wordmark-blue">
            Produções
          </p>
          <p className="mt-4 font-mono text-xs text-text-low">Acesso à produção</p>
        </div>

        {/* Form */}
        <LoginForm action={loginAction} />
      </div>
    </div>
  );
}
