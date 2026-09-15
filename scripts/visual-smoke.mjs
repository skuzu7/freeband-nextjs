// Visual smoke test. Loads every route at desktop (1440) and phone (390)
// widths, saves PNGs to ./screenshots/ (gitignored), and fails on: a console
// error, horizontal overflow, a photograph whose box does not match its file's
// aspect (i.e. a crop), one photograph covering another, a lightbox picture
// that does not fit the room its chrome leaves it, or the protected route not
// being reached through the legacy token link. Not wired into vitest — run
// with `npm run smoke` while a server is up.
//
//   BASE_URL              server to hit (default http://localhost:3000)
//   ORCAMENTO_TOKEN       legacy token for /orcamento/<token> (from .env.local)
//   PUPPETEER_BROWSER_URL attach to a running Chrome (e.g. http://127.0.0.1:9222)
//                         instead of launching one
//   SMOKE_OUT             output directory (default screenshots)
import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'node:fs';

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

// The lightbox is checked on two shapes the routes above do not cover. A short
// phone, where the caption wraps to a second line and a near-square flyer is
// the tightest fit there is: this is where a guessed chrome height shows up as
// a picture taller than its room. And a wide, short window, where the picture
// is limited by width rather than by height, which is where sizing it by
// height alone could clamp it into the wrong aspect.
const LIGHTBOX_VIEWPORTS = {
  'phone-short': { width: 320, height: 480, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  'desktop-short': { width: 1440, height: 720, deviceScaleFactor: 1 },
};

const failures = [];

async function navigate(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
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
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, SETTLE_MS));
}

/**
 * Layout checks that hold on every page: no horizontal overflow, no cropped
 * photo, and no photograph sitting on top of another. The crop audit compares
 * each box to its file and so cannot see occlusion; a picture half covered by
 * a second picture is just as much "not shown whole".
 */
async function audit(page, label) {
  const result = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const cropped = [];
    const boxes = [];
    // data-backdrop marks the one photograph allowed to bleed (the fold's
    // stage poster under its scrim); everything else must show whole.
    for (const img of document.querySelectorAll('main img:not([data-backdrop])')) {
      if (!img.naturalWidth || !img.parentElement) continue;
      const box = img.parentElement.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      const boxRatio = box.width / box.height;
      const fileRatio = img.naturalWidth / img.naturalHeight;
      if (Math.abs(boxRatio - fileRatio) / fileRatio > 0.03) cropped.push(img.getAttribute('src'));
      boxes.push({ src: img.getAttribute('src'), box });
    }
    // Overlap is symmetric, so each pair is tested once. A shared edge is not
    // an overlap: two frames of a plate touch when the gap is zero.
    const covered = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].box;
        const b = boxes[j].box;
        const dx = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const dy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (dx > 1 && dy > 1) covered.push(`${boxes[i].src} over ${boxes[j].src}`);
      }
    }
    return { overflow, cropped, covered };
  });
  if (result.overflow > 1) failures.push(`${label}: horizontal overflow of ${result.overflow}px`);
  for (const src of result.cropped) failures.push(`${label}: cropped photograph ${src}`);
  for (const pair of result.covered) failures.push(`${label}: photographs overlap — ${pair}`);
}

/**
 * The archive's lightbox. The picture is sized by the room the two bars leave
 * it, so on every flyer and every viewport it has to fit inside that area —
 * a caption wrapping to a second line takes its space from the picture, never
 * pushes it off the screen — while keeping its file's aspect.
 */
async function auditLightbox(page, label) {
  const openers = await page.$$('main .plate li button');
  if (openers.length === 0) {
    failures.push(`${label}: no flyer opened a lightbox`);
    return;
  }
  for (let i = 0; i < openers.length; i++) {
    await openers[i].click();
    const problem = await page.evaluate(async () => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return 'lightbox did not open';
      const img = dialog.querySelector('img');
      if (!img) return 'lightbox has no picture';
      // The larger variant is fetched on open; measure only once it is there.
      for (let t = 0; t < 100 && !(img.complete && img.naturalWidth); t++) {
        await new Promise((r) => setTimeout(r, 50));
      }
      if (!img.naturalWidth) return 'lightbox picture never loaded';
      const name = img.getAttribute('src');
      const picture = img.parentElement.getBoundingClientRect();
      // The dialog's own children are the dot field, the top bar, the picture
      // area and the caption bar; the one holding the picture is the room it
      // is allowed to take, and the one holding the heading is the bar it must
      // never reach. Found by containment, so no class name is load-bearing.
      const children = [...dialog.children];
      const area = children.find((el) => el.contains(img));
      const captionBar = children.find((el) => el.querySelector('h2'));
      if (!area || !captionBar) return `${name}: could not find the picture area or the caption bar`;
      const room = area.getBoundingClientRect();
      if (picture.height - room.height > 1 || picture.width - room.width > 1) {
        return `${name} is ${Math.round(picture.width)}×${Math.round(picture.height)} in a ${Math.round(
          room.width,
        )}×${Math.round(room.height)} space`;
      }
      if (picture.bottom - captionBar.getBoundingClientRect().top > 1) return `${name} runs into the caption`;
      const fileRatio = img.naturalWidth / img.naturalHeight;
      const boxRatio = picture.width / picture.height;
      if (Math.abs(boxRatio - fileRatio) / fileRatio > 0.03) return `${name} is cropped in the lightbox`;
      if (dialog.scrollHeight - dialog.clientHeight > 1) return `${name} makes the lightbox scroll`;
      return null;
    });
    if (problem) failures.push(`${label}: ${problem}`);
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 80));
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
  page.on('console', (msg) => {
    if (msg.type() === 'error') failures.push(`console error on ${page.url()}: ${msg.text()}`);
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
      await page.screenshot({ path: `${OUT}/${slug}-${name}.png`, fullPage: route !== '/' || name === 'desktop' });
    }
  }

  for (const [name, viewport] of Object.entries(LIGHTBOX_VIEWPORTS)) {
    console.log(`> /arquivo lightbox (${name})`);
    await page.setViewport(viewport);
    await navigate(page, `${BASE}/arquivo`);
    await auditLightbox(page, `/arquivo lightbox @${name}`);
  }

  console.log('> /orcamento via legacy token (desktop)');
  await page.setViewport(VIEWPORTS.desktop);
  await navigate(page, `${BASE}/orcamento/${TOKEN}`);
  if (new URL(page.url()).pathname !== '/orcamento') {
    failures.push(`protected smoke did not reach /orcamento (landed on ${page.url()})`);
  } else {
    await audit(page, '/orcamento @desktop');
    await page.screenshot({ path: `${OUT}/orcamento-desktop.png`, fullPage: false });
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
  console.log(
    `✓ ${PUBLIC_ROUTES.length * 2 + 1} pages clean, lightbox checked at ${
      Object.keys(LIGHTBOX_VIEWPORTS).length
    } sizes; screenshots in ${OUT}`,
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
