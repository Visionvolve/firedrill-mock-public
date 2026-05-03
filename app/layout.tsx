import type { Metadata } from "next";
import { DRMAX_BRAND } from "@/data/brand-tokens";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: `${DRMAX_BRAND.siteName} ${DRMAX_BRAND.tagline} — léky, vitamíny a kosmetika online`,
  description:
    "Online lékárna Dr.Max — léky, vitamíny, zdravotnické potřeby a kosmetika za nejlepší ceny.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Mulish — closest free Google equivalent of Proxima Vara
         * (Dr.MAX's proprietary brand typeface). Same humanist sans
         * geometry, similar x-height, identical horizontal rhythm. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F7F7F8] text-[#1B1B1B]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
