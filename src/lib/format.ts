// src/lib/format.ts

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// The cachê field is a plain `type="number"` input: the user types the value
// in reais and the browser hands us a canonical decimal string with a dot
// separator (e.g. "5000" or "5000.5"). Returns null when not a number.
export function parseReais(value: string): number | null {
  if (!value.trim()) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function formatCurrency(value: string): string {
  const num = parseReais(value);
  if (num === null) return "R$ —";
  return brl.format(num);
}

export function formatDate(value: string): string {
  if (!value) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export function calcEntrada(cache: string, entradaPct: string): string {
  const total = parseReais(cache);
  const pct = parseReais(entradaPct);
  if (total === null || pct === null) return "R$ —";
  return brl.format(total * (pct / 100));
}

export function calcSaldo(cache: string, entradaPct: string): string {
  const total = parseReais(cache);
  const pct = parseReais(entradaPct);
  if (total === null || pct === null) return "R$ —";
  return brl.format(total * (1 - pct / 100));
}
