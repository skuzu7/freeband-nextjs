// src/lib/format.ts
// Money and dates for the proposal. Shared by the HTML preview, the print
// layout and the PDF so the three can never disagree on a number.

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// The cachê field is a plain `type="number"` input: the user types the value
// in reais and the browser hands us a canonical decimal string with a dot
// separator (e.g. "5000" or "5000.5"). Only that shape is a number here —
// "1e3" or "0x10" are not amounts anyone meant to write on a proposal.
const DECIMAL = /^-?\d+(\.\d+)?$/;

export function parseReais(value: string): number | null {
  const t = value.trim();
  if (!DECIMAL.test(t)) return null;
  const num = Number(t);
  return Number.isFinite(num) ? num : null;
}

/** Whole centavos, so two parts always add back to the total. */
const toCents = (reais: number) => Math.round(reais * 100);
const fromCents = (cents: number) => cents / 100;

export interface PaymentSplit {
  /** Percentage of the down payment, clamped to 0..100; null when the field is not a number. */
  entradaPct: number | null;
  /** The rest, 100 - entradaPct; null when entradaPct is. */
  saldoPct: number | null;
  /** Formatted amounts, or the placeholder when either input is missing. */
  entrada: string;
  saldo: string;
}

const PLACEHOLDER = 'R$ —';

/**
 * The two payments of a proposal from the total and the down-payment
 * percentage. The percentage is clamped to 0..100, the down payment is
 * rounded to the centavo first and the balance is what is left, so the two
 * printed amounts always add up to the printed total.
 */
export function splitPayment(cache: string, entradaPct: string): PaymentSplit {
  const pctRaw = parseReais(entradaPct);
  const pct = pctRaw === null ? null : Math.min(100, Math.max(0, pctRaw));
  const total = parseReais(cache);
  if (pct === null || total === null || total < 0) {
    return { entradaPct: pct, saldoPct: pct === null ? null : 100 - pct, entrada: PLACEHOLDER, saldo: PLACEHOLDER };
  }
  const totalCents = toCents(total);
  const entradaCents = Math.round((totalCents * pct) / 100);
  return {
    entradaPct: pct,
    saldoPct: 100 - pct,
    entrada: brl.format(fromCents(entradaCents)),
    saldo: brl.format(fromCents(totalCents - entradaCents)),
  };
}

export function formatCurrency(value: string): string {
  const num = parseReais(value);
  if (num === null || num < 0) return PLACEHOLDER;
  return brl.format(num);
}

export function formatDate(value: string): string {
  if (!value) return '—';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month, day] = match;
  const m = Number(month);
  const d = Number(day);
  if (m < 1 || m > 12 || d < 1 || d > new Date(Date.UTC(Number(year), m, 0)).getUTCDate()) return value;
  return `${day}/${month}/${year}`;
}

export function calcEntrada(cache: string, entradaPct: string): string {
  return splitPayment(cache, entradaPct).entrada;
}

export function calcSaldo(cache: string, entradaPct: string): string {
  return splitPayment(cache, entradaPct).saldo;
}
