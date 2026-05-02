/**
 * SubClub loyalty day bucketing.
 *
 * Phase 20-10 (D-09 INC-C): the buggy implementation reads the server's local
 * timezone via `getFullYear / getMonth / getDate`. When the microsite is
 * deployed in Docker (server TZ = UTC) but the customer is in Czechia (CET/CEST),
 * orders placed between 22:00–24:00 UTC fall on the next Europe/Prague calendar
 * day — but the server bucket reports the UTC day, so points credit to the
 * wrong day.
 *
 * Customer-visible symptom: "I checked out at 00:30 and my SubClub points were
 * credited to yesterday."
 *
 * Canonical fix (Plan 20-12 rehearsal): use Intl.DateTimeFormat with
 * timeZone: 'Europe/Prague' and parse the YYYY-MM-DD parts so the bucket is
 * always relative to the customer's local CET day, not the server.
 */
export function bucketLoyaltyDay(orderTimestamp: Date): string {
  // BUG INC-C: server-local Date → buckets by server TZ, not Europe/Prague.
  const d = orderTimestamp;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
