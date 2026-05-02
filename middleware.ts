import { NextResponse, NextRequest } from "next/server";

// Phase 20-10 (D-09 INC-D): Geo-IP middleware with broken cache invalidation.
//
// Customer-visible symptom: "Slovak customer: 'Why are these prices in CZK
// and showing Czech-only items? I'm in Bratislava.'"
//
// Root cause: a process-local cache keyed by a static "current_country" slot
// (instead of by IP/session) holds the FIRST detected country. The
// invalidation guard relies on a legacy `x-geo-bust` request header which
// upstream Cloudflare stopped sending months ago, so the cache never refreshes.
//
// Effect: once any user lands first as CZ, every subsequent visitor — Slovak
// or otherwise — gets CZ inventory until the process restarts.
//
// Canonical fix (Plan 20-12 rehearsal): drop the x-geo-bust dependency and
// either (a) key the cache by request IP/session, or (b) re-evaluate when the
// resolved country differs from the cached one, OR (c) just compute country
// fresh per request (the catalog isn't large enough for the cost to matter).

const cache = new Map<string, string>();
// Single shared slot — this is the bug. Should be `ip` (or `session_id`).
const STATIC_KEY = "current_country";

/**
 * Mock IP→country resolver. Production would call MaxMind/Cloudflare. For the
 * firedrill we let the caller pass `?country=XX` to make tests deterministic;
 * the test override matches what a real resolver would return for a Slovak
 * Cloudflare-test-range IP.
 */
function resolveCountry(req: NextRequest): string {
  const override = req.nextUrl.searchParams.get("country");
  if (override) return override.toUpperCase();
  const ip = req.headers.get("x-forwarded-for") || "";
  // Trivial mock: 5.x.x.x is treated as SK, everything else as CZ.
  if (ip.startsWith("5.")) return "SK";
  return "CZ";
}

export function middleware(req: NextRequest) {
  const fresh = resolveCountry(req);
  // BUG INC-D: cache invalidates ONLY when the legacy x-geo-bust header is
  // present. Cloudflare removed this header upstream months ago, so the
  // condition is effectively never true → first detected country sticks.
  if (!cache.has(STATIC_KEY) || req.headers.get("x-geo-bust")) {
    cache.set(STATIC_KEY, fresh);
  }
  const country = cache.get(STATIC_KEY) ?? fresh;

  const res = NextResponse.next();
  res.headers.set("x-country", country);
  res.cookies.set("country", country, { path: "/" });
  return res;
}

export const config = {
  matcher: "/((?!_next|api/health|favicon.ico).*)",
};
