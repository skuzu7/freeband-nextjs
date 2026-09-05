// Visual smoke test. Loads every route at desktop (1440) and phone (390)
// widths, saves PNGs to ./screenshots/ (gitignored), and fails on: a console
// error, horizontal overflow, a photograph whose box does not match its file's
// aspect (i.e. a crop), or the protected route not being reached through the
// legacy token link. Not wired into vitest — run with `npm run smoke` while a
// server is up.
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

/** Layout checks that hold on every page: no horizontal overflow, no cropped photo. */
async function audit(page, label) {
  const result = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const cropped = [];
    // data-backdrop marks the one photograph allowed to bleed (the fold's
    // stage poster under its scrim); everything else must show whole.
    for (const img of document.querySelectorAll('main img:not([data-backdrop])')) {
      if (!img.naturalWidth || !img.parentElement) continue;
      const box = img.parentElement.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      const boxRatio = box.width / box.height;
      const fileRatio = img.naturalWidth / img.naturalHeight;
      if (Math.abs(boxRatio - fileRatio) / fileRatio > 0.03) cropped.push(img.getAttribute('src'));
    }
    return { overflow, cropped };
  });
  if (result.overflow > 1) failures.push(`${label}: horizontal overflow of ${result.overflow}px`);
  for (const src of result.cropped) failures.push(`${label}: cropped photograph ${src}`);
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
  console.log(`✓ ${PUBLIC_ROUTES.length * 2 + 1} pages clean; screenshots in ${OUT}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
