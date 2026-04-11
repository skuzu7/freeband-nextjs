import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 90000 });
await page.evaluate(() => document.fonts.ready).catch(() => {});

// Scroll through to trigger lazy loads
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 80));
  }
  const el = document.getElementById("galeria");
  if (el) el.scrollIntoView({ behavior: "instant" });
});
await new Promise(r => setTimeout(r, 2000));

// Check computed styles on first gallery image
const info = await page.evaluate(() => {
  const sec = document.getElementById("galeria");
  const btn = sec?.querySelector("button");
  const img = btn?.querySelector("img");
  if (!img) return null;
  const cs = getComputedStyle(img);
  return {
    filter: cs.filter,
    opacity: cs.opacity,
    width: img.offsetWidth,
    height: img.offsetHeight,
    naturalW: img.naturalWidth,
    naturalH: img.naturalHeight,
    src: img.currentSrc?.slice(-80),
    complete: img.complete,
  };
});
console.log("First gallery img computed:", JSON.stringify(info, null, 2));

// Also check btn opacity
const btnInfo = await page.evaluate(() => {
  const sec = document.getElementById("galeria");
  const btn = sec?.querySelector("button");
  if (!btn) return null;
  const cs = getComputedStyle(btn);
  return { opacity: cs.opacity, visibility: cs.visibility, display: cs.display };
});
console.log("First gallery btn:", JSON.stringify(btnInfo, null, 2));

// Screenshot viewport at galeria
await page.screenshot({ path: "/tmp/freeband-audit/galeria-scrolled.png" });
console.log("wrote galeria-scrolled.png");
await browser.close();
