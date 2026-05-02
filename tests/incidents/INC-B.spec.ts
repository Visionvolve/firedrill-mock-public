// Phase 20-10 (D-09 incident B, D-13 validation flow):
// INC-B — "Search timeout on short prefixes"
//
// Symptom shown to participants:
//   "Monitoring: search-api p95 latency 8s+ when users type single letters.
//    502 errors spiking."
//
// Root cause (hidden from participants): app/api/search/route.ts takes a
// pathological branch when the query length is < 3 — it busy-loops for ~6s
// and then returns 502.
//
// Canonical fix: gate the heavy branch on `q.length >= 2` and return early
// with `{ results: [] }` for shorter queries.
//
// Spec assertion shape: time the request and assert it returns within 1.5s
// AND with status < 500. Both fail under the buggy seed.

import { test, expect } from "@playwright/test";

test.describe("INC-B: search latency on short prefixes", () => {
  test("/api/search?q=p returns within 1.5s without 5xx", async ({ request }) => {
    const start = Date.now();
    const res = await request.get("/api/search?q=p");
    const elapsed = Date.now() - start;
    expect(elapsed, `elapsed=${elapsed}ms`).toBeLessThan(1500);
    expect(res.status(), `status=${res.status()}`).toBeLessThan(500);
  });

  test("/api/search?q=ab (2 chars) also returns fast and not 5xx", async ({ request }) => {
    // Belt-and-braces: the bug fires for q.length < 3, so 2 chars also hits.
    const start = Date.now();
    const res = await request.get("/api/search?q=ab");
    const elapsed = Date.now() - start;
    expect(elapsed, `elapsed=${elapsed}ms`).toBeLessThan(1500);
    expect(res.status(), `status=${res.status()}`).toBeLessThan(500);
  });
});
