
import { test, expect } from "@playwright/test";

test.describe("Search API stays under 500ms for short and long queries", () => {
  test("/api/search?q=p returns within 1.5s without 5xx", async ({ request }) => {
    const start = Date.now();
    const res = await request.get("/api/search?q=p");
    const elapsed = Date.now() - start;
    expect(elapsed, `elapsed=${elapsed}ms`).toBeLessThan(1500);
    expect(res.status(), `status=${res.status()}`).toBeLessThan(500);
  });

  test("/api/search?q=ab (2 chars) also returns fast and not 5xx", async ({ request }) => {
    const start = Date.now();
    const res = await request.get("/api/search?q=ab");
    const elapsed = Date.now() - start;
    expect(elapsed, `elapsed=${elapsed}ms`).toBeLessThan(1500);
    expect(res.status(), `status=${res.status()}`).toBeLessThan(500);
  });
});
