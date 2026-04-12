// Audit image layout across mobile/tablet/desktop.
// For each viewport: take per-section screenshots and log DOM geometry of
// every image tile in the gallery + each grade-* element.
import puppeteer from "puppeteer";

const VIEWPORTS = [
  { name: "mobile",  w: 390,  h: 844 },
  { name: "tablet",  w: 820,  h: 1180 },
  { name: "desktop", w: 1440, h: 900 },
];

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});

for (const v of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: v.w, height: v.h });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 40));
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  // Inspect gallery layout
  const gal = await page.evaluate(() => {
    const sec = document.getElementById("galeria");
    if (!sec) return null;
    const grid = sec.querySelector(".masonry-12");
    const gridRect = grid?.getBoundingClientRect();
    const buttons = Array.from(sec.querySelectorAll(".masonry-12 > button"));
    return {
      gridW: gridRect?.width,
      tiles: buttons.map((b, i) => {
        const r = b.getBoundingClientRect();
        const cs = getComputedStyle(b);
        const img = b.querySelector("img");
        const imgR = img?.getBoundingClientRect();
        return {
          i,
          span: b.dataset.span,
          rowSpan: b.dataset.row,
          btn: { w: Math.round(r.width), h: Math.round(r.height) },
          grid: {
            col: cs.gridColumnStart + "→" + cs.gridColumnEnd,
            row: cs.gridRowStart + "→" + cs.gridRowEnd,
          },
          img: imgR ? { w: Math.round(imgR.width), h: Math.round(imgR.height), natW: img.naturalWidth, natH: img.naturalHeight, src: img.currentSrc?.slice(-80) } : null,
        };
      }),
    };
  });
  console.log(`\n=== ${v.name} ${v.w}x${v.h} ===`);
  console.log("gallery grid width:", gal?.gridW);
  gal?.tiles.forEach(t => console.log(`  tile ${t.i} span=${t.span}${t.rowSpan?" row="+t.rowSpan:""} btn=${t.btn.w}x${t.btn.h} img=${t.img?.w}x${t.img?.h}`));

  // Inspect manifesto photo
  const mani = await page.evaluate(() => {
    const sec = document.getElementById("manifesto");
    const wrappers = Array.from(sec?.querySelectorAll("[class*='grade-']") ?? []);
    return wrappers.map(w => {
      const r = w.getBoundingClientRect();
      const img = w.querySelector("img");
      const imgR = img?.getBoundingClientRect();
      return {
        cls: w.className.slice(0, 80),
        wrap: { w: Math.round(r.width), h: Math.round(r.height) },
        img: imgR ? { w: Math.round(imgR.width), h: Math.round(imgR.height) } : null,
      };
    });
  });
  console.log("manifesto grade elements:", mani);

  // Full-page screenshot
  await page.screenshot({ path: `/tmp/freeband-audit/audit-${v.name}-full.png`, fullPage: true });

  // Per-section screenshots (galeria + manifesto)
  for (const id of ["manifesto", "galeria"]) {
    await page.evaluate((id) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, id);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `/tmp/freeband-audit/audit-${v.name}-${id}.png` });
  }

  await page.close();
}

await browser.close();
console.log("\ndone");
