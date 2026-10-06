// Visual smoke test. Loads every route at desktop (1440) and phone (390)
// widths, saves PNGs to ./screenshots/ (gitignored), and fails on: a route
// that does not answer 200, a console error, horizontal overflow, a photograph
// whose box does not match its file's aspect (i.e. a crop), a control on a
// phone smaller than a thumb, an unknown address not answering 404 inside the
// site's shell, a page that needs JavaScript to show its heading or its
// photographs, the protected route not being reached through the legacy token
// link, its A4 preview collapsing, a 320px phone scrolling sideways, or the
// portfolio button not producing a PDF, an accessibility violation axe-core
// rates serious or critical (WCAG 2.2 A and AA), the photo viewer not opening
// over the gallery at the photograph's own address (or that address, loaded
// cold, not being a page), a clip playing before it is asked to or two
// sounding at once, or a share card that is missing, the wrong size or too
// heavy for a link preview. Not wired into vitest — run with
// `npm run smoke` while a server is up.
//
//   BASE_URL              server to hit (default http://localhost:3000)
//   ORCAMENTO_TOKEN       legacy token for /orcamento/<token> (from .env.local)
//   PUPPETEER_BROWSER_URL attach to a running Chrome (e.g. http://127.0.0.1:9222)
//                         instead of launching one
//   SMOKE_OUT             output directory (default screenshots)
import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';

// axe-core is evaluated in the page through the DevTools protocol, which the
// site's Content-Security-Policy does not apply to: no exception is carved
// out of the policy for the audit.
const AXE = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const AXE_RULES = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

if (existsSync('.env.local') && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile('.env.local');
}

const OUT = process.env.SMOKE_OUT ?? 'screenshots';
mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const TOKEN = process.env.ORCAMENTO_TOKEN ?? 'dev-token';
const SETTLE_MS = Number(process.env.SMOKE_SETTLE_MS ?? 1500);

const PUBLIC_ROUTES = ['/', '/palco', '/arquivo', '/historia', '/portfolio', '/admin'];
const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const failures = [];

/** A revisit answers 304 (the cached copy still stands): that is the page, served. */
const answered = (response) => !response || response.ok() || response.status() === 304;

async function navigate(page, url) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  // Every audit below passes on an error page, which has no photograph to
  // crop and nothing to overflow: the status has to be checked first.
  if (!answered(response)) failures.push(`${new URL(url).pathname}: answered ${response.status()}`);
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  // Scroll through so lazy images attach, then back to the top.
  await page.evaluate(async () => {
    const step = Math.max(400, innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, 0);
  });
  // A lazy image only starts once the scroll rests near it, and the pass
  // above does not rest: without this the frames further down are still
  // empty when audit() runs, and an empty frame has nothing to measure.
  await page.evaluate(async () => {
    const pending = [];
    for (const img of document.images) {
      img.loading = 'eager';
      if (!img.complete)
        pending.push(
          new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }),
        );
    }
    await Promise.race([Promise.all(pending), new Promise((r) => setTimeout(r, 20000))]);
  });
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, SETTLE_MS));
}

/**
 * Layout checks that hold on every page: no horizontal overflow, every
 * photograph loaded, none cropped, none laid over another.
 */
