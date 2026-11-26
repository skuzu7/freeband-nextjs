import { describe, expect, it } from 'vitest';
import {
  composeBriefingMessage,
  composeBriefingWhatsAppLink,
  FLEXIBLE_DATE_LABEL,
  formatBriefingDate,
  mapPackageIdToBriefingName,
  validateBriefingStep,
} from '../briefing';

describe('briefing pure helpers', () => {
  it('formats ISO date strings to DD/MM/YYYY and supports flexible date flag', () => {
    expect(formatBriefingDate('2026-11-14', false)).toBe('14/11/2026');
    expect(formatBriefingDate('2026-11-14', true)).toBe(FLEXIBLE_DATE_LABEL);
    expect(formatBriefingDate('', false)).toBe('');
  });

  it('maps package ids to briefing structure names', () => {
    expect(mapPackageIdToBriefingName('premium')).toBe('Show Completo');
    expect(mapPackageIdToBriefingName('classic')).toBe('Show Essencial');
  });

  it('validates steps and composes WhatsApp message + link', () => {
    const draft = {
      format: 'Casamento',
      packageName: 'Show Completo',
      date: '2026-11-14',
      dateFlexible: false,
      city: 'Jaú/SP',
    };
    expect(validateBriefingStep(3, draft)).toEqual({ valid: true });
    expect(composeBriefingMessage(draft)).toContain('Data prevista: 14/11/2026');
    expect(decodeURIComponent(composeBriefingWhatsAppLink(draft))).toContain('Jaú/SP');
  });
});
