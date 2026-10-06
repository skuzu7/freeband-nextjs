// A clip as the page prints it — the Server Component around the player —
// and the set of them.
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { blurMap } from '@/data/blur';
import { videos } from '@/data/media/videos';
import { Clip } from '../Clip';
import { ClipList } from '../ClipList';

const clip = videos[2];

describe('Clip', () => {
  it('prints the title and what the clip shows, in text, and names the player by that title', () => {
    const { container } = render(<Clip clip={clip} sizes="100vw" />);
    const figure = container.querySelector('figure')!;
    // The clip's own address on the page.
    expect(figure).toHaveAttribute('id', 'video-solo-de-guitarra');

    const title = within(figure).getByRole('heading', { level: 3, name: clip.title });
    expect(within(figure).getByText(clip.description)).toBeInTheDocument();
    const player = within(figure).getByRole('group', { name: clip.title });
    expect(player).toHaveAttribute('aria-labelledby', title.id);
  });

  it('hands the poster its blur placeholder from the server', () => {
    const { container } = render(<Clip clip={clip} sizes="100vw" />);
    const poster = container.querySelector('img')!;
    expect(poster).toHaveAttribute('alt', clip.alt);
    expect(blurMap[clip.poster]).toMatch(/^data:image\/webp;base64,/);
    expect(poster.style.backgroundImage).toContain('data:image/');
  });
});

describe('ClipList', () => {
  it('prints every clip it is given, each in its own player, in order', () => {
    render(<ClipList clips={videos} columns={2} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(videos.map((v) => v.title));
    expect(screen.getAllByRole('group')).toHaveLength(videos.length);
    expect(document.querySelectorAll('video')).toHaveLength(videos.length);
  });

  it('opens a set of three with its first clip across the row on a tablet', () => {
    const { container } = render(<ClipList clips={videos.slice(0, 3)} columns={3} />);
    const figures = Array.from(container.querySelectorAll('figure'));
    expect(figures).toHaveLength(3);
    expect(figures[0].className).toContain('md:max-lg:col-span-2');
    expect(figures[1].className).not.toContain('col-span-2');
  });
});
