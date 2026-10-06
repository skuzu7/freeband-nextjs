// src/lib/gallery/gesture.ts
// What fingers, a mouse, a wheel and the keyboard do to one photograph, as a
// pure state machine. The component feeds it pointer samples and reads back a
// transform; nothing here touches the DOM, so every rule below is tested as
// arithmetic.
//
// Coordinates are CSS pixels measured from the CENTRE of the stage (the area
// the photograph is fitted into). The view is `translate(x, y) scale(s)` about
// that centre.
//
//   two pointers      pinch about their centroid (which also pans)
//   one, zoomed       pan, held inside the photograph's edges
//   one, at 1×        sideways: the next or the previous photograph;
//                     downwards: close (only where the viewer can be closed)
//   double tap        1× ↔ 2.5×, about the tap
//   ctrl + wheel      zoom about the pointer; a plain wheel pans when zoomed
//   keyboard          zoom about the centre, reset
//
// The largest scale is the file's own resolution: one image pixel per CSS
// pixel. A file with nothing worth gaining over its box — the 400×300 flyers
// on a desktop screen, shown at their own size — does not zoom at all.

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface GestureBounds {
  /** The area the photograph is fitted into. */
  stage: Size;
  /** The photograph as laid out at 1×. */
  fit: Size;
  /** The file's native pixels. */
  natural: Size;
  /** A downward drag at 1× closes the viewer (the lightbox, not the page). */
  dismissible: boolean;
}

/** The photograph's transform about the centre of the stage. */
export interface View {
  scale: number;
  x: number;
  y: number;
}

interface PointerSample extends Point {
  id: number;
  time: number;
}

export type GestureMode = 'idle' | 'press' | 'pan' | 'pinch' | 'swipe' | 'dismiss' | 'ignore';
export type GestureIntent = 'next' | 'prev' | 'close';

export interface GestureState {
  view: View;
  /** Pointers currently down, oldest first. Never more than two. */
  pointers: PointerSample[];
  mode: GestureMode;
  /** Where the current gesture started: its point and time, the view then, the spread. */
  origin: { point: Point; view: View; distance: number; time: number } | null;
  /** How far a drag at 1× has carried the photograph. Gone when it ends. */
  drag: Point;
  /** A slightly older sample of the dragging pointer, for the release speed. */
  track: PointerSample | null;
  /** The last lone tap, waiting to see whether a second one follows. */
  tap: { x: number; y: number; time: number } | null;
  /** Set once a gesture has asked to leave: the photograph is on its way out. */
  leaving: GestureIntent | null;
}

export type GestureEvent =
  | { type: 'down'; id: number; x: number; y: number; time: number }
  | { type: 'move'; id: number; x: number; y: number; time: number }
  | { type: 'up'; id: number; x: number; y: number; time: number }
  | { type: 'cancel'; id: number }
  | { type: 'wheel'; x: number; y: number; deltaX: number; deltaY: number; ctrl: boolean }
  /** Multiply the scale, about the centre: the + and − keys and buttons. */
  | { type: 'zoom'; factor: number }
  /** Back to the whole photograph. */
  | { type: 'reset' }
  /** The stage or the photograph changed size. */
  | { type: 'resize' };

export interface GestureResult {
  state: GestureState;
  /** What the gesture asked for when it ended. */
  intent?: GestureIntent;
  /** A wheel event the viewer used: the browser must not act on it too. */
  handled?: boolean;
}

/** Movement under this is still a press, not a drag. */
const SLOP = 8;
/** The scale a double tap goes to, when the file has that much to show. */
export const DOUBLE_TAP_SCALE = 2.5;
/** One press of + or −. */
export const KEY_ZOOM_STEP = 1.5;
/** Below this gain a file is shown at its own size and zooming is not offered. */
const MIN_USEFUL_ZOOM = 1.25;
/** A press longer than this is a hold, not a tap. */
const TAP_MS = 300;
// Two taps this close in time and place are one double tap. Generous on
// purpose: a lone tap does nothing, so there is no action to hold back, and a
// double click with a mouse may take this long.
const DOUBLE_TAP_MS = 500;
const DOUBLE_TAP_SLOP = 32;
/** A drag this long changes photograph or closes, whatever its speed. */
const TRAVEL = 96;
/** A shorter drag still counts when it was a flick: px and px/ms. */
const FLICK_TRAVEL = 24;
const FLICK_SPEED = 0.5;
/** How far back the speed sample reaches, in ms. */
const TRACK_MS = 80;

