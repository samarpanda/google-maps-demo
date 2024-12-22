import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/stable");
  await expect(page).toHaveTitle("Traffic Layer");
});

test("Verify all console logs", async ({ page }) => {
  const errorsArr: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errorsArr.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    errorsArr.push(err.message);
  });

  await page.goto("/stable");
  await page.waitForSelector(".gm-style");
  await page.waitForResponse(
    (response) =>
      response.url().includes("maps.googleapis.com/maps") &&
      response.status() === 200
  );
  await page.waitForFunction(() => window.google && window.google.maps);
  await page.waitForFunction(() => {
    const tiles: NodeListOf<HTMLImageElement> = document.querySelectorAll(
      'img[src*="googleapis"]'
    );
    return Array.from(tiles).every((img) => img.complete);
  });

  expect(errorsArr).toHaveLength(0);
});

// test("Screenshot comparison", async ({ page }) => {
//   await page.goto("/stable");
//   const mapDiv = page.locator("#map");

//   await expect(mapDiv).toHaveScreenshot({ maxDiffPixels: 100 });
// });
