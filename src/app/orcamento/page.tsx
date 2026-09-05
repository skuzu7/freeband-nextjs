// "/orcamento" — the proposal editor. Reaching this page at all requires the
// signed session cookie (src/proxy.ts); the page itself trusts that gate.
import type { Metadata } from 'next';
import { orcamento } from '@/data/copy/orcamento';
import { Page } from '@/components/orcamento/Page';
import { logoutAction } from '../admin/actions';

export const metadata: Metadata = {
  title: orcamento.seo.title,
};

export default function OrcamentoRoute() {
  return <Page onLogout={logoutAction} />;
}
