// The two things the viewer asks of the browser itself: an address without a
// fragment under the lightbox, and the focus carried across a page load.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { dropFragment, takeRememberedFocus } from '../navigate';

const FOCUS_KEY = 'freeband:viewer-focus';

afterEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
  window.history.replaceState(null, '', '/');
});

describe('dropFragment', () => {
  it('takes the fragment off the current entry, in place', () => {
    window.history.replaceState(null, '', '/palco?x=1#ato-efeitos');
    const entries = window.history.length;
    dropFragment();
    expect(window.location.pathname + window.location.search).toBe('/palco?x=1');
    expect(window.location.hash).toBe('');
    // Replaced, not pushed: "back" from the lightbox must land here.
    expect(window.history.length).toBe(entries);
  });

  it('leaves an address without a fragment alone', () => {
    window.history.replaceState(null, '', '/palco');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    dropFragment();
    expect(replaceState).not.toHaveBeenCalled();
  });
});

describe('takeRememberedFocus', () => {
  const remember = (value: unknown) => sessionStorage.setItem(FOCUS_KEY, JSON.stringify(value));

  it('returns the control once, then forgets it', () => {
    remember({ focus: 'next', at: Date.now() });
    expect(takeRememberedFocus()).toBe('next');
    expect(takeRememberedFocus()).toBeNull();
  });

  it('ignores a control remembered for an earlier page load', () => {
    remember({ focus: 'next', at: Date.now() - 60_000 });
    expect(takeRememberedFocus()).toBeNull();
    expect(sessionStorage.getItem(FOCUS_KEY)).toBeNull();
  });

  it('ignores anything that is not what it wrote', () => {
    sessionStorage.setItem(FOCUS_KEY, 'not json');
    expect(takeRememberedFocus()).toBeNull();
    remember({ focus: 3, at: 'now' });
    expect(takeRememberedFocus()).toBeNull();
  });

  it('is null when nothing was remembered', () => {
    expect(takeRememberedFocus()).toBeNull();
  });
});
