import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";

const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets"];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "All"
  );

  const { products, loading } = useSupabaseProducts();

  useEffect(() => {
    setQuery(initialQuery);
    const cat = searchParams.get("category") || "All";
    setCategory(categories.includes(cat) ? cat : "All");
  }, [initialQuery, searchParams]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      if (!q) return matchesCategory;
      const searchable = [p.name, p.category, p.material, p.stone, p.collection, p.sku]
        .join(" ")
        .toLowerCase();
      return matchesCategory && searchable.includes(q);
    });
  }, [query, category, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (query.trim()) params.q = query.trim();
    if (category !== "All") params.category = category;
    setSearchParams(params);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const params = {};
    if (query.trim()) params.q = query.trim();
    if (cat !== "All") params.category = cat;
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <div className="bg-obsidian pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-3">Discover</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-ivory mb-6">Search Products</h1>
          <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rings, necklaces, earrings..."
              className="w-full bg-white/5 border border-gold/20 text-ivory placeholder-champagne/40 text-sm font-body px-5 py-4 pr-12 outline-none focus:border-gold/50 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gold hover:text-gold-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-[10px] tracking-widest uppercase px-6 py-2.5 transition-all duration-300 font-body ${
                  category === cat
                    ? "bg-obsidian text-ivory border border-obsidian"
                    : "border border-obsidian/20 text-slate hover:border-gold hover:text-gold bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-center text-sm font-body text-obsidian/50 mb-8">
            {loading ? (
              <span className="animate-pulse">Loading products...</span>
            ) : (
              <>
                {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"}
                {query.trim() && <> for &ldquo;{query.trim()}&rdquo;</>}
                {category !== "All" && <> in {category}</>}
              </>
            )}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white/60 animate-pulse" style={{ aspectRatio: "3/4" }} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-2xl font-light text-obsidian mb-3">No products found</p>
              <p className="font-body text-sm text-obsidian/50">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
