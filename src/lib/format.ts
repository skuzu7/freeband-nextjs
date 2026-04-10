// src/lib/format.ts
export function formatCurrency(value: string): string {
  const num = parseFloat(value.replace(/\D/g, "")) / 100;
  if (isNaN(num)) return "R$ —";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

export function formatDate(value: string): string {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function calcSaldo(cache: string, entradaPct: string): string {
  const total = parseFloat(cache.replace(/\D/g, "")) / 100;
  const pct = parseFloat(entradaPct) / 100;
  if (isNaN(total) || isNaN(pct)) return "R$ —";
  const saldo = total * (1 - pct);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(saldo);
}

export function calcEntrada(cache: string, entradaPct: string): string {
  const total = parseFloat(cache.replace(/\D/g, "")) / 100;
  const pct = parseFloat(entradaPct) / 100;
  if (isNaN(total) || isNaN(pct)) return "R$ —";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total * pct);
}
