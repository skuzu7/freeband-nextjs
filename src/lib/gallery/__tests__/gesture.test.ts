// @vitest-environment node
//
// The viewer's gestures as arithmetic. Coordinates are CSS pixels from the
// centre of the stage; the view is translate(x, y) scale(s) about that centre.
import { describe, expect, it } from 'vitest';
import {
  DOUBLE_TAP_SCALE,
  KEY_ZOOM_STEP,
  canZoom,
  initialGesture,
  isZoomed,
  maxScale,
  present,
  reduceGesture,
  type GestureBounds,
  type GestureEvent,
  type GestureResult,
  type GestureState,
} from '../gesture';

/** A 3:2 photograph, 900×600 on a 1000×600 stage, from a 2700×1800 file: up to 3×. */
const bounds: GestureBounds = {
  stage: { width: 1000, height: 600 },
  fit: { width: 900, height: 600 },
  natural: { width: 2700, height: 1800 },
  dismissible: true,
};
/** A 400×300 flyer shown at its own size: nothing to zoom into. */
const flyer: GestureBounds = {
  stage: { width: 1000, height: 600 },
  fit: { width: 400, height: 300 },
  natural: { width: 400, height: 300 },
  dismissible: true,
};

function run(events: GestureEvent[], b: GestureBounds = bounds, from: GestureState = initialGesture): GestureResult {
  let result: GestureResult = { state: from };
  for (const event of events) result = reduceGesture(result.state, event, b);
  return result;
}

const down = (id: number, x: number, y: number, time: number): GestureEvent => ({ type: 'down', id, x, y, time });
const move = (id: number, x: number, y: number, time: number): GestureEvent => ({ type: 'move', id, x, y, time });
const up = (id: number, x: number, y: number, time: number): GestureEvent => ({ type: 'up', id, x, y, time });
const tap = (x: number, y: number, time: number): GestureEvent[] => [down(1, x, y, time), up(1, x, y, time + 40)];

/** The point of the photograph (in its own 1× pixels) drawn at stage point (x, y). */
const under = (state: GestureState, x: number, y: number) => ({
  x: (x - state.view.x) / state.view.scale,
  y: (y - state.view.y) / state.view.scale,
});

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) deepFreeze((value as Record<string, unknown>)[key]);
    Object.freeze(value);
  }
  return value;
}

describe('the largest scale is the resolution of the file', () => {
  it('is one image pixel per CSS pixel', () => {
    expect(maxScale(bounds)).toBe(3);
    expect(canZoom(bounds)).toBe(true);
  });

  it('is 1 for a file no bigger than its box, and for a gain too small to matter', () => {
    expect(maxScale(flyer)).toBe(1);
    expect(canZoom(flyer)).toBe(false);
    expect(maxScale({ ...bounds, natural: { width: 990, height: 660 } })).toBe(1);
    expect(maxScale({ ...bounds, fit: { width: 0, height: 0 } })).toBe(1);
  });
});

describe('double tap', () => {
  it('goes to 2.5× about the tap, and back to the whole photograph', () => {
    const zoomed = run([...tap(100, 50, 0), ...tap(102, 51, 150)]).state;
    expect(zoomed.view.scale).toBe(DOUBLE_TAP_SCALE);
    // What was under the finger at 1× is still under it.
    expect(under(zoomed, 102, 51).x).toBeCloseTo(102);
    expect(under(zoomed, 102, 51).y).toBeCloseTo(51);
    expect(isZoomed(zoomed)).toBe(true);

    const back = run([...tap(0, 0, 1000), ...tap(0, 0, 1150)], bounds, zoomed).state;
    expect(back.view).toEqual({ scale: 1, x: 0, y: 0 });
  });

  it('stops at the file when it has less than 2.5× to show', () => {
    const small: GestureBounds = { ...bounds, natural: { width: 1620, height: 1080 } };
    expect(run([...tap(0, 0, 0), ...tap(0, 0, 150)], small).state.view.scale).toBeCloseTo(1.8);
  });

  it('does nothing to a flyer shown at its own size', () => {
    expect(run([...tap(0, 0, 0), ...tap(0, 0, 150)], flyer).state.view).toEqual({ scale: 1, x: 0, y: 0 });
  });

  it('needs the second tap soon and near', () => {
    expect(run([...tap(0, 0, 0), ...tap(0, 0, 600)]).state.view.scale).toBe(1);
    expect(run([...tap(0, 0, 0), ...tap(120, 0, 150)]).state.view.scale).toBe(1);
  });

  it('a long press is not a tap', () => {
    const state = run([down(1, 0, 0, 0), up(1, 0, 0, 500), ...tap(0, 0, 600)]).state;
    expect(state.view.scale).toBe(1);
  });
});

