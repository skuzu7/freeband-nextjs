// src/lib/proposta.ts
// The proposal as the strings it prints: the event rows, the total and the
// two payments with their labels. Shared by the HTML print layout and the
// PDF, so the preview, the printout and the file never disagree on a number.
import { orcamento } from '@/data/copy/orcamento';
import { formatCurrency, formatDate, splitPayment } from '@/lib/format';
import type { OrcamentoData } from '@/types/orcamento';

const doc = orcamento.doc;

/** "22:00 às —" when only one end of the evening is known; "—" when neither. */
export function formatSchedule(inicio: string, fim: string): string {
  if (!inicio && !fim) return doc.empty;
  return `${inicio || doc.empty} ${doc.horarioJoin} ${fim || doc.empty}`;
}

/** "Entrada (50%)"; the percentage is the clamped one the amounts use. */
export function pctLabel(label: string, pct: number | null): string {
  return `${label} (${pct === null ? doc.empty : `${pct}%`})`;
}

/** What the proposal prints from the form, already formatted. */
export interface PropostaView {
  /** Label and value of each event detail, in print order. */
  rows: ReadonlyArray<readonly [string, string]>;
  total: string;
  entradaLabel: string;
  entradaValor: string;
  saldoLabel: string;
  saldoValor: string;
}

export function buildProposta(data: OrcamentoData): PropostaView {
  const payment = splitPayment(data.cache, data.entradaPct);

  const rows: ReadonlyArray<readonly [string, string]> = [
    [doc.tipoEvento, data.tipoEvento || doc.empty],
    [doc.data, data.dataEvento ? formatDate(data.dataEvento) : doc.empty],
    [doc.local, data.local || doc.empty],
    [doc.horario, formatSchedule(data.horarioInicio, data.horarioFim)],
    [doc.convidados, data.numConvidados ? `${data.numConvidados} ${doc.pessoas}` : doc.empty],
  ];

  return {
    rows,
    total: data.cache !== '' ? formatCurrency(data.cache) : doc.empty,
    entradaLabel: pctLabel(doc.entrada, payment.entradaPct),
    entradaValor: payment.entrada,
    saldoLabel: pctLabel(doc.saldo, payment.saldoPct),
    saldoValor: payment.saldo,
  };
}
