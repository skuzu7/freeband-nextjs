import puppeteer from "puppeteer";
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
await page.evaluate(() => document.fonts.ready).catch(() => {});
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 40));
  }
});
await new Promise(r => setTimeout(r, 800));
const el = await page.$("#palcos");
if (el) {
  const box = await el.boundingBox();
  console.log("palcos box:", box);
  await page.evaluate((id) => {
    const e = document.getElementById(id);
    e?.scrollIntoView({ behavior: "instant", block: "start" });
  }, "palcos");
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: "/tmp/freeband-audit/palco2-palcos-v2.png" });
  console.log("wrote palco2-palcos-v2.png");
}
await browser.close();