async function audit(page, label) {
  const result = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const unloaded = [];
    const cropped = [];
    const offPage = [];
    const frames = [];
    const pageWidth = document.documentElement.clientWidth;
    // data-backdrop marks the one photograph allowed to bleed (the fold's
    // stage poster under its scrim); everything else must show whole.
    for (const img of document.querySelectorAll('main img:not([data-backdrop])')) {
      if (!img.parentElement) continue;
      if (!img.naturalWidth) {
        unloaded.push(img.getAttribute('src'));
        continue;
      }
      const box = img.parentElement.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      const boxRatio = box.width / box.height;
      const fileRatio = img.naturalWidth / img.naturalHeight;
      if (Math.abs(boxRatio - fileRatio) / fileRatio > 0.03) cropped.push(img.getAttribute('src'));
      // The body clips what runs past its edge, so a photograph can be cut by
      // the page itself while its own box is whole and nothing scrolls sideways.
      // (A row that scrolls on purpose keeps its frames inside its own scroller.)
      if (!img.closest('.snap-row')) {
        // …or by spilling out of the page column: a plate wider than the track
        // it sits in breaks the margin every other block keeps.
        const column = img.closest('.container-site');
        let left = 0;
        let right = pageWidth;
        if (column) {
          const rect = column.getBoundingClientRect();
          const style = getComputedStyle(column);
          left = rect.left + parseFloat(style.paddingLeft);
          right = rect.right - parseFloat(style.paddingRight);
        }
        if (box.left < left - 1 || box.right > right + 1) offPage.push(img.getAttribute('src'));
      }
      frames.push({ src: img.getAttribute('src'), rect: img.getBoundingClientRect() });
    }
    // A frame tucked over another hides part of it just as a crop would. The
    // smaller of an overlapping pair is the one on top.
    const covered = [];
    for (const under of frames) {
      for (const over of frames) {
        if (over === under) continue;
        if (over.rect.width * over.rect.height >= under.rect.width * under.rect.height) continue;
        const w = Math.min(under.rect.right, over.rect.right) - Math.max(under.rect.left, over.rect.left);
        const h = Math.min(under.rect.bottom, over.rect.bottom) - Math.max(under.rect.top, over.rect.top);
        if (w > 1 && h > 1 && (w * h) / (under.rect.width * under.rect.height) > 0.01)
          covered.push(`${under.src} under ${over.src}`);
      }
    }
    return { overflow, unloaded, cropped, offPage, covered };
  });
  if (result.overflow > 1) failures.push(`${label}: horizontal overflow of ${result.overflow}px`);
  for (const src of result.unloaded) failures.push(`${label}: photograph did not load ${src}`);
  for (const src of result.cropped) failures.push(`${label}: cropped photograph ${src}`);
  for (const src of result.offPage) failures.push(`${label}: photograph runs out of its column ${src}`);
  for (const pair of result.covered) failures.push(`${label}: covered photograph ${pair}`);
}

/**
 * The automated half of an accessibility review: what axe-core can decide by
 * reading the rendered page (names, roles, contrast, structure). Serious and
 * critical findings fail the run; the rest are printed for a person to weigh.
 * It does not replace a keyboard pass or a screen reader.
 */
async function auditAccessibility(page, label) {
  await page.evaluate(AXE);
  const violations = await page.evaluate(async (tags) => {
    const result = await window.axe.run(document, { runOnly: { type: 'tag', values: tags } });
    return result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      first: v.nodes[0]?.target?.join(' ') ?? '',
    }));
  }, AXE_RULES);
  for (const v of violations) {
    const line = `${label}: axe ${v.id} (${v.impact}) — ${v.help} [${v.nodes}× e.g. ${v.first}]`;
    if (v.impact === 'serious' || v.impact === 'critical') failures.push(line);
    else console.log(`   note: ${line}`);
  }
}

/**
 * On a phone every control is at least one thumb wide and tall (44px, the
 * `tap` utility). A link set inline in a sentence is the one exception: it
 * takes the height of its line.
 */
async function auditTapTargets(page, label) {
  const small = await page.evaluate(() => {
    const MIN = 43.5;
    const out = [];
    const controls =
      'header a[href], header button, main a[href], main button, footer a[href], footer button, [role="dialog"] a[href], [role="dialog"] button';
    for (const el of document.querySelectorAll(controls)) {
      const style = getComputedStyle(el);
      if (style.display === 'inline' || style.visibility === 'hidden') continue;
      const rect = el.getBoundingClientRect();
      // Not rendered (a desktop-only control, a closed panel) or parked off-screen for screen readers.
      if (rect.width < 2 || rect.height < 2) continue;
      if (rect.width < MIN || rect.height < MIN) {
        const name = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
        out.push(`"${name}" ${Math.round(rect.width)}×${Math.round(rect.height)}`);
      }
    }
    return out;
  });
  for (const target of small) failures.push(`${label}: tap target under 44px — ${target}`);
}

/**
 * The site has to read without JavaScript: the heading, every photograph and
 * the wordmark are in the HTML the server sends, and nothing waits on a script
 * to become visible.
 */
