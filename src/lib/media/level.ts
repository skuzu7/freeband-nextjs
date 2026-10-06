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
