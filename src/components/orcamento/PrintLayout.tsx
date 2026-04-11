// src/components/orcamento/PrintLayout.tsx
// Print/screen HTML version of the proposal rendered inside OrcamentoPreview.
// Uses paper-theme design tokens so it stays consistent with the rest of
// /orcamento and so the printed output doesn't need any bespoke hex values.
// The @react-pdf/renderer document is a separate file (OrcamentoPdf.tsx).
import type { OrcamentoData } from "@/types/orcamento";
import {
  formatCurrency,
  formatDate,
  calcEntrada,
  calcSaldo,
} from "@/lib/format";

interface PrintLayoutProps {
  data: OrcamentoData;
}

const sectionTitle =
  "mb-4 border-b border-border pb-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand";
const microLabel = "mb-1 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-text-muted";
const bodyBlock = "whitespace-pre-line text-[0.82rem] leading-[1.8] text-text";

export function PrintLayout({ data }: PrintLayoutProps) {
  const hasCache = data.cache !== "";
  const hasEntrada = hasCache && data.entradaPct !== "";
  const entradaStr = calcEntrada(data.cache, data.entradaPct);
  const saldoStr = calcSaldo(data.cache, data.entradaPct);
  const saldoPct = data.entradaPct ? 100 - Number(data.entradaPct) : 0;

  const infoRows: ReadonlyArray<readonly [string, string]> = [
    ["Tipo de Evento", data.tipoEvento || "—"],
    ["Data", data.dataEvento ? formatDate(data.dataEvento) : "—"],
    ["Local", data.local || "—"],
    [
      "Horário",
      data.horarioInicio && data.horarioFim
        ? `${data.horarioInicio} às ${data.horarioFim}`
        : "—",
    ],
    [
      "Convidados",
      data.numConvidados ? `${data.numConvidados} pessoas` : "—",
    ],
  ];

  return (
    <div
      id="print-area"
      className="flex min-h-[297mm] w-[210mm] max-w-full flex-col bg-bg-high p-[18mm] font-sans text-text"
    >
      {/* Header */}
      <header className="mb-10 flex items-end justify-between border-b-[3px] border-brand pb-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-text-muted">
            Proposta Comercial
          </span>
          <span
            className="font-sans font-bold leading-none text-text"
            style={{ fontSize: "24px" }}
          >
            Internacional
          </span>
          <span
            className="font-display font-semibold leading-none text-brand -tracking-[0.02em]"
            style={{ fontSize: "34px" }}
          >
            freeband
          </span>
        </div>
        <div className="text-right font-mono text-[0.62rem] uppercase tracking-[0.15em] text-text-muted">
          <div>Desde 1969</div>
          <div>Trabiju / SP</div>
          <div className="mt-1 text-brand">(16) 99171-2996</div>
        </div>
      </header>

      {/* Recipient */}
      <section className="mb-8">
        <div className={microLabel}>Proposta para</div>
        <div
          className="font-display font-semibold -tracking-[0.01em] text-text"
          style={{ fontSize: "24px", lineHeight: 1.1 }}
        >
          {data.contratante || "—"}
        </div>
      </section>

      {/* Event info grid */}
      <section className="mb-8 grid grid-cols-2 gap-4 border border-border bg-bg-raise p-5">
        {infoRows.map(([label, value]) => (
          <div key={label}>
            <div className={microLabel}>{label}</div>
            <div className="text-[0.9rem] font-medium text-text">{value}</div>
          </div>
        ))}
      </section>

      {/* Investment */}
      <section className="mb-8">
        <div className={sectionTitle}>Investimento</div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[0.9rem] text-text-muted">Valor Total</span>
          <span
            className="font-display font-semibold -tracking-[0.01em] text-text"
            style={{ fontSize: "26px" }}
          >
            {hasCache ? formatCurrency(data.cache) : "—"}
          </span>
        </div>
      </section>

      {/* Payment terms */}
      <section className="mb-8">
        <div className={sectionTitle}>Condições de Pagamento</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-border bg-bg-raise p-4">
            <div className={microLabel}>Entrada ({data.entradaPct || 0}%)</div>
            <div
              className="font-display font-semibold text-text"
              style={{ fontSize: "18px" }}
            >
              {hasEntrada ? entradaStr : "—"}
            </div>
            {data.entradaData ? (
              <div className="mt-1 font-mono text-[0.62rem] text-text-muted">
                até {formatDate(data.entradaData)}
              </div>
            ) : null}
          </div>
          <div className="border border-border bg-bg-raise p-4">
            <div className={microLabel}>Saldo ({saldoPct}%)</div>
            <div
              className="font-display font-semibold text-text"
              style={{ fontSize: "18px" }}
            >
              {hasEntrada ? saldoStr : "—"}
            </div>
            {data.saldoData ? (
              <div className="mt-1 font-mono text-[0.62rem] text-text-muted">
                até {formatDate(data.saldoData)}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {data.itensInclusos ? (
        <section className="mb-8">
          <div className={sectionTitle}>Itens Inclusos</div>
          <div className={bodyBlock}>{data.itensInclusos}</div>
        </section>
      ) : null}

      {data.observacoes ? (
        <section className="mb-8">
          <div className={sectionTitle}>Observações</div>
          <div className={bodyBlock}>{data.observacoes}</div>
        </section>
      ) : null}

      {/* Footer */}
      <footer className="mt-auto flex items-end justify-between border-t-2 border-brand pt-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-text-muted">
        <div>
          {data.validade ? (
            <span>Proposta válida até {formatDate(data.validade)}</span>
          ) : null}
        </div>
        <div className="text-right">
          <div>Internacional Freeband</div>
          <div className="text-brand">(16) 99171-2996</div>
        </div>
      </footer>
    </div>
  );
}