async function auditWithoutScripts(browser) {
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport(VIEWPORTS.desktop);
  for (const route of PUBLIC_ROUTES.filter((r) => r !== '/admin')) {
    console.log(`> ${route} (no JavaScript)`);
    const response = await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 60000 });
    if (!response || !answered(response)) {
      failures.push(`${route} without JS: answered ${response?.status() ?? 'nothing'}`);
      continue;
    }
    // With scripting off the page has no timers either: a wait inside
    // page.evaluate would never return. The pauses are taken out here.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 720) {
      await page.evaluate((top) => scrollTo(0, top), y);
      await new Promise((r) => setTimeout(r, 60));
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});

    // Content further down enters on a scroll-driven animation (CSS, so it
    // runs without scripts): it is transparent until it scrolls into view.
    // Each photograph and heading is therefore judged where a reader meets it
    // — brought to the middle of the screen first.
    const count = await page.evaluate(() => {
      window.__audited = [...document.querySelectorAll('main img, main h2, main h3, [role="img"][aria-label="Freeband"] .led-wordmark-acrylic')];
      return window.__audited.length;
    });
    const report = { missing: [], hidden: [], hiddenHeadings: [], wordmark: null };
    for (let i = 0; i < count; i++) {
      // `instant`: the site scrolls smoothly, and a smooth scroll would still
      // be on its way when the opacity is read.
      await page.evaluate((n) => window.__audited[n].scrollIntoView({ block: 'center', behavior: 'instant' }), i);
      await new Promise((r) => setTimeout(r, 80));
      const seen = await page.evaluate((n) => {
        const el = window.__audited[n];
        let shown = true;
        for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
          const style = getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.99) shown = false;
        }
        const isImage = el.tagName === 'IMG';
        return {
          kind: isImage ? 'image' : el.classList.contains('led-wordmark-acrylic') ? 'wordmark' : 'heading',
          name: isImage ? el.getAttribute('src') : (el.textContent ?? '').trim().slice(0, 40),
          loaded: !isImage || el.naturalWidth > 0,
          shown,
        };
      }, i);
      if (seen.kind === 'wordmark') report.wordmark = seen.shown;
      else if (seen.kind === 'image') {
        if (!seen.loaded) report.missing.push(seen.name);
        else if (!seen.shown) report.hidden.push(seen.name);
      } else if (!seen.shown) report.hiddenHeadings.push(seen.name);
    }
    const headings = await page.evaluate(() => document.querySelectorAll('main h1').length);

    if (headings !== 1) failures.push(`${route} without JS: expected one <h1>, found ${headings}`);
    for (const src of report.missing) failures.push(`${route} without JS: photograph did not load ${src}`);
    for (const src of report.hidden) failures.push(`${route} without JS: photograph hidden ${src}`);
    for (const text of report.hiddenHeadings) failures.push(`${route} without JS: heading hidden "${text}"`);
    if (route === '/' && report.wordmark !== true) failures.push('/ without JS: the wordmark is not visible');
  }
  await page.close();
}

