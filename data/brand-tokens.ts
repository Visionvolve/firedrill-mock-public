/**
 * Dr.MAX brand tokens — extracted from drmax.cz visual reference.
 * Used by SiteHeader, SiteFooter, and the global Tailwind theme.
 *
 * NOTE: this is a fixture for an internal training exercise (Phase 20 firedrill).
 * The Dr.MAX wordmark and colors are approximations — not actual brand assets.
 */
export const DRMAX_BRAND = {
  red: "#E2001A",
  redDark: "#C40016",
  neutralBg: "#F7F7F8",
  textPrimary: "#1A1A1A",
  textMuted: "#6B6B6B",
  border: "#E5E5E5",
  accent: "#FFCC00",
  logoPath: "/logo-drmax.svg",
  siteName: "Dr.MAX",
  tagline: "Zdraví a léky",
  fontFamily: "'Open Sans', sans-serif",
} as const;

export type DrmaxBrand = typeof DRMAX_BRAND;
