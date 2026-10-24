import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import { initiateRazorpayPayment } from "../services/paymentService";

/* ── Checkout Modal ──────────────────────────────────────────────────── */
function CheckoutModal({ onClose, cartItems, cartTotal }) {
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", pincode: "", payment: "card",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.payment === "cod") {
      setStep(2);
      return;
    }

    // Online payment using Razorpay
    setIsProcessing(true);
    
    await initiateRazorpayPayment(
      { amount: grandTotal },
      { name: form.name, email: form.email, contact: form.phone },
      (successData) => {
        setIsProcessing(false);
        setStep(2); // Show success screen
      },
      (error) => {
        setIsProcessing(false);
        // Error handling is already done in the service via alerts
      }
    );
  };

  const shipping = cartTotal >= 100000 ? 0 : 999;
  const taxes = Math.round(cartTotal * 0.03);
  const grandTotal = cartTotal + shipping + taxes;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ivory w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-obsidian px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-[9px] tracking-widest3 text-gold uppercase font-body mb-1">Aurelia Fine Jewellery</p>
            <h2 className="font-display text-2xl font-light text-ivory">
              {step === 1 ? "Secure Checkout" : "Order Confirmed"}
            </h2>
          </div>
          <button onClick={onClose} className="text-champagne/60 hover:text-gold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Contact */}
            <div>
              <h3 className="text-[9px] tracking-widest3 uppercase text-gold font-body mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-obsidian/50 font-body mb-1.5">Full Name *</label>
                  <input
                    name="name" value={form.name} onChange={handleChange} required
                    className="w-full border border-obsidian/15 bg-white px-4 py-3 text-sm font-body text-obsidian focus:outline-none focus:border-gold transition-colors"
                    placeholder="Priya Sharma"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-obsidian/50 font-body mb-1.5">Email Address *</label>
                  <input
                    name="email" value={form.email} onChange={handleChange} required type="email"
                    className="w-full border border-obsidian/15 bg-white px-4 py-3 text-sm font-body text-obsidian focus:outline-none focus:border-gold transition-colors"
                    placeholder="priya@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-widest uppercase text-obsidian/50 font-body mb-1.5">Phone Number *</label>
                  <input
                    name="phone" value={form.phone} onChange={handleChange} required type="tel"
                    className="w-full border border-obsidian/15 bg-white px-4 py-3 text-sm font-body text-obsidian focus:outline-none focus:border-gold transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h3 className="text-[9px] tracking-widest3 uppercase text-gold font-body mb-4">Delivery Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-obsidian/50 font-body mb-1.5">Street Address *</label>
                  <input
                    name="address" value={form.address} onChange={handleChange} required
                    className="w-full border border-obsidian/15 bg-white px-4 py-3 text-sm font-body text-obsidian focus:outline-none focus:border-gold transition-colors"
                    placeholder="123 Park Street, Flat 4B"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-obsidian/50 font-body mb-1.5">City *</label>
                    <input
                      name="city" value={form.city} onChange={handleChange} required
                      className="w-full border border-obsidian/15 bg-white px-4 py-3 text-sm font-body text-obsidian focus:outline-none focus:border-gold transition-colors"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-obsidian/50 font-body mb-1.5">PIN Code *</label>
                    <input
                      name="pincode" value={form.pincode} onChange={handleChange} required maxLength={6}
                      className="w-full border border-obsidian/15 bg-white px-4 py-3 text-sm font-body text-obsidian focus:outline-none focus:border-gold transition-colors"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h3 className="text-[9px] tracking-widest3 uppercase text-gold font-body mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: "card", label: "Credit / Debit Card", icon: "💳" },
                  { value: "upi", label: "UPI / Net Banking", icon: "📲" },
                  { value: "cod", label: "Cash on Delivery", icon: "💵" },
                ].map(({ value, label, icon }) => (
                  <label
                    key={value}
                    className={`flex flex-col items-center gap-2 p-4 border cursor-pointer transition-all ${
                      form.payment === value
                        ? "border-gold bg-gold/5"
                        : "border-obsidian/15 hover:border-gold/40"
                    }`}
                  >
                    <input
                      type="radio" name="payment" value={value}
                      checked={form.payment === value} onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-2xl">{icon}</span>
                    <span className="text-[10px] tracking-widest uppercase font-body text-obsidian/70 text-center">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-mist p-6 space-y-3">
              <h3 className="text-[9px] tracking-widest3 uppercase text-gold font-body mb-4">Order Summary</h3>
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size ?? "default"}`} className="flex justify-between items-center">
                  <span className="text-xs font-body text-obsidian/70 truncate pr-4">
                    {item.name} {item.size && `(${item.size})`} × {item.quantity}
                  </span>
                  <span className="text-xs font-body text-obsidian font-medium whitespace-nowrap">
                    {formatPrice(item.priceNum * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-obsidian/10 pt-3 space-y-2">
                <div className="flex justify-between text-xs font-body text-obsidian/60">
                  <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-body text-obsidian/60">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-xs font-body text-obsidian/60">
                  <span>GST (3%)</span><span>{formatPrice(taxes)}</span>
                </div>
                <div className="flex justify-between font-display text-lg font-light text-obsidian border-t border-obsidian/10 pt-2">
                  <span>Total</span><span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-obsidian text-gold text-xs tracking-widest uppercase py-4 font-body hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : `Place Order · ${formatPrice(grandTotal)}`}
            </button>
          </form>
        ) : (
          /* Success */
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[9px] tracking-widest3 uppercase text-gold font-body mb-3">Thank You</p>
            <h2 className="font-display text-3xl font-light text-obsidian mb-4">Order Placed Successfully</h2>
            <p className="font-body text-sm text-obsidian/50 mb-2">
              A confirmation has been sent to <strong>{form.email}</strong>
            </p>
            <p className="font-body text-sm text-obsidian/50 mb-8">
              Your jewellery will be delivered in 5–7 business days.
            </p>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-8" />
            <Link
              to="/"
              onClick={onClose}
              className="inline-block bg-obsidian text-gold text-xs tracking-widest uppercase px-10 py-3.5 font-body hover:bg-gold hover:text-obsidian transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Cart Page ───────────────────────────────────────────────────────── */
export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const shipping = cartTotal >= 100000 ? 0 : 999;
  const taxes = Math.round(cartTotal * 0.03);
  const grandTotal = cartTotal + shipping + taxes;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F4EE" }}>
      <Navbar />

      {/* Hero Banner */}
      <div style={{ backgroundColor: "#0D0D0D", paddingTop: "7rem", paddingBottom: "3rem" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p style={{ fontSize: "10px", letterSpacing: "0.35em", color: "#C9A84C", textTransform: "uppercase", fontFamily: "Jost, sans-serif", marginBottom: "0.75rem" }}>
            Your Selection
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#F8F4EE", marginBottom: "1rem" }}>
            Shopping Bag
          </h1>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)", margin: "0 auto" }} />
          {cartItems.length > 0 && (
            <p style={{ color: "#C9A84C", fontSize: "13px", marginTop: "1rem", fontFamily: "Jost, sans-serif" }}>
              {cartItems.reduce((s, i) => s + i.quantity, 0)} item{cartItems.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          {cartItems.length === 0 ? (
            /* Empty State */
            <div style={{ textAlign: "center", padding: "5rem 0" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(201,168,76,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
                <svg style={{ width: "36px", height: "36px", color: "#C9A84C", stroke: "currentColor" }} fill="none" strokeWidth={1} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", fontWeight: 300, color: "#0D0D0D", marginBottom: "0.75rem" }}>
                Your bag is empty
              </h2>
              <p style={{ fontFamily: "Jost, sans-serif", fontSize: "14px", color: "rgba(13,13,13,0.5)", marginBottom: "0.5rem" }}>
                Discover our curated collection of fine jewellery.
              </p>
              <p style={{ fontFamily: "Jost, sans-serif", fontSize: "12px", color: "rgba(13,13,13,0.4)", marginBottom: "2.5rem" }}>
                Browse rings, necklaces, earrings and bracelets crafted with the finest materials.
              </p>
              <Link
                to="/"
                style={{ display: "inline-block", background: "#0D0D0D", color: "#C9A84C", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 36px", fontFamily: "Jost, sans-serif", textDecoration: "none", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#C9A84C"; e.currentTarget.style.color = "#0D0D0D"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0D0D0D"; e.currentTarget.style.color = "#C9A84C"; }}
              >
                Explore Collection
              </Link>

              {/* Quick links */}
              <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "3rem", flexWrap: "wrap" }}>
                {[
                  { label: "Rings", to: "/search?category=Rings" },
                  { label: "Necklaces", to: "/search?category=Necklaces" },
                  { label: "Earrings", to: "/search?category=Earrings" },
                  { label: "Bracelets", to: "/search?category=Bracelets" },
                ].map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    style={{ fontFamily: "Jost, sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(13,13,13,0.5)", textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.3)", paddingBottom: "2px" }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
              {/* Cart Items */}
              <div>
                {/* Items Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(13,13,13,0.08)" }}>
                  <p style={{ fontFamily: "Jost, sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(13,13,13,0.5)" }}>
                    {cartItems.reduce((s, i) => s + i.quantity, 0)} item{cartItems.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""} in your bag
                  </p>
                  <button
                    onClick={clearCart}
                    style={{ fontFamily: "Jost, sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(13,13,13,0.35)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#b91c1c"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(13,13,13,0.35)"}
                  >
                    Clear All
                  </button>
                </div>

                {/* Item Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size ?? "default"}`}
                      style={{ background: "#fff", border: "1px solid rgba(13,13,13,0.06)", padding: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "flex-start", transition: "box-shadow 0.3s" }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)"}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                    >
                      {/* Product Image */}
                      <Link
                        to={String(item.id).startsWith("custom-") ? "/custom-jewelry" : `/product/${item.id}`}
                        style={{ flexShrink: 0, width: "100px", height: "120px", overflow: "hidden", display: "block" }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        />
                      </Link>

                      {/* Product Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "Jost, sans-serif", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.8)", marginBottom: "4px" }}>
                          {item.category}
                        </p>
                        <Link
                          to={String(item.id).startsWith("custom-") ? "/custom-jewelry" : `/product/${item.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontWeight: 300, color: "#0D0D0D", marginBottom: "4px", transition: "color 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                            onMouseLeave={e => e.currentTarget.style.color = "#0D0D0D"}
                          >
                            {item.name}
                          </h3>
                        </Link>
                        {item.size && (
                          <p style={{ fontFamily: "Jost, sans-serif", fontSize: "12px", color: "rgba(13,13,13,0.45)", marginBottom: "8px" }}>
                            Size: {item.size}
                          </p>
                        )}
                        <p style={{ fontFamily: "Jost, sans-serif", fontSize: "13px", color: "#0D0D0D", fontWeight: 500 }}>
                          {item.price}
                        </p>
                      </div>

                      {/* Quantity + Price */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", flexShrink: 0 }}>
                        {/* Quantity Control */}
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(13,13,13,0.15)" }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                            disabled={item.quantity <= 1}
                            style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: item.quantity <= 1 ? "not-allowed" : "pointer", color: item.quantity <= 1 ? "rgba(13,13,13,0.2)" : "rgba(13,13,13,0.6)", transition: "color 0.2s" }}
                          >
                            <svg style={{ width: "12px", height: "12px" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                          </button>
                          <span style={{ width: "36px", textAlign: "center", fontFamily: "Jost, sans-serif", fontSize: "14px", color: "#0D0D0D" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                            style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "rgba(13,13,13,0.6)", transition: "color 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(13,13,13,0.6)"}
                          >
                            <svg style={{ width: "12px", height: "12px" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        {/* Line Total */}
                        <p style={{ fontFamily: "Jost, sans-serif", fontSize: "15px", fontWeight: 500, color: "#0D0D0D" }}>
                          {formatPrice(item.priceNum * item.quantity)}
                        </p>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          style={{ fontFamily: "Jost, sans-serif", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(13,13,13,0.3)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "4px" }}
                          onMouseEnter={e => e.currentTarget.style.color = "#b91c1c"}
                          onMouseLeave={e => e.currentTarget.style.color = "rgba(13,13,13,0.3)"}
                        >
                          <svg style={{ width: "11px", height: "11px" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div style={{ marginTop: "1.5rem" }}>
                  <Link
                    to="/"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "Jost, sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(13,13,13,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(13,13,13,0.5)"}
                  >
                    <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div style={{ position: "sticky", top: "7rem" }}>
                <div style={{ background: "#fff", border: "1px solid rgba(13,13,13,0.07)", padding: "2rem" }}>
                  <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", fontWeight: 300, color: "#0D0D0D", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(13,13,13,0.08)" }}>
                    Order Summary
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {cartItems.map((item) => (
                      <div key={`sum-${item.id}-${item.size ?? "default"}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                        <span style={{ fontFamily: "Jost, sans-serif", fontSize: "12px", color: "rgba(13,13,13,0.6)", flex: 1 }}>
                          {item.name}
                          {item.size ? ` (${item.size})` : ""} × {item.quantity}
                        </span>
                        <span style={{ fontFamily: "Jost, sans-serif", fontSize: "12px", color: "#0D0D0D", fontWeight: 500, whiteSpace: "nowrap" }}>
                          {formatPrice(item.priceNum * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid rgba(13,13,13,0.08)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Jost, sans-serif", fontSize: "13px", color: "rgba(13,13,13,0.55)" }}>Subtotal</span>
                      <span style={{ fontFamily: "Jost, sans-serif", fontSize: "13px", color: "#0D0D0D" }}>{formatPrice(cartTotal)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Jost, sans-serif", fontSize: "13px", color: "rgba(13,13,13,0.55)" }}>Shipping</span>
                      <span style={{ fontFamily: "Jost, sans-serif", fontSize: "13px", color: shipping === 0 ? "#C9A84C" : "#0D0D0D", fontWeight: shipping === 0 ? 500 : 400 }}>
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p style={{ fontFamily: "Jost, sans-serif", fontSize: "10px", color: "rgba(201,168,76,0.8)", marginTop: "-4px" }}>
                        Free shipping on orders above ₹1,00,000
                      </p>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Jost, sans-serif", fontSize: "13px", color: "rgba(13,13,13,0.55)" }}>GST (3%)</span>
                      <span style={{ fontFamily: "Jost, sans-serif", fontSize: "13px", color: "#0D0D0D" }}>{formatPrice(taxes)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid rgba(13,13,13,0.08)", marginTop: "0.25rem" }}>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontWeight: 300, color: "#0D0D0D" }}>Total</span>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", fontWeight: 300, color: "#0D0D0D" }}>{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => setShowCheckout(true)}
                    style={{ width: "100%", background: "#0D0D0D", color: "#C9A84C", fontFamily: "Jost, sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px", border: "none", cursor: "pointer", marginTop: "1.5rem", transition: "all 0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#C9A84C"; e.currentTarget.style.color = "#0D0D0D"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#0D0D0D"; e.currentTarget.style.color = "#C9A84C"; }}
                  >
                    Proceed to Checkout
                  </button>

                  {/* Trust badges */}
                  <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(13,13,13,0.08)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {[
                      { icon: "🔒", text: "Secure & Encrypted Checkout" },
                      { icon: "💎", text: "GIA Certified Fine Jewellery" },
                      { icon: "🚚", text: "Free Shipping on ₹1L+ Orders" },
                      { icon: "↩️", text: "30-Day Returns & Exchange" },
                    ].map(({ icon, text }) => (
                      <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "14px" }}>{icon}</span>
                        <span style={{ fontFamily: "Jost, sans-serif", fontSize: "11px", color: "rgba(13,13,13,0.5)" }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon Code */}
                <div style={{ background: "#fff", border: "1px solid rgba(13,13,13,0.07)", padding: "1.5rem", marginTop: "1rem" }}>
                  <p style={{ fontFamily: "Jost, sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(13,13,13,0.5)", marginBottom: "0.75rem" }}>
                    Have a coupon?
                  </p>
                  <div style={{ display: "flex", gap: "0" }}>
                    <input
                      type="text"
                      placeholder="Enter code"
                      style={{ flex: 1, border: "1px solid rgba(13,13,13,0.15)", borderRight: "none", padding: "10px 14px", fontFamily: "Jost, sans-serif", fontSize: "13px", outline: "none", background: "#F8F4EE" }}
                    />
                    <button
                      style={{ background: "#0D0D0D", color: "#C9A84C", border: "none", padding: "10px 18px", fontFamily: "Jost, sans-serif", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#C9A84C"; e.currentTarget.style.color = "#0D0D0D"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#0D0D0D"; e.currentTarget.style.color = "#C9A84C"; }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          cartItems={cartItems}
          cartTotal={cartTotal}
        />
      )}
    </div>
  );
}
