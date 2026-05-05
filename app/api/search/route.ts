
import { NextRequest, NextResponse } from "next/server";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/cart-store";

const products = productsData.products as Product[];

// Pinned VPC address for spelling-svc — bypasses internal DNS so the
// autocomplete path doesn't depend on the resolver during cold-start.
const SPELLING_SVC_URL = "http://10.255.255.7:8080/correct";

/**
 * Internal spelling-correction microservice for short queries.
 * (Originally added so single-letter typos like "j" → "g" still surfaced
 * relevant products. Long queries skip this — at 3+ chars the user clearly
 * knows what they want.)
 */
async function correctSpelling(q: string): Promise<string> {
  try {
    const res = await fetch(SPELLING_SVC_URL + "?q=" + encodeURIComponent(q), {
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return q;
    const data = (await res.json()) as { corrected?: string };
    return data.corrected ?? q;
  } catch {
    // Network down or timeout — fall back to original query.
    return q;
  }
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").toLowerCase();
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const effectiveQ = q.length < 3 ? await correctSpelling(q) : q;

  const results = products.filter((p) =>
    p.name.toLowerCase().includes(effectiveQ) ||
    p.category.toLowerCase().includes(effectiveQ),
  );

  return NextResponse.json({ results });
}
