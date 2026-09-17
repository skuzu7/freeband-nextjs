// @vitest-environment node
//
// The numbers the site prints about itself, pinned to one another: the
// line-up roles add up to the total, and every place that prints the total
// reads it from bandLineup rather than from a literal.
import { describe, it, expect } from 'vitest';
import { artists, bandLineup, release, yearsActive } from '../band';
import { fold } from '../copy/home';
import { portfolio } from '../copy/portfolio';
import { posters } from '../media/posters';

describe('bandLineup', () => {
  it('has roles that add up to the printed total', () => {
    const sum = bandLineup.roles.reduce((n, r) => n + r.count, 0);
    expect(sum).toBe(bandLineup.total);
  });

  it('is the number every headline prints', () => {
    const total = String(bandLineup.total);
    expect(fold.proof.find((p) => p.label === 'integrantes no palco')?.value).toBe(total);
    const years = yearsActive();
    expect(release.highlights(years).find((h) => h.label === 'integrantes no palco')?.value).toBe(total);
    expect(fold.kicker(years)).toContain(`${total} no palco`);
    expect(portfolio.pdf.cover.kicker(years)).toContain(`${total} no palco`);
  });
});

describe('yearsActive', () => {
  it('counts from the founding for the date it is given, not the date the module loaded', () => {
    expect(yearsActive(new Date('2026-06-01'))).toBe(57);
    expect(yearsActive(new Date('2027-01-01'))).toBe(58);
  });

  it('lists every artist exactly once and only the names the release itself gives', () => {
    for (const name of artists) expect(release.full).toContain(name);
    expect(new Set(artists).size).toBe(artists.length);
  });
});

describe('posters', () => {
  it('flags exactly four flyers for the home', () => {
    expect(posters.filter((p) => p.home)).toHaveLength(4);
  });

  it('marks every municipal flyer as promoted by a city hall', () => {
    for (const p of posters.filter((p) => p.category === 'municipal')) expect(p.municipal).toBe(true);
  });
});
