export function bucketLoyaltyDay(orderTimestamp: Date): string {
  const d = orderTimestamp;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
