import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StarRating from "../components/StarRating";
import { products as hardcodedProducts, badgeColor } from "../data/products";
import { useSupabaseProduct, useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Image Gallery ─────────────────────────────────────────────────── */
function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 overflow-hidden border-2 transition-all duration-300 ${
              active === i ? "border-gold" : "border-transparent hover:border-gold/40"
            }`}
          >
            <img src={img} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="relative flex-1 overflow-hidden bg-mist cursor-zoom-in group"
        style={{ minHeight: "520px" }}
        onClick={() => setZoomed(true)}
      >
        <img
          src={images[active]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge strip */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="text-[9px] tracking-widest uppercase font-body font-medium px-3 py-1.5 bg-gold text-obsidian">
            GIA Certified
          </span>
        </div>

        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-obsidian/70 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-3 h-3 text-champagne" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
          </svg>
          <span className="text-[9px] tracking-widest uppercase text-champagne font-body">Zoom</span>
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); setActive(a => (a - 1 + images.length) % images.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-obsidian/60 hover:bg-obsidian/90 flex items-center justify-center text-champagne transition-all opacity-0 group-hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={e => { e.stopPropagation(); setActive(a => (a + 1) % images.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-obsidian/60 hover:bg-obsidian/90 flex items-center justify-center text-champagne transition-all opacity-0 group-hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setActive(i); }}
              className={`rounded-full transition-all duration-300 ${i === active ? "w-4 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-white/40"}`} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {zoomed && (
        <div className="fixed inset-0 z-[100] bg-obsidian/95 flex items-center justify-center p-8" onClick={() => setZoomed(false)}>
          <img src={images[active]} alt={name} className="max-w-full max-h-full object-contain" />
          <button className="absolute top-6 right-6 text-champagne hover:text-gold transition-colors" onClick={() => setZoomed(false)}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Accordion ─────────────────────────────────────────────────────── */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-obsidian/10">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-xs tracking-widest uppercase font-body text-obsidian group-hover:text-gold transition-colors">{title}</span>
        <svg
          className={`w-4 h-4 text-gold transition-transform duration-300 ${open ? "rotate-45" : "rotate-0"}`}
          fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${open ? "max-h-screen pb-5" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  );
}

/* ─── Review Card ───────────────────────────────────────────────────── */
function ReviewCard({ review, delay, inView }) {
  return (
    <div
      className={`bg-mist p-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-body font-medium text-obsidian">{review.author}</div>
          <div className="text-[9px] tracking-widest uppercase text-gold font-body">{review.city}</div>
        </div>
        <div className="text-[9px] text-obsidian/30 font-body">{review.date}</div>
      </div>
      <StarRating rating={review.rating} size="w-3 h-3" />
      <p className="mt-3 text-sm font-body font-light text-obsidian/60 leading-relaxed">{review.text}</p>
    </div>
  );
}

