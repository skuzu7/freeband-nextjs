// The thumbnail that opens its photograph, and the keeper of the history
// entries the lightbox goes back to.
import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HistoryKeeper } from '../HistoryKeeper';
import { PhotoLink } from '../PhotoLink';

let pathname = '/palco';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

const link = {
  href: '/palco/foto/tres',
  anchor: 'foto-tres',
  name: 'palco-tres',
  label: 'Ampliar foto: Banda no palco',
};
const photo = { src: '/images/tres.jpeg', alt: 'Banda no palco', aspect: '1465/888' as const };

beforeEach(() => {
  pathname = '/palco';
});

afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

describe('PhotoLink', () => {
  it("is a link to the photograph's own address, named after what it opens", () => {
    render(<PhotoLink link={link} photo={photo} sizes="50vw" />);
    const anchor = screen.getByRole('link', { name: link.label });
    expect(anchor).toHaveAttribute('href', link.href);
    // The id the lightbox hands the focus back to.
    expect(anchor).toHaveAttribute('id', link.anchor);
    const img = within(anchor).getByRole('img', { name: photo.alt });
    // Whole: the box has the file's own aspect.
    expect(img.parentElement).toHaveStyle({ aspectRatio: '1465 / 888' });
  });

  it('steps aside while its photograph is on show, keeping its box', () => {
    pathname = link.href;
    render(<PhotoLink link={link} photo={photo} sizes="50vw" />);
    const anchor = screen.getByRole('link', { name: link.label });
    expect(within(anchor).queryByRole('img')).not.toBeInTheDocument();
    expect(anchor.firstElementChild).toHaveStyle({ aspectRatio: '1465 / 888' });
    expect(anchor.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps its photograph while another one is on show', () => {
    pathname = '/palco/foto/quatro';
    render(<PhotoLink link={link} photo={photo} sizes="50vw" />);
    expect(screen.getByRole('img', { name: photo.alt })).toBeInTheDocument();
  });
});

describe('HistoryKeeper', () => {
  it('hands the router an entry an in-page anchor left without state', () => {
    render(<HistoryKeeper />);
    // What the browser leaves after a click on <a href="#ato-efeitos">.
    History.prototype.replaceState.call(window.history, null, '', '/palco#ato-efeitos');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    fireEvent(window, new Event('hashchange'));
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(replaceState).toHaveBeenCalledWith(null, '', window.location.href);
    expect(window.location.hash).toBe('#ato-efeitos');
  });

  it('leaves an entry the router already knows alone', () => {
    render(<HistoryKeeper />);
    History.prototype.replaceState.call(window.history, { __NA: true }, '', '/palco#ato-efeitos');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    fireEvent(window, new Event('hashchange'));
    expect(replaceState).not.toHaveBeenCalled();
  });

  it('stops listening when it unmounts', () => {
    const { unmount } = render(<HistoryKeeper />);
    unmount();
    History.prototype.replaceState.call(window.history, null, '', '/palco#ato-efeitos');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    fireEvent(window, new Event('hashchange'));
    expect(replaceState).not.toHaveBeenCalled();
  });
});
