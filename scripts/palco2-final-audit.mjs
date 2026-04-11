// Final end-to-end visual audit of PALCO II.
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 90000 });
await page.evaluate(() => document.fonts.ready).catch(() => {});

// Scroll to trigger lazy loads
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 50));
  }
});
await new Promise(r => setTimeout(r, 1200));

// Take hero at top
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: "/tmp/freeband-audit/final-hero.png" });

// Each section: scroll to top of section
const sections = ["manifesto", "galeria", "palcos", "servicos", "contato"];
for (const id of sections) {
  await page.evaluate((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, id);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `/tmp/freeband-audit/final-${id}.png` });
}

// Console error check
const errors = [];
page.on("pageerror", (err) => errors.push(err.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
await page.reload({ waitUntil: "networkidle2" });
await new Promise(r => setTimeout(r, 1500));

console.log("done");
console.log("errors:", errors.length === 0 ? "none" : errors);
await browser.close();
