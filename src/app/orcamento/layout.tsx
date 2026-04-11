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
