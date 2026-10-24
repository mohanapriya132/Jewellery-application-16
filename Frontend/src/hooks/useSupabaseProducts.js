import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { products as hardcodedProducts } from "../data/products";

/**
 * Safely parses a JSON column which might already be an object/array,
 * or might be a string, or might be malformed.
 */
function safeParseJSON(val, fallback = []) {
  if (Array.isArray(val)) return val;
  if (typeof val === "object" && val !== null) {
    // If it's a plain object but we expect an array, wrap it or return fallback
    return Array.isArray(fallback) ? [val] : val;
  }
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
}

/**
 * Maps a Supabase product row to the shape the app expects.
 * Supabase column names differ slightly from the hardcoded format
 * (e.g., price_display vs price, image_url vs image).
 */
function mapSupabaseProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price_display || row.price || "Contact for price",
    priceNum: row.price_num || row.priceNum || 0,
    original: (row.original_price || row.original) ?? null,
    rating: row.rating || 5,
    reviews: row.review_count || row.reviews || 0,
    image: row.image_url || row.image || "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&auto=format&fit=crop&q=80",
    images: safeParseJSON(row.images, []),
    badge: row.badge || null,
    tag: row.tag || row.category || "All",
    material: row.material || "",
    stone: row.stone || "",
    collection: row.collection || "",
    sku: row.sku || "",
    description: row.description || "",
    details: safeParseJSON(row.details, []),
    sizes: safeParseJSON(row.sizes, []),
    care: row.care || "",
    reviewList: [],
    sort_order: row.sort_order || 0
  };
}

/**
 * Hook to fetch all products from Supabase.
 * Falls back to hardcoded products if Supabase is empty or errors.
 */
export function useSupabaseProducts() {
  const [products, setProducts] = useState(hardcodedProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error: sbError } = await supabase
        .from("products")
        .select("*");

      if (sbError) {
        console.warn("[useSupabaseProducts] Supabase error:", sbError.message);
        setError(sbError.message);
      } else if (data) {
        const mapped = data.map(mapSupabaseProduct);
        mapped.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        setProducts(mapped);
        setError(null);
      }
    } catch (err) {
      console.warn("[useSupabaseProducts] Unexpected error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}

/**
 * Hook to fetch a single product by ID from Supabase.
 * Falls back to the matching hardcoded product if not found.
 */
export function useSupabaseProduct(id) {
  const numericId = Number(id);
  const fallback = hardcodedProducts.find((p) => p.id === numericId) || null;

  const [product, setProduct] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        // Fetch product + its approved reviews
        const [{ data: prodData, error: prodErr }, { data: revData }] = await Promise.all([
          supabase.from("products").select("*").eq("id", numericId).single(),
          supabase
            .from("product_reviews")
            .select("*")
            .eq("product_id", numericId)
            .eq("status", "Approved")
            .order("created_at", { ascending: false }),
        ]);

        if (cancelled) return;

        if (prodErr || !prodData) {
          console.warn("[useSupabaseProduct] Not found in Supabase, using fallback.");
          // Keep fallback
        } else {
          const mapped = mapSupabaseProduct(prodData);
          // Attach live reviews from product_reviews table
          if (revData && revData.length > 0) {
            mapped.reviewList = revData.map((r) => ({
              author: r.author,
              city: r.city,
              rating: r.rating,
              date: r.date,
              text: r.text,
            }));
          } else {
            // Keep hardcoded reviewList from fallback if Supabase has none
            mapped.reviewList = fallback?.reviewList || [];
          }
          setProduct(mapped);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[useSupabaseProduct] Unexpected error:", err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  return { product, loading, error };
}
