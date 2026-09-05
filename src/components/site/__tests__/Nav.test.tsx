import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Nav } from '../Nav';
import { site } from '@/data/copy/site';

vi.mock('next/navigation', () => ({ usePathname: () => '/palco' }));

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
});
