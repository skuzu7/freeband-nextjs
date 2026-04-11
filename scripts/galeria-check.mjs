import puppeteer from "puppeteer";
import sharp from "sharp";
import { readFileSync } from "node:fs";

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Log image requests
const imgLoads = [];
page.on("response", async (r) => {
  const url = r.url();
  if (url.includes("/_next/image") || /\.(jpe?g|png|webp|avif)/.test(url)) {
    imgLoads.push({ url: url.slice(-100), status: r.status() });
  }
});

await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2000));

// Scroll so all lazy images render
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 1500));

// Force all images to be ready
await page.evaluate(async () => {
  const imgs = Array.from(document.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) =>
      img.complete ? Promise.resolve() : new Promise((res) => (img.onload = img.onerror = res)),
    ),
  );
});

// Find galeria and screenshot just that region
const box = await page.evaluate(() => {
  const el = document.getElementById("galeria");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
});
console.log("galeria box:", box);

// Count broken/empty imgs
const imgStats = await page.evaluate(() => {
  const sec = document.getElementById("galeria");
  if (!sec) return null;
  const imgs = Array.from(sec.querySelectorAll("img"));
  return imgs.map((img) => ({
    src: img.currentSrc?.slice(-80) ?? img.src?.slice(-80),
    natW: img.naturalWidth,
    natH: img.naturalHeight,
    complete: img.complete,
    w: img.width,
    h: img.height,
  }));
});
console.log("gallery imgs:");
imgStats?.slice(0, 10).forEach((s, i) => console.log(` ${i}:`, s));

// Take full page then slice
await page.screenshot({ path: "/tmp/freeband-audit/full-raw.png", fullPage: true });
const buffer = readFileSync("/tmp/freeband-audit/full-raw.png");
if (box) {
  await sharp(buffer)
    .extract({
      left: Math.max(0, Math.round(box.x)),
      top: Math.max(0, Math.round(box.y)),
      width: Math.round(box.width),
      height: Math.min(Math.round(box.height), 4000),
    })
    .toFile("/tmp/freeband-audit/galeria-raw.png");
  console.log("wrote galeria-raw.png");
}

console.log(`\n${imgLoads.length} image responses:`);
imgLoads.slice(0, 10).forEach((l) => console.log(` ${l.status} ${l.url}`));

await browser.close();
