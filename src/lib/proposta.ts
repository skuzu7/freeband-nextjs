// src/lib/proposta.ts
// The proposal, twice over and both times pure:
//   buildProposta(data)   the form as the strings it prints — the event rows,
//                         the total, the two payments with their labels.
//   propostaBlocks(view)  those strings as the document's blocks, in print
//                         order, with the copy and the band's own details.
// The HTML print layout and the PDF are thin renderers over the blocks, so
// the preview, the printout and the file never disagree on a number, a label
// or the order of things.
import { bandInfo } from '@/data/band';
import { contact } from '@/data/contact';
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

/** The lines of a free-text field: trimmed, blank ones dropped. */
function linesOf(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** A list typed as "• item" or "- item": the document draws its own bullets. */
function itemsOf(text: string): string[] {
  return linesOf(text)
    .map((line) => line.replace(/^[•·*–—-]+\s*/, ''))
    .filter(Boolean);
}

/** "31/12/2026" as the dot matrix shows it, which has digits and blanks only: "31 12 2026". */
function matrixDate(formatted: string): string | null {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(formatted) ? formatted.split('/').join(' ') : null;
}

/** "até 10/12/2026", or nothing when the field is empty. */
const dueBy = (date: string) => (date ? `${doc.ate} ${formatDate(date)}` : null);

/** What the proposal prints from the form, already formatted. */
export interface PropostaView {
  /** Label and value of each event detail, in print order. */
  rows: ReadonlyArray<readonly [string, string]>;
  total: string;
  entradaLabel: string;
  entradaValor: string;
  saldoLabel: string;
  saldoValor: string;
  /** Who the proposal is for, or the dash. */
  contratante: string;
  /** The event date as it is printed: "31/12/2026", or the dash. */
  dataEvento: string;
  /** The same date for the dot matrix, "31 12 2026"; null when there is no real date to light. */
  dataMatriz: string | null;
  /** "até 10/12/2026" under each payment; null without a date. */
  entradaPrazo: string | null;
  saldoPrazo: string | null;
  /** The included items, one per line typed, bullets stripped. */
  itens: string[];
  /** The remarks, one paragraph per line typed. */
  observacoes: string[];
  /** "Proposta válida até 31/12/2026"; null without a date. */
  validade: string | null;
}

export function buildProposta(data: OrcamentoData): PropostaView {
  const payment = splitPayment(data.cache, data.entradaPct);
  const dataEvento = data.dataEvento ? formatDate(data.dataEvento) : doc.empty;

  const rows: ReadonlyArray<readonly [string, string]> = [
    [doc.tipoEvento, data.tipoEvento || doc.empty],
    [doc.data, dataEvento],
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
    contratante: data.contratante.trim() || doc.empty,
    dataEvento,
    dataMatriz: matrixDate(dataEvento),
    entradaPrazo: dueBy(data.entradaData),
    saldoPrazo: dueBy(data.saldoData),
    itens: itemsOf(data.itensInclusos),
    observacoes: linesOf(data.observacoes),
    validade: data.validade ? `${doc.validade} ${formatDate(data.validade)}` : null,
  };
}

/** A label over a value. */
export interface PropostaFact {
  label: string;
  value: string;
}

/** One of the two payments: its label, the amount, and when it is due. */
export interface PropostaPayment extends PropostaFact {
  due: string | null;
}

/**
 * The date of the event, for the letterhead. With a real date it is lit on
 * the 5×7 dot matrix and `label` spells it out beside its name ("Data do
 * evento · 31/12/2026"), so the day is never read off the dots alone; without
 * one, `label` is the name and `text` — the dash — is printed as type.
 */
export interface PropostaDate {
  label: string;
  /** For the dot matrix: "31 12 2026". Null when there is no real date. */
  matrix: string | null;
  /** As type: "31/12/2026", or the dash. */
  text: string;
}

/**
 * One block of the proposal. Both renderers switch on `kind` and nothing
 * else: a block added here does not print until each of them says how.
 */
export type PropostaBlock =
  /** The letterhead: what the document is, whose it is, and the date it is about. */
  | { kind: 'header'; kicker: string; brandLine: string; name: string; date: PropostaDate }
  /** Who it is for. */
  | { kind: 'client'; label: string; name: string }
  /** The rest of the event, as labelled facts (the date is in the letterhead). */
  | { kind: 'facts'; rows: PropostaFact[] }
  /** The figure the proposal is about. */
  | { kind: 'total'; title: string; label: string; value: string }
  /** How it is paid. */
  | { kind: 'payments'; title: string; parts: PropostaPayment[] }
  /** A titled list — the included items. */
  | { kind: 'list'; title: string; items: string[] }
  /** Titled paragraphs — the remarks. */
  | { kind: 'text'; title: string; paragraphs: string[] }
  /** What every page is signed with: the terms on one side, the band on the other. */
  | { kind: 'footer'; terms: string[]; links: string; signature: string[]; phone: string };

export type PropostaBlockOf<K extends PropostaBlock['kind']> = Extract<PropostaBlock, { kind: K }>;

/**
 * The proposal as its blocks, in print order: header first, footer last, and
 * between them only what has something to say — an empty list or no remarks
 * leaves no title behind.
 */
export function propostaBlocks(view: PropostaView): PropostaBlock[] {
  const blocks: PropostaBlock[] = [
    {
      kind: 'header',
      kicker: doc.kicker,
      brandLine: bandInfo.brandLine,
      name: bandInfo.name,
      date: {
        label: view.dataMatriz ? `${doc.dataEvento} · ${view.dataEvento}` : doc.dataEvento,
        matrix: view.dataMatriz,
        text: view.dataEvento,
      },
    },
    { kind: 'client', label: doc.para, name: view.contratante },
    {
      kind: 'facts',
      rows: view.rows.filter(([label]) => label !== doc.data).map(([label, value]) => ({ label, value })),
    },
    { kind: 'total', title: doc.investimento, label: doc.valorTotal, value: view.total },
    {
      kind: 'payments',
      title: doc.pagamento,
      parts: [
        { label: view.entradaLabel, value: view.entradaValor, due: view.entradaPrazo },
        { label: view.saldoLabel, value: view.saldoValor, due: view.saldoPrazo },
      ],
    },
  ];
  if (view.itens.length > 0) blocks.push({ kind: 'list', title: doc.itens, items: view.itens });
  if (view.observacoes.length > 0) blocks.push({ kind: 'text', title: doc.observacoes, paragraphs: view.observacoes });
  blocks.push({
    kind: 'footer',
    terms: [...(view.validade ? [view.validade] : []), `${doc.cnpj} ${bandInfo.cnpj}`],
    links: `${contact.instagram} · ${contact.website}`,
    signature: [`${bandInfo.name} · ${doc.since(bandInfo.founded)}`, contact.addressFull],
    phone: contact.phone,
  });
  return blocks;
}
