export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-obsidian">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&auto=format&fit=crop&q=80"
          alt="Luxury jewelry"
          className="w-full h-full object-cover object-center opacity-40"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-24 left-6 w-16 h-16 border-l border-t border-gold/30" />
      <div className="absolute top-24 right-6 w-16 h-16 border-r border-t border-gold/30" />
      <div className="absolute bottom-24 left-6 w-16 h-16 border-l border-b border-gold/30" />
      <div className="absolute bottom-24 right-6 w-16 h-16 border-r border-b border-gold/30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24">
        <div className="max-w-2xl">
          <p className="text-xs tracking-widest3 text-gold uppercase font-body font-light mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-gold inline-block" />
            New Collection 2025
          </p>

          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-light text-ivory leading-[1.05] mb-6">
            Crafted for<br />
            <em className="gold-shimmer not-italic font-light">Eternity</em>
          </h1>

          <p className="text-champagne/70 font-body font-light text-base leading-relaxed max-w-md mb-10">
            Each piece in our collection is a testament to timeless elegance — handcrafted by master artisans using ethically sourced diamonds and 18K gold.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <button className="bg-gold hover:bg-gold-light text-obsidian text-xs tracking-widest uppercase px-10 py-4 font-body font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]">
              Explore Collection
            </button>
            <button className="border border-champagne/30 text-champagne text-xs tracking-widest uppercase px-10 py-4 font-body font-light hover:border-gold/60 hover:text-gold-light transition-all duration-300">
              Our Story
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-16 pt-10 border-t border-gold/20">
            {[
              { num: "18K", label: "Pure Gold" },
              { num: "2500+", label: "Unique Pieces" },
              { num: "50+", label: "Years Heritage" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-light text-gold-light mb-1">{s.num}</div>
                <div className="text-[10px] tracking-widest uppercase text-champagne/50 font-body">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating ring image right side */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[480px] h-[480px] float-anim">
        <img
          src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80"
          alt="Diamond ring"
          className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(201,168,76,0.3)]"
        />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-widest2 text-champagne/40 uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
