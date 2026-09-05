// src/data/contact.ts
// How to reach the production. One number, one e-mail, one address.

const WHATSAPP_NUMBER = '5516997732749';

export const contact = {
  phone: '(16) 99773-2749',
  phoneIntl: '+55 16 99773-2749',
  whatsapp: '(16) 99773-2749',
  whatsappLink: `https://wa.me/${WHATSAPP_NUMBER}`,
  // Same number, but the conversation opens with the three answers the
  // production needs anyway — one less round-trip before a proposal exists.
  whatsappQuoteLink: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Olá! Quero um orçamento da Freeband. O evento é: (formato, data e cidade)',
  )}`,
  email: 'freeband.morales@gmail.com',
  city: 'Trabiju/SP',
  address: 'Rua Gabriel Tannuri, 210',
  addressFull: 'Rua Gabriel Tannuri, 210 — Trabiju/SP',
  instagram: '@internacionalfreeband',
  instagramUrl: 'https://instagram.com/internacionalfreeband',
  website: 'www.freeband.com.br',
  siteUrl: 'https://freeband.com.br',
  cnpj: '59.457.507/0001-11',
};

/** WhatsApp link that opens with a message about a specific package. */
export function whatsappPackageLink(intro: string, packageName: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`${intro} ${packageName}`)}`;
}
