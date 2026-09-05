// src/components/ui/Button.tsx
// The three buttons of the site. `primary` is the only place besides the
// wordmark that the acrylic red is allowed; its label is dark, because white
// on this red does not clear AA (see contrast.test.ts).
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm font-medium uppercase tracking-wide transition-quick select-none disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-red text-on-red hover:bg-red-hot',
  secondary: 'border border-line-strong text-ink hover:border-led hover:text-led-text',
  ghost: 'text-ink-muted hover:text-ink',
};

const sizes: Record<Size, string> = {
  md: 'text-sm px-5 py-3',
  lg: 'text-base px-7 py-4',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<'button'>, keyof CommonProps> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<ComponentProps<'a'>, keyof CommonProps | 'href'> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const OWN_PROPS = new Set(['variant', 'size', 'className', 'children', 'href']);

/** Everything the caller passed that belongs on the DOM element. */
function domProps<T extends object>(props: ButtonProps): T {
  return Object.fromEntries(Object.entries(props).filter(([k]) => !OWN_PROPS.has(k))) as T;
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const rest = domProps<Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>>(props);
    const external = /^https?:\/\//.test(props.href);
    if (external) {
      return (
        <a href={props.href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const rest = domProps<Omit<ComponentProps<'button'>, 'className' | 'children'>>(props);
  return (
    <button type="button" {...rest} className={classes}>
      {children}
    </button>
  );
}
