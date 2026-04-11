// Per-section screenshots that work with scroll-driven animations.
// Strategy: emulate prefers-reduced-motion: reduce so my .reveal
// scroll-timeline fallback kicks in (elements render at opacity 1).
// Then take one fullPage screenshot per viewport and slice it with sharp.
import puppeteer from "puppeteer";
import sharp from "sharp";
import { mkdirSync, readFileSync } from "node:fs";

const OUT = "/tmp/freeband-audit";
mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SECTIONS = [
  "hero",
  "sobre",
  "historia",
  "galeria",
  "artistas",
  "servicos",
  "parceiros",
  "contato",
];

async function auditViewport(browser, label, width, height) {
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);

  await page.goto(`${BASE}/`, { waitUntil: "networkidle2", timeout: 90000 });
  try {
    await page.evaluate(() => document.fonts.ready);
  } catch {}

  // Force lazy images to resolve by scrolling through
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
  await new Promise((r) => setTimeout(r, 1500));

  const boxes = await page.evaluate((ids) => {
    const out = {};
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      out[id] = {
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }
    return out;
  }, SECTIONS);

  const fullPath = `${OUT}/${label}-FULL.png`;
  await page.screenshot({ path: fullPath, fullPage: true });
  await page.close();

  const buffer = readFileSync(fullPath);
  const meta = await sharp(buffer).metadata();
  for (const id of SECTIONS) {
    const b = boxes[id];
    if (!b) {
      console.log(`  ${label}/${id}: MISSING`);
      continue;
    }
    const left = Math.max(0, Math.round(b.x));
    const top = Math.max(0, Math.round(b.y));
    const w = Math.min(Math.round(b.width), (meta.width ?? width) - left);
    const h = Math.min(Math.round(b.height), (meta.height ?? 0) - top);
    if (w <= 0 || h <= 0) continue;
    await sharp(buffer)
      .extract({ left, top, width: w, height: h })
      .toFile(`${OUT}/${label}-${id}.png`);
    console.log(`  ${label}/${id}: ok (h=${Math.round(b.height)})`);
  }
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    protocolTimeout: 180000,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  console.log("> desktop 1440x900");
  await auditViewport(browser, "desktop", 1440, 900);
  console.log("> mobile 390x844");
  await auditViewport(browser, "mobile", 390, 844);

  await browser.close();
  console.log(`done -> ${OUT}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
