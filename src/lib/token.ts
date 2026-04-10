// src/lib/token.ts
export function validateToken(token: string): boolean {
  const expected = process.env.ORCAMENTO_TOKEN;
  if (!expected) return false;
  return token === expected;
}
