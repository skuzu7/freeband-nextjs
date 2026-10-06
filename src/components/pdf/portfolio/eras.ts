// src/components/pdf/portfolio/eras.ts
// The timeline page's arithmetic: what each node shows on the dot matrix and
// where the nodes fall on the rail. Pure, so it is tested without a render.

/**
 * What an era's node shows on the 5×7 matrix, which has digits and nothing
 * else: the digits of the era's own name ("1969", "Anos 80–90" → "80 90",
 * "Anos 2000" → "2000"). An era named without any — "Hoje" — is this year.
 */
export function eraDigits(label: string, thisYear: number): string {
  return label.match(/\d+/g)?.join(' ') ?? String(thisYear);
}

/** Heights in points: the founding chapter, each later era, and the gap between two of them. */
export const ERA_LAYOUT = { founding: 186, era: 98, gap: 12 } as const;

/** Distance from the top of an era's block to the centre of its node on the rail. */
export const NODE_OFFSET = 10;

/** Top of each of `count` eras, the first being the founding chapter. */
export function eraTops(count: number): number[] {
  const { founding, era, gap } = ERA_LAYOUT;
  return Array.from({ length: count }, (_, i) => (i === 0 ? 0 : founding + gap + (i - 1) * (era + gap)));
}

/** Height of the whole list. */
export function erasHeight(count: number): number {
  const { founding, era, gap } = ERA_LAYOUT;
  return count === 0 ? 0 : founding + (count - 1) * (era + gap);
}
