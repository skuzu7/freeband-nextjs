// src/lib/briefing.ts
// Pure helpers for the guided 3-step WhatsApp briefing flow:
// date formatting (ISO picker -> DD/MM/YYYY or flexible text),
// package catalog mapping, step validation, and message composition.
import { buildBriefingMessage, whatsappBriefingLink } from '@/data/contact';

export type BriefingStep = 1 | 2 | 3;

export interface BriefingDraft {
  format: string;
  packageName: string;
  date: string;
  dateFlexible: boolean;
  city: string;
}

export const FLEXIBLE_DATE_LABEL = 'Data ainda a definir';

/**
 * Formats an ISO date string (`YYYY-MM-DD`) into `DD/MM/YYYY`.
 * When `flexible` is true, returns the explicit flexible label.
 * Free-text strings (e.g. "Novembro/2026") are returned trimmed as-is.
 */
export function formatBriefingDate(date: string, flexible: boolean): string {
  if (flexible) return FLEXIBLE_DATE_LABEL;
  const trimmed = date.trim();
  if (!trimmed) return '';
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) {
    return `${iso[3]}/${iso[2]}/${iso[1]}`;
  }
  return trimmed;
}

/**
 * Maps a commercial package id from `src/data/packages.ts` (`premium` | `classic`)
 * or briefing package id (`completo` | `essencial`) to the corresponding briefing label.
 */
export function mapPackageIdToBriefingName(packageId: string): string {
  const normalized = packageId.trim().toLowerCase();
  if (normalized === 'classic' || normalized === 'essencial' || normalized.includes('classic')) {
    return 'Show Essencial';
  }
  return 'Show Completo';
}

export interface StepValidationResult {
  valid: boolean;
  hint?: string;
}

/**
 * Validates the active step of the guided briefing.
 * Steps 1 and 2 require a selection; Step 3 never blocks WhatsApp submission,
 * returning an optional helper hint when both date and city are empty.
 */
export function validateBriefingStep(step: BriefingStep, draft: BriefingDraft): StepValidationResult {
  if (step === 1) {
    return draft.format.trim().length > 0
      ? { valid: true }
      : { valid: false, hint: 'Escolha o formato do evento para continuar.' };
  }
  if (step === 2) {
    return draft.packageName.trim().length > 0
      ? { valid: true }
      : { valid: false, hint: 'Escolha a estrutura de palco desejada.' };
  }
  const hasDate = draft.dateFlexible || draft.date.trim().length > 0;
  const hasCity = draft.city.trim().length > 0;
  if (!hasDate && !hasCity) {
    return {
      valid: true,
      hint: 'Informar a data (ou marcar "ainda a definir") e a cidade agiliza o retorno da produção.',
    };
  }
  return { valid: true };
}

export function composeBriefingMessage(draft: BriefingDraft): string {
  return buildBriefingMessage({
    format: draft.format,
    packageName: draft.packageName,
    date: formatBriefingDate(draft.date, draft.dateFlexible),
    city: draft.city,
  });
}

export function composeBriefingWhatsAppLink(draft: BriefingDraft): string {
  return whatsappBriefingLink({
    format: draft.format,
    packageName: draft.packageName,
    date: formatBriefingDate(draft.date, draft.dateFlexible),
    city: draft.city,
  });
}
