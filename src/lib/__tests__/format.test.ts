import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, calcSaldo, calcEntrada } from "../format";

// Non-breaking space character used by Intl.NumberFormat pt-BR between "R$" and value
const NBSP = "\u00A0";

describe("formatCurrency", () => {
  it("should format digit-only string as BRL when value is valid", () => {
    expect(formatCurrency("1000000")).toBe(`R$${NBSP}10.000,00`);
  });

  it("should strip non-digit characters before parsing", () => {
    expect(formatCurrency("R$ 10.000,00")).toBe(`R$${NBSP}10.000,00`);
  });

  it("should return placeholder when input has no digits", () => {
    expect(formatCurrency("abc")).toBe("R$ —");
  });

  it("should return placeholder when input is empty", () => {
    expect(formatCurrency("")).toBe("R$ —");
  });

  it("should format small values correctly", () => {
    expect(formatCurrency("150")).toBe(`R$${NBSP}1,50`);
  });
});

describe("formatDate", () => {
  it("should convert ISO date string to dd/mm/yyyy", () => {
    expect(formatDate("2026-04-10")).toBe("10/04/2026");
  });

  it("should return placeholder when value is empty", () => {
    expect(formatDate("")).toBe("—");
  });

  it("should preserve single-digit day and month segments", () => {
    expect(formatDate("2026-01-05")).toBe("05/01/2026");
  });
});

describe("calcSaldo", () => {
  it("should compute remaining balance after percentage down payment", () => {
    // 10000,00 total, 50% entrada → saldo = 5000,00
    expect(calcSaldo("1000000", "50")).toBe(`R$${NBSP}5.000,00`);
  });

  it("should return full total when down payment is 0%", () => {
    expect(calcSaldo("1000000", "0")).toBe(`R$${NBSP}10.000,00`);
  });

  it("should return zero when down payment is 100%", () => {
    expect(calcSaldo("1000000", "100")).toBe(`R$${NBSP}0,00`);
  });

  it("should return placeholder when percentage is not numeric", () => {
    expect(calcSaldo("1000000", "abc")).toBe("R$ —");
  });

  it("should return placeholder when cache is empty", () => {
    expect(calcSaldo("", "50")).toBe("R$ —");
  });
});

describe("calcEntrada", () => {
  it("should compute down payment amount from percentage", () => {
    expect(calcEntrada("1000000", "50")).toBe(`R$${NBSP}5.000,00`);
  });

  it("should return zero when down payment is 0%", () => {
    expect(calcEntrada("1000000", "0")).toBe(`R$${NBSP}0,00`);
  });

  it("should return full total when down payment is 100%", () => {
    expect(calcEntrada("1000000", "100")).toBe(`R$${NBSP}10.000,00`);
  });

  it("should return placeholder when cache has no digits", () => {
    expect(calcEntrada("", "50")).toBe("R$ —");
  });
});
