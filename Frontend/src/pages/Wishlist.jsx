import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { products } = useSupabaseProducts();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <div className="bg-obsidian pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-3">Your Collection</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-ivory mb-4">Wishlist</h1>
          <div className="divider-gold" />
          <p className="font-body text-sm text-champagne/50 mt-4">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? "piece" : "pieces"} saved
          </p>
        </div>
      </div>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gold/30 mx-auto mb-6" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="font-display text-2xl font-light text-obsidian mb-3">Your wishlist is empty</h2>
              <p className="font-body text-sm text-obsidian/50 mb-8">Save your favourite pieces to revisit later.</p>
              <Link
                to="/"
                className="inline-block bg-obsidian text-gold text-xs tracking-widest uppercase px-8 py-3 font-body hover:bg-gold hover:text-obsidian transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="bg-white border border-obsidian/5 flex flex-col">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[9px] tracking-widest uppercase text-gold/70 font-body mb-1">{product.category}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-display text-xl font-light text-obsidian mb-2 hover:text-gold transition-colors">{product.name}</h3>
                    </Link>
                    <p className="font-body font-medium text-obsidian text-sm mb-4">{product.price}</p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 bg-obsidian text-gold text-[10px] tracking-widest uppercase py-3 font-body hover:bg-gold hover:text-obsidian transition-colors"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="flex-1 border border-obsidian/20 text-[10px] tracking-widest uppercase py-3 font-body text-obsidian/60 hover:border-red-300 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
