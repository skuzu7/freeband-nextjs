// The archive page: a filter of pressed buttons with counts, and flyers that
// are links to their own address in the photo viewer. The viewer itself walks
// all nine whatever the filter shows — a flyer's neighbours come from its
// address (src/lib/gallery/sets.ts), not from the state of this page.
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Cartazes } from '../Cartazes';
import { arquivo } from '@/data/copy/arquivo';
import { gallery } from '@/data/media/gallery';
import { posters, type Poster } from '@/data/media/posters';
import { positionOf } from '@/lib/gallery/sets';

let pathname = '/arquivo';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

const countOf = (key: string) =>
  key === 'todos' ? posters.length : posters.filter((p) => p.category === key).length;
const nameOf = (p: Poster) => `${arquivo.viewer.open}: ${p.town} · ${p.event}`;
const flyers = () => screen.getAllByRole('link', { name: new RegExp(`^${arquivo.viewer.open}`) });

beforeEach(() => {
  pathname = '/arquivo';
});

describe('Cartazes', () => {
  it('shows a filter button per category, pressed or not, with its count', () => {
    render(<Cartazes />);
    const group = screen.getByRole('group', { name: arquivo.filterLabel });
    for (const f of arquivo.filters) {
      const button = within(group).getByRole('button', { name: `${f.label} ${countOf(f.key)}` });
      expect(button).toHaveAttribute('aria-pressed', f.key === 'todos' ? 'true' : 'false');
    }
    // The counts add up: every flyer is in exactly one category.
    const perCategory = arquivo.filters.filter((f) => f.key !== 'todos').map((f) => countOf(f.key));
    expect(perCategory.reduce((a, b) => a + b, 0)).toBe(posters.length);
  });

  it('every flyer is a link to its own address, with the id focus comes back to', () => {
    render(<Cartazes />);
    expect(flyers()).toHaveLength(posters.length);
    for (const p of posters) {
      const link = screen.getByRole('link', { name: nameOf(p) });
      expect(link).toHaveAttribute('href', `/arquivo/cartaz/${p.id}`);
      expect(link).toHaveAttribute('id', `cartaz-${p.id}`);
      expect(within(link).getByRole('img', { name: p.alt })).toBeInTheDocument();
    }
  });

  it('prints what is on each flyer under it', () => {
    render(<Cartazes />);
    for (const p of posters) expect(screen.getByText(`${p.town} · ${p.event}`)).toBeInTheDocument();
    expect(screen.getAllByText(arquivo.municipalNote)).toHaveLength(posters.filter((p) => p.municipal).length);
  });

  it('filters to one category and back', () => {
    render(<Cartazes />);
    const group = screen.getByRole('group', { name: arquivo.filterLabel });
    fireEvent.click(within(group).getByRole('button', { name: `Clubes ${countOf('clube')}` }));

    expect(within(group).getByRole('button', { name: /^Clubes/ })).toHaveAttribute('aria-pressed', 'true');
    expect(within(group).getByRole('button', { name: /^Todos/ })).toHaveAttribute('aria-pressed', 'false');
    expect(flyers()).toHaveLength(countOf('clube'));
    for (const p of posters.filter((p) => p.category === 'clube')) {
      expect(screen.getByRole('link', { name: nameOf(p) })).toBeInTheDocument();
    }
    for (const p of posters.filter((p) => p.category !== 'clube')) {
      expect(screen.queryByRole('link', { name: nameOf(p) })).not.toBeInTheDocument();
    }

    fireEvent.click(within(group).getByRole('button', { name: /^Todos/ }));
    expect(within(group).getByRole('button', { name: /^Todos/ })).toHaveAttribute('aria-pressed', 'true');
    expect(flyers()).toHaveLength(posters.length);
  });

  it('the viewer walks all nine, whatever the filter shows', () => {
    render(<Cartazes />);
    const group = screen.getByRole('group', { name: arquivo.filterLabel });
    fireEvent.click(within(group).getByRole('button', { name: /^Prefeituras/ }));
    const municipal = posters.filter((p) => p.category === 'municipal');
    expect(flyers()).toHaveLength(municipal.length);

    // The link still points at the flyer's address, and from that address the
    // set is the whole archive: its neighbours are not the filter's.
    const first = municipal[0];
    expect(screen.getByRole('link', { name: nameOf(first) })).toHaveAttribute('href', `/arquivo/cartaz/${first.id}`);
    const position = positionOf(gallery.arquivo, first.id);
    expect(position?.total).toBe(posters.length);
    expect(position?.index).toBe(posters.indexOf(first));
    expect(position?.next.id).toBe(posters[(posters.indexOf(first) + 1) % posters.length].id);
  });

  it('a flyer on show in the lightbox leaves its box on the page, and only that one', () => {
    const onShow = posters[1];
    pathname = `/arquivo/cartaz/${onShow.id}`;
    render(<Cartazes />);
    const link = screen.getByRole('link', { name: nameOf(onShow) });
    expect(within(link).queryByRole('img')).not.toBeInTheDocument();
    // The box keeps the flyer's own shape, so the row does not move.
    expect(link.firstElementChild).toHaveStyle({ aspectRatio: onShow.aspect.replace('/', ' / ') });
    expect(screen.getAllByRole('img')).toHaveLength(posters.length - 1);
  });
});