/** An address nobody serves answers 404, inside the shell of the site. */
async function auditNotFound(page) {
  const response = await page.goto(`${BASE}/endereco-que-nao-existe`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (response?.status() !== 404) failures.push(`unknown address answered ${response?.status() ?? 'nothing'}, not 404`);
  const shell = await page.evaluate(() => ({
    nav: document.querySelectorAll('header nav a[href]').length,
    heading: document.querySelectorAll('main h1').length,
  }));
  if (!shell.nav) failures.push('the 404 page has no navigation');
  if (shell.heading !== 1) failures.push('the 404 page has no <h1>');
}

/**
 * The A4 preview is sized by hand from its content; a measuring loop that
 * feeds on its own output collapses it to nothing while the page still loads
 * without an error. The sheet must stand at least one scaled page tall.
 */
async function auditPreview(page, label) {
  const result = await page.evaluate(() => {
    const frame = document.querySelector('[style*="container-type"]');
    if (!frame) return { missing: true };
    const { width, height } = frame.getBoundingClientRect();
    return { width, height };
  });
  if (result.missing) failures.push(`${label}: the A4 preview frame is missing`);
  // 297/210 is the A4 ratio; allow a little for borders and rounding.
  else if (result.height < result.width * (297 / 210) * 0.95)
    failures.push(`${label}: the A4 preview is ${Math.round(result.height)}px tall for ${Math.round(result.width)}px wide`);
}

/**
 * The portfolio button must hand over a real PDF. Run against `next start`
 * this exercises the production CSP too: a policy that blocks the PDF
 * engine's WebAssembly passes every page load and still fails here.
 */
async function auditPdfDownload(page) {
  const dir = mkdtempSync(path.join(tmpdir(), 'smoke-pdf-'));
  try {
    const cdp = await page.createCDPSession();
    await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: dir });
    await navigate(page, `${BASE}/portfolio`);
    const button = await page.waitForSelector('main button:not([disabled])', { timeout: 60000 });
    await button.click();
    const deadline = Date.now() + 60000;
    let file;
    while (Date.now() < deadline && !file) {
      file = readdirSync(dir).find((f) => f.endsWith('.pdf'));
      if (!file) await new Promise((r) => setTimeout(r, 500));
    }
    if (!file) failures.push('/portfolio: the download button produced no PDF within 60s');
    else if (readFileSync(path.join(dir, file)).subarray(0, 5).toString() !== '%PDF-')
      failures.push(`/portfolio: ${file} is not a PDF`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * The photo viewer. Opened from the gallery it is a dialog over the page, at
 * the photograph's own address; that address loaded cold is a page of its
 * own; a flyer scanned small is shown at its size, never blown up.
 */
async function auditGallery(page) {
  await navigate(page, `${BASE}/palco`);
  const thumb = await page.$('a.photo-link');
  if (!thumb) {
    failures.push('/palco: no photograph links to the viewer');
    return;
  }
  const href = await thumb.evaluate((a) => a.getAttribute('href'));
  await thumb.click();
  await page.waitForSelector('[role="dialog"]', { timeout: 15000 }).catch(() => {});
  // The dialog mounts first; making the page behind it inert and wiring the
  // keys happen in the effect that follows. Wait for that, then judge.
  await page.waitForFunction(() => document.querySelector('main')?.hasAttribute('inert'), { timeout: 5000 }).catch(() => {});
  const opened = await page.evaluate(() => ({
    dialog: Boolean(document.querySelector('[role="dialog"]')),
    path: location.pathname,
    inert: document.querySelector('main')?.hasAttribute('inert') ?? false,
    galleryBehind: Boolean(document.querySelector('a.photo-link')),
  }));
  if (!opened.dialog) failures.push('viewer: clicking a photograph opened no dialog');
  if (opened.path !== href) failures.push(`viewer: the address is ${opened.path}, not ${href}`);
  if (!opened.inert) failures.push('viewer: the page behind the dialog is not inert');
  if (!opened.galleryBehind) failures.push('viewer: the gallery behind the dialog was unmounted');

  await page.keyboard.press('ArrowRight');
  await page.waitForFunction((from) => location.pathname !== from, { timeout: 15000 }, href).catch(() => {});
  const stepped = await page.evaluate(() => ({ path: location.pathname, dialog: Boolean(document.querySelector('[role="dialog"]')) }));
  if (stepped.path === href || !stepped.path.startsWith('/palco/foto/')) failures.push(`viewer: → did not move to the next photograph (at ${stepped.path})`);
  if (!stepped.dialog) failures.push('viewer: the dialog closed on →');

  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout: 15000 }).catch(() => {});
  const closed = await page.evaluate(() => ({
    dialog: Boolean(document.querySelector('[role="dialog"]')),
    path: location.pathname,
    inert: document.querySelector('main')?.hasAttribute('inert') ?? false,
    focusOnThumb: document.activeElement?.classList.contains('photo-link') ?? false,
  }));
  if (closed.dialog) failures.push('viewer: Escape left the dialog open');
  if (closed.path !== '/palco') failures.push(`viewer: closing left the address at ${closed.path}`);
  if (closed.inert) failures.push('viewer: the page stayed inert after closing');
  if (!closed.focusOnThumb) failures.push('viewer: focus did not return to a photograph of the gallery');

  console.log(`> ${href} (loaded cold)`);
  await navigate(page, `${BASE}${href}`);
  const cold = await page.evaluate(() => ({
    dialog: Boolean(document.querySelector('[role="dialog"]')),
    page: Boolean(document.querySelector('figure.viewer[data-mode="page"]')),
    headings: document.querySelectorAll('main h1').length,
  }));
  if (cold.dialog) failures.push(`${href}: loaded cold, it opened a dialog instead of a page`);
  if (!cold.page) failures.push(`${href}: loaded cold, there is no photo page`);
  if (cold.headings !== 1) failures.push(`${href}: expected one <h1>, found ${cold.headings}`);
  await audit(page, `${href} @desktop`);
  await auditAccessibility(page, `${href} @desktop`);

  const small = '/arquivo/cartaz/reveillom-itatinga';
  console.log(`> ${small} (a 400×300 scan)`);
  await navigate(page, `${BASE}${small}`);
  const flyer = await page.evaluate(async () => {
    const img = document.querySelector('figure.viewer img');
    if (!img) return null;
    // The pixels actually served. With `w` descriptors naturalWidth is divided
    // by the density the browser assumed, so it does not say how big the file is.
    const bitmap = await createImageBitmap(await (await fetch(img.currentSrc)).blob());
    return { shown: img.getBoundingClientRect().width, natural: bitmap.width };
  });
  if (!flyer) failures.push(`${small}: no photograph on the page`);
  else if (flyer.shown > flyer.natural + 1) failures.push(`${small}: a ${flyer.natural}px scan is shown ${Math.round(flyer.shown)}px wide`);
  await audit(page, `${small} @desktop`);
}

