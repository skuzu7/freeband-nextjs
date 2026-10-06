// scripts/social/browser.mjs
// The two functions build.mjs runs INSIDE the page. Puppeteer serialises them
// and calls them in the browser, so they see the DOM and nothing from Node:
// whatever they need arrives as their one argument, and whatever they find
// goes back as plain JSON.

/**
 * Sizes each headline and aims the wall's light.
 *
 * A headline starts at its layout's largest size (--head-max in cards.css)
 * and steps down until every line fits the card's width and the card's last
 * element still ends inside the padding — the photograph's plate has a floor
 * (--plate-min), so a headline cannot grow by starving the photograph. The
 * result is written on the card as --head, and the --pool-* variables are set
 * to the box of the photograph, which is what the wall lights.
 *
 * Returns the size chosen for each card. A card that still does not fit at
 * `minHead` is left for auditCards to report.
 */
export function fitCards({ minHead, step }) {
  const px = (value) => Number.parseFloat(value) || 0;

  return [...document.querySelectorAll('.card')].map((card) => {
    const head = card.querySelector('.head');
    const foot = card.querySelector('.foot');
    const img = card.querySelector('.plate img');
    // Marked before anything is measured: cards.css gives a portrait a taller plate.
    if (img && img.naturalHeight > img.naturalWidth) card.classList.add('card--portrait');
    const style = getComputedStyle(card);
    const floor = () => card.getBoundingClientRect().bottom - px(style.paddingBottom);
    const tooBig = () => head.scrollWidth > head.clientWidth + 1 || foot.getBoundingClientRect().bottom > floor() + 0.5;

    let size = px(style.getPropertyValue('--head-max'));
    card.style.setProperty('--head', `${size}px`);
    while (tooBig() && size > minHead) {
      size -= step;
      card.style.setProperty('--head', `${size}px`);
    }

    if (img) {
      const box = card.getBoundingClientRect();
      const target = img.getBoundingClientRect();
      card.style.setProperty('--pool-x', `${Math.round(target.left - box.left + target.width / 2)}px`);
      card.style.setProperty('--pool-y', `${Math.round(target.top - box.top + target.height / 2)}px`);
      card.style.setProperty('--pool-rx', `${Math.round(target.width / 2 + 150)}px`);
      card.style.setProperty('--pool-ry', `${Math.round(target.height / 2 + 130)}px`);
    }

    return { id: card.id, head: size };
  });
}

/**
 * Measures every card as it will be photographed. For each one:
 *
 *   width, height  the canvas itself
 *   overflow       every piece of text that leaves the card's padding box or
 *                  is wider than its own box (a line that did not fit)
 *   photo          the photograph's file size and drawn size, and whether it
 *                  is whole: loaded, inside the card, drawn at its own ratio
 *                  and not enlarged past its pixels
 *   sticker        where the space kept free for a native sticker sits
 *
 * `fonts` is checked once for the document: each weight the cards use has to
 * be the embedded Outfit, not a fallback the browser picked in silence.
 */
export function auditCards({ weights }) {
  const px = (value) => Number.parseFloat(value) || 0;
  const round = (value) => Math.round(value * 10) / 10;
  const name = (el) => `.${[...el.classList].join('.')}`;

  const cards = [...document.querySelectorAll('.card')].map((card) => {
    const box = card.getBoundingClientRect();
    const style = getComputedStyle(card);
    const inner = {
      left: box.left + px(style.paddingLeft),
      right: box.right - px(style.paddingRight),
      top: box.top + px(style.paddingTop),
      bottom: box.bottom - px(style.paddingBottom),
    };
    const outside = (r, limit) =>
      r.left < limit.left - 0.5 || r.right > limit.right + 0.5 || r.top < limit.top - 0.5 || r.bottom > limit.bottom + 0.5;

    const overflow = [];
    for (const el of card.querySelectorAll('.lockup, .signature, .tag, .head, .sub, .items li, .foot__text, .mark')) {
      const r = el.getBoundingClientRect();
      if (outside(r, inner) || el.scrollWidth > el.clientWidth + 1) overflow.push(name(el));
    }

    const img = card.querySelector('.plate img');
    let photo = null;
    if (img) {
      const r = img.getBoundingClientRect();
      const loaded = img.complete && img.naturalWidth > 0;
      const natural = loaded ? img.naturalWidth / img.naturalHeight : 0;
      const sameRatio = loaded && Math.abs(r.width / r.height / natural - 1) < 0.01;
      const fill = getComputedStyle(img).objectFit === 'fill';
      const enlarged = r.width > img.naturalWidth + 1;
      photo = {
        key: img.dataset.photo,
        file: [img.naturalWidth, img.naturalHeight],
        drawn: [round(r.width), round(r.height)],
        whole: loaded && sameRatio && fill && !enlarged && !outside(r, box),
      };
    }

    const stickerEl = card.querySelector('.sticker');
    const sticker = stickerEl
      ? { top: round(stickerEl.getBoundingClientRect().top - box.top), bottom: round(stickerEl.getBoundingClientRect().bottom - box.top) }
      : null;

    return {
      id: card.id,
      format: card.dataset.format,
      width: box.width,
      height: box.height,
      head: px(card.style.getPropertyValue('--head')),
      overflow,
      photo,
      sticker,
    };
  });

  // document.fonts.check() answers true for a family nobody declared, so the
  // faces themselves are asked: declared as Outfit, and actually loaded.
  const loaded = new Set(
    [...document.fonts]
      .filter((face) => face.family.replace(/["']/g, '') === 'Outfit' && face.status === 'loaded')
      .map((face) => String(face.weight)),
  );
  const fonts = Object.fromEntries(weights.map((weight) => [weight, loaded.has(String(weight))]));
  return { cards, fonts };
}
