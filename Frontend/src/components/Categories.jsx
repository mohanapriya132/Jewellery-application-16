import { useSupabaseData } from "../hooks/useSupabaseData";

/* ─── Hardcoded fallback ────────────────────────────────────── */
const hardcodedCategories = [
  {
    title: "Rings",
    subtitle: "Solitaire & Bands",
    image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    count: "142 pieces",
  },
  {
    title: "Necklaces",
    subtitle: "Pendants & Chains",
    image_url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
    count: "98 pieces",
  },
  {
    title: "Earrings",
    subtitle: "Studs & Drops",
    image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    count: "210 pieces",
  },
  {
    title: "Bracelets",
    subtitle: "Bangles & Tennis",
    image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80",
    count: "76 pieces",
  },
];

export default function Categories() {
  const { data: categories } = useSupabaseData("categories", hardcodedCategories, {
    orderBy: { column: "sort_order", ascending: true },
  });

  return (
    <section className="bg-ivory py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body font-light mb-3">Shop by</p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-obsidian mb-4">
            Categories
          </h2>
          <div className="divider-gold" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <div
              key={cat.title || cat.id || i}
              className="group relative overflow-hidden cursor-pointer"
              style={{ aspectRatio: i === 0 || i === 3 ? "4/5" : "3/4" }}
            >
              {/* Image */}
              <img
                src={cat.image_url || cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent transition-opacity duration-300 group-hover:from-obsidian/90" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[9px] tracking-widest2 text-gold uppercase font-body mb-1">{cat.subtitle}</p>
                <h3 className="font-display text-2xl font-light text-ivory mb-1">{cat.title}</h3>
                <p className="text-[10px] text-champagne/60 font-body">{cat.count}</p>
                <div className="mt-3 flex items-center gap-2 text-gold-light text-[10px] tracking-widest uppercase font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Explore</span>
                  <span className="w-6 h-px bg-gold-light" />
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-3 left-3 w-8 h-8 border-l border-t border-gold/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
