// The lightbox as a dialog: where the focus goes, what the rest of the page
// becomes, what Escape does, and how a new photograph is announced while the
// dialog stays open.
import { useEffect } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LightboxClose, LightboxDialog } from '../LightboxDialog';
import { useViewerHost } from '../host';

const back = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ back }) }));

/** Stands in for the viewer: tells the dialog what is on show, like ViewerGestures. */
function Viewer({ id, caption }: { id: string; caption: string }) {
  const host = useViewerHost();
  useEffect(() => {
    host?.show({ anchor: `foto-${id}`, announcement: caption });
  }, [host, id, caption]);
  return (
    <figure>
      <LightboxClose label="Fechar" />
      <figcaption>{caption}</figcaption>
      <a href={`#depois-de-${id}`} data-viewer-control="next">
        Próxima foto
      </a>
    </figure>
  );
}

const photos = [
  { id: 'um', caption: '1 de 3. Vocais principais' },
  { id: 'dois', caption: '2 de 3. Bloco anos 70' },
  { id: 'fora', caption: '3 de 3. Sem miniatura na página' },
];

/** A gallery page with two thumbnails and the lightbox slot beside it. */
function Page({ open }: { open: number | null }) {
  const photo = open === null ? null : photos[open];
  return (
    <>
      <header data-testid="header">
        <a href="#inicio">Início</a>
      </header>
      <main data-testid="main">
        <a id="foto-um" href="#um">
          Ampliar foto: Vocais principais
        </a>
        <a id="foto-dois" href="#dois">
          Ampliar foto: Bloco anos 70
        </a>
      </main>
      {photo && (
        <LightboxDialog label="Fotos do palco" keys="Setas trocam de foto, Esc fecha.">
          {/* A new route segment per photograph: the viewer is replaced, the dialog is not. */}
          <Viewer key={photo.id} id={photo.id} caption={photo.caption} />
        </LightboxDialog>
      )}
    </>
  );
}

/** The page with the lightbox closed, and the two moves the router makes. */
function mount() {
  const view = render(<Page open={null} />);
  const show = (index: number | null) => view.rerender(<Page open={index} />);
  // router.back() empties the slot: the dialog unmounts.
  back.mockImplementation(() => show(null));
  return {
    show,
    /** Focus a thumbnail, as a click does, then open the lightbox on a photograph. */
    openFrom(thumbnail: HTMLElement, index = 0) {
      thumbnail.focus();
      show(index);
      return screen.getByRole('dialog');
    },
  };
}

const thumbnailOne = () => screen.getByRole('link', { name: /Vocais principais/ });
const thumbnailTwo = () => screen.getByRole('link', { name: /Bloco anos 70/ });

beforeEach(() => {
  back.mockReset();
});

describe('LightboxDialog', () => {
  it('is a labelled modal dialog that describes its keys', () => {
    const dialog = mount().openFrom(thumbnailOne());
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Fotos do palco');
    expect(dialog).toHaveAccessibleDescription('Setas trocam de foto, Esc fecha.');
  });

  it('takes the focus to its close control', () => {
    const dialog = mount().openFrom(thumbnailOne());
    expect(within(dialog).getByRole('button', { name: 'Fechar' })).toHaveFocus();
  });

  it('makes the rest of the page inert and stops it scrolling, and undoes both on close', () => {
    const page = mount();
    const dialog = page.openFrom(thumbnailOne());
    expect(screen.getByTestId('main')).toHaveAttribute('inert');
    expect(screen.getByTestId('header')).toHaveAttribute('inert');
    expect(dialog).not.toHaveAttribute('inert');
    expect(dialog.closest('[inert]')).toBeNull();
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    page.show(null);
    expect(screen.getByTestId('main')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('header')).not.toHaveAttribute('inert');
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });

  it('keeps Tab inside', () => {
    const dialog = mount().openFrom(thumbnailOne());
    const close = within(dialog).getByRole('button', { name: 'Fechar' });
    const next = within(dialog).getByRole('link', { name: 'Próxima foto' });

    next.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(next).toHaveFocus();
  });

  it('Escape goes back in history, and so does the close control', () => {
    const page = mount();
    page.openFrom(thumbnailOne());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(back).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const dialog = page.openFrom(thumbnailOne());
    fireEvent.click(within(dialog).getByRole('button', { name: 'Fechar' }));
    expect(back).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('announces each photograph from one live region that outlives the step', () => {
    const page = mount();
    const dialog = page.openFrom(thumbnailOne());
    const live = dialog.querySelector('[aria-live]');
    expect(live).toHaveAttribute('aria-live', 'polite');
    expect(live).toHaveAttribute('aria-atomic', 'true');
    expect(live).toHaveTextContent(photos[0].caption);

    page.show(1);
    // A live region speaks when its own node gets new text: the node the first
    // caption was in must still be there, now holding the second.
    expect(screen.getByRole('dialog')).toBe(dialog);
    expect(dialog.querySelector('[aria-live]')).toBe(live);
    expect(live).toHaveTextContent(photos[1].caption);
    expect(live).not.toHaveTextContent(photos[0].caption);
  });

  it('hands the focus back to the thumbnail it was opened from', () => {
    const page = mount();
    page.openFrom(thumbnailOne());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(thumbnailOne()).toHaveFocus();
  });

  it('after stepping, hands the focus to the thumbnail of the photograph on show', () => {
    const page = mount();
    page.openFrom(thumbnailOne());
    page.show(1);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(thumbnailTwo()).toHaveFocus();
  });

  it('falls back to whatever opened it when that thumbnail is not on the page', () => {
    const page = mount();
    page.openFrom(thumbnailOne());
    page.show(2);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(thumbnailOne()).toHaveFocus();
  });
});
