import { useState } from "react";
import { useSupabaseData } from "../hooks/useSupabaseData";

/* ─── Hardcoded fallback reviews ────────────────────────────── */
const hardcodedReviews = [
  {
    id: 1,
    author: "Meera Krishnamurthy",
    city: "Mumbai",
    rating: 5,
    text: "The Celestial Diamond Ring is absolutely breathtaking. Aurelia's craftsmanship is unmatched — every detail is perfect. My husband proposed with this ring and I've never stopped getting compliments.",
    product_name: "Celestial Diamond Ring",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    date: "2 weeks ago",
  },
  {
    id: 2,
    author: "Ananya Sharma",
    city: "Delhi",
    rating: 5,
    text: "Ordered the Pearl Cascade Necklace for my anniversary. It arrived beautifully packaged and looked even more stunning in person. The quality exceeded every expectation.",
    product_name: "Pearl Cascade Necklace",
    avatar_url: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&auto=format&fit=crop&q=80",
    date: "1 month ago",
  },
  {
    id: 3,
    author: "Priyanka Reddy",
    city: "Hyderabad",
    rating: 5,
    text: "From browsing to delivery, everything was seamless. The Ruby Drop Earrings are exquisite — I wore them to a gala and received so many compliments. Truly luxury redefined.",
    product_name: "Ruby Drop Earrings",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    date: "3 weeks ago",
  },
  {
    id: 4,
    author: "Kavitha Nair",
    city: "Bangalore",
    rating: 5,
    text: "The Gold Tennis Bracelet is magnificent. Wearing it feels like wearing a piece of art. Aurelia's attention to detail and quality is extraordinary. Worth every rupee.",
    product_name: "Gold Tennis Bracelet",
    avatar_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80",
    date: "5 days ago",
  },
  {
    id: 5,
    author: "Divya Venkatesh",
    city: "Chennai",
    rating: 5,
    text: "I've purchased from several luxury jewellers but Aurelia stands apart. The Sapphire Halo Ring is beyond beautiful — it glows in any light. Exceptional service too.",
    product_name: "Sapphire Halo Ring",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    date: "2 months ago",
  },
];

export default function Reviews() {
  const [active, setActive] = useState(0);
  const { data: reviews } = useSupabaseData("product_reviews", hardcodedReviews, {
    filter: { status: "Approved" },
    orderBy: { column: "created_at", ascending: false },
  });

  // Only show reviews that have an avatar (homepage testimonials)
  const displayReviews = reviews.filter((r) => r.avatar_url).slice(0, 5);
  const currentReview = displayReviews[active] || displayReviews[0];

  if (!currentReview) return null;

  return (
    <section className="bg-obsidian py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body font-light mb-3">Testimonials</p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-ivory mb-4">
            Words of <em className="gold-shimmer not-italic">Love</em>
          </h2>
          <div className="divider-gold" />
        </div>

        {/* Main Review */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="text-gold text-4xl font-display mb-6">"</div>
          <p className="font-display text-xl md:text-2xl font-light text-ivory/90 leading-relaxed mb-8">
            {currentReview.text}
          </p>
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-gold text-gold" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <img
            src={currentReview.avatar_url}
            alt={currentReview.author}
            className="w-14 h-14 rounded-full object-cover mx-auto mb-3 border-2 border-gold/30"
          />
          <p className="font-body font-medium text-ivory text-sm">{currentReview.author}</p>
          <p className="text-[10px] tracking-widest uppercase text-champagne/40 font-body mt-1">
            {currentReview.city} · {currentReview.product_name}
          </p>
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-3 flex-wrap">
          {displayReviews.map((r, i) => (
            <button
              key={r.id || i}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 ${
                i === active
                  ? "ring-2 ring-gold ring-offset-2 ring-offset-obsidian"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              <img
                src={r.avatar_url}
                alt={r.author}
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Rating summary */}
        <div className="mt-16 pt-10 border-t border-gold/20 grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
          {[
            { num: "4.9", label: "Average Rating" },
            { num: "5K+", label: "Happy Customers" },
            { num: "98%", label: "Recommend Us" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl font-light text-gold-light mb-1">{s.num}</div>
              <div className="text-[9px] tracking-widest uppercase text-champagne/40 font-body">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