describe('pinch', () => {
  it('scales about the centroid of the two fingers', () => {
    const state = run([
      down(1, 100, 100, 0),
      down(2, 300, 100, 10),
      move(1, 0, 100, 20),
      move(2, 400, 100, 30),
    ]).state;
    expect(state.mode).toBe('pinch');
    expect(state.view.scale).toBe(2);
    expect(state.view).toEqual({ scale: 2, x: -200, y: -100 });
    // The point that was between the fingers has not moved.
    expect(under(state, 200, 100)).toEqual({ x: 200, y: 100 });
  });

  it('pans when both fingers travel together', () => {
    const state = run([
      down(1, 100, 100, 0),
      down(2, 300, 100, 10),
      move(1, 0, 100, 20),
      move(2, 400, 100, 30),
      move(1, 50, 100, 40),
      move(2, 450, 100, 50),
    ]).state;
    expect(state.view).toEqual({ scale: 2, x: -150, y: -100 });
  });

  it('never goes past the file, nor under the whole photograph', () => {
    const wide = run([down(1, -10, 0, 0), down(2, 10, 0, 10), move(2, 990, 0, 20)]).state;
    expect(wide.view.scale).toBe(3);

    const narrow = run([down(1, -200, 0, 0), down(2, 200, 0, 10), move(2, -190, 0, 20)]).state;
    expect(narrow.view).toEqual({ scale: 1, x: 0, y: 0 });
  });

  it('carries on as a pan with the finger that stays down', () => {
    const state = run([
      down(1, -100, 0, 0),
      down(2, 100, 0, 10),
      move(1, -200, 0, 20),
      move(2, 200, 0, 30),
      up(2, 200, 0, 40),
      move(1, -150, 0, 50),
    ]).state;
    expect(state.mode).toBe('pan');
    expect(state.view).toEqual({ scale: 2, x: 50, y: 0 });
  });

  it('a pinch that ends at 1× leaves the remaining finger idle: no swipe', () => {
    const result = run([
      down(1, -100, 0, 0),
      down(2, 100, 0, 10),
      up(2, 100, 0, 20),
      move(1, -400, 0, 30),
      up(1, -400, 0, 40),
    ]);
    expect(result.intent).toBeUndefined();
    expect(result.state.view).toEqual({ scale: 1, x: 0, y: 0 });
  });

  it('is not offered to a flyer shown at its own size', () => {
    const state = run([down(1, -50, 0, 0), down(2, 50, 0, 10), move(2, 300, 0, 20)], flyer).state;
    expect(state.mode).toBe('ignore');
    expect(state.view.scale).toBe(1);
  });

  it('ignores a third finger', () => {
    const two = run([down(1, -100, 0, 0), down(2, 100, 0, 10)]).state;
    const three = reduceGesture(two, down(3, 0, 200, 20), bounds).state;
    expect(three).toBe(two);
  });
});

describe('pan', () => {
  const zoomed: GestureState = { ...initialGesture, view: { scale: 2, x: 0, y: 0 } };

  it('follows the finger once zoomed', () => {
    const result = run([down(1, 0, 0, 0), move(1, 20, 0, 10), move(1, 120, 60, 20), up(1, 120, 60, 30)], bounds, zoomed);
    expect(result.intent).toBeUndefined();
    expect(result.state.view).toEqual({ scale: 2, x: 100, y: 60 });
  });

  it('stops at the edges of the photograph', () => {
    // 1800×1200 on a 1000×600 stage: 400 px of travel each way, 300 up and down.
    const far = run([down(1, 0, 0, 0), move(1, 20, 20, 10), move(1, 2020, 2020, 20)], bounds, zoomed).state;
    expect(far.view).toEqual({ scale: 2, x: 400, y: 300 });
    const back = run([down(1, 0, 0, 0), move(1, -20, -20, 10), move(1, -2020, -2020, 20)], bounds, zoomed).state;
    expect(back.view).toEqual({ scale: 2, x: -400, y: -300 });
  });
});

