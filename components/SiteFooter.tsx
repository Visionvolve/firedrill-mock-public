import { DRMAX_BRAND } from "@/data/brand-tokens";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#F2F2F2] text-[#1B1B1B] mt-16">
      {/* Trust strip */}
      <div className="bg-white border-t border-b" style={{ borderColor: DRMAX_BRAND.border }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap items-center justify-around gap-6 text-sm text-[#5E5E5E]">
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-2xl">🚚</span>
            <div>
              <p className="font-bold text-[#1B1B1B]">Doprava ZDARMA</p>
              <p className="text-xs">při nákupu nad 1 500 Kč</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-2xl">🏬</span>
            <div>
              <p className="font-bold text-[#1B1B1B]">Síť 460+ lékáren</p>
              <p className="text-xs">v celé České republice</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-2xl">💊</span>
            <div>
              <p className="font-bold text-[#1B1B1B]">Doručení do 24 hodin</p>
              <p className="text-xs">k vyzvednutí v lékárně zdarma</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DRMAX_BRAND.trustBadge1}
              alt="Nejdůvěryhodnější značka 2025"
              width={64}
              height={64}
              className="h-14 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-extrabold text-[#1B1B1B] mb-4 uppercase text-xs tracking-wider">
            Online nákup
          </h3>
          <ul className="space-y-2.5 text-[#5E5E5E]">
            <li><a href="#" className="hover:text-[#47850A]">Objednávky</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Stav objednávky</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Doprava a platba</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Reklamace a vrácení zboží</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Časté dotazy</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Slevové kódy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-extrabold text-[#1B1B1B] mb-4 uppercase text-xs tracking-wider">
            Věrnostní program
          </h3>
          <ul className="space-y-2.5 text-[#5E5E5E]">
            <li><a href="#" className="hover:text-[#47850A]">Karta výhod</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Výhody programu</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Klub aktivně</a></li>
            <li><a href="#" className="hover:text-[#47850A]">SubClub</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Pravidla věrnostního programu</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-extrabold text-[#1B1B1B] mb-4 uppercase text-xs tracking-wider">
            O Dr.Max
          </h3>
          <ul className="space-y-2.5 text-[#5E5E5E]">
            <li><a href="#" className="hover:text-[#47850A]">O nás</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Vše o Dr.Max</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Preventivní péče</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Poradna</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Kariéra</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Tisková centrála</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-extrabold text-[#1B1B1B] mb-4 uppercase text-xs tracking-wider">
            Kontakty
          </h3>
          <ul className="space-y-2.5 text-[#5E5E5E]">
            <li><a href="#" className="hover:text-[#47850A]">Kontaktujte nás</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Mapa lékáren</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Kontakty</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Lékárny</a></li>
            <li><a href="#" className="hover:text-[#47850A]">Pro firmy</a></li>
          </ul>
          <p className="mt-4 text-xs uppercase tracking-wider font-extrabold text-[#1B1B1B]">
            Sociální sítě
          </p>
          <div className="mt-2 flex items-center gap-3 text-[#5E5E5E]">
            <span aria-label="Instagram" className="hover:text-[#47850A]">📷</span>
            <span aria-label="YouTube" className="hover:text-[#47850A]">▶</span>
            <span aria-label="Facebook" className="hover:text-[#47850A]">f</span>
          </div>
        </div>
      </div>

      {/* Payment methods strip */}
      <div className="border-t" style={{ borderColor: DRMAX_BRAND.border }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-[#5E5E5E]">
            <span className="font-semibold">Přijímáme platby:</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DRMAX_BRAND.paymentsPath}
              alt="master, visa, dpd, ceska posta, sodexo, up, edenred, ppl"
              className="h-7 w-auto"
            />
          </div>
          <p className="text-xs text-[#7A7A7A]">
            © {year} Lékárna Dr.Max. Všechna práva vyhrazena. (Workshop firedrill fixture.)
          </p>
        </div>
      </div>
    </footer>
  );
}
