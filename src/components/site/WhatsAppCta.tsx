// src/components/site/WhatsAppCta.tsx
// The primary action of the whole site: open WhatsApp with the quote message
// pre-filled. Red, like the wordmark — nothing else on the page is.
import type { ReactNode } from 'react';
import { contact } from '@/data/contact';
import { Button } from '@/components/ui/Button';

interface WhatsAppCtaProps {
  children: ReactNode;
  size?: 'md' | 'lg';
  className?: string;
  /** Override the default quote link (e.g. a package-specific message). */
  href?: string;
}

export function WhatsAppCta({ children, size = 'md', className, href }: WhatsAppCtaProps) {
  return (
    <Button href={href ?? contact.whatsappQuoteLink} size={size} className={className}>
      <svg viewBox="0 0 24 24" className="size-[1.1em] shrink-0" fill="currentColor" aria-hidden>
        <path d="M12 2.5A9.5 9.5 0 0 0 3.8 16.7L2.5 21.5l4.9-1.3A9.5 9.5 0 1 0 12 2.5Zm0 1.8a7.7 7.7 0 1 1-3.9 14.3l-.3-.2-2.9.8.8-2.8-.2-.3A7.7 7.7 0 0 1 12 4.3Zm-3 3.9c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.2-.2-.5-.3l-1.8-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5.3-.5c.1-.2 0-.3 0-.5L10 8.6c-.2-.4-.4-.4-.6-.4H9Z" />
      </svg>
      <span>{children}</span>
    </Button>
  );
}