const ORIGIN: Point = { x: 0, y: 0 };
const REST: View = { scale: 1, x: 0, y: 0 };

export const initialGesture: GestureState = {
  view: REST,
  pointers: [],
  mode: 'idle',
  origin: null,
  drag: ORIGIN,
  track: null,
  tap: null,
  leaving: null,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const centroid = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/** The largest scale the file's resolution allows; 1 when there is nothing to gain. */
export function maxScale(bounds: GestureBounds): number {
  if (bounds.fit.width <= 0) return 1;
  const gain = bounds.natural.width / bounds.fit.width;
  return gain < MIN_USEFUL_ZOOM ? 1 : gain;
}

export function canZoom(bounds: GestureBounds): boolean {
  return maxScale(bounds) > 1;
}

export function isZoomed(state: GestureState): boolean {
  return state.view.scale > 1.001;
}

/** `value` kept within ±limit; with no room at all it is exactly 0. */
const hold = (value: number, limit: number) => (limit <= 0 ? 0 : clamp(value, -limit, limit));

/** Hold the photograph's edges at the stage's: no empty margin once it is larger. */
function clampView(view: View, bounds: GestureBounds): View {
  const scale = clamp(view.scale, 1, maxScale(bounds));
  const limitX = (bounds.fit.width * scale - bounds.stage.width) / 2;
  const limitY = (bounds.fit.height * scale - bounds.stage.height) / 2;
  return { scale, x: hold(view.x, limitX), y: hold(view.y, limitY) };
}

/** Scale to `target`, keeping the part of the photograph under `point` where it is. */
function zoomAbout(view: View, point: Point, target: number, bounds: GestureBounds): View {
  const scale = clamp(target, 1, maxScale(bounds));
  // The point of the photograph (in its own 1× pixels) that sits under `point`.
  const px = (point.x - view.x) / view.scale;
  const py = (point.y - view.y) / view.scale;
  return clampView({ scale, x: point.x - px * scale, y: point.y - py * scale }, bounds);
}

function settle(state: GestureState): GestureState {
  return { ...state, pointers: [], mode: 'idle', origin: null, drag: ORIGIN, track: null };
}

function down(state: GestureState, event: Extract<GestureEvent, { type: 'down' }>, bounds: GestureBounds): GestureState {
  if (state.leaving || state.pointers.length >= 2 || state.pointers.some((p) => p.id === event.id)) return state;
  const sample: PointerSample = { id: event.id, x: event.x, y: event.y, time: event.time };
  const pointers = [...state.pointers, sample];

  if (pointers.length === 1) {
    return {
      ...state,
      pointers,
      mode: 'press',
      origin: { point: sample, view: state.view, distance: 0, time: sample.time },
      drag: ORIGIN,
      track: sample,
    };
  }
  // A second finger: whatever the first was doing, the two now pinch.
  const [a, b] = pointers;
  return {
    ...state,
    pointers,
    mode: canZoom(bounds) ? 'pinch' : 'ignore',
    origin: { point: centroid(a, b), view: state.view, distance: Math.max(1, distance(a, b)), time: sample.time },
    drag: ORIGIN,
    track: null,
    tap: null,
  };
}

function move(state: GestureState, event: Extract<GestureEvent, { type: 'move' }>, bounds: GestureBounds): GestureState {
  const index = state.pointers.findIndex((p) => p.id === event.id);
  if (index < 0 || !state.origin) return state;
  const previous = state.pointers[index];
  const sample: PointerSample = { id: event.id, x: event.x, y: event.y, time: event.time };
  const pointers = state.pointers.map((p, i) => (i === index ? sample : p));
  const { origin } = state;

  if (state.mode === 'pinch' && pointers.length === 2) {
    const [a, b] = pointers;
    const centre = centroid(a, b);
    const scale = clamp((origin.view.scale * distance(a, b)) / origin.distance, 1, maxScale(bounds));
    // The part of the photograph that was under the fingers stays under them.
    const px = (origin.point.x - origin.view.x) / origin.view.scale;
    const py = (origin.point.y - origin.view.y) / origin.view.scale;
    return { ...state, pointers, view: clampView({ scale, x: centre.x - px * scale, y: centre.y - py * scale }, bounds) };
  }
  if (pointers.length !== 1) return { ...state, pointers };

  // The speed sample trails the pointer by about TRACK_MS.
  const track = state.track && previous.time - state.track.time < TRACK_MS ? state.track : previous;
  const dx = sample.x - origin.point.x;
  const dy = sample.y - origin.point.y;

  switch (state.mode) {
    case 'press': {
      if (Math.hypot(dx, dy) < SLOP) return { ...state, pointers, track };
      // The drag starts here, so the photograph does not jump by the slop.
      const anchored = { ...origin, point: sample };
      const mode: GestureMode = isZoomed(state)
        ? 'pan'
        : Math.abs(dx) >= Math.abs(dy)
          ? 'swipe'
          : dy > 0 && bounds.dismissible
            ? 'dismiss'
            : 'ignore';
      return { ...state, pointers, track: sample, mode, origin: anchored, tap: null };
    }
    case 'pan':
      return {
        ...state,
        pointers,
        track,
        view: clampView({ scale: origin.view.scale, x: origin.view.x + dx, y: origin.view.y + dy }, bounds),
      };
    case 'swipe':
      return { ...state, pointers, track, drag: { x: dx, y: 0 } };
    case 'dismiss':
      return { ...state, pointers, track, drag: { x: dx, y: Math.max(0, dy) } };
    default:
      return { ...state, pointers, track };
  }
}

/** Far enough, or fast enough in that direction, to mean it. */
function committed(travel: number, speed: number, room: number): boolean {
  return travel > Math.min(TRAVEL, room * 0.25) || (travel > FLICK_TRAVEL && speed > FLICK_SPEED);
}

function up(state: GestureState, event: Extract<GestureEvent, { type: 'up' }>, bounds: GestureBounds): GestureResult {
  const pointer = state.pointers.find((p) => p.id === event.id);
  if (!pointer) return { state };
  const pointers = state.pointers.filter((p) => p.id !== event.id);

  if (pointers.length === 1) {
    // One finger of a pinch lifted: the other carries on as a pan, or waits.
    const [rest] = pointers;
    return {
      state: {
        ...state,
        pointers,
        mode: isZoomed(state) ? 'pan' : 'ignore',
        origin: { point: rest, view: state.view, distance: 0, time: event.time },
        track: rest,
      },
    };
  }

  const track = state.track;
  const elapsed = track ? Math.max(1, event.time - track.time) : 1;
  const speedX = track ? (event.x - track.x) / elapsed : 0;
  const speedY = track ? (event.y - track.y) / elapsed : 0;

  switch (state.mode) {
    case 'press': {
      if (!state.origin || event.time - state.origin.time > TAP_MS) return { state: { ...settle(state), tap: null } };
      const tap = { x: event.x, y: event.y, time: event.time };
      const isSecond = state.tap !== null && tap.time - state.tap.time < DOUBLE_TAP_MS && distance(tap, state.tap) < DOUBLE_TAP_SLOP;
      if (!isSecond) return { state: { ...settle(state), tap } };
      const view = isZoomed(state)
        ? REST
        : zoomAbout(state.view, tap, Math.min(DOUBLE_TAP_SCALE, maxScale(bounds)), bounds);
      return { state: { ...settle(state), view, tap: null } };
    }
    case 'swipe': {
      const { x } = state.drag;
      // A flick only counts in the direction the photograph was dragged.
      const speed = Math.sign(speedX) === Math.sign(x) ? Math.abs(speedX) : 0;
      if (!committed(Math.abs(x), speed, bounds.stage.width)) return { state: settle(state) };
      const intent: GestureIntent = x < 0 ? 'next' : 'prev';
      return { state: { ...settle(state), drag: state.drag, leaving: intent }, intent };
    }
    case 'dismiss': {
      const { y } = state.drag;
      if (!committed(y, Math.max(0, speedY), bounds.stage.height)) return { state: settle(state) };
      return { state: { ...settle(state), drag: state.drag, leaving: 'close' }, intent: 'close' };
    }
    default:
      // A pinch that came back to (almost) 1× rests exactly there.
      return { state: { ...settle(state), view: state.view.scale < 1.02 ? REST : state.view } };
  }
}

function wheel(state: GestureState, event: Extract<GestureEvent, { type: 'wheel' }>, bounds: GestureBounds): GestureResult {
  if (state.leaving) return { state };
  if (event.ctrl) {
    if (!canZoom(bounds)) return { state };
    // A trackpad pinch arrives as many small deltas, a wheel as a few large ones.
    const rate = Math.abs(event.deltaY) < 40 ? 0.01 : 0.002;
    const target = state.view.scale * Math.exp(-event.deltaY * rate);
    return { state: { ...state, view: zoomAbout(state.view, event, target, bounds), tap: null }, handled: true };
  }
  if (!isZoomed(state)) return { state };
  const view = clampView({ ...state.view, x: state.view.x - event.deltaX, y: state.view.y - event.deltaY }, bounds);
  return { state: { ...state, view }, handled: true };
}

/** Advance the machine by one event. Never mutates `state`. */
export function reduceGesture(state: GestureState, event: GestureEvent, bounds: GestureBounds): GestureResult {
  switch (event.type) {
    case 'down':
      return { state: down(state, event, bounds) };
    case 'move':
      return { state: move(state, event, bounds) };
    case 'up':
      return up(state, event, bounds);
    case 'cancel': {
      if (!state.pointers.some((p) => p.id === event.id)) return { state };
      return { state: { ...settle(state), view: clampView(state.view, bounds) } };
    }
    case 'wheel':
      return wheel(state, event, bounds);
    case 'zoom':
      if (state.leaving) return { state };
      return { state: { ...state, view: zoomAbout(state.view, ORIGIN, state.view.scale * event.factor, bounds), tap: null } };
    case 'reset':
      return { state: { ...settle(state), view: REST, tap: null, leaving: null } };
    case 'resize':
      return { state: { ...state, view: clampView(state.view, bounds) } };
  }
}

/** What to draw: the photograph's transform and how far it is on its way out. */
export interface Presentation {
  x: number;
  y: number;
  scale: number;
  /** 0 → 1 as a downward drag approaches closing: the backdrop dims with it. */
  dismiss: number;
  /** A finger is on the photograph: follow it without easing. */
  dragging: boolean;
  leaving: GestureIntent | null;
}

export function present(state: GestureState, bounds: GestureBounds): Presentation {
  const closing = state.mode === 'dismiss' || state.leaving === 'close';
  const dismiss = closing && bounds.stage.height > 0 ? clamp(state.drag.y / (bounds.stage.height * 0.5), 0, 1) : 0;
  // A photograph leaving sideways goes all the way off the stage.
  const off = (bounds.stage.width + bounds.fit.width) / 2;
  const x = state.leaving === 'next' ? -off : state.leaving === 'prev' ? off : state.view.x + state.drag.x;
  return {
    x,
    y: state.view.y + state.drag.y,
    scale: state.view.scale * (1 - dismiss * 0.2),
    dismiss,
    dragging: state.pointers.length > 0,
    leaving: state.leaving,
  };
}
