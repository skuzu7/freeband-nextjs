// The viewer as the server prints it: the whole photograph, its caption, its
// place in the set, and plain links to the neighbours and the way out. The
// same figure is the page and the content of the lightbox.
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { gallery } from '@/data/media/gallery';
import { PhotoViewer } from '../PhotoViewer';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn(), replace: vi.fn() }),
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

const { items, labels } = gallery.palco;
const third = items[2];

describe('PhotoViewer', () => {
  it('prints the photograph whole, its caption and its place in the set', () => {
    render(<PhotoViewer set="palco" id={third.id} mode="page" />);
    const figure = screen.getByRole('figure');
    expect(within(figure).getByText(labels.counter(3, items.length))).toBeInTheDocument();
    expect(within(figure).getByText('3 de 39')).toBeInTheDocument();
    expect(within(figure).getByRole('heading', { name: third.caption })).toBeInTheDocument();
    expect(within(figure).getByText(third.meta ?? '')).toBeInTheDocument();

    // The box takes the file's real aspect: nothing for object-cover to crop.
    const img = within(figure).getByRole('img', { name: third.alt });
    expect(img.parentElement).toHaveStyle({ aspectRatio: third.aspect.replace('/', ' / ') });
    // And it never grows past the file's own pixels.
    expect(figure.style.getPropertyValue('--viewer-natural')).toBe(`${third.aspect.split('/')[0]}px`);
  });

  it('links to the neighbours without leaving a history entry behind', () => {
    render(<PhotoViewer set="palco" id={third.id} mode="page" />);
    const prev = screen.getByRole('link', { name: labels.prev });
    const next = screen.getByRole('link', { name: labels.next });
    expect(prev).toHaveAttribute('href', `/palco/foto/${items[1].id}`);
    expect(prev).toHaveAttribute('rel', 'prev');
    expect(next).toHaveAttribute('href', `/palco/foto/${items[3].id}`);
    expect(next).toHaveAttribute('rel', 'next');
  });

  it('wraps: before the first comes the last, after the last the first', () => {
    const last = items[items.length - 1];
    const { unmount } = render(<PhotoViewer set="palco" id={items[0].id} mode="page" />);
    expect(screen.getByRole('link', { name: labels.prev })).toHaveAttribute('href', `/palco/foto/${last.id}`);
    unmount();
    render(<PhotoViewer set="palco" id={last.id} mode="page" />);
    expect(screen.getByRole('link', { name: labels.next })).toHaveAttribute('href', `/palco/foto/${items[0].id}`);
    expect(screen.getByText(labels.counter(items.length, items.length))).toBeInTheDocument();
  });

  it('on its own page the caption is the h1 and the way out is a link to the thumbnail', () => {
    render(<PhotoViewer set="palco" id={third.id} mode="page" />);
    expect(screen.getByRole('heading', { level: 1, name: third.caption })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: labels.back })).toHaveAttribute('href', `/palco#foto-${third.id}`);
    expect(screen.queryByRole('button', { name: labels.close })).not.toBeInTheDocument();
  });

  it('in the lightbox the caption is an h2 and the way out is the close button', () => {
    render(<PhotoViewer set="palco" id={third.id} mode="modal" />);
    expect(screen.getByRole('heading', { level: 2, name: third.caption })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: labels.close })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: labels.back })).not.toBeInTheDocument();
  });

  it('shows a flyer with its facts and its promoter', () => {
    const flyer = gallery.arquivo.items.find((i) => i.note);
    expect(flyer).toBeDefined();
    if (!flyer) return;
    render(<PhotoViewer set="arquivo" id={flyer.id} mode="page" />);
    expect(screen.getByRole('heading', { name: flyer.caption })).toBeInTheDocument();
    expect(screen.getByText(flyer.meta ?? '')).toBeInTheDocument();
    expect(screen.getByText(flyer.note ?? '')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: gallery.arquivo.labels.back })).toHaveAttribute(
      'href',
      `/arquivo#cartaz-${flyer.id}`,
    );
  });

  it('an id that is not in the set is a 404', () => {
    expect(() => render(<PhotoViewer set="palco" id="nao-existe" mode="page" />)).toThrow('NEXT_NOT_FOUND');
  });
});
