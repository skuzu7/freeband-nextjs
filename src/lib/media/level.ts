// src/lib/media/level.ts
// How loud whatever is playing is right now, 0..1 — the one number the LED
// wall listens to. The player publishes it from the clip's pre-computed
// envelope (a small JSON beside each video), so nothing here touches Web
// Audio: no AudioContext to unlock, no silent output on iOS, no CSP change.
type Listener = (level: number) => void;

const listeners = new Set<Listener>();
let current = 0;

/** Publishes the level; out-of-range and non-finite values are clamped to 0..1. */
export function setLevel(level: number): void {
  const next = Number.isFinite(level) ? Math.min(1, Math.max(0, level)) : 0;
  if (next === current) return;
  current = next;
  for (const listener of listeners) listener(next);
}

export function getLevel(): number {
  return current;
}

/** Calls `listener` on every change; returns the unsubscribe. */
export function onLevel(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * The envelope's value at `time` seconds, linearly interpolated between its
 * samples. Past either end it is 0: silence before the clip and after it.
 */
export function levelAt(levels: readonly number[], rate: number, time: number): number {
  if (!levels.length || rate <= 0 || time < 0) return 0;
  const position = time * rate;
  const i = Math.floor(position);
  if (i >= levels.length - 1) return i === levels.length - 1 ? levels[i] : 0;
  const t = position - i;
  return levels[i] * (1 - t) + levels[i + 1] * t;
}

export interface StretchOptions {
  /** The percentile that becomes 0 (0..1). */
  low?: number;
  /** The percentile that becomes 1 (0..1). */
  high?: number;
  /** Above 1 the quiet half is pushed down, so the peaks stand out. */
  gamma?: number;
}

/** The value `p` of the way (0..1) through an ascending list, interpolated. */
function percentile(sorted: readonly number[], p: number): number {
  const position = (sorted.length - 1) * Math.min(1, Math.max(0, p));
  const i = Math.floor(position);
  const next = Math.min(sorted.length - 1, i + 1);
  return sorted[i] + (sorted[next] - sorted[i]) * (position - i);
}

/**
 * The envelope spread over the whole 0..1 the wall can show. A mastered clip
 * is compressed: its RMS sits in a narrow band (roughly 0.4–0.9 for these
 * cuts), and read as it is the wall would glow almost evenly from the first
 * bar to the last. The `low` percentile becomes 0, the `high` one becomes 1,
 * and `gamma` bends what lies between. Percentiles, not the minimum and the
 * maximum: one silent sample at a cut or one crash must not set the scale.
 *
 * Returns a new list of the same length; a sample that is not a number reads
 * as silence. An envelope with no range between the two percentiles has
 * nothing to stretch and comes back as it is, clamped to 0..1.
 */
export function stretchLevels(
  levels: readonly number[],
  { low = 0.05, high = 0.95, gamma = 1.5 }: StretchOptions = {},
): number[] {
  const clean = levels.map((v) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0));
  if (!clean.length) return clean;
  const sorted = [...clean].sort((a, b) => a - b);
  const floor = percentile(sorted, Math.min(low, high));
  const span = percentile(sorted, Math.max(low, high)) - floor;
  if (span < 1e-6) return clean;
  const bend = Number.isFinite(gamma) && gamma > 0 ? gamma : 1;
  return clean.map((v) => Math.min(1, Math.max(0, (v - floor) / span)) ** bend);
}