describe('a drag on the whole photograph', () => {
  it('to the left asks for the next one, to the right for the previous', () => {
    const next = run([down(1, 0, 0, 0), move(1, -20, 0, 16), move(1, -150, 0, 200), up(1, -150, 0, 400)]);
    expect(next.intent).toBe('next');
    expect(next.state.leaving).toBe('next');

    const prev = run([down(1, 0, 0, 0), move(1, 20, 0, 16), move(1, 150, 0, 200), up(1, 150, 0, 400)]);
    expect(prev.intent).toBe('prev');
  });

  it('comes back when it was short and slow', () => {
    const result = run([down(1, 0, 0, 0), move(1, -20, 0, 100), move(1, -60, 0, 400), up(1, -60, 0, 800)]);
    expect(result.intent).toBeUndefined();
    expect(result.state.drag).toEqual({ x: 0, y: 0 });
    expect(result.state.mode).toBe('idle');
  });

  it('counts a short flick', () => {
    const result = run([down(1, 0, 0, 0), move(1, -10, 0, 10), move(1, -50, 0, 30), up(1, -50, 0, 40)]);
    expect(result.intent).toBe('next');
  });

  it('downwards closes the lightbox', () => {
    const result = run([down(1, 0, 0, 0), move(1, 0, 20, 16), move(1, 4, 180, 200), up(1, 4, 180, 400)]);
    expect(result.intent).toBe('close');
    expect(result.state.leaving).toBe('close');
  });

  it("downwards does nothing on the photograph's own page, where the page scrolls", () => {
    const page = { ...bounds, dismissible: false };
    const result = run([down(1, 0, 0, 0), move(1, 0, 20, 16), move(1, 0, 300, 200), up(1, 0, 300, 400)], page);
    expect(result.intent).toBeUndefined();
    expect(result.state.drag).toEqual({ x: 0, y: 0 });
  });

  it('upwards does nothing', () => {
    const result = run([down(1, 0, 0, 0), move(1, 0, -20, 16), move(1, 0, -300, 200), up(1, 0, -300, 400)]);
    expect(result.intent).toBeUndefined();
  });

  it('does not start a second gesture once the photograph is leaving', () => {
    const leaving = run([down(1, 0, 0, 0), move(1, -20, 0, 16), move(1, -150, 0, 200), up(1, -150, 0, 400)]).state;
    expect(reduceGesture(leaving, down(2, 0, 0, 500), bounds).state).toBe(leaving);
  });

  it('a cancelled pointer puts the photograph back and asks for nothing', () => {
    const result = run([down(1, 0, 0, 0), move(1, -20, 0, 16), move(1, -300, 0, 200), { type: 'cancel', id: 1 }]);
    expect(result.intent).toBeUndefined();
    expect(result.state.drag).toEqual({ x: 0, y: 0 });
    expect(result.state.pointers).toEqual([]);
  });
});

describe('wheel', () => {
  it('with ctrl zooms about the pointer and claims the event', () => {
    const result = run([{ type: 'wheel', x: 100, y: 0, deltaX: 0, deltaY: -100, ctrl: true }]);
    expect(result.handled).toBe(true);
    expect(result.state.view.scale).toBeCloseTo(Math.exp(0.2));
    expect(under(result.state, 100, 0).x).toBeCloseTo(100);
  });

  it('without ctrl is left to the page while the photograph is whole', () => {
    const result = run([{ type: 'wheel', x: 0, y: 0, deltaX: 0, deltaY: 100, ctrl: false }]);
    expect(result.handled).toBeUndefined();
    expect(result.state).toBe(initialGesture);
  });

  it('without ctrl pans a zoomed photograph, inside its edges', () => {
    const zoomed: GestureState = { ...initialGesture, view: { scale: 2, x: 0, y: 0 } };
    const result = run([{ type: 'wheel', x: 0, y: 0, deltaX: 30, deltaY: 1000, ctrl: false }], bounds, zoomed);
    expect(result.handled).toBe(true);
    expect(result.state.view).toEqual({ scale: 2, x: -30, y: -300 });
  });

  it('with ctrl is left to the browser when the file has nothing more to show', () => {
    const result = run([{ type: 'wheel', x: 0, y: 0, deltaX: 0, deltaY: -100, ctrl: true }], flyer);
    expect(result.handled).toBeUndefined();
    expect(result.state.view.scale).toBe(1);
  });
});

