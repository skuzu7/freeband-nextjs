import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Nav } from '../Nav';
import { site } from '@/data/copy/site';

vi.mock('next/navigation', () => ({ usePathname: () => '/palco' }));

/** A controllable matchMedia: the test flips `matches` and fires `change`. */
function mockMatchMedia(initial: boolean) {
  const listeners = new Set<() => void>();
  const mq = {
    matches: initial,
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
  };
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: () => mq });
  return {
    widen() {
      mq.matches = true;
      listeners.forEach((cb) => cb());
    },
    restore() {
      Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: undefined });
    },
  };
}

describe('Nav', () => {
  it('renders every public route and the WhatsApp CTA', () => {
    render(<Nav />);
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    for (const link of site.nav.links) {
      expect(nav).toContainElement(screen.getByRole('link', { name: link.label }));
    }
    const cta = screen.getByRole('link', { name: site.nav.cta.label });
    expect(cta).toHaveAttribute('href', site.nav.cta.href);
    expect(cta).toHaveAttribute('target', '_blank');
  });

  it('marks the current route', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Palco' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Arquivo' })).not.toHaveAttribute('aria-current');
  });

  it('closes the mobile menu with Escape and returns focus to the trigger', () => {
    render(<Nav />);

    const trigger = screen.getByRole('button', { name: site.nav.menuOpen });
    trigger.focus();
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAccessibleName(site.nav.menuClose);
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(trigger).toHaveAccessibleName(site.nav.menuOpen);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the mobile menu from the button inside the dialog', () => {
    render(<Nav />);
    const trigger = screen.getByRole('button', { name: site.nav.menuOpen });
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: site.nav.menuLabel });
    const close = Array.from(dialog.querySelectorAll('button')).find((b) => b.textContent?.includes(site.nav.menuClose));
    expect(close).toBeDefined();
    fireEvent.click(close!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
    expect(trigger).toHaveFocus();
  });

  it('closes the mobile menu and unlocks scrolling when the viewport grows to desktop', () => {
    const media = mockMatchMedia(false);
    try {
      render(<Nav />);
      fireEvent.click(screen.getByRole('button', { name: site.nav.menuOpen }));
      expect(screen.getByRole('dialog', { name: site.nav.menuLabel })).toBeInTheDocument();
      expect(document.body).toHaveStyle({ overflow: 'hidden' });

      act(() => media.widen());

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
    } finally {
      media.restore();
    }
  });

  it('toggles mobile menu with button and closes on link click', () => {
    render(<Nav />);
    const trigger = screen.getByRole('button', { name: site.nav.menuOpen });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();

    // Toggle close
    fireEvent.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Open again and click a link inside the menu
    fireEvent.click(trigger);
    const link = screen.getByRole('navigation', { name: 'Principal (menu)' }).querySelector('a[href="/historia"]');
    expect(link).toBeInTheDocument();
    if (link) fireEvent.click(link);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

