// Reduced-motion audit. Opens the public routes with
// `prefers-reduced-motion: reduce` emulated and asserts that nothing moves:
// no video element is playing (the fold never even attaches its loop), the
// WebGL wall never comes on, no element has a running CSS animation longer
// than a frame, the acrylic wordmark is simply there, no photograph or
// heading is still behind its cover of dots, the wall behind the page stays
// unlit, and the running sign has stopped and wrapped.
//
//   BASE_URL              server to hit (default http://localhost:3000)
//   PUPPETEER_BROWSER_URL attach to a running Chrome instead of launching one
import puppeteer from 'puppeteer';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const ROUTES = ['/', '/palco', '/arquivo', '/historia', '/portfolio'];
const failures = [];

async function run() {
  const browser = process.env.PUPPETEER_BROWSER_URL
    ? await puppeteer.connect({ browserURL: process.env.PUPPETEER_BROWSER_URL })
    : await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  for (const route of ROUTES) {
    console.log(`> ${route}`);
    const response = await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // An error page moves nothing either: without this the audit passes on a
    // site that is down.
    if (!response || !(response.ok() || response.status() === 304)) {
      failures.push(`${route}: answered ${response?.status() ?? 'nothing'}`);
      continue;
    }
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
    // Move the mouse and scroll through, so everything that answers a
    // pointer or a scroll position has had its chance to start.
    await page.mouse.move(400, 300);
    await page.mouse.move(700, 450, { steps: 5 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 1200));

    const report = await page.evaluate(() => {
      const playing = [...document.querySelectorAll('video')].filter((v) => !v.paused && !v.ended).length;
      const withSrc = [...document.querySelectorAll('video[aria-hidden]')].filter((v) => v.getAttribute('src')).length;
      const wallLive = document.querySelectorAll('canvas[data-live]').length;
      const stageLit = [...document.querySelectorAll('.led-stage-pointer, .led-stage-level, .led-stage-sweep')].filter(
        (el) => 'on' in el.dataset || 'run' in el.dataset || Number(getComputedStyle(el).opacity) > 0.01 && !el.classList.contains('led-stage-sweep'),
      ).length;
      const covered = [...document.querySelectorAll('.led-resolve')].filter(
        (el) => Number(getComputedStyle(el, '::after').opacity) > 0.01,
      ).length;
      const running = document.getAnimations().filter((a) => {
        const t = a.effect?.getComputedTiming();
        return a.playState === 'running' && t && (t.duration === Infinity || Number(t.duration) > 50);
      }).length;
      const wordmarkVisible = (() => {
        const el = document.querySelector('[role="img"][aria-label="Freeband"] .led-wordmark-acrylic');
        return el ? getComputedStyle(el).opacity === '1' : null;
      })();
      const tickerAnimation = (() => {
        const t = document.querySelector('.ticker-track');
        return t ? getComputedStyle(t).animationName : null;
      })();
      const heading = document.querySelectorAll('main h1').length;
      return { heading, playing, heroVideoAttached: withSrc, wallLive, stageLit, covered, running, wordmarkVisible, tickerAnimation };
    });

    if (report.heading !== 1) failures.push(`${route}: expected the page's one <h1>, found ${report.heading}`);
    if (route === '/' && report.wordmarkVisible === null) failures.push('/: the fold has no wordmark to check');
    if (route === '/' && report.tickerAnimation === null) failures.push('/: the home has no running sign to check');
    if (report.playing) failures.push(`${route}: ${report.playing} video(s) playing`);
    if (report.heroVideoAttached) failures.push(`${route}: hero loop attached under reduced motion`);
    if (report.wallLive) failures.push(`${route}: the WebGL wall is drawing`);
    if (report.stageLit) failures.push(`${route}: ${report.stageLit} layer(s) of the LED stage lit`);
    if (report.covered) failures.push(`${route}: ${report.covered} element(s) still behind the dot cover`);
    if (report.running) failures.push(`${route}: ${report.running} CSS animation(s) still running`);
    if (report.wordmarkVisible === false) failures.push(`${route}: wordmark not shown immediately`);
    if (report.tickerAnimation && report.tickerAnimation !== 'none') failures.push(`${route}: ticker animating`);
    console.log('  ', JSON.stringify(report));
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
  console.log('✓ nothing moves under prefers-reduced-motion');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
