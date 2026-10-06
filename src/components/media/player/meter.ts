// src/components/media/player/meter.ts
// What the LED wall hears. While a clip plays, its loudness right now is
// published to src/lib/media/level.ts once a frame, read from the envelope
// that sits beside the video (<id>.levels.json) — no Web Audio, so nothing to
// unlock and nothing the CSP has to allow.
//
// The envelope is fetched the first time the clip plays, never before: a clip
// nobody starts costs nothing. Without it (offline, a 404) the clip plays all
// the same and the wall stays still.
import { levelAt, setLevel, stretchLevels } from '@/lib/media/level';

export interface MeterSample {
  /** Seconds into the clip. */
  time: number;
  /** False when the clip is muted: a wall pulsing to silence is noise. */
  audible: boolean;
}

export interface LevelMeter {
  /** Begin publishing; fetches the envelope on the first call. */
  start(): void;
  /** Stop publishing. Whether the level goes back to 0 is the caller's call:
   *  another clip may already be the one that is playing. */
  stop(): void;
}

interface Envelope {
  rate: number;
  levels: number[];
}

function parseEnvelope(data: unknown): Envelope | null {
  if (typeof data !== 'object' || data === null) return null;
  const { rate, levels } = data as { rate?: unknown; levels?: unknown };
  if (typeof rate !== 'number' || !(rate > 0) || !Array.isArray(levels)) return null;
  return { rate, levels: stretchLevels(levels.map(Number)) };
}

export function createLevelMeter(url: string, sample: () => MeterSample | null): LevelMeter {
  let envelope: Envelope | null = null;
  let requested = false;
  let frame = 0;

  const load = () => {
    if (requested || typeof fetch !== 'function') return;
    requested = true;
    fetch(url)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        envelope = parseEnvelope(data);
      })
      .catch(() => {
        // Tried again the next time the clip plays.
        requested = false;
      });
  };

  const tick = () => {
    frame = requestAnimationFrame(tick);
    if (!envelope) return;
    const now = sample();
    setLevel(now?.audible ? levelAt(envelope.levels, envelope.rate, now.time) : 0);
  };

  return {
    start() {
      load();
      if (!frame) frame = requestAnimationFrame(tick);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}
