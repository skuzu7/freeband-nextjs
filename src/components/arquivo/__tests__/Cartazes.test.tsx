import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Cartazes } from '../Cartazes';
import { arquivo } from '@/data/copy/arquivo';
import { posters } from '@/data/media/posters';

const countOf = (key: string) =>
  key === 'todos' ? posters.length : posters.filter((p) => p.category === key).length;

describe('Cartazes', () => {
  it('shows every flyer and a filter button per category with its count', () => {
    render(<Cartazes />);
    const group = screen.getByRole('group', { name: arquivo.filterLabel });
    for (const f of arquivo.filters) {
      const button = within(group).getByRole('button', { name: `${f.label} ${countOf(f.key)}` });
      expect(button).toHaveAttribute('aria-pressed', f.key === 'todos' ? 'true' : 'false');
    }
    expect(screen.getAllByRole('button', { name: new RegExp(`^${arquivo.lightbox.open}`) })).toHaveLength(
      posters.length,
    );
  });

  it('filters to one category and back', () => {
    render(<Cartazes />);
    const group = screen.getByRole('group', { name: arquivo.filterLabel });
    fireEvent.click(within(group).getByRole('button', { name: `Clubes ${countOf('clube')}` }));

    expect(within(group).getByRole('button', { name: /^Clubes/ })).toHaveAttribute('aria-pressed', 'true');
    expect(within(group).getByRole('button', { name: /^Todos/ })).toHaveAttribute('aria-pressed', 'false');
    const open = new RegExp(`^${arquivo.lightbox.open}`);
    expect(screen.getAllByRole('button', { name: open })).toHaveLength(countOf('clube'));
    for (const p of posters.filter((p) => p.category === 'clube')) {
      expect(screen.getByRole('button', { name: `${arquivo.lightbox.open}: ${p.town} · ${p.event}` })).toBeInTheDocument();
    }

    fireEvent.click(within(group).getByRole('button', { name: /^Todos/ }));
    expect(screen.getAllByRole('button', { name: open })).toHaveLength(posters.length);
  });

  it('opens a lightbox on the chosen flyer, walks it with the arrow keys, and Escape returns focus', () => {
    render(<Cartazes />);
    const second = posters[1];
    const thumb = screen.getByRole('button', { name: `${arquivo.lightbox.open}: ${second.town} · ${second.event}` });
    thumb.focus();
    fireEvent.click(thumb);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName(`${second.town} · ${second.event}`);
    expect(within(dialog).getByText(arquivo.lightbox.counter(2, posters.length))).toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
    expect(within(dialog).getByRole('button', { name: arquivo.lightbox.close })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(screen.getByRole('dialog')).toHaveAccessibleName(`${posters[2].town} · ${posters[2].event}`);
    expect(screen.getByText(arquivo.lightbox.counter(3, posters.length))).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(screen.getByRole('dialog')).toHaveAccessibleName(`${posters[0].town} · ${posters[0].event}`);

    // Wraps from the first back to the last.
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    const last = posters[posters.length - 1];
    expect(screen.getByRole('dialog')).toHaveAccessibleName(`${last.town} · ${last.event}`);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
    expect(thumb).toHaveFocus();
  });

  it('the lightbox only walks the flyers the filter shows', () => {
    render(<Cartazes />);
    const group = screen.getByRole('group', { name: arquivo.filterLabel });
    fireEvent.click(within(group).getByRole('button', { name: /^Prefeituras/ }));
    const municipal = posters.filter((p) => p.category === 'municipal');

    fireEvent.click(screen.getByRole('button', { name: `${arquivo.lightbox.open}: ${municipal[0].town} · ${municipal[0].event}` }));
    expect(screen.getByText(arquivo.lightbox.counter(1, municipal.length))).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: arquivo.lightbox.next }));
    expect(screen.getByRole('dialog')).toHaveAccessibleName(`${municipal[1].town} · ${municipal[1].event}`);
    expect(screen.getByText(arquivo.lightbox.counter(2, municipal.length))).toBeInTheDocument();
  });
});
