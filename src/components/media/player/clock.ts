// src/components/media/player/clock.ts
// A position in a clip as "min:seg" — 5.4 s is "0:05", 83 s is "1:23". Whole
// seconds, rounded down: a clock that shows 0:27 has reached it.

export function formatClock(seconds: number): string {
  const whole = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}
