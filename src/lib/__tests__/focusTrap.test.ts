import { afterEach, describe, expect, it, vi } from 'vitest';
import { cycleFocus } from '../focusTrap';

const SELECTOR = 'a[href], button:not([disabled])';

// jsdom only moves focus between elements that are attached to the document.
function mountPanel(html: string): HTMLElement {
  const panel = document.createElement('div');
  panel.innerHTML = html;
  document.body.appendChild(panel);
  return panel;
}

function keydown(key: string, shiftKey = false) {
  const event = new KeyboardEvent('keydown', { key, shiftKey, cancelable: true });
  const preventDefault = vi.spyOn(event, 'preventDefault');
  return { event, preventDefault };
}

const THREE = '<a href="/a" id="first">a</a><button id="middle">b</button><button id="last">c</button>';

describe('cycleFocus', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('wraps Tab on the last focusable to the first', () => {
    const panel = mountPanel(THREE);
    panel.querySelector<HTMLElement>('#last')!.focus();
    const { event, preventDefault } = keydown('Tab');

    cycleFocus(event, panel, SELECTOR);

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(panel.querySelector('#first'));
  });

  it('wraps Shift+Tab on the first focusable to the last', () => {
    const panel = mountPanel(THREE);
    panel.querySelector<HTMLElement>('#first')!.focus();
    const { event, preventDefault } = keydown('Tab', true);

    cycleFocus(event, panel, SELECTOR);

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(panel.querySelector('#last'));
  });

  it('leaves Tab on a middle element to the browser', () => {
    const panel = mountPanel(THREE);
    const middle = panel.querySelector<HTMLElement>('#middle')!;
    middle.focus();

    const forward = keydown('Tab');
    cycleFocus(forward.event, panel, SELECTOR);
    const backward = keydown('Tab', true);
    cycleFocus(backward.event, panel, SELECTOR);

    expect(forward.preventDefault).not.toHaveBeenCalled();
    expect(backward.preventDefault).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(middle);
  });

  it('ignores every key other than Tab', () => {
    const panel = mountPanel(THREE);
    const last = panel.querySelector<HTMLElement>('#last')!;
    last.focus();

    for (const key of ['Escape', 'Enter', 'ArrowRight', ' ']) {
      const { event, preventDefault } = keydown(key);
      cycleFocus(event, panel, SELECTOR);
      expect(preventDefault).not.toHaveBeenCalled();
    }
    expect(document.activeElement).toBe(last);
  });

  it('does not throw when the panel is null', () => {
    const { event, preventDefault } = keydown('Tab');

    expect(() => cycleFocus(event, null, SELECTOR)).not.toThrow();
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('does nothing when the panel has no focusables', () => {
    const panel = mountPanel('<p>nothing to focus</p>');
    const { event, preventDefault } = keydown('Tab');

    cycleFocus(event, panel, SELECTOR);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.body);
  });

  it('skips button[disabled] through the button:not([disabled]) selector', () => {
    const panel = mountPanel(
      '<button id="first">a</button><button id="last">b</button><button id="off" disabled>c</button>',
    );
    panel.querySelector<HTMLElement>('#last')!.focus();
    const { event, preventDefault } = keydown('Tab');

    cycleFocus(event, panel, 'button:not([disabled])');

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(panel.querySelector('#first'));
  });
});
