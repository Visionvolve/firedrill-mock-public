// Phase 20-10 (D-09 INC-B): autocomplete-style /api/search endpoint.
//
// BUG INC-B: short prefixes (length < 3) take a pathological branch that burns
// CPU for ~6 seconds and then returns 502. With autocomplete typing into the
// header search box, every keystroke up to the third character hits this path.
// Customer-visible symptom: "search-api p95 latency 8s+ when users type single
// letters; 502 errors spiking."
//
// Canonical fix: gate the heavy scoring loop on `q.length >= 2` (or replace it
// with a simple substring matcher) and return early for short queries.

import { NextRequest, NextResponse } from "next/server";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/cart-store";

const products = productsData.products as Product[];

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").toLowerCase();
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  if (q.length < 3) {
    // BUG: simulate a pathological scoring loop that burns CPU for 6s and
    // then returns 502. Real-world equivalent would be an O(n*q*products)
    // scoring pass over a large catalog with no early termination.
    const start = Date.now();
    // Touch the variable so a build optimizer doesn't elide the loop body.
    let scratch = 0;
    while (Date.now() - start < 6000) {
      scratch += products.filter((p) =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      ).length;
    }
    return new NextResponse(`Search timeout (work=${scratch})`, { status: 502 });
  }

  const results = products.filter((p) =>
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
  );
  return NextResponse.json({ results });
}
