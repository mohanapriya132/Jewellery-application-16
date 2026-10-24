import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ variant = "navbar", autoFocus = false }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(variant === "page");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setOpen(false);
    }
  };

  if (variant === "page") {
    return (
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rings, necklaces, earrings..."
          className="w-full bg-white border border-obsidian/15 text-obsidian placeholder-slate/40 text-sm font-body px-5 py-4 pr-12 outline-none focus:border-gold/50 transition-colors"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gold hover:text-gold-dark transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
          </svg>
        </button>
      </form>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="text-champagne/70 hover:text-gold-light transition-colors"
        aria-label="Search"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="absolute right-0 top-full mt-3 w-72 sm:w-80 bg-obsidian border border-gold/20 shadow-xl z-50 p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/5 border border-gold/20 text-ivory placeholder-champagne/40 text-sm font-body px-4 py-2.5 outline-none focus:border-gold/50"
            />
            <button
              type="submit"
              className="mt-2 w-full bg-gold text-obsidian text-[10px] tracking-widest uppercase py-2 font-body hover:bg-gold-light transition-colors"
            >
              Search
            </button>
          </form>
        </>
      )}
    </div>
  );
}
