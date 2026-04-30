import { DRMAX_BRAND } from "@/data/brand-tokens";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="w-full bg-[#1A1A1A] text-[#E5E5E5] mt-16"
      style={{ borderTop: `4px solid ${DRMAX_BRAND.red}` }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="font-bold text-white mb-3">Zákaznický servis</h3>
          <ul className="space-y-2">
            <li>Kontaktujte nás</li>
            <li>Doprava a platba</li>
            <li>Reklamace a vrácení zboží</li>
            <li>Časté dotazy</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-3">O Dr.MAX</h3>
          <ul className="space-y-2">
            <li>O nás</li>
            <li>Lékárny v ČR</li>
            <li>Kariéra</li>
            <li>Tisková centrála</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-3">Pomoc</h3>
          <ul className="space-y-2">
            <li>Jak nakupovat</li>
            <li>Bonusový program SubClub</li>
            <li>Slevové kódy</li>
            <li>Ochrana osobních údajů</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#3A3A3A]">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-[#9A9A9A] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>© {year} Dr.MAX (fixture). Všechna práva vyhrazena.</span>
          <span>Phase 20 firedrill — internal training fixture.</span>
        </div>
      </div>
    </footer>
  );
}
