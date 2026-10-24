import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import engagementImg from "../assets/engagement_ring_hero.png";
import weddingBandsImg from "../assets/wedding_bands_hero.png";
import luxuryImg from "../assets/luxury_jewelry_hero.png";

/* ─── Data ─────────────────────────────────────────────────────────── */
const categories = [
  {
    id: "engagement",
    tag: "Forever Begins Here",
    title: "Engagement Rings",
    subtitle: "The Symbol of Your Promise",
    description:
      "Discover our curated collection of breathtaking engagement rings — each hand-crafted with ethically sourced diamonds and precious gemstones to mark the beginning of your forever.",
    image: engagementImg,
    accent: "#E5C97A",
    pieces: "240+ Pieces",
    startingPrice: "From ₹ 85,000",
    features: ["GIA Certified Diamonds", "Custom Engraving", "Lifetime Warranty"],
    badge: "Best Seller",
  },
  {
    id: "wedding-bands",
    tag: "United in Gold",
    title: "Wedding Bands",
    subtitle: "Worn for a Lifetime",
    description:
      "Our wedding bands are crafted to complement every engagement ring in our collection. Choose from classic plain bands to diamond-eternity designs that celebrate the infinite circle of love.",
    image: weddingBandsImg,
    accent: "#C9A84C",
    pieces: "180+ Pieces",
    startingPrice: "From ₹ 45,000",
    features: ["His & Hers Sets", "Comfort-Fit Design", "Free Resizing"],
    badge: "New Arrivals",
  },
  {
    id: "luxury",
    tag: "Rare & Extraordinary",
    title: "Luxury Jewelry",
    subtitle: "Wearable Masterpieces",
    description:
      "From diamond rivieras to emerald pendant necklaces, our luxury collection represents the pinnacle of fine jewellery artistry — pieces destined to become tomorrow's heirlooms.",
    image: luxuryImg,
    accent: "#9A7A35",
    pieces: "320+ Pieces",
    startingPrice: "From ₹ 1,20,000",
    features: ["One-of-a-Kind Pieces", "Private Consultation", "Bespoke Creation"],
    badge: "Exclusive",
  },
];

const featuredProducts = [
  { id: 1, name: "Celestial Solitaire", category: "Engagement Ring", price: "₹ 1,85,000", material: "18K White Gold · 1.5ct Diamond", badge: "Most Loved" },
  { id: 2, name: "Eternité Band", category: "Wedding Band", price: "₹ 95,000", material: "Platinum · Diamond Pavé", badge: "New" },
  { id: 3, name: "Aurora Necklace", category: "Luxury Jewelry", price: "₹ 2,40,000", material: "18K Gold · Emerald & Diamonds", badge: "Exclusive" },
  { id: 4, name: "Lumière Halo Ring", category: "Engagement Ring", price: "₹ 2,20,000", material: "18K Rose Gold · 1.2ct Diamond", badge: "Trending" },
  { id: 5, name: "Classic Duo Set", category: "Wedding Band", price: "₹ 1,10,000", material: "18K Yellow Gold · His & Hers", badge: "Set Deal" },
  { id: 6, name: "Sapphire Riviera", category: "Luxury Jewelry", price: "₹ 3,80,000", material: "Platinum · Blue Sapphires", badge: "Rare Find" },
];

const stats = [
  { value: "50+", label: "Years of Craftsmanship" },
  { value: "740+", label: "Wedding Pieces" },
  { value: "12K+", label: "Happy Couples" },
  { value: "100%", label: "Ethically Sourced" },
];

