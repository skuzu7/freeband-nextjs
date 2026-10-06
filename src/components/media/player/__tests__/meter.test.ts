// @vitest-environment node
//
// What the LED wall hears of a clip: its envelope, fetched on the first play
// and published once a frame. Frames are run by hand here.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getLevel, setLevel } from '@/lib/media/level';
import { createLevelMeter, type MeterSample } from '../meter';

const URL = '/video/clipe.levels.json';
/** 0.4, 0.9, 0.4 … at 20 samples a second: stretched, 0, 1, 0 … */
const ENVELOPE = { rate: 20, levels: Array.from({ length: 40 }, (_, i) => 0.4 + (i % 2) * 0.5) };

let frames: FrameRequestCallback[];
let fetched: ReturnType<typeof vi.fn>;
let now: MeterSample | null;

/** Lets the fetch settle, then runs the frames that are waiting. */
async function frame() {
  await new Promise((resolve) => setTimeout(resolve, 0));
  const due = frames;
  frames = [];
  for (const callback of due) callback(0);
}

const answer = (body: unknown, ok = true) => vi.fn(async () => ({ ok, json: async () => body }));

beforeEach(() => {
  frames = [];
  now = { time: 0.05, audible: true };
  fetched = answer(ENVELOPE);
  vi.stubGlobal('fetch', fetched);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
  vi.stubGlobal('cancelAnimationFrame', () => {
    frames = [];
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  setLevel(0);
});

describe('createLevelMeter', () => {
  it('costs nothing until it starts, and fetches the envelope once', async () => {
    const meter = createLevelMeter(URL, () => now);
    expect(fetched).not.toHaveBeenCalled();
    expect(frames).toHaveLength(0);

    meter.start();
    meter.start();
    expect(fetched).toHaveBeenCalledTimes(1);
    expect(fetched).toHaveBeenCalledWith(URL);
    // One loop, however often it is started.
    expect(frames).toHaveLength(1);

    meter.stop();
    meter.start();
    await frame();
    expect(fetched).toHaveBeenCalledTimes(1);
  });

  it('publishes the stretched level at the clip’s position, frame after frame', async () => {
    const meter = createLevelMeter(URL, () => now);
    meter.start();
    await frame();
    // Sample 1 of the envelope is its ceiling.
    expect(getLevel()).toBe(1);

    now = { time: 0.1, audible: true };
    await frame();
    expect(getLevel()).toBe(0);

    now = { time: 0.125, audible: true };
    await frame();
    // Half-way between a floor and a ceiling.
    expect(getLevel()).toBeCloseTo(0.5, 6);
    meter.stop();
  });

  it('is silent for a clip that is muted, and for a player that is gone', async () => {
    const meter = createLevelMeter(URL, () => now);
    meter.start();
    await frame();
    expect(getLevel()).toBe(1);

    now = { time: 0.05, audible: false };
    await frame();
    expect(getLevel()).toBe(0);

    now = { time: 0.05, audible: true };
    await frame();
    expect(getLevel()).toBe(1);

    now = null;
    await frame();
    expect(getLevel()).toBe(0);
    meter.stop();
  });

  it('stops publishing when stopped and leaves the level to its caller', async () => {
    const meter = createLevelMeter(URL, () => now);
    meter.start();
    await frame();
    expect(getLevel()).toBe(1);

    meter.stop();
    expect(frames).toHaveLength(0);
    now = { time: 0.1, audible: true };
    await frame();
    // Another clip may already be the one playing: zeroing is not the meter's call.
    expect(getLevel()).toBe(1);
  });

  it('plays on without an envelope: a missing or malformed file moves nothing', async () => {
    for (const body of [null, {}, { rate: 0, levels: [1] }, { rate: 20 }, { rate: '20', levels: [1] }, 'x']) {
      vi.stubGlobal('fetch', answer(body));
      const meter = createLevelMeter(URL, () => now);
      meter.start();
      await frame();
      await frame();
      expect(getLevel(), JSON.stringify(body)).toBe(0);
      meter.stop();
    }
    vi.stubGlobal('fetch', answer(ENVELOPE, false));
    const missing = createLevelMeter(URL, () => now);
    missing.start();
    await frame();
    expect(getLevel()).toBe(0);
    missing.stop();
  });

  it('asks again on the next play after the network failed', async () => {
    const offline = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    vi.stubGlobal('fetch', offline);
    const meter = createLevelMeter(URL, () => now);
    meter.start();
    await frame();
    expect(getLevel()).toBe(0);
    meter.stop();

    vi.stubGlobal('fetch', fetched);
    meter.start();
    await frame();
    await frame();
    expect(offline).toHaveBeenCalledTimes(1);
    expect(fetched).toHaveBeenCalledTimes(1);
    expect(getLevel()).toBe(1);
    meter.stop();
  });
});
