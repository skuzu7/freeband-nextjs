// Visual smoke test for the redesign.
// Loads home (top + mid scroll) and the orcamento page, saves PNGs to
// /tmp/. Not wired into vitest — run with `node scripts/visual-smoke.mjs`
// while `npm run dev` is up.
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const OUT = "/tmp/freeband-smoke";
mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const TOKEN = process.env.ORCAMENTO_TOKEN ?? "dev-token";

async function waitForFonts(page) {
  try {
    await page.evaluate(() => document.fonts.ready);
  } catch {
    /* fonts may fail to load in sandbox; continue */
  }
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  console.log("> home (top)");
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 60000 });
  await waitForFonts(page);
  await page.screenshot({ path: `${OUT}/home-top.png`, fullPage: false });

  console.log("> home (full)");
  await page.screenshot({ path: `${OUT}/home-full.png`, fullPage: true });

  console.log("> home (mobile)");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 60000 });
  await waitForFonts(page);
  await page.screenshot({ path: `${OUT}/home-mobile.png`, fullPage: false });

  console.log("> orcamento");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/orcamento/${TOKEN}`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await waitForFonts(page);
  await page.screenshot({ path: `${OUT}/orcamento.png`, fullPage: false });

  await browser.close();
  console.log(`✓ screenshots in ${OUT}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