/**
 * The clips with sound: nothing plays until asked, a press plays with sound,
 * and starting a second clip stops the first.
 */
async function auditPlayer(page) {
  await navigate(page, `${BASE}/palco`);
  const state = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('.player video')].map((v) => ({
        paused: v.paused,
        muted: v.muted,
        autoplay: v.autoplay,
        time: v.currentTime,
        src: v.currentSrc.split('/').pop() ?? '',
      })),
    );
  const before = await state();
  if (before.length < 2) {
    failures.push(`/palco: expected the clips with sound, found ${before.length} player(s)`);
    return;
  }
  if (before.some((v) => !v.paused || v.autoplay)) failures.push('/palco: a clip is playing, or set to autoplay, before anyone asked');

  // Chrome for Testing, which Puppeteer downloads, may ship without the
  // licensed decoders (AAC, H.264). Where no source can be decoded the clips
  // cannot start and the rest of this audit proves nothing: it says so and
  // stops, rather than pass or fail on a browser that could never play them.
  // PUPPETEER_EXECUTABLE_PATH pointing at Chrome or Edge exercises it.
  const playable = await page.evaluate(() => {
    const probe = document.createElement('video');
    return [...document.querySelectorAll('.player source')].some((source) => probe.canPlayType(source.type) !== '');
  });
  if (!playable) {
    console.log('   note: this browser decodes none of the sources — play, sound and one-at-a-time were NOT checked');
    return;
  }

  const plays = await page.$$('[data-player-control="play"]');
  if (plays.length < 2) {
    failures.push(`/palco: found ${plays.length} play control(s) for ${before.length} players`);
    return;
  }
  await plays[0].click();
  await new Promise((r) => setTimeout(r, 3000));
  const one = await state();
  if (one[0].paused || one[0].time <= 0) failures.push('/palco: pressing play did not start the first clip');
  if (one[0].muted) failures.push('/palco: the first clip plays muted');
  if (!/\.mp4$/.test(one[0].src)) failures.push(`/palco: the first clip is playing an unexpected source (${one[0].src})`);
  if (one.slice(1).some((v) => !v.paused)) failures.push('/palco: another clip started with the first');

  await plays[1].click();
  await new Promise((r) => setTimeout(r, 2000));
  const two = await state();
  if (!two[0].paused) failures.push('/palco: two clips sound at once — the second did not stop the first');
  if (two[1].paused) failures.push('/palco: pressing play did not start the second clip');
  await plays[1].click();
}

/** Width and height of a PNG, read from its header. */
function pngSize(bytes) {
  const isPng = bytes.length > 24 && bytes.subarray(1, 4).toString('latin1') === 'PNG';
  return isPng ? { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) } : null;
}

/**
 * The card a shared link shows. Every public route names its own address and
 * its own picture; the picture is 1200×630 and light enough for a messaging
 * app to fetch (the budget src/lib/og/__tests__/card.test.tsx also holds).
 */
