import test from 'node:test';
import assert from 'node:assert/strict';
import {
  composeBriefingMessage,
  composeBriefingWhatsAppLink,
  FLEXIBLE_DATE_LABEL,
  formatBriefingDate,
  mapPackageIdToBriefingName,
  validateBriefingStep,
} from '../src/lib/briefing';

test('formatBriefingDate formats ISO dates into DD/MM/YYYY and supports flexible date flag', () => {
  assert.equal(formatBriefingDate('2026-11-14', false), '14/11/2026');
  assert.equal(formatBriefingDate('2026-11-14', true), FLEXIBLE_DATE_LABEL);
  assert.equal(formatBriefingDate('', true), FLEXIBLE_DATE_LABEL);
  assert.equal(formatBriefingDate('Novembro/2026', false), 'Novembro/2026');
  assert.equal(formatBriefingDate('', false), '');
});

test('mapPackageIdToBriefingName maps catalog package ids accurately', () => {
  assert.equal(mapPackageIdToBriefingName('premium'), 'Show Completo');
  assert.equal(mapPackageIdToBriefingName('classic'), 'Show Essencial');
  assert.equal(mapPackageIdToBriefingName('essencial'), 'Show Essencial');
  assert.equal(mapPackageIdToBriefingName('PACOTE CLASSIC'), 'Show Essencial');
});

test('validateBriefingStep checks step prerequisites and provides non-blocking step 3 hint', () => {
  const base = { format: 'Casamento', packageName: 'Show Completo', date: '', dateFlexible: false, city: '' };
  assert.equal(validateBriefingStep(1, base).valid, true);
  assert.equal(validateBriefingStep(1, { ...base, format: '' }).valid, false);
  assert.equal(validateBriefingStep(2, base).valid, true);
  assert.equal(validateBriefingStep(2, { ...base, packageName: '' }).valid, false);

  const step3Empty = validateBriefingStep(3, base);
  assert.equal(step3Empty.valid, true);
  assert.ok(step3Empty.hint);

  const step3Flexible = validateBriefingStep(3, { ...base, dateFlexible: true });
  assert.equal(step3Flexible.valid, true);
  assert.equal(step3Flexible.hint, undefined);
});

test('composeBriefingMessage and WhatsApp link encode formatted date and city', () => {
  const draft = {
    format: 'Formatura',
    packageName: 'Show Essencial',
    date: '2026-12-20',
    dateFlexible: false,
    city: 'Jaú/SP',
  };
  const msg = composeBriefingMessage(draft);
  assert.match(msg, /Formato: Formatura/);
  assert.match(msg, /Estrutura: Show Essencial/);
  assert.match(msg, /Data prevista: 20\/12\/2026/);
  assert.match(msg, /Cidade\/UF: Jaú\/SP/);

  const link = composeBriefingWhatsAppLink(draft);
  assert.ok(link.startsWith('https://wa.me/5516997732749?text='));
  assert.ok(decodeURIComponent(link).includes('20/12/2026'));
});
