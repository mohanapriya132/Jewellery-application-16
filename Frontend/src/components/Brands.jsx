import { useSupabaseData } from "../hooks/useSupabaseData";

/* ─── Hardcoded fallbacks ───────────────────────────────────── */
const hardcodedBrands = [
  { name: "Tiffany & Co.", est: "Est. 1837" },
  { name: "Cartier", est: "Est. 1847" },
  { name: "Van Cleef", est: "Est. 1906" },
  { name: "Bulgari", est: "Est. 1884" },
  { name: "Harry Winston", est: "Est. 1932" },
  { name: "Graff", est: "Est. 1960" },
];

const certifications = [
  { logo: "GIA", name: "Gemological Institute", sub: "All diamonds certified" },
  { logo: "IGI", name: "International Gemological", sub: "Lab-grown certified" },
  { logo: "BIS", name: "Bureau of Indian Standards", sub: "Hallmarked gold" },
  { logo: "RJC", name: "Responsible Jewellery Council", sub: "Ethical sourcing" },
];

export default function Brands() {
  const { data: brands } = useSupabaseData("brands", hardcodedBrands, {
    orderBy: { column: "sort_order", ascending: true },
  });

  return (
    <section className="bg-ivory py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Featured in */}
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body font-light mb-3">As seen in</p>
          <h2 className="font-display text-4xl font-light text-obsidian mb-4">Trusted by the World's Finest</h2>
          <div className="divider-gold" />
        </div>

        {/* Brand marquee row */}
        <div className="border-y border-obsidian/10 py-8 overflow-hidden mb-20">
          <div className="flex gap-16 items-center justify-center flex-wrap">
            {brands.map((b) => (
              <div key={b.name || b.id} className="text-center group cursor-pointer">
                <div className="font-display text-xl md:text-2xl font-light text-obsidian/30 group-hover:text-obsidian transition-colors duration-300 whitespace-nowrap">
                  {b.name}
                </div>
                <div className="text-[8px] tracking-widest uppercase text-gold/50 group-hover:text-gold font-body transition-colors duration-300">
                  {b.est}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body font-light mb-3">Certified Quality</p>
          <h3 className="font-display text-3xl md:text-4xl font-light text-obsidian">
            Every Piece, Authenticated
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {certifications.map((c) => (
            <div key={c.logo} className="border border-obsidian/10 p-6 text-center hover:border-gold/40 hover:shadow-lg transition-all duration-300 group">
              <div className="font-display text-4xl font-light text-gold/70 group-hover:text-gold transition-colors mb-3">
                {c.logo}
              </div>
              <div className="font-body text-xs tracking-wider text-obsidian font-medium mb-1">{c.name}</div>
              <div className="text-[10px] text-slate/50 font-body">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Press strip */}
        <div className="mt-16 text-center">
          <p className="text-[10px] tracking-widest uppercase text-slate/40 font-body mb-6">Featured in</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-30">
            {["Vogue India", "Harper's Bazaar", "Elle India", "Femina", "Grazia"].map((p) => (
              <span key={p} className="font-display text-lg text-obsidian font-light">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
