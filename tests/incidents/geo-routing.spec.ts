
import { test, expect } from "@playwright/test";

test.describe("Country detection isolated per request — no cross-customer leakage", () => {
  test("Slovak user (after a Czech user) sees SK, not CZ", async ({ browser, baseURL }) => {
    // Context 1: a Czech user. We pass `?country=CZ` so the test is
    // independent of the IP→country mock implementation, AND a CZ-shaped
    // x-forwarded-for so the test doesn't accidentally rely on the override.
    const ctx1 = await browser.newContext();
    const r1 = await ctx1.request.get(`${baseURL ?? ""}/?country=CZ`, {
      headers: { "x-forwarded-for": "1.2.3.4" },
    });
    expect(r1.status(), `first request status=${r1.status()}`).toBeLessThan(500);
    const country1 = (await ctx1.request.storageState()).cookies.find(
      (c) => c.name === "country",
    )?.value;
    expect(country1, "first user should be CZ").toBe("CZ");

    const ctx2 = await browser.newContext();
    const r2 = await ctx2.request.get(`${baseURL ?? ""}/?country=SK`, {
      headers: { "x-forwarded-for": "5.6.7.8" },
    });
    expect(r2.status(), `second request status=${r2.status()}`).toBeLessThan(500);
    const country2 = (await ctx2.request.storageState()).cookies.find(
      (c) => c.name === "country",
    )?.value;
    expect(country2, "second user MUST be SK").toBe("SK");

    await ctx1.close();
    await ctx2.close();
  });
});