describe('keyboard and buttons', () => {
  it('zoom in steps about the centre up to the file, and out down to 1×', () => {
    let state = run([{ type: 'zoom', factor: KEY_ZOOM_STEP }]).state;
    expect(state.view).toEqual({ scale: 1.5, x: 0, y: 0 });
    state = run([{ type: 'zoom', factor: KEY_ZOOM_STEP }, { type: 'zoom', factor: KEY_ZOOM_STEP }], bounds, state).state;
    expect(state.view.scale).toBe(3);
    state = run(Array.from({ length: 5 }, () => ({ type: 'zoom', factor: 1 / KEY_ZOOM_STEP }) as GestureEvent), bounds, state).state;
    expect(state.view).toEqual({ scale: 1, x: 0, y: 0 });
  });

  it('reset brings the whole photograph back', () => {
    const zoomed: GestureState = { ...initialGesture, view: { scale: 2.4, x: 310, y: -120 } };
    expect(run([{ type: 'reset' }], bounds, zoomed).state.view).toEqual({ scale: 1, x: 0, y: 0 });
  });
});

describe('resize', () => {
  it('holds the view inside the new limits', () => {
    const zoomed: GestureState = { ...initialGesture, view: { scale: 3, x: 850, y: 600 } };
    // The same photograph in a box twice as wide: the file now gives 1.5×.
    const larger: GestureBounds = { ...bounds, stage: { width: 2000, height: 1200 }, fit: { width: 1800, height: 1200 } };
    const state = run([{ type: 'resize' }], larger, zoomed).state;
    expect(state.view.scale).toBe(1.5);
    expect(state.view.x).toBe(350);
    expect(state.view.y).toBe(300);
  });
});

describe('present', () => {
  it('is the view at rest', () => {
    expect(present(initialGesture, bounds)).toEqual({ x: 0, y: 0, scale: 1, dismiss: 0, dragging: false, leaving: null });
  });

  it('follows a sideways drag, and sends a photograph that is leaving off the stage', () => {
    const dragging = run([down(1, 0, 0, 0), move(1, -20, 0, 16), move(1, -80, 0, 40)]).state;
    expect(present(dragging, bounds)).toMatchObject({ x: -60, y: 0, scale: 1, dragging: true });

    const leaving = run([up(1, -200, 0, 60)], bounds, run([move(1, -200, 0, 50)], bounds, dragging).state).state;
    expect(present(leaving, bounds)).toMatchObject({ x: -950, leaving: 'next', dragging: false });
  });

  it('shrinks the photograph and dims the lightbox as it is dragged down', () => {
    const state = run([down(1, 0, 0, 0), move(1, 0, 20, 16), move(1, 0, 170, 40)]).state;
    const p = present(state, bounds);
    expect(p.y).toBe(150);
    expect(p.dismiss).toBeCloseTo(0.5);
    expect(p.scale).toBeCloseTo(0.9);
  });
});

describe('purity', () => {
  it('never mutates the state it is given', () => {
    const frozen = deepFreeze(structuredClone(initialGesture));
    const events: GestureEvent[] = [
      down(1, 0, 0, 0),
      down(2, 100, 0, 10),
      move(2, 300, 0, 20),
      up(2, 300, 0, 30),
      move(1, 40, 40, 40),
      up(1, 40, 40, 50),
      { type: 'wheel', x: 0, y: 0, deltaX: 0, deltaY: -50, ctrl: true },
      { type: 'zoom', factor: 2 },
      { type: 'resize' },
      { type: 'reset' },
    ];
    let state: GestureState = frozen;
    expect(() => {
      for (const event of events) state = deepFreeze(reduceGesture(state, event, bounds).state);
    }).not.toThrow();
    expect(frozen).toEqual(initialGesture);
  });
});
