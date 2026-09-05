// Reduced-motion audit. Opens the public routes with
// `prefers-reduced-motion: reduce` emulated and asserts that nothing moves:
// no video element is playing (the fold never even attaches its loop), no
// element has a running CSS animation longer than a frame, the LED panel is
// already lit (the wordmark is visible without waiting for the light-up), and
// the ticker has stopped and wrapped.
//
//   BASE_URL              server to hit (default http://localhost:3000)
//   PUPPETEER_BROWSER_URL attach to a running Chrome instead of launching one
import puppeteer from 'puppeteer';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const ROUTES = ['/', '/palco', '/arquivo', '/historia'];
const failures = [];

async function run() {
  const browser = process.env.PUPPETEER_BROWSER_URL
    ? await puppeteer.connect({ browserURL: process.env.PUPPETEER_BROWSER_URL })
    : await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  for (const route of ROUTES) {
    console.log(`> ${route}`);
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
    // Scroll through so every reel and panel has had its chance to start.
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
      const withSrc = [...document.querySelectorAll('.hero-video')].filter((v) => v.getAttribute('src')).length;
      const running = document.getAnimations().filter((a) => {
        const t = a.effect?.getComputedTiming();
        return a.playState === 'running' && t && (t.duration === Infinity || Number(t.duration) > 50);
      }).length;
      const wordmarkVisible = (() => {
        const el = document.querySelector('[role="img"][aria-label="Freeband"] svg');
        return el ? getComputedStyle(el).opacity === '1' : null;
      })();
      const tickerAnimation = (() => {
        const t = document.querySelector('.ticker-track');
        return t ? getComputedStyle(t).animationName : null;
      })();
      return { playing, heroVideoAttached: withSrc, running, wordmarkVisible, tickerAnimation };
    });

    if (report.playing) failures.push(`${route}: ${report.playing} video(s) playing`);
    if (report.heroVideoAttached) failures.push(`${route}: hero loop attached under reduced motion`);
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
