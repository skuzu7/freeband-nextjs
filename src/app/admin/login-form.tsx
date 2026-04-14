'use client';

import { useActionState } from 'react';

interface LoginFormProps {
  action: (prev: { error: string } | null, formData: FormData) => Promise<{ error: string } | null>;
}

export function LoginForm({ action }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        type="password"
        name="password"
        placeholder="Senha"
        autoComplete="current-password"
        required
        className="w-full rounded-md border border-border-strong bg-bg-raise px-4 py-3 text-sm font-mono text-text placeholder:text-text-low outline-none transition-shadow focus:border-brand/60 focus:ring-2 focus:ring-brand/30"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md px-4 py-3 text-sm font-mono uppercase tracking-wider text-white transition-opacity disabled:opacity-50"
        style={{ backgroundColor: 'var(--color-brand)' }}
      >
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>

      {state?.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
    </form>
  );
}
