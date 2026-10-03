// src/lib/orcamentoDraft.ts
// The proposal editor's draft in this browser's localStorage, so a reload, a
// slip on the back button or an expired session does not cost the producer
// the proposal. Drafts already saved are read back under DRAFT_KEY, so its
// value never changes. Reading turns whatever is stored into a whole
// OrcamentoData or null; writing never throws.
import { ORCAMENTO_FIELDS, defaultOrcamento, type OrcamentoData } from '@/types/orcamento';

export const DRAFT_KEY = 'freeband_orcamento_draft';

export function isDefault(data: OrcamentoData): boolean {
  return (Object.keys(defaultOrcamento) as Array<keyof OrcamentoData>).every((k) => data[k] === defaultOrcamento[k]);
}

export function readDraft(): OrcamentoData | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? parseOrcamento(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeDraft(data: OrcamentoData | null): void {
  try {
    if (data === null) window.localStorage.removeItem(DRAFT_KEY);
    else window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable: the editor still works, just without a draft */
  }
}

/** Reads a stored draft back into a whole OrcamentoData; unknown shapes yield null. */
export function parseOrcamento(raw: unknown): OrcamentoData | null {
  if (!raw || typeof raw !== 'object') return null;
  const source = raw as Record<string, unknown>;
  const data = { ...defaultOrcamento };
  for (const field of ORCAMENTO_FIELDS) {
    const value = source[field];
    if (typeof value === 'string') data[field] = value;
  }
  return data;
}
