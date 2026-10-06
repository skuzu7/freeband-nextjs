// src/components/ui/SectionHeader.tsx
// How every block and every page opens: a dotted label, the headline
// resolving out of the LED wall, and the lead under it. The heading is real
// text in the HTML; the dots are a cover that fades as it scrolls into view
// (.led-resolve in src/styles/led.css).
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Label } from './Label';

const SIZES = {
  /** The h1 of an inner page: wide, but never more than a few words a line. */
  page: 'max-w-[22ch] text-5xl',
  /** A block of the home or a section of a page. */
  block: 'text-4xl',
  /** A heading inside a section. */
  sub: 'text-3xl',
} as const;

interface SectionHeaderProps {
  /** Id of the heading: the section around it is named by it. */
  id: string;
  label: string;
  /** May contain "\n" for a deliberate line break. */
  headline: string;
  lead?: string;
  as?: 'h1' | 'h2' | 'h3';
  size?: keyof typeof SIZES;
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({
  id,
  label,
  headline,
  lead,
  as: Tag = 'h2',
  size = 'block',
  className,
  children,
}: SectionHeaderProps) {
  return (
    <header className={cn(size !== 'page' && 'max-w-[60ch]', className)}>
      <Label dot>{label}</Label>
      <Tag
        id={id}
        className={cn(
          'led-resolve led-resolve-fine relative mt-4 whitespace-pre-line font-semibold tracking-display text-ink',
          SIZES[size],
        )}
      >
        {headline}
      </Tag>
      {lead && <p className="rise mt-5 max-w-[60ch] text-lg text-ink-muted">{lead}</p>}
      {children}
    </header>
  );
}
