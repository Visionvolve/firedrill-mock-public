// Phase 20-10 (D-09 incident D, D-13 validation flow):
// INC-D — "Geo-routing race / cache invalidation broken"
//
// Symptom shown to participants:
//   "Slovak customer: 'Why are these prices in CZK and showing Czech-only
//    items? I'm in Bratislava.'"
//
// Root cause (hidden from participants): middleware.ts caches the resolved
// country in a single shared slot keyed by a static string. The invalidation
// guard relies on a legacy `x-geo-bust` request header that no longer arrives
// from upstream → first user's country sticks for all subsequent users.
//
// Canonical fix: drop the x-geo-bust dependency. Key the cache by IP/session
// or just re-evaluate per request (catalog is small enough).
//
// Spec assertion shape: two contexts hit the site sequentially with different
// `country` overrides and different IPs. The second context's `country`
// cookie MUST reflect its own resolved country, not the cached value from
// the first context. Under the buggy seed, both see the first country.

import { test, expect } from "@playwright/test";

test.describe("INC-D: geo cache pins first user's country for everyone", () => {
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

    // Context 2: a Slovak user with a Slovak IP. Different cookie jar; the
    // expected country is SK. Under the bug the middleware cache has already
    // pinned CZ and refuses to invalidate, so the second user gets CZ too.
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
