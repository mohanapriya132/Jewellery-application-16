import { Link, useNavigate } from "react-router-dom";
import { badgeColor } from "../data/products";
import StarRating from "./StarRating";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, showActions = true }) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="group bg-white relative flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span
            className={`absolute top-3 left-3 text-[9px] tracking-widest uppercase px-2.5 py-1 font-body font-medium ${badgeColor[product.badge]}`}
          >
            {product.badge}
          </span>
          {showActions && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white transition-colors"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg
                className={`w-4 h-4 transition-colors ${wishlisted ? "fill-gold text-gold" : "fill-none text-slate"}`}
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-obsidian/90 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-center">
            <span className="text-[10px] tracking-widest uppercase text-gold-light font-body">View Details</span>
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[9px] tracking-widest uppercase text-gold/70 font-body mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg font-light text-obsidian leading-tight mb-2 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-[9px] text-slate/50 font-body ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-body font-medium text-obsidian text-sm">{product.price}</span>
          {product.original && (
            <span className="font-body text-xs text-slate/40 line-through">{product.original}</span>
          )}
        </div>
        {showActions && (
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
              navigate('/cart');
            }}
            className="mt-3 w-full border border-obsidian/20 text-[10px] tracking-widest uppercase py-2.5 font-body text-obsidian/70 hover:bg-obsidian hover:text-gold hover:border-obsidian transition-all duration-300"
          >
            Add to Bag
          </button>
        )}
      </div>
    </div>
  );
}
