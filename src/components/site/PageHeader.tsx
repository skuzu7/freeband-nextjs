// src/components/site/PageHeader.tsx
// The opening of every inner page: kicker, the headline resolving out of the
// LED wall, lead. The h1 carries the id the page's <main> region is named by.
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface PageHeaderProps {
  id: string;
  label: string;
  /** May contain "
" for a deliberate line break. */
  headline: string;
  lead?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ id, label, headline, lead, children, className }: PageHeaderProps) {
  return (
    <Container className={cn('pt-16 pb-12 md:pt-24 md:pb-16', className)}>
      <SectionHeader as="h1" size="page" id={id} label={label} headline={headline} lead={lead}>
        {children}
      </SectionHeader>
    </Container>
  );
}
