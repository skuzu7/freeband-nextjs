// src/components/orcamento/PrintLayout.tsx
// The proposal as an HTML page: what the preview scales and what print
// outputs. Paper tokens only, so it matches the editor around it; the PDF
// twin is src/components/pdf/orcamento/OrcamentoPdf.tsx and reads the same
// copy and the same view-model (src/lib/proposta.ts), so the two never
// disagree on a number.
import { bandInfo } from '@/data/band';
import { contact } from '@/data/contact';
import { orcamento } from '@/data/copy/orcamento';
import { formatDate } from '@/lib/format';
import { buildProposta } from '@/lib/proposta';
import type { OrcamentoData } from '@/types/orcamento';
import { Wordmark } from '@/components/brand/Wordmark';

interface PrintLayoutProps {
  data: OrcamentoData;
}

const doc = orcamento.doc;
const sectionTitle = 'label-caps mb-3 border-b border-line pb-2 text-led-text';
const micro = 'label-caps mb-1 text-ink-muted';
const bodyBlock = 'whitespace-pre-line text-[0.82rem] leading-[1.75] text-ink';

export function PrintLayout({ data }: PrintLayoutProps) {
  const v = buildProposta(data);

  return (
    <div id="print-area" className="flex min-h-[297mm] w-[210mm] max-w-full flex-col bg-surface-high p-[18mm] text-ink">
      <header className="mb-10 flex items-end justify-between gap-8 border-b-2 border-red pb-6">
        <div className="flex flex-col gap-3">
          <span className="label-caps text-ink-muted">{doc.kicker}</span>
          <div className="flex flex-col gap-1.5">
            <span className="label-caps text-ink">{bandInfo.brandLine}</span>
            <Wordmark className="h-8 w-auto text-red" title={bandInfo.name} />
          </div>
        </div>
        <div className="label-caps flex flex-col gap-1 text-right text-ink-muted">
          <span>{doc.since(bandInfo.founded)}</span>
          <span>{contact.address}</span>
          <span>{contact.city}</span>
          <span className="mt-1 text-ink">{contact.phone}</span>
        </div>
      </header>

      <section className="mb-8">
        <h2 className={micro}>{doc.para}</h2>
        <p className="text-2xl font-semibold tracking-tight text-ink">{data.contratante || doc.empty}</p>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-4 border border-line bg-surface-raise p-5">
        {v.rows.map(([label, value]) => (
          <div key={label}>
            <div className={micro}>{label}</div>
            <div className="text-[0.9rem] font-medium text-ink">{value}</div>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className={sectionTitle}>{doc.investimento}</h2>
        <div className="flex items-baseline justify-between">
          <span className="text-[0.9rem] text-ink-muted">{doc.valorTotal}</span>
          <span className="text-2xl font-semibold tracking-tight text-ink">{v.total}</span>
        </div>
      </section>

      <section className="mb-8">
        <h2 className={sectionTitle}>{doc.pagamento}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-line bg-surface-raise p-4">
            <div className={micro}>{v.entradaLabel}</div>
            <div className="text-lg font-semibold text-ink">{v.entradaValor}</div>
            {data.entradaData && (
              <div className="mt-1 text-xs text-ink-muted">
                {doc.ate} {formatDate(data.entradaData)}
              </div>
            )}
          </div>
          <div className="border border-line bg-surface-raise p-4">
            <div className={micro}>{v.saldoLabel}</div>
            <div className="text-lg font-semibold text-ink">{v.saldoValor}</div>
            {data.saldoData && (
              <div className="mt-1 text-xs text-ink-muted">
                {doc.ate} {formatDate(data.saldoData)}
              </div>
            )}
          </div>
        </div>
      </section>

      {data.itensInclusos && (
        <section className="mb-8">
          <h2 className={sectionTitle}>{doc.itens}</h2>
          <div className={bodyBlock}>{data.itensInclusos}</div>
        </section>
      )}

      {data.observacoes && (
        <section className="mb-8">
          <h2 className={sectionTitle}>{doc.observacoes}</h2>
          <div className={bodyBlock}>{data.observacoes}</div>
        </section>
      )}

      <footer className="print-footer label-caps mt-auto flex items-end justify-between gap-6 border-t border-line pt-4 text-ink-muted">
        <div className="flex flex-col gap-1">
          {data.validade && (
            <span>
              {doc.validade} {formatDate(data.validade)}
            </span>
          )}
          <span>
            {doc.cnpj} {bandInfo.cnpj}
          </span>
          <span className="normal-case tracking-normal">
            {contact.instagram} · {contact.website}
          </span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span>{bandInfo.name}</span>
          <span className="text-ink">{contact.phone}</span>
        </div>
      </footer>
    </div>
  );
}
