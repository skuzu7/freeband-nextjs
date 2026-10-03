// Visual smoke test. Loads every route at desktop (1440) and phone (390)
// widths, saves PNGs to ./screenshots/ (gitignored), and fails on: a console
// error, horizontal overflow, a photograph whose box does not match its file's
// aspect (i.e. a crop), the protected route not being reached through the
// legacy token link, its A4 preview collapsing, a 320px phone scrolling
// sideways, or the portfolio button not producing a PDF. Not wired into vitest —
// run with `npm run smoke` while a server is up.
//
//   BASE_URL              server to hit (default http://localhost:3000)
//   ORCAMENTO_TOKEN       legacy token for /orcamento/<token> (from .env.local)
//   PUPPETEER_BROWSER_URL attach to a running Chrome (e.g. http://127.0.0.1:9222)
//                         instead of launching one
//   SMOKE_OUT             output directory (default screenshots)
import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

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
    const frames = [];
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
    return { overflow, unloaded, cropped, covered };
  });
  if (result.overflow > 1) failures.push(`${label}: horizontal overflow of ${result.overflow}px`);
  for (const src of result.unloaded) failures.push(`${label}: photograph did not load ${src}`);
  for (const src of result.cropped) failures.push(`${label}: cropped photograph ${src}`);
  for (const pair of result.covered) failures.push(`${label}: covered photograph ${pair}`);
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

  // The narrowest phone still sold: the header's wordmark, CTA and menu
  // button have 280px there, so one extra pixel of padding shows up as a
  // horizontal scroll on every page. One route is enough to catch it.
  console.log('> /palco (320)');
  await page.setViewport({ ...VIEWPORTS.mobile, width: 320, height: 640 });
  await navigate(page, `${BASE}/palco`);
  await audit(page, '/palco @320');

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
