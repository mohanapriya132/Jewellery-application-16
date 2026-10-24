import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { supabase } from "../supabaseClient";

const navLinks = [
  { label: "Collections", to: "/collections/wedding" },
  { label: "Rings", to: "/search?category=Rings" },
  { label: "Necklaces", to: "/search?category=Necklaces" },
  { label: "Earrings", to: "/search?category=Earrings" },
  { label: "Bracelets", to: "/search?category=Bracelets" },
  { label: "Custom Jewelry", to: "/custom-jewelry" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
  };
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (to) => {
    if (!to) return false;
    const [path] = to.split("?");
    return location.pathname === path || location.pathname + location.search === to;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-obsidian/95 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl font-light tracking-widest2 text-gold-light">AURELIA</span>
          <span className="text-[9px] tracking-widest3 text-champagne uppercase font-body font-light">Fine Jewellery</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-4 xl:gap-7">
          {navLinks.map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className={`text-xs tracking-widest uppercase font-body transition-colors duration-300 relative group ${
                  isActive(to) ? "text-gold-light" : "text-champagne/80 hover:text-gold-light"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                    isActive(to) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3 xl:gap-5">
          <SearchBar variant="navbar" />

          <Link to="/wishlist" className="relative text-champagne/70 hover:text-gold-light transition-colors" aria-label="Wishlist">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gold text-obsidian text-[8px] flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-champagne/70 hover:text-gold-light transition-colors" aria-label="Cart">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gold text-obsidian text-[8px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-champagne/80 hover:text-gold-light transition-colors text-xs tracking-widest uppercase font-body"
              >
                {user.user_metadata?.name || "User"}
                <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-40 bg-obsidian-light border border-gold/20 shadow-xl rounded-sm py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-xs tracking-widest uppercase text-champagne/80 hover:text-gold hover:bg-obsidian transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-xs tracking-widest uppercase text-red-400 hover:text-red-300 hover:bg-obsidian transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs tracking-widest uppercase text-champagne/80 hover:text-gold-light transition-colors font-body">
                Login
              </Link>
              <Link to="/signup" className="border border-gold/50 text-gold-light text-xs tracking-widest uppercase px-4 py-2 hover:bg-gold hover:text-obsidian transition-all duration-300 font-body">
                Sign Up
              </Link>
            </div>
          )}

          <Link
            to="/admin/login"
            className="hidden xl:block border border-gold/50 text-gold-light text-xs tracking-widest uppercase px-4 py-2 hover:bg-gold hover:text-obsidian transition-all duration-300 font-body"
          >
            Admin
          </Link>
        </div>

        <button className="lg:hidden text-champagne" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-px bg-gold-light transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-px bg-gold-light transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-gold-light transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      <div className={`lg:hidden overflow-hidden transition-all duration-400 ${menuOpen ? "max-h-screen" : "max-h-0"}`}>
        <div className="bg-obsidian/98 px-6 py-6 border-t border-gold/20">
          {navLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className={`block py-3 text-sm tracking-widest uppercase border-b border-gold/10 transition-colors ${
                isActive(to) ? "text-gold-light" : "text-champagne/80 hover:text-gold-light"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center gap-6 py-4 border-b border-gold/10">
            <Link to="/search" className="text-sm tracking-widest uppercase text-champagne/80 hover:text-gold-light">Search</Link>
            <Link to="/wishlist" className="text-sm tracking-widest uppercase text-champagne/80 hover:text-gold-light">
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <Link to="/cart" className="text-sm tracking-widest uppercase text-champagne/80 hover:text-gold-light">
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
          
          {user ? (
            <div className="py-4 border-b border-gold/10 flex flex-col gap-3">
              <span className="text-sm tracking-widest uppercase text-gold-light">
                {user.user_metadata?.name || "User"}
              </span>
              <Link to="/profile" className="text-sm tracking-widest uppercase text-champagne/80 hover:text-gold-light" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left text-sm tracking-widest uppercase text-red-400 hover:text-red-300">
                Logout
              </button>
            </div>
          ) : (
            <div className="py-4 border-b border-gold/10 flex flex-col gap-3">
              <Link to="/login" className="text-sm tracking-widest uppercase text-champagne/80 hover:text-gold-light" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="text-sm tracking-widest uppercase text-champagne/80 hover:text-gold-light" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}

          <Link
            to="/admin/login"
            className="mt-4 block w-full text-center border border-gold/50 text-gold-light text-xs tracking-widest uppercase py-3 hover:bg-gold hover:text-obsidian transition-all duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
