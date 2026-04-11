import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
// Tall viewport so the whole gallery fits without fullPage stitching
await page.setViewport({ width: 1440, height: 9000 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 120000 });
await page.evaluate(() => document.fonts.ready).catch(() => {});

// Wait for all imgs to load
await page.evaluate(async () => {
  const imgs = Array.from(document.querySelectorAll("img"));
  await Promise.all(
    imgs.map((i) =>
      i.complete && i.naturalHeight > 0
        ? null
        : new Promise((res) => {
            i.addEventListener("load", res, { once: true });
            i.addEventListener("error", res, { once: true });
            setTimeout(res, 8000);
          }),
    ),
  );
});
await new Promise((r) => setTimeout(r, 1000));

const el = await page.$("#galeria");
if (el) {
  await el.screenshot({ path: "/tmp/freeband-audit/galeria-elem.png" });
  console.log("wrote galeria-elem.png");
}
await browser.close();