/* ─── Related Product Card ──────────────────────────────────────────── */
function RelatedCard({ product }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => { navigate(`/product/${product.id}`); window.scrollTo(0, 0); }}
      className="group bg-white cursor-pointer relative flex flex-col border border-transparent hover:border-gold/20 transition-all duration-300"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <span className={`absolute top-3 left-3 text-[9px] tracking-widest uppercase px-2.5 py-1 font-body font-medium ${badgeColor[product.badge]}`}>
          {product.badge}
        </span>
        <div className="absolute bottom-0 left-0 right-0 bg-obsidian/90 py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-center">
          <span className="text-[10px] tracking-widest uppercase text-gold-light font-body">View Details</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[9px] tracking-widest uppercase text-gold/70 font-body mb-1">{product.category}</p>
        <h3 className="font-display text-lg font-light text-obsidian mb-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.rating} size="w-3 h-3" />
          <span className="text-[9px] text-obsidian/40 font-body">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-body font-medium text-obsidian text-sm">{product.price}</span>
          {product.original && <span className="font-body text-xs text-obsidian/30 line-through">{product.original}</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading: productLoading } = useSupabaseProduct(id);
  const { products } = useSupabaseProducts();
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewsRef, reviewsInView] = useInView(0.1);
  const [relatedRef, relatedInView] = useInView(0.1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const wishlisted = product ? isInWishlist(product.id) : false;
  const related = products.filter(p => p.id !== product?.id && p.tag === product?.tag).slice(0, 4);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty, selectedSize);
    navigate('/cart');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize(null);
    setQty(1);
    setAdded(false);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32">
          <div className="font-display text-6xl font-light text-obsidian/20 mb-4">404</div>
          <h1 className="font-display text-3xl font-light text-obsidian mb-3">Product Not Found</h1>
          <p className="font-body text-sm text-obsidian/50 mb-8">The piece you're looking for may have been sold or removed.</p>
          <Link to="/" className="bg-gold text-obsidian text-xs tracking-widest uppercase px-8 py-3 font-body hover:bg-gold-light transition-colors">
            Return to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const ratingAvg = product.reviewList.reduce((a, r) => a + r.rating, 0) / product.reviewList.length;

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div className="bg-obsidian pt-20 pb-0">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-2 text-[10px] tracking-widest uppercase font-body text-champagne/30">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-gold transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-champagne/60">{product.name}</span>
        </div>
      </div>

      {/* ── Main Product Section ── */}
      <section className="bg-ivory">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left — Gallery */}
          <div className="sticky top-24">
            <ImageGallery images={product.images} name={product.name} />
          </div>

          {/* Right — Info */}
          <div>
            {/* Badge + Collection */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[9px] tracking-widest uppercase px-3 py-1.5 font-body font-medium ${badgeColor[product.badge]}`}>
                {product.badge}
              </span>
              <span className="text-[9px] tracking-widest uppercase text-gold font-body">{product.collection} Collection</span>
            </div>

            {/* Name */}
            <h1 className="font-display text-4xl md:text-5xl font-light text-obsidian leading-tight mb-2">
              {product.name}
            </h1>
            <p className="font-body text-sm text-obsidian/40 mb-4">SKU: {product.sku}</p>

            {/* Rating Summary */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-obsidian/10">
              <StarRating rating={Math.round(ratingAvg)} />
              <span className="text-sm font-body text-obsidian/60">{ratingAvg.toFixed(1)}</span>
              <span className="text-[10px] text-obsidian/30 font-body">({product.reviewList.length} reviews)</span>
              <a href="#reviews" className="text-[10px] tracking-widest uppercase text-gold hover:text-gold-dark font-body transition-colors ml-auto">
                Read Reviews
              </a>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-display text-4xl font-light text-obsidian">{product.price}</span>
              {product.original && (
                <>
                  <span className="font-body text-lg text-obsidian/30 line-through">{product.original}</span>
                  <span className="text-[9px] tracking-widest uppercase bg-red-900/10 text-red-800 px-2 py-1 font-body">
                    Save {Math.round((1 - product.priceNum / parseInt(product.original.replace(/[^0-9]/g, ""))) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Material + Stone pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[{ label: "Metal", val: product.material }, { label: "Stone", val: product.stone }].map(p => (
                <div key={p.label} className="flex items-center gap-2 bg-white border border-obsidian/10 px-4 py-2">
                  <span className="text-[8px] tracking-widest uppercase text-gold font-body">{p.label}</span>
                  <span className="text-xs font-body text-obsidian/70">{p.val}</span>
                </div>
              ))}
            </div>

            {/* Size Selector */}
            {product.sizes.length > 1 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-widest uppercase font-body text-obsidian">
                    {product.category === "Necklaces" ? "Chain Length" : product.category === "Bracelets" ? "Bracelet Size" : "Ring Size"}
                  </span>
                  <button className="text-[9px] tracking-widest uppercase text-gold hover:text-gold-dark font-body transition-colors flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[48px] px-3 py-2 text-xs font-body border transition-all duration-200 ${
                        selectedSize === s
                          ? "bg-obsidian text-gold border-obsidian"
                          : "border-obsidian/20 text-obsidian/60 hover:border-gold/50 hover:text-gold"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] tracking-widest uppercase font-body text-obsidian">Quantity</span>
              <div className="flex items-center border border-obsidian/20">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-obsidian/60 hover:text-gold hover:bg-gold/5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center text-sm font-body text-obsidian">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-obsidian/60 hover:text-gold hover:bg-gold/5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 text-xs tracking-widest uppercase font-body font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  added
                    ? "bg-green-800 text-ivory"
                    : "bg-obsidian hover:bg-gold hover:text-obsidian text-gold"
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Bag
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Bag
                  </>
                )}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 border flex items-center justify-center transition-all duration-300 ${
                  wishlisted ? "border-gold bg-gold/10 text-gold" : "border-obsidian/20 text-obsidian/40 hover:border-gold/50 hover:text-gold"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg className={`w-5 h-5 transition-all ${wishlisted ? "fill-gold" : "fill-none"}`} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="w-14 h-14 border border-obsidian/20 flex items-center justify-center text-obsidian/40 hover:border-gold/50 hover:text-gold transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-8 p-5 bg-white border border-obsidian/8">
              {[
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Certified Authentic" },
                { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", label: "Free Insured Shipping" },
                { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: "30-Day Returns" },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-2 text-center">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                  </svg>
                  <span className="text-[8px] tracking-widest uppercase text-obsidian/50 font-body leading-tight">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="border-t border-obsidian/10">
              <Accordion title="Description" defaultOpen>
                <p className="text-sm font-body font-light text-obsidian/60 leading-relaxed">{product.description}</p>
              </Accordion>
              <Accordion title="Product Details">
                <table className="w-full text-sm">
                  <tbody>
                    {product.details.map(d => (
                      <tr key={d.label} className="border-b border-obsidian/5 last:border-0">
                        <td className="py-2.5 pr-4 text-[9px] tracking-widest uppercase text-gold font-body w-2/5">{d.label}</td>
                        <td className="py-2.5 text-xs font-body font-light text-obsidian/60">{d.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Accordion>
              <Accordion title="Care Instructions">
                <p className="text-sm font-body font-light text-obsidian/60 leading-relaxed">{product.care}</p>
              </Accordion>
              <Accordion title="Shipping & Returns">
                <div className="space-y-2 text-sm font-body font-light text-obsidian/60">
                  <p>✦ Complimentary insured shipping across India (3–5 business days)</p>
                  <p>✦ Express delivery available (1–2 business days)</p>
                  <p>✦ International shipping to 40+ countries</p>
                  <p>✦ 30-day hassle-free returns for unworn, unaltered pieces</p>
                  <p>✦ Free ring resizing within 60 days of purchase</p>
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" ref={reviewsRef} className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 transition-all duration-700 ${reviewsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div>
              <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-2">Customer Stories</p>
              <h2 className="font-display text-4xl font-light text-obsidian">Reviews</h2>
            </div>

            {/* Summary */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-display text-5xl font-light text-obsidian">{ratingAvg.toFixed(1)}</div>
                <StarRating rating={Math.round(ratingAvg)} />
                <div className="text-[9px] text-obsidian/40 font-body mt-1">{product.reviewList.length} reviews</div>
              </div>
              <div className="w-px h-16 bg-obsidian/10" />
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = product.reviewList.filter(r => r.rating === star).length;
                  const pct = product.reviewList.length > 0 ? (count / product.reviewList.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[9px] font-body text-obsidian/40 w-3">{star}</span>
                      <div className="w-28 h-1.5 bg-obsidian/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[9px] font-body text-obsidian/30">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Review Cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {product.reviewList.map((r, i) => (
              <ReviewCard key={i} review={r} delay={i * 100} inView={reviewsInView} />
            ))}
          </div>

          {/* Write a review */}
          <div className={`mt-10 p-8 bg-obsidian transition-all duration-700 delay-500 ${reviewsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h3 className="font-display text-2xl font-light text-ivory mb-1">Share Your Experience</h3>
            <p className="text-xs font-body text-champagne/40 mb-6">Your review helps other customers make confident choices.</p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Your Name" className="bg-white/5 border border-gold/20 text-ivory placeholder-champagne/30 text-sm font-body px-4 py-3 outline-none focus:border-gold/50 transition-colors" />
              <input type="email" placeholder="Email Address" className="bg-white/5 border border-gold/20 text-ivory placeholder-champagne/30 text-sm font-body px-4 py-3 outline-none focus:border-gold/50 transition-colors" />
            </div>
            <textarea rows={3} placeholder="Write your review…" className="w-full bg-white/5 border border-gold/20 text-ivory placeholder-champagne/30 text-sm font-body px-4 py-3 outline-none focus:border-gold/50 transition-colors resize-none mb-4" />
            <button className="bg-gold hover:bg-gold-light text-obsidian text-xs tracking-widest uppercase px-8 py-3 font-body font-medium transition-colors duration-300">
              Submit Review
            </button>
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section ref={relatedRef} className="bg-mist py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${relatedInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-2">You May Also Love</p>
              <h2 className="font-display text-4xl font-light text-obsidian mb-4">Related Pieces</h2>
              <div className="divider-gold" />
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-5 transition-all duration-700 delay-200 ${relatedInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              {related.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
