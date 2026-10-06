// The two hooks every dialog on the site shares: the page behind it is out of
// reach while it is open, and gets everything back when it closes.
import { render } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useBodyScrollLock } from '../useBodyScrollLock';
import { useInertOutside } from '../useInertOutside';

function Page({ open, keepHeader = false }: { open: boolean; keepHeader?: boolean }) {
  const dialog = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  useInertOutside(dialog, open, keepHeader ? [header] : []);
  useBodyScrollLock(open);
  return (
    <>
      <header ref={header} data-testid="header" />
      <main data-testid="main">
        <aside data-testid="already" inert />
      </main>
      <div data-testid="wrapper">
        <p data-testid="sibling" />
        {open && <div ref={dialog} data-testid="dialog" />}
      </div>
      <footer data-testid="footer" />
    </>
  );
}

const inert = (root: HTMLElement, id: string) => root.querySelector(`[data-testid="${id}"]`)!.hasAttribute('inert');

describe('useInertOutside', () => {
  it('silences everything that is not the dialog or on the way to it', () => {
    const { container } = render(<Page open />);
    expect(inert(container, 'header')).toBe(true);
    expect(inert(container, 'main')).toBe(true);
    expect(inert(container, 'footer')).toBe(true);
    expect(inert(container, 'sibling')).toBe(true);
    expect(inert(container, 'wrapper')).toBe(false);
    expect(inert(container, 'dialog')).toBe(false);
  });

  it('leaves alone what it was asked to keep', () => {
    const { container } = render(<Page open keepHeader />);
    expect(inert(container, 'header')).toBe(false);
    expect(inert(container, 'main')).toBe(true);
  });

  it('gives the page back on close, except what was inert before it opened', () => {
    const { container, rerender } = render(<Page open />);
    rerender(<Page open={false} />);
    for (const id of ['header', 'main', 'footer', 'sibling']) expect(inert(container, id), id).toBe(false);
    expect(inert(container, 'already')).toBe(true);
  });
});

describe('useBodyScrollLock', () => {
  it('locks the page while active and restores what was there', () => {
    document.body.style.overflow = 'clip';
    const { rerender, unmount } = render(<Page open />);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Page open={false} />);
    expect(document.body.style.overflow).toBe('clip');
    rerender(<Page open />);
    unmount();
    expect(document.body.style.overflow).toBe('clip');
    document.body.style.overflow = '';
  });
});
