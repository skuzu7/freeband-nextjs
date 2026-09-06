// src/components/site/PageHeader.tsx
// The opening of every inner page: kicker, the headline coming on as a LED
// sign, lead. The h1 carries the id the page's <main> region is named by.
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { LedText } from '@/components/brand/LedText';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';

interface PageHeaderProps {
  id: string;
  label: string;
  /** May contain "\n": the line breaks are shared by the sign and the type. */
  headline: string;
  lead?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ id, label, headline, lead, children, className }: PageHeaderProps) {
  return (
    <Container as="header" className={cn('pt-16 pb-12 md:pt-24 md:pb-16', className)}>
      <Label dot>{label}</Label>
      {/* text-5xl here too: the `ch` cap must resolve against the heading's
          size, not the body's, or 22ch is ~190px and every word gets a line */}
      <div className="mt-4 max-w-[22ch] text-5xl">
        <LedText as="h1" id={id} text={headline} className="text-5xl font-semibold tracking-display text-ink" cols={170} />
      </div>
      {lead && <p className="rise mt-6 max-w-[60ch] text-lg text-ink-muted">{lead}</p>}
      {children}
    </Container>
  );
}
