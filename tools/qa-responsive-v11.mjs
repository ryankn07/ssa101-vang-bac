/* SSA101 / Vang Bac — V11 Responsive Regression Audit
 * Optional, LOCAL-ONLY QA. No production runtime dependency, no paid service.
 *
 * Setup: npm install --no-save playwright
 *        npx playwright install chromium
 * Run:   node tools/qa-responsive-v11.mjs
 * Or:    node tools/qa-responsive-v11.mjs https://ssa101-vang-bac.vercel.app/
 *
 * Outputs JSON diagnostics and screenshots in qa-output/. This tests UI behavior
 * and navigation timings, NOT official Lighthouse/Core Web Vitals scores.
 */
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Missing optional QA package. Run: npm install --no-save playwright && npx playwright install chromium");
  process.exit(2);
}

const url = process.argv[2] || "https://ssa101-vang-bac.vercel.app/";
const sizes = [360, 390, 430, 768, 1360];
const output = resolve("qa-output");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
let failures = 0;
const results = [];

for (const width of sizes) {
  const context = await browser.newContext({
    viewport: { width, height: 820 },
    deviceScaleFactor: 1,
    isMobile: width <= 800,
    hasTouch: width <= 800,
    reducedMotion: "reduce"
  });
  // Only test our own video UI. External Google Drive availability is a separate check.
  await context.route("https://drive.google.com/**", route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const assertions = {};
  const check = (name, value) => {
    assertions[name] = Boolean(value);
    if (!value) failures++;
  };
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.locator("#hero-title").waitFor({ timeout: 10000 });
    check("actualViewport", await page.evaluate(w => innerWidth === w, width));
    check("noHorizontalPageOverflow", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

    const mobile = width <= 800;
    const toggle = page.locator(".mobile-nav-toggle");
    check("responsiveMenuVisibility", (await toggle.isVisible()) === mobile);
    if (mobile) {
      await toggle.click();
      check("mobileMenuOpens", (await toggle.getAttribute("aria-expanded")) === "true" && await page.locator("#mobile-navigation").isVisible());
      await page.keyboard.press("Escape");
      check("mobileMenuCloses", (await toggle.getAttribute("aria-expanded")) === "false" && !(await page.locator("#mobile-navigation").isVisible()));
    } else {
      check("desktopNavigationVisible", await page.locator(".desktop-nav").isVisible());
    }

    await page.locator('.toggle-button[data-view="month"]').click();
    check("monthCalendarWorks", await page.locator("#calendar-content .month-calendar").count() === 1);
    await page.locator('.toggle-button[data-view="week"]').click();
    check("weekCalendarWorks", await page.locator("#calendar-content .weekly-calendar").count() === 1);

    await page.locator('[data-vb-open-slide="0"]').click();
    await page.locator('[data-vb-day="1"]').click();
    check("selectedDayWorks", (await page.locator("#vb-day-current").innerText()).includes("13/10/2026"));

    await page.locator('[data-vb-open-slide="1"]').click();
    check("memberSwitchWorks", (await page.locator("#vb-switch-counter").innerText()).includes("THÀNH VIÊN 02"));
    const afterButton = page.locator('[data-compare-select="1"]');
    if (width <= 720) {
      check("beforeAfterControlsVisible", await afterButton.isVisible());
      await afterButton.click();
      check("afterImageVisible", await page.locator('.vb-compare-case.is-active .demo-case-image[href*="demo-after"]').isVisible());
      check("beforeImageHidden", !(await page.locator('.vb-compare-case .demo-case-image[href*="demo-before"]').isVisible()));
    } else {
      check("comparisonImagesDesktop", await page.locator('.demo-case-image[href*="demo-before"]').isVisible() && await page.locator('.demo-case-image[href*="demo-after"]').isVisible());
    }

    const play = page.locator("#demo-video .vb-video-start");
    await play.click();
    check("driveFallbackVisible", await page.locator("#demo-video .vb-video-utility-link").isVisible());
    await page.locator("#demo-video .vb-video-close").click();
    check("videoCoverRestored", await play.isVisible());

    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      return nav ? {
        responseStartMs: Math.round(nav.responseStart),
        domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd)
      } : null;
    });
    await page.screenshot({ path: resolve(output, "v11-" + width + "px.png"), animations: "disabled" });
    check("noUncaughtPageErrors", errors.length === 0);
    results.push({ width, assertions, errors, timing });
  } catch (error) {
    failures++;
    results.push({ width, assertions, errors, fatal: String(error) });
    await page.screenshot({ path: resolve(output, "v11-error-" + width + "px.png") }).catch(() => {});
  } finally {
    await context.close();
  }
}
await browser.close();
console.log(JSON.stringify({ url, sizes, failures, results, note: "Timings are single-run navigation diagnostics, not Lighthouse/CWV." }, null, 2));
if (failures) process.exitCode = 1;
