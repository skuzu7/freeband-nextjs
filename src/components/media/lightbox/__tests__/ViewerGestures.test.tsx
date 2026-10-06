// The viewer made live: what the keyboard, the pointer, the zoom controls and
// the share button do. The arithmetic of the gestures is tested on its own
// (src/lib/gallery/__tests__/gesture.test.ts); this is the wiring.
import type { ReactNode } from 'react';
import { createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ViewerGestures } from '../ViewerGestures';
import { ViewerHostContext, type ViewerHost } from '../host';

const router = vi.hoisted(() => ({ replace: vi.fn(), push: vi.fn(), back: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

// A page load cannot happen in jsdom; the module that makes it is replaced.
const navigate = vi.hoisted(() => ({ loadPhotoPage: vi.fn(), takeRememberedFocus: vi.fn(() => null as string | null) }));
vi.mock('@/lib/gallery/navigate', () => navigate);

const hrefs = {
  self: '/palco/foto/tres',
  prev: '/palco/foto/dois',
  next: '/palco/foto/quatro',
  first: '/palco/foto/um',
  last: '/palco/foto/nove',
  back: '/palco#foto-tres',
};
const labels = {
  zoomIn: 'Aproximar',
  zoomOut: 'Afastar',
  share: 'Compartilhar',
  copied: 'Link copiado',
  shareFailed: 'Copie o endereço da barra do navegador',
};

interface Geometry {
  stage: [number, number];
  fit: [number, number];
}
/** A 2700×1800 file fitted at 900×600: three times its box. */
const LARGE: Geometry = { stage: [1000, 600], fit: [900, 600] };
/** A 400×300 flyer at its own size. */
const FLYER: Geometry = { stage: [1000, 600], fit: [400, 300] };

/** jsdom lays nothing out: give the stage and the photograph a size, and report it. */
function layout(geometry: Geometry) {
  const sizeOf = (el: Element): [number, number] =>
    el.classList.contains('viewer-stage') ? geometry.stage : el.classList.contains('viewer-photo') ? geometry.fit : [0, 0];
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (this: Element) {
    return sizeOf(this)[0];
  });
  vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(function (this: Element) {
    return sizeOf(this)[1];
  });
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
    return sizeOf(this)[0];
  });
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    return sizeOf(this)[1];
  });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(private readonly callback: () => void) {}
      observe() {
        queueMicrotask(this.callback);
      }
      unobserve() {}
      disconnect() {}
    },
  );
}

const newHost = (): ViewerHost => ({ show: vi.fn(), close: vi.fn() });

function renderViewer(options: { aspect?: `${number}/${number}`; mode?: 'page' | 'modal'; host?: ViewerHost } = {}) {
  const { aspect = '2700/1800', mode = 'page' } = options;
  // The lightbox is a viewer inside a dialog: the two always come together.
  const host = options.host ?? (mode === 'modal' ? newHost() : undefined);
  const wrap = (children: ReactNode) =>
    host ? <ViewerHostContext.Provider value={host}>{children}</ViewerHostContext.Provider> : children;
  const view = render(
    wrap(
      <figure>
        <ViewerGestures
          photo={{ src: '/images/tres.jpeg', alt: 'Banda no palco', aspect }}
          mode={mode}
          name="palco-tres"
          anchor="foto-tres"
          announcement="3 de 9. Banda no palco"
          title="Banda no palco"
          hrefs={hrefs}
          neighbours={[]}
          labels={labels}
        />
        {/* The neighbours as PhotoViewer prints them on the photograph's own page. */}
        <a href={hrefs.prev} data-viewer-control="prev" data-viewer-step>
          Foto anterior
        </a>
        <a href={hrefs.next} data-viewer-control="next" data-viewer-step>
          Próxima foto
        </a>
      </figure>,
    ),
  );
  const stage = view.container.querySelector<HTMLElement>('.viewer-stage');
  const photo = view.container.querySelector<HTMLElement>('.viewer-photo');
  if (!stage || !photo) throw new Error('the viewer rendered no stage');
  return { ...view, stage, photo, host };
}

const pointer = (x: number, y: number) => ({ pointerId: 1, pointerType: 'touch', button: 0, clientX: x, clientY: y });

function swipeLeft(stage: HTMLElement) {
  fireEvent.pointerDown(stage, pointer(500, 300));
  fireEvent.pointerMove(stage, pointer(480, 300));
  fireEvent.pointerMove(stage, pointer(300, 300));
  fireEvent.pointerUp(stage, pointer(300, 300));
}
function dragDown(stage: HTMLElement) {
  fireEvent.pointerDown(stage, pointer(500, 100));
  fireEvent.pointerMove(stage, pointer(500, 120));
  fireEvent.pointerMove(stage, pointer(500, 400));
  fireEvent.pointerUp(stage, pointer(500, 400));
}

