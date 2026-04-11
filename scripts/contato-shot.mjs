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
await page.evaluate(() => {
  document.getElementById("contato")?.scrollIntoView({ behavior: "instant", block: "start" });
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: "/tmp/freeband-audit/palco2-contato-top.png" });
await page.evaluate(() => {
  const el = document.getElementById("contato");
  if (el) window.scrollTo(0, el.offsetTop + 500);
});
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: "/tmp/freeband-audit/palco2-contato-bot.png" });
console.log("done");
await browser.close();
