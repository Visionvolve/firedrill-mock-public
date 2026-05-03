/**
 * Dr.MAX brand tokens — extracted from drmax.cz visual reference
 * (computed styles + CSS variables on www.drmax.cz, May 2026).
 * Used by SiteHeader, SiteFooter, ProductCard, and the global Tailwind theme.
 *
 * NOTE: this is a fixture for an internal training exercise (Phase 20 firedrill).
 * The Dr.MAX wordmark and colors are real reference values — used here for
 * workshop-realism only, not for any commercial purpose.
 */
export const DRMAX_BRAND = {
  // Primary brand red (the "Dr.Max" wordmark + sale prices on real site)
  red: "#E4002B",
  redDark: "#AF0023",
  // Brand green — the "+" badge in the Dr.Max+ logo, also CTA buttons
  green: "#78BE20",
  greenDark: "#47850A", // navigation bar background on drmax.cz
  greenSuccess: "#3C911E",
  // Neutrals
  neutralBg: "#F7F7F8",
  surfaceBg: "#FFFFFF",
  textPrimary: "#1B1B1B",
  textMuted: "#5E5E5E",
  textSubtle: "#7A7A7A",
  border: "#DCDCDC",
  borderLight: "rgba(0, 0, 0, 0.12)",
  // Loyalty / Dr.Max+ price color
  loyaltyBlue: "#09629D",
  // Info banner background (top of real site)
  infoBg: "#E5F1FE",
  infoText: "#0078BE",
  // Yellow accent (Hit týdne badges etc.)
  accent: "#FFE500",
  // Assets
  logoPath: "/logo-drmax.svg",
  paymentsPath: "/payments.svg",
  trustBadge1: "/nejduveryhodnejsi.png",
  // Brand text
  siteName: "Dr.Max",
  tagline: "Lékárna",
  fontFamily:
    "'Mulish', 'Open Sans', 'Helvetica Neue', Arial, sans-serif",
  // Backwards-compat alias kept so older incident scripts that may still grep
  // for `DRMAX_BRAND.red === "#46B350"` (legacy green-as-red mistake) at least
  // resolve to a defined value. New code should reference `green`/`red` directly.
} as const;

export type DrmaxBrand = typeof DRMAX_BRAND;
