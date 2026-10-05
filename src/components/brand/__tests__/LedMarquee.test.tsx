// The LED sign with a browser stood in around it. jsdom has no canvas, no
// observers and no FontFaceSet, so each is a stand-in the cases drive by hand:
// the box is reported when a case says so, and the web font arrives when a
// case says so. The text rasteriser is a stub that only counts how many times
// the strip was built.
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LedMarquee } from '../LedMarquee';
import { textStripToPixels } from '@/lib/led/sources';

vi.mock('@/lib/led/sources', () => ({
  // One column of eleven unlit rows at three pixels per cell: all sampleGrid needs.
  textStripToPixels: vi.fn(() => ({ data: new Uint8ClampedArray(3 * 33 * 4), width: 3, height: 33, cols: 1 })),
}));

const PAUSE = 'Pausar o letreiro';
const PLAY = 'Rodar o letreiro';

/** What every live ResizeObserver would be told; a real one reports after layout, not on observe(). */
const resizeCallbacks = new Set<() => void>();
let fontsReady: Promise<void>;
let resolveFonts: () => void;

class FakeResizeObserver {
  private readonly callback: () => void;
  constructor(callback: () => void) {
    this.callback = callback;
  }
  observe() {
    resizeCallbacks.add(this.callback);
  }
  disconnect() {
    resizeCallbacks.delete(this.callback);
  }
}

/** Never reports: the sign stays out of view, so no frame loop runs. */
class FakeIntersectionObserver {
  observe() {}
  disconnect() {}
}

class FakePath {
  moveTo() {}
  arc() {}
}

/** Takes every call the sign makes on a 2D context and draws nothing. */
const context = { fillStyle: '', setTransform() {}, clearRect() {}, drawImage() {}, fill() {} };

beforeEach(() => {
  vi.mocked(textStripToPixels).mockClear();
  resizeCallbacks.clear();
  fontsReady = new Promise<void>((resolve) => {
    resolveFonts = resolve;
  });
  Object.defineProperty(document, 'fonts', { configurable: true, value: { ready: fontsReady } });
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  vi.stubGlobal('Path2D', FakePath);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
  // The sign's box, laid out: the same size every time it is measured.
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ width: 800, height: 66 } as DOMRect);
});

afterEach(() => {
  Reflect.deleteProperty(document, 'fonts');
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const mount = () =>
  render(
    <LedMarquee items={['Lulu Santos', 'Roupa Nova']} label="Palcos divididos" pauseLabel={PAUSE} playLabel={PLAY} />,
  );

/** The observer reports the box, unchanged since the last time. */
const reportBox = () => resizeCallbacks.forEach((callback) => callback());

/** `document.fonts.ready` settles and the sign gets its turn. */
const fontsArrive = async () => {
  resolveFonts();
  await fontsReady;
};

describe('LedMarquee and the web font', () => {
  it('builds the strip again when the font arrives after the box was first reported', async () => {
    mount();
    expect(textStripToPixels).not.toHaveBeenCalled();

    // The face is still loading: this strip is set in whatever fallback is there.
    reportBox();
    expect(textStripToPixels).toHaveBeenCalledTimes(1);

    // Same box, new face. The size guard alone would keep the fallback strip.
    await fontsArrive();
    expect(textStripToPixels).toHaveBeenCalledTimes(2);

    // Once, for the font: an unchanged box costs nothing again afterwards.
    reportBox();
    expect(textStripToPixels).toHaveBeenCalledTimes(2);
  });

  it('builds the strip once when the font is in before the box is reported', async () => {
    mount();
    await fontsArrive();
    expect(textStripToPixels).toHaveBeenCalledTimes(1);

    reportBox();
    expect(textStripToPixels).toHaveBeenCalledTimes(1);
  });
});

describe('LedMarquee pause control', () => {
  it('is named after what a press does, with no pressed state to contradict it', () => {
    mount();
    const control = screen.getByRole('button', { name: PAUSE });
    expect(control).not.toHaveAttribute('aria-pressed');

    fireEvent.click(control);
    expect(control).toHaveAccessibleName(PLAY);
    expect(control).not.toHaveAttribute('aria-pressed');

    fireEvent.click(control);
    expect(control).toHaveAccessibleName(PAUSE);
    expect(control).not.toHaveAttribute('aria-pressed');
  });

  it('keeps its name while a pointer rests on the sign, because a press would still pause', () => {
    const { container } = mount();
    const control = screen.getByRole('button', { name: PAUSE });
    const sign = container.querySelector('canvas')!.parentElement!;

    fireEvent.mouseEnter(sign);
    expect(control).toHaveAccessibleName(PAUSE);

    fireEvent.click(control);
    expect(control).toHaveAccessibleName(PLAY);

    fireEvent.mouseLeave(sign);
    expect(control).toHaveAccessibleName(PLAY);
  });
});
