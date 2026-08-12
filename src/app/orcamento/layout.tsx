import type { Metadata } from 'next';

// Private tooling — keep the whole /orcamento segment out of search indexes.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OrcamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="paper"
      className="min-h-screen bg-bg text-text font-sans antialiased"
    >
      {children}
    </div>
  );
}
