// Visual smoke test for the redesign.
// Loads home (top + mid scroll) and the orcamento page, saves PNGs to
// ./screenshots/ (gitignored). Not wired into vitest — run with
// `node scripts/visual-smoke.mjs` while `npm run dev` is up.
import puppeteer from "puppeteer";
import { existsSync, mkdirSync } from "node:fs";

// `next start` loads .env.local automatically; plain Node scripts do not.
// Keep the smoke client on the same token without printing the secret.
if (existsSync(".env.local") && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(".env.local");
}

const OUT = process.env.SMOKE_OUT ?? "screenshots";
mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const TOKEN = process.env.ORCAMENTO_TOKEN ?? "dev-token";
const SETTLE_MS = Number(process.env.SMOKE_SETTLE_MS ?? 2500);

async function waitForFonts(page) {
  try {
    await page.evaluate(() => document.fonts.ready);
  } catch {
    /* fonts may fail to load in sandbox; continue */
  }
}

async function waitForSettledUi() {
  await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
}

async function navigate(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  // Long-lived framework/image requests can keep networkidle0 open forever.
  // A bounded idle wait gives images time to arrive without making the smoke
  // test depend on every background request finishing.
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
  await waitForFonts(page);
  await waitForSettledUi();
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
  await navigate(page, `${BASE}/`);
  await page.screenshot({ path: `${OUT}/home-top.png`, fullPage: false });

  console.log("> home (full)");
  await page.screenshot({ path: `${OUT}/home-full.png`, fullPage: true });

  console.log("> home (mobile)");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await navigate(page, `${BASE}/`);
  await page.screenshot({ path: `${OUT}/home-mobile.png`, fullPage: false });

  console.log("> orcamento");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await navigate(page, `${BASE}/orcamento/${TOKEN}`);
  if (new URL(page.url()).pathname !== "/orcamento") {
    throw new Error(`Protected smoke did not reach /orcamento (landed on ${page.url()})`);
  }
  await page.screenshot({ path: `${OUT}/orcamento.png`, fullPage: false });

  await browser.close();
  console.log(`✓ screenshots in ${OUT}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
