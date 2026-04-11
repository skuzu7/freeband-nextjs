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

await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 80));
  }
});
await new Promise(r => setTimeout(r, 1000));

for (const id of ["servicos", "contato"]) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo(0, el.offsetTop);
  }, id);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `/tmp/freeband-audit/shot-${id}-top.png` });
  // Also capture the bottom half (infra / social block)
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo(0, el.offsetTop + Math.max(0, el.offsetHeight - 900));
  }, id);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `/tmp/freeband-audit/shot-${id}-bot.png` });
}
console.log("done");
await browser.close();
