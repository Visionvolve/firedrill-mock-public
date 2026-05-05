import { NextResponse, NextRequest } from "next/server";


const cache = new Map<string, string>();
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
