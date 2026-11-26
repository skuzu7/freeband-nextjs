'use client';

// src/components/site/MobileThumbBar.tsx
// Ergonomic bottom thumb-zone action bar for phones (< md).
// Combined with the 56px mobile header, fixed chrome totals 116px (13.7% of an
// 844px mobile viewport — strictly under the 15% sticky surface cap).
// Automatically hides on the Home Hero, inside the #contato Briefing section,
// and whenever a modal dialog (menu or lightbox) is open.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { contact } from '@/data/contact';
import { site } from '@/data/copy/site';
import { Icon } from '@/components/ui/Icon';

export function MobileThumbBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Hide immediately while the mobile menu or photo lightbox is open.
  useEffect(() => {
    const checkDialog = () => {
      setDialogOpen(document.querySelector('[role="dialog"]') !== null);
    };
    checkDialog();
    const observer = new MutationObserver(checkDialog);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Smart visibility: on Home hide inside Hero & #contato; on subpages reveal after scrolling 120px.
  useEffect(() => {
    const isHome = pathname === '/';
    let heroVisible = isHome;
    let contatoVisible = false;

    const syncVisibility = () => {
      if (isHome) {
        setVisible(!heroVisible && !contatoVisible);
      } else {
        setVisible(window.scrollY > 120);
      }
    };

    if (!isHome) {
      syncVisibility();
      window.addEventListener('scroll', syncVisibility, { passive: true });
      return () => window.removeEventListener('scroll', syncVisibility);
    }

    const heroEl = document.getElementById('fold-hero');
    const contatoEl = document.getElementById('contato');

    if (typeof IntersectionObserver === 'undefined' || (!heroEl && !contatoEl)) {
      const onScroll = () => setVisible(window.scrollY > 360);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === 'fold-hero') {
            heroVisible = entry.isIntersecting && entry.intersectionRatio > 0.25;
          }
          if (entry.target.id === 'contato') {
            contatoVisible = entry.isIntersecting && entry.intersectionRatio > 0.1;
          }
        }
        syncVisibility();
      },
      { threshold: [0, 0.1, 0.25, 0.5] },
    );

    if (heroEl) observer.observe(heroEl);
    if (contatoEl) observer.observe(contatoEl);
    syncVisibility();

    return () => observer.disconnect();
  }, [pathname]);

  const show = visible && !dialogOpen;
  const briefingHref = pathname === '/' ? '#contato' : site.nav.briefingCta.href;

  return (
    <aside
      aria-label={site.nav.mobileBar.landmark}
      aria-hidden={!show}
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-md transition-[transform,opacity] duration-200 ease-light md:hidden',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0',
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex h-[60px] max-w-[var(--container-site)] items-center gap-2.5 px-[var(--pad-inline)]">
        <Link
          href={briefingHref}
          tabIndex={show ? 0 : -1}
          className="tap transition-quick flex flex-1 items-center justify-center rounded-sm bg-red px-4 text-xs font-semibold tracking-wide text-on-red uppercase hover:bg-red-hot active:scale-[0.98]"
        >
          {site.nav.mobileBar.briefing}
        </Link>
        <a
          href={contact.whatsappQuoteLink}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show ? 0 : -1}
          aria-label="Falar pelo WhatsApp"
          className="tap transition-quick inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm border border-line-strong bg-surface-raise px-3.5 text-xs font-medium tracking-wide text-ink uppercase hover:border-led hover:text-led-text active:scale-[0.98]"
        >
          <Icon name="whatsapp" className="size-4" />
          <span>{site.nav.mobileBar.whatsapp}</span>
        </a>
      </div>
    </aside>
  );
}
