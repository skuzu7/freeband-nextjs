// src/components/site/PageHeader.tsx
// The opening of every inner page: kicker, one-line headline, lead. The h1
// carries the id the page's <main> region is named by.
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';

interface PageHeaderProps {
  id: string;
  label: string;
  headline: string;
  lead?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ id, label, headline, lead, children, className }: PageHeaderProps) {
  return (
    <Container as="header" className={cn('pt-16 pb-12 md:pt-24 md:pb-16', className)}>
      <Label dot>{label}</Label>
      <h1 id={id} className="mt-4 max-w-[18ch] text-5xl font-semibold tracking-display text-ink">
        {headline}
      </h1>
      {lead && <p className="mt-6 max-w-[60ch] text-lg text-ink-muted">{lead}</p>}
      {children}
    </Container>
  );
}