/* ─── Hook: Intersection Observer ──────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Sub-components ────────────────────────────────────────────────── */

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold/10"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatParticle ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />

      {/* Diagonal gold line accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[15%] w-px h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="absolute top-0 right-[20%] w-px h-48 bg-gradient-to-b from-transparent via-gold/20 to-transparent" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-[35%] w-px h-24 bg-gradient-to-t from-transparent via-gold/25 to-transparent" />
      </div>

      <div className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-6 flex items-center justify-center gap-4">
          <span className="w-10 h-px bg-gold/50" />
          Aurelia Wedding Collections
          <span className="w-10 h-px bg-gold/50" />
        </p>

        <h1 className="font-display text-6xl md:text-8xl font-light text-ivory leading-[0.95] mb-6">
          <span className="block">Love, Forged</span>
          <span className="block italic text-gold-light">in Gold</span>
        </h1>

        <p className="font-body font-light text-champagne/60 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Celebrate your most cherished moments with jewellery crafted for eternity.
          From the proposal to the aisle and beyond.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#collections"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-obsidian text-xs tracking-widest uppercase px-8 py-4 font-body font-medium transition-all duration-300 group"
          >
            Explore Collection
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 border border-gold/40 text-gold-light text-xs tracking-widest uppercase px-8 py-4 font-body hover:bg-gold/10 transition-all duration-300"
          >
            Book a Consultation
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-widest3 text-champagne/30 uppercase font-body">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

function StatsBar() {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} className="bg-obsidian border-y border-gold/15 py-10">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="font-display text-3xl md:text-4xl font-light text-gold-light mb-1">{s.value}</div>
            <div className="text-[9px] tracking-widest uppercase text-champagne/40 font-body">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ cat, index }) {
  const [ref, inView] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 items-stretch min-h-[600px] transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image side */}
      <div
        className={`relative overflow-hidden group ${isEven ? "lg:order-1" : "lg:order-2"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={cat.image}
          alt={cat.title}
          className={`w-full h-full object-cover min-h-[400px] transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"}`}
        />
        {/* Dark overlay gradient */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-20" : "opacity-40"}`}
          style={{ background: "linear-gradient(135deg, #0D0D0D 0%, transparent 60%)" }} />

        {/* Badge */}
        <div className="absolute top-6 left-6">
          <span className="text-[9px] tracking-widest3 uppercase font-body font-medium px-3 py-1.5 bg-gold text-obsidian">
            {cat.badge}
          </span>
        </div>

        {/* Piece count bottom */}
        <div className="absolute bottom-6 right-6 text-right">
          <div className="font-display text-2xl font-light text-ivory/80">{cat.pieces}</div>
          <div className="text-[8px] tracking-widest uppercase text-champagne/40 font-body">Available</div>
        </div>

        {/* Animated corner accent */}
        <div className={`absolute top-0 right-0 w-16 h-16 pointer-events-none transition-all duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute top-0 right-0 w-8 h-px bg-gold" />
          <div className="absolute top-0 right-0 w-px h-8 bg-gold" />
        </div>
        <div className={`absolute bottom-0 left-0 w-16 h-16 pointer-events-none transition-all duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute bottom-0 left-0 w-8 h-px bg-gold" />
          <div className="absolute bottom-0 left-0 w-px h-8 bg-gold" />
        </div>
      </div>

      {/* Content side */}
      <div
        className={`flex flex-col justify-center px-10 py-14 lg:px-16 bg-obsidian ${isEven ? "lg:order-2" : "lg:order-1"}`}
        style={{ borderLeft: isEven ? `1px solid ${cat.accent}22` : "none", borderRight: !isEven ? `1px solid ${cat.accent}22` : "none" }}
      >
        <p className="text-[9px] tracking-widest3 uppercase font-body mb-4 flex items-center gap-3" style={{ color: cat.accent }}>
          <span className="w-8 h-px" style={{ background: cat.accent }} />
          {cat.tag}
        </p>

        <h2 className="font-display text-4xl md:text-5xl font-light text-ivory leading-tight mb-2">
          {cat.title}
        </h2>
        <p className="font-display italic text-xl font-light mb-6" style={{ color: cat.accent }}>
          {cat.subtitle}
        </p>

        <div className="w-12 h-px mb-6" style={{ background: `linear-gradient(90deg, ${cat.accent}, transparent)` }} />

        <p className="font-body font-light text-champagne/55 text-sm leading-relaxed mb-8 max-w-sm">
          {cat.description}
        </p>

        {/* Features */}
        <ul className="space-y-2.5 mb-10">
          {cat.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-xs font-body text-champagne/60">
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke={cat.accent} strokeWidth="1" />
                <path d="M5 8l2 2 4-4" stroke={cat.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-[9px] tracking-widest uppercase text-champagne/30 font-body mb-0.5">Starting Price</div>
            <div className="font-display text-2xl font-light" style={{ color: cat.accent }}>{cat.startingPrice}</div>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-body px-6 py-3 border transition-all duration-300 group hover:text-obsidian"
            style={{ borderColor: `${cat.accent}60`, color: cat.accent, "--hover-bg": cat.accent }}
            onMouseEnter={e => { e.currentTarget.style.background = cat.accent; e.currentTarget.style.color = "#0D0D0D"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = cat.accent; }}
          >
            Shop Now
            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function FeaturedProducts() {
  const [ref, inView] = useInView(0.1);
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Engagement Ring", "Wedding Band", "Luxury Jewelry"];
  const visible = filter === "All" ? featuredProducts : featuredProducts.filter(p => p.category === filter);

  return (
    <section ref={ref} className="bg-ivory py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-3">Handpicked For You</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-obsidian mb-4">Featured Pieces</h2>
          <div className="divider-gold" />
        </div>

        {/* Filter tabs */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] tracking-widest uppercase font-body px-5 py-2 border transition-all duration-300 ${filter === f
                  ? "bg-obsidian text-gold border-obsidian"
                  : "border-obsidian/20 text-obsidian/50 hover:border-gold/50 hover:text-gold"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 80} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, delay, inView }) {
  const [hovered, setHovered] = useState(false);
  const bgColors = {
    "Engagement Ring": "from-[#1a1208] to-obsidian",
    "Wedding Band": "from-[#150f00] to-obsidian",
    "Luxury Jewelry": "from-[#0e1209] to-obsidian",
  };

  return (
    <div
      className={`group relative border border-obsidian/10 hover:border-gold/30 transition-all duration-700 overflow-hidden cursor-pointer ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay + 200}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Visual placeholder — gradient with icon */}
      <div className={`relative h-56 bg-gradient-to-br ${bgColors[product.category] || "from-obsidian to-slate"} flex items-center justify-center overflow-hidden`}>
        <div className={`transition-all duration-500 ${hovered ? "scale-110 opacity-80" : "scale-100 opacity-60"}`}>
          <svg className="w-14 h-14 text-gold/40" fill="none" stroke="currentColor" strokeWidth={0.6} viewBox="0 0 64 64">
            <path d="M32 8 L54 22 L54 42 L32 56 L10 42 L10 22 Z" />
            <path d="M32 8 L32 56M10 22 L54 22M10 42 L54 42M10 22 L32 8 L54 22M10 42 L32 56 L54 42" strokeDasharray="2 3" />
          </svg>
        </div>

        {/* Badge */}
        <span className="absolute top-4 left-4 text-[8px] tracking-widest uppercase font-body px-2.5 py-1 bg-gold text-obsidian font-medium">
          {product.badge}
        </span>

        {/* Wishlist */}
        <button className={`absolute top-4 right-4 w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-champagne/50 hover:text-gold hover:border-gold transition-all duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gold/5 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`} />
      </div>

      {/* Info */}
      <div className="p-5 bg-white">
        <div className="text-[8px] tracking-widest uppercase text-gold font-body mb-1">{product.category}</div>
        <h3 className="font-display text-xl font-light text-obsidian mb-0.5">{product.name}</h3>
        <p className="text-xs font-body text-obsidian/40 mb-4">{product.material}</p>

        <div className="flex items-center justify-between">
          <span className="font-body text-sm font-medium text-obsidian">{product.price}</span>
          <button className={`text-[9px] tracking-widest uppercase font-body px-4 py-2 border border-obsidian/20 text-obsidian/60 hover:bg-obsidian hover:text-gold hover:border-obsidian transition-all duration-300 ${hovered ? "border-gold/40 text-gold" : ""}`}>
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}

function BespokeSection() {
  const [ref, inView] = useInView(0.2);
  return (
    <section ref={ref} className="relative bg-obsidian py-28 px-6 overflow-hidden">
      {/* Background ornament */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
        <svg className="w-[600px] h-[600px]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="#C9A84C" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="70" stroke="#C9A84C" strokeWidth="0.3" />
          <path d="M100 10 L100 190M10 100 L190 100M29 29 L171 171M171 29 L29 171" stroke="#C9A84C" strokeWidth="0.3" />
        </svg>
      </div>

      <div className={`relative z-10 max-w-3xl mx-auto text-center transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-4 flex items-center justify-center gap-4">
          <span className="w-10 h-px bg-gold/40" />
          Bespoke Service
          <span className="w-10 h-px bg-gold/40" />
        </p>

        <h2 className="font-display text-5xl md:text-6xl font-light text-ivory leading-tight mb-4">
          Dream It.<br />
          <span className="italic text-gold-light">We'll Create It.</span>
        </h2>

        <div className="divider-gold my-6" />

        <p className="font-body font-light text-champagne/50 text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto">
          Work directly with our master craftsmen to design the ring or jewellery of your dreams.
          From sketches to the finished piece — your vision, perfected in gold.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-12 text-left">
          {[
            { step: "01", title: "Consultation", desc: "Share your vision with our expert designers" },
            { step: "02", title: "Design", desc: "We craft a 3D render for your approval" },
            { step: "03", title: "Creation", desc: "Master artisans bring your piece to life" },
          ].map((s) => (
            <div key={s.step} className="border border-gold/15 p-6 hover:border-gold/30 transition-colors duration-300">
              <div className="font-display text-3xl font-light text-gold/30 mb-3">{s.step}</div>
              <div className="text-xs tracking-widest uppercase text-ivory font-body mb-2">{s.title}</div>
              <div className="text-xs font-body font-light text-champagne/40">{s.desc}</div>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="inline-flex items-center gap-3 bg-transparent border border-gold/50 text-gold-light text-xs tracking-widest uppercase px-10 py-4 font-body hover:bg-gold hover:text-obsidian transition-all duration-300 group"
        >
          Begin Your Journey
          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}

function Testimonial() {
  const [ref, inView] = useInView(0.2);
  const testimonials = [
    { quote: "The engagement ring Aurelia crafted was beyond anything I imagined. She cried when she saw it.", author: "Arjun & Priya", city: "Mumbai" },
    { quote: "Our wedding bands are perfect. The attention to detail and quality is unmatched.", author: "Rohit & Sneha", city: "Bangalore" },
    { quote: "The bespoke necklace for our anniversary is a masterpiece I'll treasure forever.", author: "Vivek & Ananya", city: "Delhi" },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="bg-ivory py-24 px-6 overflow-hidden">
      <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}>
        <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-8 flex items-center justify-center gap-4">
          <span className="w-8 h-px bg-gold/40" />
          Love Stories
          <span className="w-8 h-px bg-gold/40" />
        </p>
        <div className="relative min-h-[140px]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-700 ${i === active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
            >
              <svg className="w-8 h-8 text-gold/30 mx-auto mb-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="font-display text-xl md:text-2xl font-light text-obsidian/80 italic leading-relaxed mb-6">"{t.quote}"</p>
              <div className="text-[10px] tracking-widest uppercase text-gold font-body">{t.author} · {t.city}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`w-6 h-px transition-all duration-300 ${i === active ? "bg-gold" : "bg-obsidian/20"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function WeddingCollection() {
  return (
    <div className="min-h-screen bg-obsidian">
      <Navbar />
      <HeroSection />
      <StatsBar />

      {/* Category Cards */}
      <section id="collections" className="bg-obsidian">
        <div className="border-b border-gold/10 py-16 px-6 text-center">
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-3 flex items-center justify-center gap-4">
            <span className="w-10 h-px bg-gold/40" />
            The Wedding Edit
            <span className="w-10 h-px bg-gold/40" />
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-ivory mb-3">Our Collections</h2>
          <p className="font-body font-light text-champagne/40 text-sm">Three collections. One promise. Yours forever.</p>
        </div>
        <div className="divide-y divide-gold/10">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </section>

      <FeaturedProducts />
      <BespokeSection />
      <Testimonial />
      <Footer />

      {/* Global animation keyframes */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
