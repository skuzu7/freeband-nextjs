// Simple fullPage screenshot with forced scroll-through.
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
page.setDefaultTimeout(60000);
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

console.log("goto /");
await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 90000 });

try {
  await page.evaluate(() => document.fonts.ready);
} catch {}

console.log("scroll through to trigger lazy loads");
await page.evaluate(async () => {
  await new Promise((res) => {
    let y = 0;
    const tick = () => {
      window.scrollTo(0, y);
      y += 600;
      if (y < document.body.scrollHeight) {
        requestAnimationFrame(tick);
      } else {
        window.scrollTo(0, 0);
        res(null);
      }
    };
    tick();
  });
});

// Wait for all images to be loaded and settle
await new Promise((r) => setTimeout(r, 3000));

console.log("fullpage screenshot");
await page.screenshot({ path: "/tmp/freeband-audit/full-real.png", fullPage: true });
console.log("done");
await browser.close();
