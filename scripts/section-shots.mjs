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

const sections = ["sobre", "historia", "galeria"];
for (const id of sections) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "instant" });
  }, id);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `/tmp/freeband-audit/shot-${id}.png` });
  console.log(`wrote shot-${id}.png`);
}

await browser.close();
