'use client';

// src/components/site/Nav.tsx
// Sticky header: wordmark, the four routes, the red CTA. On small screens the
// CTA stays in the header and the routes fold into a full-screen dialog: focus
// is kept inside, the page behind is inert, Escape closes it and hands focus
// back to the button that opened it.
//
// The header is named for view transitions, so it holds still while one route
// replaces another, and the lit dot under the current route is a shared
// element: it slides from the old link to the new one.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { cycleFocus } from '@/lib/focusTrap';
import { site } from '@/data/copy/site';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useInertOutside } from '@/hooks/useInertOutside';
import { BrandLine } from '@/components/brand/BrandLine';
import { DotGrid } from '@/components/brand/DotGrid';
import { Wordmark } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';

const FOCUSABLE = 'a[href], button:not([disabled])';
/** The breakpoint at which the routes leave the dialog for the header (md). */
const DESKTOP = '(min-width: 48rem)';

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
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useBodyScrollLock(open);
  // The header stays live: its toggle is how a pointer closes the menu, and
  // where focus returns.
  useInertOutside(panelRef, open, [headerRef]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpenFor(null);
        triggerRef.current?.focus();
        return;
      }
      cycleFocus(event, panelRef.current, FOCUSABLE);
    };
    document.addEventListener('keydown', onKeyDown);
    // The dialog is md:hidden, so a rotation into desktop width would leave
    // the page locked behind a menu nobody can see: close it instead.
    const mq = typeof window.matchMedia === 'function' ? window.matchMedia(DESKTOP) : null;
    const onWide = () => {
      if (mq?.matches) setOpenFor(null);
    };
    onWide();
    mq?.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      mq?.removeEventListener('change', onWide);
    };
  }, [open]);

  const links = site.nav.links.map((link) => ({ ...link, active: isActive(pathname, link.href) }));

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md"
        style={{ viewTransitionName: 'site-header' }}
      >
        <Container className="flex h-[var(--nav-h)] items-center justify-between gap-3 sm:gap-6">
          <Link
            href="/"
            aria-label={site.nav.homeLabel}
            className="group transition-quick tap flex shrink-0 flex-col items-start justify-center gap-1 hover:opacity-95"
          >
            <BrandLine size="sm" className="transition-quick group-hover:text-ink" />
            <Wordmark
              acrylic
              className="h-5 w-auto text-red transition-[filter] duration-300 ease-light group-hover:drop-shadow-[0_0_10px_color-mix(in_oklab,var(--color-red),transparent_40%)] sm:h-5.5"
            />
          </Link>

          <nav aria-label={site.nav.landmark} className="hidden items-center gap-6 md:flex lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.active ? 'page' : undefined}
                className={cn(
                  'label-caps transition-quick tap relative inline-flex items-center justify-center text-ink-muted hover:text-ink',
                  link.active && 'text-ink',
                )}
              >
                {link.label}
                {link.active && (
                  <span
                    aria-hidden
                    className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-pill bg-led"
                    style={{ viewTransitionName: 'nav-dot' }}
                  />
                )}
              </Link>
            ))}
            <Button href={site.nav.cta.href}>{site.nav.cta.label}</Button>
          </nav>

          {/* On phones the quote stays one tap away: the routes fold into
              the menu, the button that books the band does not. */}
          {/* Sized to fit a 320px screen: wordmark, CTA and menu button
              share 280px there, and the smoke test fails on overflow. */}
          <div className="flex shrink-0 items-center gap-1.5 md:hidden">
            <Button href={site.nav.cta.href} className="tap px-3 py-2 text-xs min-[360px]:px-3.5">
              {site.nav.cta.label}
            </Button>
            <button
              ref={triggerRef}
              type="button"
              className="transition-quick tap -mr-2 flex items-center justify-center rounded-sm text-ink hover:text-led-text"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? site.nav.menuClose : site.nav.menuOpen}
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? 'close' : 'menu'} />
            </button>
          </div>
        </Container>
      </header>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label={site.nav.menuLabel}
          className="sheet-in fixed inset-x-0 top-[var(--nav-h)] bottom-0 z-40 isolate flex flex-col overflow-y-auto bg-surface md:hidden"
        >
          <DotGrid fade />
          {/* The header's toggle sits outside the dialog, which aria-modal
              hides from assistive tech: the dialog carries its own close. */}
          <div className="flex justify-end px-[var(--pad-inline)] pt-4">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="label-caps transition-quick tap inline-flex items-center gap-2 py-2 text-ink-muted hover:text-ink"
            >
              {site.nav.menuClose}
              <Icon name="close" className="size-4" />
            </button>
          </div>
          <nav aria-label={site.nav.menuLandmark} className="flex flex-1 flex-col gap-2 px-[var(--pad-inline)] py-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.active ? 'page' : undefined}
                onClick={() => setOpen(false)}
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
              <Button href={site.nav.cta.href} size="lg" className="w-full" onClick={() => setOpen(false)}>
                {site.nav.cta.label}
              </Button>
              <p className="label-caps mt-6 text-ink-low">{site.nav.brandLine}</p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
