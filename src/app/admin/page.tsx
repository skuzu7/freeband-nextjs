// "/admin" — the production login. Outside the (site) group: no nav, no
// footer, not indexed.
import type { Metadata } from 'next';
import Link from 'next/link';
import { admin } from '@/data/copy/admin';
import { site } from '@/data/copy/site';
import { DotGrid } from '@/components/brand/DotGrid';
import { Logotipo } from '@/components/brand/Logotipo';
import { Label } from '@/components/ui/Label';
import { loginAction } from './actions';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: admin.seo.title,
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center px-6 py-16">
      <DotGrid fade />
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-start gap-6">
          <Link href="/" aria-label={site.nav.homeLabel}>
            <Logotipo markClassName="h-10 w-auto" />
          </Link>
          <div>
            <Label dot>{admin.brandSub}</Label>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{admin.title}</h1>
          </div>
        </div>
        <LoginForm action={loginAction} />
      </div>
    </main>
  );
}
