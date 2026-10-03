// src/lib/focusTrap.ts
// The Tab trap shared by the mobile menu and the lightbox. Called from a
// keydown handler: Tab on the last focusable wraps to the first, Shift+Tab on
// the first wraps to the last, anything else is left to the browser.

export function cycleFocus(event: KeyboardEvent, panel: HTMLElement | null, selector: string): void {
  if (event.key !== 'Tab' || !panel) return;
  const focusables = Array.from(panel.querySelectorAll<HTMLElement>(selector));
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
