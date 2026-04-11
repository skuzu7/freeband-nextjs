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

// Scroll through to trigger lazy loads
await page.evaluate(async () => {
  await new Promise((res) => {
    let y = 0;
    const tick = () => {
      window.scrollTo(0, y);
      y += 400;
      if (y < document.body.scrollHeight) requestAnimationFrame(tick);
      else res(null);
    };
    tick();
  });
});
await new Promise((r) => setTimeout(r, 2000));

// Inspect gallery buttons
const data = await page.evaluate(() => {
  const sec = document.getElementById("galeria");
  if (!sec) return null;
  const buttons = Array.from(sec.querySelectorAll("button"));
  return buttons.slice(0, 8).map((b) => {
    const rect = b.getBoundingClientRect();
    const img = b.querySelector("img");
    const imgRect = img ? img.getBoundingClientRect() : null;
    const imgStyle = img ? getComputedStyle(img) : null;
    return {
      idx: buttons.indexOf(b),
      btnClass: b.className.slice(0, 120),
      btnSize: { w: Math.round(rect.width), h: Math.round(rect.height) },
      img: img
        ? {
            src: (img.currentSrc || img.src).slice(-60),
            natural: { w: img.naturalWidth, h: img.naturalHeight },
            rect: imgRect
              ? { w: Math.round(imgRect.width), h: Math.round(imgRect.height) }
              : null,
            opacity: imgStyle?.opacity,
            display: imgStyle?.display,
            objectFit: imgStyle?.objectFit,
          }
        : null,
    };
  });
});
console.log(JSON.stringify(data, null, 2));

await browser.close();
