'use client';

// src/app/admin/LoginForm.tsx
// The password form. State comes back from the server action; the error is
// announced live so a screen reader hears it without hunting for it.
import { useActionState } from 'react';
import { admin } from '@/data/copy/admin';
import type { LoginState } from './actions';
import { Button } from '@/components/ui/Button';

interface LoginFormProps {
  action: (prev: LoginState, formData: FormData) => Promise<LoginState>;
}

export function LoginForm({ action }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label htmlFor="admin-password" className="label-caps text-ink-muted">
        {admin.passwordLabel}
      </label>
      <input
        id="admin-password"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        autoFocus
        className="transition-quick w-full rounded-sm border border-line-strong bg-surface-raise px-4 py-3 text-base text-ink outline-none focus:border-led"
      />
      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? admin.submitting : admin.submit}
      </Button>
      <p role="alert" aria-live="polite" className="min-h-[1.5em] text-center text-sm text-red-hot">
        {state?.error}
      </p>
    </form>
  );
}