async function auditShareCards(page) {
  for (const route of PUBLIC_ROUTES.filter((r) => r !== '/admin')) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const meta = await page.evaluate(() => ({
      image: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? null,
      url: document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? null,
    }));
    if (!meta.url) failures.push(`${route}: no og:url`);
    if (!meta.image) {
      failures.push(`${route}: no og:image`);
      continue;
    }
    // The tag carries the production domain; the file is asked of this server.
    const response = await fetch(`${BASE}${new URL(meta.image).pathname}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const size = pngSize(bytes);
    if (!response.ok) failures.push(`${route}: its share card answered ${response.status}`);
    else if (!size || size.width !== 1200 || size.height !== 630) failures.push(`${route}: its share card is not a 1200×630 PNG`);
    else if (bytes.length > 300_000) failures.push(`${route}: its share card weighs ${Math.round(bytes.length / 1000)} KB (budget 300 KB)`);
  }
}

async function run() {
  const browser = process.env.PUPPETEER_BROWSER_URL
    ? await puppeteer.connect({ browserURL: process.env.PUPPETEER_BROWSER_URL })
    : await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
  const page = await browser.newPage();
  // The 404 audit asks for an address that does not exist on purpose; the
  // browser logs that as a failed resource.
  let expectMissing = false;
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    if (expectMissing && /404/.test(msg.text())) return;
    failures.push(`console error on ${page.url()}: ${msg.text()}`);
  });
  page.on('pageerror', (err) => failures.push(`page error on ${page.url()}: ${err.message}`));

  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    await page.setViewport(viewport);
    for (const route of PUBLIC_ROUTES) {
      const slug = route === '/' ? 'home' : route.slice(1);
      console.log(`> ${route} (${name})`);
      await navigate(page, `${BASE}${route}`);
      try {
        await audit(page, `${route} @${name}`);
      } catch {
        // A dev-server reload mid-audit detaches the frame; one retry is fair.
        await navigate(page, `${BASE}${route}`);
        await audit(page, `${route} @${name}`);
      }
      if (name === 'mobile') await auditTapTargets(page, `${route} @${name}`);
      await auditAccessibility(page, `${route} @${name}`);
      await page.screenshot({ path: `${OUT}/${slug}-${name}.png`, fullPage: route !== '/' || name === 'desktop' });
    }
  }

  // The narrowest phone still sold: the header's wordmark, CTA and menu
  // button have 280px there, so one extra pixel of padding shows up as a
  // horizontal scroll on every page. One route is enough to catch it.
  console.log('> /palco (320)');
  await page.setViewport({ ...VIEWPORTS.mobile, width: 320, height: 640 });
  await navigate(page, `${BASE}/palco`);
  await audit(page, '/palco @320');

  console.log('> unknown address (404)');
  await page.setViewport(VIEWPORTS.desktop);
  expectMissing = true;
  await auditNotFound(page);
  expectMissing = false;

  await auditWithoutScripts(browser);

  console.log('> photo viewer');
  await page.setViewport(VIEWPORTS.desktop);
  await auditGallery(page);

  console.log('> clips with sound');
  await auditPlayer(page);

  console.log('> share cards');
  await auditShareCards(page);

  console.log('> /portfolio PDF download');
  await page.setViewport(VIEWPORTS.desktop);
  await auditPdfDownload(page);

  console.log('> /orcamento via legacy token (desktop)');
  await page.setViewport(VIEWPORTS.desktop);
  await navigate(page, `${BASE}/orcamento/${TOKEN}`);
  if (new URL(page.url()).pathname !== '/orcamento') {
    failures.push(`protected smoke did not reach /orcamento (landed on ${page.url()})`);
  } else {
    for (const [name, viewport] of Object.entries(VIEWPORTS)) {
      if (name !== 'desktop') {
        console.log(`> /orcamento (${name})`);
        await page.setViewport(viewport);
        await navigate(page, `${BASE}/orcamento`);
      }
      await audit(page, `/orcamento @${name}`);
      await auditPreview(page, `/orcamento @${name}`);
      await page.screenshot({ path: `${OUT}/orcamento-${name}.png`, fullPage: false });
    }
  }

  if (process.env.PUPPETEER_BROWSER_URL) {
    await page.close();
    browser.disconnect();
  } else {
    await browser.close();
  }

  if (failures.length) {
    console.error(`\n✗ ${failures.length} problem(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(`✓ ${PUBLIC_ROUTES.length * 2 + 3} pages clean; screenshots in ${OUT}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