beforeEach(() => {
  router.replace.mockReset();
  router.push.mockReset();
  router.back.mockReset();
  navigate.loadPhotoPage.mockReset();
  navigate.takeRememberedFocus.mockReset();
  navigate.takeRememberedFocus.mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ViewerGestures — stepping in the lightbox', () => {
  it('arrows, Home and End replace the route, with the direction of the step', () => {
    renderViewer({ mode: 'modal' });
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(router.replace).toHaveBeenLastCalledWith(hrefs.next, { scroll: false, transitionTypes: ['photo-next'] });
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(router.replace).toHaveBeenLastCalledWith(hrefs.prev, { scroll: false, transitionTypes: ['photo-prev'] });
    fireEvent.keyDown(document, { key: 'Home' });
    expect(router.replace).toHaveBeenLastCalledWith(hrefs.first, { scroll: false, transitionTypes: ['photo-prev'] });
    fireEvent.keyDown(document, { key: 'End' });
    expect(router.replace).toHaveBeenLastCalledWith(hrefs.last, { scroll: false, transitionTypes: ['photo-next'] });
    expect(router.replace).toHaveBeenCalledTimes(4);
    expect(router.push).not.toHaveBeenCalled();
    expect(navigate.loadPhotoPage).not.toHaveBeenCalled();
  });

  it("leaves the browser's own shortcuts alone", () => {
    renderViewer({ mode: 'modal' });
    fireEvent.keyDown(document, { key: 'ArrowLeft', altKey: true });
    fireEvent.keyDown(document, { key: '+', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'ArrowRight', metaKey: true });
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('Escape belongs to the dialog', () => {
    const { host } = renderViewer({ mode: 'modal' });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(router.push).not.toHaveBeenCalled();
    expect(host?.close).not.toHaveBeenCalled();
  });

  it('tells the dialog which photograph is on show and what to say', () => {
    const { host } = renderViewer({ mode: 'modal' });
    expect(host?.show).toHaveBeenCalledWith({ anchor: 'foto-tres', announcement: '3 de 9. Banda no palco' });
  });

  it('a drag to the left asks for the next photograph; a drag down closes', async () => {
    layout(LARGE);
    const { stage, host } = renderViewer({ mode: 'modal' });
    await screen.findByRole('button', { name: labels.zoomIn });
    swipeLeft(stage);
    expect(router.replace).toHaveBeenLastCalledWith(hrefs.next, { scroll: false, transitionTypes: ['photo-next'] });
    expect(host?.close).not.toHaveBeenCalled();
  });

  it('a drag down closes the lightbox', async () => {
    layout(LARGE);
    const { stage, host } = renderViewer({ mode: 'modal' });
    await screen.findByRole('button', { name: labels.zoomIn });
    dragDown(stage);
    expect(host?.close).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });
});

describe("ViewerGestures — stepping on the photograph's own page", () => {
  // A router navigation from here would be intercepted and open the lightbox
  // over the page: every step is a page load instead.
  it('arrows, Home and End load the other page, never through the router', () => {
    renderViewer({ mode: 'page' });
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(navigate.loadPhotoPage).toHaveBeenLastCalledWith(hrefs.next, null);
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(navigate.loadPhotoPage).toHaveBeenLastCalledWith(hrefs.prev, null);
    fireEvent.keyDown(document, { key: 'Home' });
    expect(navigate.loadPhotoPage).toHaveBeenLastCalledWith(hrefs.first, null);
    fireEvent.keyDown(document, { key: 'End' });
    expect(navigate.loadPhotoPage).toHaveBeenLastCalledWith(hrefs.last, null);
    expect(router.replace).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('a click on a neighbour steps without a history entry and remembers the control', () => {
    renderViewer({ mode: 'page' });
    const next = screen.getByRole('link', { name: 'Próxima foto' });
    const click = createEvent.click(next, { button: 0 });
    fireEvent(next, click);
    expect(click.defaultPrevented).toBe(true);
    expect(navigate.loadPhotoPage).toHaveBeenCalledWith(new URL(hrefs.next, window.location.href).href, 'next');
  });

  it("a modified click on a neighbour is the browser's: a new tab", () => {
    renderViewer({ mode: 'page' });
    const next = screen.getByRole('link', { name: 'Próxima foto' });
    // Read what the viewer decided, then stop jsdom from trying to navigate.
    let preventedByViewer: boolean | null = null;
    document.addEventListener(
      'click',
      (event) => {
        preventedByViewer = event.defaultPrevented;
        event.preventDefault();
      },
      { once: true },
    );
    fireEvent(next, createEvent.click(next, { button: 0, ctrlKey: true }));
    expect(preventedByViewer).toBe(false);
    expect(navigate.loadPhotoPage).not.toHaveBeenCalled();
  });

  it('hands the focus to the control remembered across the page load', () => {
    navigate.takeRememberedFocus.mockReturnValue('next');
    renderViewer({ mode: 'page' });
    expect(screen.getByRole('link', { name: 'Próxima foto' })).toHaveFocus();
  });

  it('Escape goes to the gallery, at the thumbnail', () => {
    renderViewer({ mode: 'page' });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(router.push).toHaveBeenCalledWith(hrefs.back);
  });

  it('a drag to the left loads the next page; a drag down is left to the page', async () => {
    layout(LARGE);
    const { stage } = renderViewer({ mode: 'page' });
    await screen.findByRole('button', { name: labels.zoomIn });
    dragDown(stage);
    expect(navigate.loadPhotoPage).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();

    swipeLeft(stage);
    expect(navigate.loadPhotoPage).toHaveBeenLastCalledWith(hrefs.next, null);
  });
});

describe('ViewerGestures — zoom', () => {
  it('offers zoom when the file has pixels to spare, and steps it with + − 0', async () => {
    layout(LARGE);
    const { photo } = renderViewer();
    const zoomOut = await screen.findByRole('button', { name: labels.zoomOut });
    const zoomIn = screen.getByRole('button', { name: labels.zoomIn });
    // Dimmed, not disabled: a dead button would drop the keyboard's focus.
    expect(zoomOut).toHaveAttribute('aria-disabled', 'true');
    expect(zoomOut).not.toBeDisabled();
    expect(zoomIn).toHaveAttribute('aria-disabled', 'false');

    fireEvent.keyDown(document, { key: '+' });
    await waitFor(() => expect(photo.style.transform).toBe('translate(0.00px, 0.00px) scale(1.5000)'));
    expect(zoomOut).toHaveAttribute('aria-disabled', 'false');

    fireEvent.click(zoomIn);
    fireEvent.click(zoomIn);
    await waitFor(() => expect(photo.style.transform).toContain('scale(3.0000)'));
    // The file's own resolution is the limit.
    expect(zoomIn).toHaveAttribute('aria-disabled', 'true');

    fireEvent.keyDown(document, { key: '-' });
    await waitFor(() => expect(photo.style.transform).toContain('scale(2.0000)'));

    fireEvent.keyDown(document, { key: '0' });
    await waitFor(() => expect(photo.style.transform).toBe(''));
    expect(zoomOut).toHaveAttribute('aria-disabled', 'true');
  });

  it('asks the browser for a larger file once magnified, never beyond the file', async () => {
    layout(LARGE);
    renderViewer();
    const img = screen.getByRole('img', { name: 'Banda no palco' });
    expect(img.getAttribute('sizes')).toContain('100vw');

    await screen.findByRole('button', { name: labels.zoomIn });
    fireEvent.keyDown(document, { key: '+' });
    await waitFor(() => expect(img).toHaveAttribute('sizes', '1350px'));

    for (let i = 0; i < 4; i += 1) fireEvent.keyDown(document, { key: '+' });
    await waitFor(() => expect(img).toHaveAttribute('sizes', '2700px'));
  });

  it('shows a 400×300 flyer at its own size, with no zoom at all', async () => {
    layout(FLYER);
    const { photo } = renderViewer({ aspect: '400/300' });
    // Wait for the geometry to be measured: the share control is always there.
    await screen.findByRole('button', { name: labels.share });
    await Promise.resolve();
    expect(screen.queryByRole('button', { name: labels.zoomIn })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: labels.zoomOut })).not.toBeInTheDocument();

    fireEvent.keyDown(document, { key: '+' });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(photo.style.transform).toBe('');
    expect(screen.getByRole('img', { name: 'Banda no palco' })).toHaveAttribute('sizes', '(min-width: 400px) 400px, 100vw');
  });
});

describe('ViewerGestures — pointer', () => {
  it('a pointer that only hovers does nothing', () => {
    const { stage, photo } = renderViewer();
    fireEvent.pointerMove(stage, pointer(100, 100));
    fireEvent.pointerUp(stage, pointer(100, 100));
    expect(photo.style.transform).toBe('');
    expect(router.replace).not.toHaveBeenCalled();
    expect(navigate.loadPhotoPage).not.toHaveBeenCalled();
  });
});

describe('ViewerGestures — share', () => {
  it('copies the photograph’s own address when the browser has no share sheet', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    renderViewer();
    fireEvent.click(screen.getByRole('button', { name: labels.share }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(labels.copied));
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}${hrefs.self}`);
  });

  it('uses the share sheet when there is one', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn();
    vi.stubGlobal('navigator', { share, clipboard: { writeText } });
    renderViewer();
    fireEvent.click(screen.getByRole('button', { name: labels.share }));
    await waitFor(() => expect(share).toHaveBeenCalledWith({ title: 'Banda no palco', url: `${window.location.origin}${hrefs.self}` }));
    expect(writeText).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('says what to do when the address cannot be copied either', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    renderViewer();
    fireEvent.click(screen.getByRole('button', { name: labels.share }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(labels.shareFailed));
  });
});
