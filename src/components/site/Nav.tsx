'use client';

// src/components/site/Nav.tsx
// Sticky header: wordmark, the four routes, the red CTA. On small screens the
// routes fold into a full-screen dialog with focus kept inside; Escape closes
// it and hands focus back to the button that opened it.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { site } from '@/data/copy/site';
import { Wordmark } from '@/components/brand/Wordmark';
import { DotGrid } from '@/components/brand/DotGrid';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

const FOCUSABLE = 'a[href], button:not([disabled])';

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  // The menu is open FOR a pathname: navigating away changes the key and the
  // menu is closed on the next render, with no effect and no extra state.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor !== null && openFor === (pathname ?? '');
  const setOpen = (next: boolean) => setOpenFor(next ? (pathname ?? '') : null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpenFor(null);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const links = site.nav.links.map((link) => ({ ...link, active: isActive(pathname, link.href) }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label={site.nav.homeLabel} className="flex shrink-0 items-center py-2">
          <Wordmark className="h-5 w-auto text-red" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.active ? 'page' : undefined}
              className={cn(
                'label-caps transition-quick relative py-2 text-ink-muted hover:text-ink',
                link.active && 'text-ink',
              )}
            >
              {link.label}
              {link.active && (
                <span aria-hidden className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-pill bg-led" />
              )}
            </Link>
          ))}
          <Button href={site.nav.cta.href}>{site.nav.cta.label}</Button>
        </nav>

        <button
          ref={triggerRef}
          type="button"
          className="transition-quick -mr-2 flex size-11 items-center justify-center rounded-sm text-ink hover:text-led-text md:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? site.nav.menuClose : site.nav.menuOpen}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <path d="M3 7h18" />
                <path d="M3 12h18" />
                <path d="M3 17h18" />
              </>
            )}
          </svg>
        </button>
      </Container>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-x-0 top-16 bottom-0 z-40 isolate flex flex-col overflow-y-auto bg-surface md:hidden"
        >
          <DotGrid fade />
          <nav aria-label="Principal (menu)" className="flex flex-1 flex-col gap-2 px-[var(--pad-inline)] py-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.active ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between border-b border-line py-5 text-3xl font-semibold tracking-tight text-ink',
                  link.active && 'text-led-text',
                )}
              >
                {link.label}
                {link.active && <span aria-hidden className="size-2 rounded-pill bg-led" />}
              </Link>
            ))}
            <div className="mt-8">
              <Button href={site.nav.cta.href} size="lg" className="w-full">
                {site.nav.cta.label}
              </Button>
              <p className="label-caps mt-6 text-ink-low">{site.nav.brandLine}</p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
