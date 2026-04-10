// src/components/orcamento/PrintLayout.tsx
// Print/screen HTML version of the proposal rendered inside OrcamentoPreview.
// Separate from OrcamentoPdf (which is the @react-pdf/renderer document) so
// the live preview can reflect form state reactively without going through
// the PDF pipeline.
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

const sectionTitleClasses =
  "mb-4 border-b border-[#e8e0ce] pb-2 text-xs font-semibold uppercase tracking-widest text-gold";
const labelClasses = "mb-0.5 text-[10px] uppercase tracking-widest text-[#888]";
const bodyBlockClasses =
  "whitespace-pre-line text-[13px] leading-[1.8] text-[#333]";

export function PrintLayout({ data }: PrintLayoutProps) {
  const hasCache = data.cache !== "";
  const hasEntrada = hasCache && data.entradaPct !== "";
  const entradaStr = calcEntrada(data.cache, data.entradaPct);
  const saldoStr = calcSaldo(data.cache, data.entradaPct);
  const saldoPct = data.entradaPct ? 100 - Number(data.entradaPct) : 0;

  const infoRows: ReadonlyArray<readonly [string, string]> = [
    ["Tipo de Evento", data.tipoEvento || "\u2014"],
    ["Data", data.dataEvento ? formatDate(data.dataEvento) : "\u2014"],
    ["Local", data.local || "\u2014"],
    [
      "Horario",
      data.horarioInicio && data.horarioFim
        ? `${data.horarioInicio} as ${data.horarioFim}`
        : "\u2014",
    ],
    [
      "Convidados",
      data.numConvidados ? `${data.numConvidados} pessoas` : "\u2014",
    ],
  ];

  return (
    <div
      id="print-area"
      className="min-h-[297mm] w-[210mm] max-w-full bg-white p-10 font-serif text-[#1a1a1a]"
    >
      <div className="mb-8 flex items-end justify-between border-b-[3px] border-gold pb-6">
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#888]">
            Proposta Comercial
          </div>
          <div className="text-[28px] font-bold leading-none text-[#1a1a1a]">
            Internacional
          </div>
          <div className="text-[28px] font-bold leading-none text-gold">
            Freeband
          </div>
        </div>
        <div className="text-right text-xs text-[#666]">
          <div>Desde 1969</div>
          <div>Trabiju, SP</div>
          <div className="mt-1 text-gold">(16) 99171-2996</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-1 text-[11px] uppercase tracking-widest text-[#888]">
          Proposta para
        </div>
        <div className="text-[22px] font-semibold text-[#1a1a1a]">
          {data.contratante || "\u2014"}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 border border-[#e8e0ce] bg-[#f9f7f2] p-5">
        {infoRows.map(([label, value]) => (
          <div key={label}>
            <div className={labelClasses}>{label}</div>
            <div className="text-sm font-medium">{value}</div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className={sectionTitleClasses}>Investimento</div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-[#444]">Valor Total</span>
          <span className="text-[22px] font-bold text-[#1a1a1a]">
            {hasCache ? formatCurrency(data.cache) : "\u2014"}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className={sectionTitleClasses}>Condicoes de Pagamento</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-[#e8e0ce] bg-[#f9f7f2] p-3">
            <div className="mb-1 text-[10px] uppercase text-[#888]">
              Entrada ({data.entradaPct || 0}%)
            </div>
            <div className="text-lg font-bold">
              {hasEntrada ? entradaStr : "\u2014"}
            </div>
            {data.entradaData ? (
              <div className="mt-1 text-[11px] text-[#666]">
                ate {formatDate(data.entradaData)}
              </div>
            ) : null}
          </div>
          <div className="border border-[#e8e0ce] bg-[#f9f7f2] p-3">
            <div className="mb-1 text-[10px] uppercase text-[#888]">
              Saldo ({saldoPct}%)
            </div>
            <div className="text-lg font-bold">
              {hasEntrada ? saldoStr : "\u2014"}
            </div>
            {data.saldoData ? (
              <div className="mt-1 text-[11px] text-[#666]">
                ate {formatDate(data.saldoData)}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {data.itensInclusos ? (
        <div className="mb-6">
          <div className={sectionTitleClasses}>Itens Inclusos</div>
          <div className={bodyBlockClasses}>{data.itensInclusos}</div>
        </div>
      ) : null}

      {data.observacoes ? (
        <div className="mb-6">
          <div className={sectionTitleClasses}>Observacoes</div>
          <div className={bodyBlockClasses}>{data.observacoes}</div>
        </div>
      ) : null}

      <div className="mt-auto flex items-end justify-between border-t-2 border-gold pt-4 text-[11px] text-[#888]">
        <div>
          {data.validade ? (
            <span>Proposta valida ate {formatDate(data.validade)}</span>
          ) : null}
        </div>
        <div className="text-right">
          <div>Internacional Freeband</div>
          <div className="text-gold">(16) 99171-2996</div>
        </div>
      </div>
    </div>
  );
}
