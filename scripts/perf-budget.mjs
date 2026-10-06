// Performance budget. Loads every public route in Chrome with the CPU slowed
// four times (a mid-range phone) and fails when a page costs more than it is
// allowed to. Run it against `next start`, never against `next dev`: the dev
// bundle is several times larger and says nothing about what ships.
//
// What is held, per route:
//   JS          uncompressed bytes of every script the first load fetches
//   LCP         largest contentful paint
//   CLS         cumulative layout shift, after scrolling the whole page
//   canvases    one on the home (the WebGL wall on the fold), none elsewhere
//   sound       no clip with an audio track is fetched before the visitor asks
//   long tasks  nothing blocks the main thread for long once the page is up
// and once, for the home: the weight of the fold's poster as served.
//
//   BASE_URL              server to hit (default http://localhost:3000)
//   PUPPETEER_BROWSER_URL attach to a running Chrome instead of launching one
//   PERF_TIMING=report    print LCP and long tasks over budget without failing
//                         (a shared CI runner is slower than the machine the
//                         timings were calibrated on; bytes and layout still fail)
//   PERF_JSON             write the measurements to this file as JSON
import puppeteer from 'puppeteer';
import { writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const ROUTES = ['/', '/palco', '/arquivo', '/historia', '/portfolio'];
const CPU_SLOWDOWN = 4;

const BUDGET = {
  /**
   * Uncompressed script bytes on first load. Measured at 632–664 KB when this
   * budget was set — the same weight the site had before the photo viewer and
   * the player with sound went in (627–664 KB). The budget holds that line.
   */
  jsBytes: 680_000,
  lcpMs: 2500,
  cls: 0.02,
  /** Longest main-thread task after the load event, with the CPU slowed. */
  longTaskMs: 250,
  /** The fold's poster, as the image optimiser serves it to a 1440px screen. */
  posterBytes: 150_000,
};

/**
 * Two routes carry something the others do not.
 *
 * The home starts the WebGL wall on the fold: on a browser that has not made
 * a WebGL context yet, creating one and compiling the shader took 144–290 ms
 * with the CPU slowed four times. It runs once, on idle, and never again in
 * that session.
 *
 * /portfolio exists to hand over a PDF, and it loads the PDF engine
 * (@react-pdf/renderer, about 1.3 MB of script) as soon as the page is up so
 * that the button answers in one press. That engine is the page's budget:
 * measured at 2 021 KB, with one 398 ms task while it is evaluated.
 */
const ROUTE_BUDGET = {
  '/': { longTaskMs: 400 },
  '/portfolio': { jsBytes: 2_100_000, longTaskMs: 500 },
};
const budgetFor = (route) => ({ ...BUDGET, ...(ROUTE_BUDGET[route] ?? {}) });

/** The only moving picture a page may fetch unasked: the silent loop on the fold. */
const SILENT_MEDIA = [/\/video\/hero-loop\.mp4$/];

const failures = [];
const results = [];
/** A timing over budget: a failure here, a note where timings are only reported. */
const timing = (line) => (process.env.PERF_TIMING === 'report' ? console.log(`   note: ${line}`) : failures.push(line));

async function measure(browser, route) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });

  let jsBytes = 0;
  let posterBytes = 0;
  const media = [];
  const pending = [];
  page.on('response', (response) => {
    const request = response.request();
    const url = response.url();
    if (request.resourceType() === 'media') media.push(new URL(url).pathname);
    if (request.resourceType() === 'script' && response.ok()) {
      pending.push(response.buffer().then((b) => (jsBytes += b.length), () => {}));
    }
    if (route === '/' && request.resourceType() === 'image' && decodeURIComponent(url).includes('hero-loop.jpg')) {
      pending.push(response.buffer().then((b) => (posterBytes = Math.max(posterBytes, b.length)), () => {}));
    }
  });

  await page.evaluateOnNewDocument(() => {
    window.__perf = { lcp: 0, cls: 0, longest: 0, loaded: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__perf.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__perf.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (window.__perf.loaded && entry.startTime > window.__perf.loaded) {
          window.__perf.longest = Math.max(window.__perf.longest, entry.duration);
        }
      }
    }).observe({ type: 'longtask', buffered: true });
    addEventListener('load', () => (window.__perf.loaded = performance.now()));
  });

  const response = await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 60000 });
  // An error page is light and fast: it must not pass for the route.
  if (!response || !(response.ok() || response.status() === 304)) {
    failures.push(`${route}: answered ${response?.status() ?? 'nothing'}`);
    await page.close();
    return;
  }
  await page.waitForNetworkIdle({ idleTime: 800, timeout: 20000 }).catch(() => {});
  // Scroll the whole page: a shift or a long task further down counts too.
  await page.evaluate(async () => {
    const step = Math.max(400, innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
  });
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
  await Promise.all(pending);

  const perf = await page.evaluate(() => ({ ...window.__perf, canvases: document.querySelectorAll('canvas').length }));
  await page.close();

  const unasked = media.filter((path) => !SILENT_MEDIA.some((allowed) => allowed.test(path)));
  const row = {
    route,
    jsKB: Math.round(jsBytes / 1000),
    lcpMs: Math.round(perf.lcp),
    cls: +perf.cls.toFixed(4),
    longestTaskMs: Math.round(perf.longest),
    canvases: perf.canvases,
    unaskedMedia: unasked,
    ...(route === '/' ? { posterKB: Math.round(posterBytes / 1000) } : {}),
  };
  results.push(row);
  console.log('  ', JSON.stringify(row));

  const budget = budgetFor(route);
  if (jsBytes > budget.jsBytes) failures.push(`${route}: ${row.jsKB} KB of JavaScript (budget ${budget.jsBytes / 1000} KB)`);
  if (perf.lcp > budget.lcpMs) timing(`${route}: LCP at ${row.lcpMs} ms (budget ${budget.lcpMs} ms)`);
  if (perf.cls > budget.cls) failures.push(`${route}: CLS ${row.cls} (budget ${budget.cls})`);
  if (perf.longest > budget.longTaskMs) timing(`${route}: a ${row.longestTaskMs} ms task after load (budget ${budget.longTaskMs} ms)`);
  if (perf.canvases > (route === '/' ? 1 : 0)) failures.push(`${route}: ${perf.canvases} canvas element(s)`);
  for (const path of unasked) failures.push(`${route}: fetched ${path} before any interaction`);
  if (route === '/' && posterBytes > BUDGET.posterBytes) failures.push(`/: the fold's poster weighs ${row.posterKB} KB (budget ${BUDGET.posterBytes / 1000} KB)`);
  if (route === '/' && !posterBytes) failures.push('/: the fold did not request its poster');
}

async function run() {
  const browser = process.env.PUPPETEER_BROWSER_URL
    ? await puppeteer.connect({ browserURL: process.env.PUPPETEER_BROWSER_URL })
    : await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });

  for (const route of ROUTES) {
    console.log(`> ${route}`);
    await measure(browser, route);
  }

  if (process.env.PUPPETEER_BROWSER_URL) browser.disconnect();
  else await browser.close();

  if (process.env.PERF_JSON) writeFileSync(process.env.PERF_JSON, JSON.stringify({ budget: BUDGET, routes: ROUTE_BUDGET, results }, null, 2));

  if (failures.length) {
    console.error(`\n✗ ${failures.length} over budget:`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(`✓ ${ROUTES.length} routes within budget`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
