// src/hooks/useInertOutside.ts
// While a dialog is open, the rest of the page is out of reach: not
// focusable, not clickable, not read. `aria-modal` only asks assistive tech to
// behave that way; `inert` makes the browser do it. Everything that is not an
// ancestor of the dialog (or of an element in `keep`) gets the attribute, and
// loses it again on close — unless it was inert already, which is left alone.
import { useEffect, type RefObject } from 'react';

/** Every element that must stay live: each target and all of its ancestors. */
function lineage(targets: Element[]): Set<Element> {
  const live = new Set<Element>();
  for (const target of targets) {
    for (let el: Element | null = target; el; el = el.parentElement) live.add(el);
  }
  return live;
}

export function useInertOutside(
  dialog: RefObject<Element | null>,
  active: boolean,
  keep: RefObject<Element | null>[] = [],
): void {
  useEffect(() => {
    const root = dialog.current;
    if (!active || !root) return;
    const targets = [root, ...keep.map((ref) => ref.current)].filter((el): el is Element => el !== null);
    const live = lineage(targets);
    const silenced: Element[] = [];
    // Walk down from <body> along the live branches, silencing what hangs off them.
    const visit = (parent: Element) => {
      for (const child of Array.from(parent.children)) {
        if (targets.includes(child)) continue;
        if (live.has(child)) visit(child);
        else if (!child.hasAttribute('inert')) {
          child.setAttribute('inert', '');
          silenced.push(child);
        }
      }
    };
    visit(document.body);
    return () => {
      for (const el of silenced) el.removeAttribute('inert');
    };
    // `keep` is a list of stable refs: its identity changes every render, its
    // contents do not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog, active]);
}
