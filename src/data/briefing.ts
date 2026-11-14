/**
 * The home briefing builder's WhatsApp message. Kept out of contact.ts on
 * purpose: contact.ts is imported by the client-side player on /palco,
 * /arquivo and /historia, and anything added there ships on those pages.
 */
import { WHATSAPP_NUMBER } from './contact';

export interface BriefingSelection {
  format: string;
  packageName: string;
  date: string;
  city: string;
}

export function buildBriefingMessage({ format, packageName, date, city }: BriefingSelection): string {
  const parts = [
    `Olá! Gostaria de solicitar uma proposta da Internacional Freeband.`,
    `• Formato: ${format || 'A definir'}`,
    `• Estrutura: ${packageName || 'Show Completo'}`,
  ];
  if (date.trim()) parts.push(`• Data prevista: ${date.trim()}`);
  if (city.trim()) parts.push(`• Cidade/UF: ${city.trim()}`);
  return parts.join('\n');
}

export function whatsappBriefingLink(selection: BriefingSelection): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildBriefingMessage(selection))}`;
}
