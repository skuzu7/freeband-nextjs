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
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 1500));

// Sobre bottom (photo + stats)
await page.evaluate(() => {
  const el = document.getElementById("sobre");
  if (el) window.scrollTo(0, el.offsetTop + el.offsetHeight - 900);
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: "/tmp/freeband-audit/sobre-bottom.png" });
console.log("wrote sobre-bottom.png");

// Gallery row 2-3
await page.evaluate(() => {
  const el = document.getElementById("galeria");
  if (el) window.scrollTo(0, el.offsetTop + 900);
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: "/tmp/freeband-audit/galeria-row2.png" });
console.log("wrote galeria-row2.png");

// Gallery row 3-4
await page.evaluate(() => {
  const el = document.getElementById("galeria");
  if (el) window.scrollTo(0, el.offsetTop + 1800);
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: "/tmp/freeband-audit/galeria-row3.png" });
console.log("wrote galeria-row3.png");

await browser.close();
