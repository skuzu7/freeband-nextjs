// "/orcamento" — the proposal editor. The proxy (src/proxy.ts) is the first
// gate; the page checks the same cookie again, so a request that reached the
// handler without passing the proxy still ends at the login.
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { orcamento } from '@/data/copy/orcamento';
import { sessionCookieName, verifySession } from '@/lib/session';
import { Page } from '@/components/orcamento/Page';
import { logoutAction } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: orcamento.seo.title,
};

export default async function OrcamentoRoute() {
  const secret = process.env.SESSION_SECRET;
  const cookieStore = await cookies();
  const session = cookieStore.get(sessionCookieName())?.value;
  if (!secret || !(await verifySession(session, secret))) redirect('/admin');
  return <Page onLogout={logoutAction} />;
}
