'use client';

// src/components/site/Nav.tsx
// Clean 3-zone sticky top bar: single-element wordmark, 4 concise single-line
// routes, and 1 primary Briefing 30s CTA on desktop. On phones the header stays
// compact (56px / 6.6% of mobile viewport) with wordmark + menu trigger while
// quick booking sits ergonomically in the bottom thumb bar (MobileThumbBar).
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { cycleFocus } from '@/lib/focusTrap';
import { contact, telHref } from '@/data/contact';
import { site } from '@/data/copy/site';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useInertOutside } from '@/hooks/useInertOutside';
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
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor !== null && openFor === (pathname ?? '');
  const setOpen = (next: boolean) => setOpenFor(next ? (pathname ?? '') : null);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useBodyScrollLock(open);
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
  const briefingHref = pathname === '/' ? '#contato' : site.nav.briefingCta.href;

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md"
        style={{ viewTransitionName: 'site-header' }}
      >
        <Container className="flex h-14 items-center justify-between gap-8 md:h-[var(--nav-h)]">
          {/* Zone 1: Clean single-element wordmark */}
          <Link
            href="/"
            aria-label={site.nav.homeLabel}
            className="group transition-quick tap flex shrink-0 items-center whitespace-nowrap hover:opacity-95"
          >
            <Wordmark
              acrylic
              className="h-5 w-auto text-red transition-[filter] duration-200 ease-light group-hover:drop-shadow-[0_0_10px_color-mix(in_oklab,var(--color-red),transparent_40%)] sm:h-5.5"
            />
          </Link>

          {/* Zone 2: Four single-line text links */}
          <nav aria-label={site.nav.landmark} className="hidden items-center gap-7 md:flex lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.active ? 'page' : undefined}
                className={cn(
                  'label-caps transition-quick tap relative inline-flex shrink-0 items-center justify-center whitespace-nowrap text-ink-muted hover:text-ink',
                  link.active && 'text-ink',
                )}
              >
                {link.label}
                {link.active && (
                  <span
                    aria-hidden
                    className="absolute bottom-1.5 inset-x-0 h-0.5 bg-led"
                    style={{ viewTransitionName: 'nav-dot' }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Zone 3: One primary desktop CTA */}
          <div className="hidden shrink-0 items-center md:flex">
            <Button href={briefingHref} className="whitespace-nowrap shrink-0">
              {site.nav.briefingCta.label}
            </Button>
          </div>

          {/* Mobile: Compact menu button (thumb-zone CTA lives in MobileThumbBar) */}
          <div className="flex shrink-0 items-center md:hidden">
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
          className="sheet-in fixed inset-x-0 top-14 bottom-0 z-50 isolate flex flex-col overflow-y-auto bg-surface md:hidden"
        >
          <DotGrid fade className="opacity-45" />
          <div className="relative z-10 flex items-center justify-between border-b border-line/60 px-[var(--pad-inline)] py-3">
            <span className="label-caps text-2xs text-ink-low">{site.nav.brandLine}</span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="label-caps transition-quick tap inline-flex items-center gap-2 text-ink-muted hover:text-ink"
            >
              {site.nav.menuClose}
              <Icon name="close" className="size-4" />
            </button>
          </div>

          <nav aria-label={site.nav.menuLandmark} className="relative z-10 flex flex-1 flex-col justify-between px-[var(--pad-inline)] py-6">
            <div className="flex flex-col">
              <Link
                href="/"
                aria-current={pathname === '/' ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'tap flex items-center justify-between border-b border-line py-4 text-2xl font-semibold tracking-tight text-ink',
                  pathname === '/' && 'text-led-text',
                )}
              >
                <span>{site.nav.homeLink}</span>
                <Icon name="chevron-right" className="size-4 text-ink-low" />
              </Link>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={link.active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'tap flex items-center justify-between border-b border-line py-4 text-2xl font-semibold tracking-tight text-ink',
                    link.active && 'text-led-text',
                  )}
                >
                  <span>{link.label}</span>
                  <Icon name="chevron-right" className="size-4 text-ink-low" />
                </Link>
              ))}
            </div>

            {/* Thumb-zone actions anchored at bottom of drawer */}
            <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 pb-[env(safe-area-inset-bottom,0px)]">
              <Button href={briefingHref} size="lg" className="w-full" onClick={() => setOpen(false)}>
                Montar briefing em 30s
              </Button>
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="secondary"
                  href={contact.whatsappQuoteLink}
                  className="w-full px-3 py-3 text-xs"
                  onClick={() => setOpen(false)}
                >
                  <Icon name="whatsapp" className="size-4" />
                  <span>WhatsApp</span>
                </Button>
                <a
                  href={telHref}
                  onClick={() => setOpen(false)}
                  className="tap transition-quick inline-flex items-center justify-center border border-line text-xs font-medium tracking-wide text-ink-muted hover:border-line-strong hover:text-ink"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
