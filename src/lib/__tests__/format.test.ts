import { describe, it, expect } from "vitest";
import {
  parseReais,
  formatCurrency,
  formatDate,
  calcSaldo,
  calcEntrada,
} from "../format";

// Non-breaking space character used by Intl.NumberFormat pt-BR between "R$" and value
const NBSP = " ";

describe("parseReais", () => {
  it("parses whole reais", () => {
    expect(parseReais("5000")).toBe(5000);
  });

  it("parses decimal reais with dot separator (type=number canonical form)", () => {
    expect(parseReais("5000.5")).toBe(5000.5);
  });

  it("returns null for empty input", () => {
    expect(parseReais("")).toBeNull();
    expect(parseReais("   ")).toBeNull();
  });

  it("returns null for non-numeric input", () => {
    expect(parseReais("abc")).toBeNull();
  });
});

describe("formatCurrency", () => {
  it("treats the input as reais, not centavos", () => {
    expect(formatCurrency("5000")).toBe(`R$${NBSP}5.000,00`);
  });

  it("keeps the decimal part", () => {
    expect(formatCurrency("5000.5")).toBe(`R$${NBSP}5.000,50`);
  });

  it("formats zero", () => {
    expect(formatCurrency("0")).toBe(`R$${NBSP}0,00`);
  });

  it("returns placeholder for non-numeric input", () => {
    expect(formatCurrency("abc")).toBe("R$ —");
  });

  it("returns placeholder for empty input", () => {
    expect(formatCurrency("")).toBe("R$ —");
  });
});

describe("formatDate", () => {
  it("converts ISO date string to dd/mm/yyyy", () => {
    expect(formatDate("2026-04-10")).toBe("10/04/2026");
  });

  it("returns placeholder when value is empty", () => {
    expect(formatDate("")).toBe("—");
  });

  it("preserves single-digit day and month segments", () => {
    expect(formatDate("2026-01-05")).toBe("05/01/2026");
  });

  it("returns non-ISO input unchanged instead of mangling it", () => {
    expect(formatDate("10/04/2026")).toBe("10/04/2026");
  });
});

describe("calcSaldo", () => {
  it("computes remaining balance after percentage down payment", () => {
    expect(calcSaldo("10000", "50")).toBe(`R$${NBSP}5.000,00`);
  });

  it("returns full total when down payment is 0%", () => {
    expect(calcSaldo("10000", "0")).toBe(`R$${NBSP}10.000,00`);
  });

  it("returns zero when down payment is 100%", () => {
    expect(calcSaldo("10000", "100")).toBe(`R$${NBSP}0,00`);
  });

  it("returns placeholder when percentage is not numeric", () => {
    expect(calcSaldo("10000", "abc")).toBe("R$ —");
  });

  it("returns placeholder when cache is empty", () => {
    expect(calcSaldo("", "50")).toBe("R$ —");
  });
});

describe("calcEntrada", () => {
  it("computes down payment amount from percentage", () => {
    expect(calcEntrada("10000", "50")).toBe(`R$${NBSP}5.000,00`);
  });

  it("supports the official 30% default", () => {
    expect(calcEntrada("10000", "30")).toBe(`R$${NBSP}3.000,00`);
  });

  it("returns placeholder when cache is empty", () => {
    expect(calcEntrada("", "50")).toBe("R$ —");
  });
});
