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
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: "/tmp/freeband-audit/palco2-hero.png" });
console.log("wrote palco2-hero.png");
await browser.close();
