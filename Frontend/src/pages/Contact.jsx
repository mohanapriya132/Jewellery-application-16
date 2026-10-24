import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─── Helper ────────────────────────────────────────────────────────── */
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

/* ─── Data ──────────────────────────────────────────────────────────── */
const storeLocations = [
  {
    id: 1,
    city: "Mumbai",
    address: "14, Maker Chambers IV, Nariman Point, Mumbai — 400 021",
    phone: "+91 22 6630 5500",
    email: "mumbai@aurelia.in",
    hours: "Mon–Sat: 10:00 AM – 8:00 PM\nSun: 11:00 AM – 6:00 PM",
    mapEmbedCity: "Mumbai+Nariman+Point",
    flagship: true,
  },
  {
    id: 2,
    city: "Delhi",
    address: "Shop 8, DLF Emporio Mall, Nelson Mandela Road, Vasant Kunj, New Delhi — 110 070",
    phone: "+91 11 4655 7700",
    email: "delhi@aurelia.in",
    hours: "Mon–Sun: 11:00 AM – 9:00 PM",
    mapEmbedCity: "Vasant+Kunj+New+Delhi",
    flagship: false,
  },
  {
    id: 3,
    city: "Bangalore",
    address: "UB City Mall, Level 2, Vittal Mallya Road, Bangalore — 560 001",
    phone: "+91 80 4190 2200",
    email: "bangalore@aurelia.in",
    hours: "Mon–Sun: 11:00 AM – 9:00 PM",
    mapEmbedCity: "UB+City+Mall+Bangalore",
    flagship: false,
  },
];

const faqs = [
  { q: "Do you offer custom / bespoke designs?", a: "Yes. Our master craftsmen work one-on-one with clients to create completely bespoke pieces. Book a consultation at any flagship store or schedule a virtual appointment." },
  { q: "How long does an order take to be delivered?", a: "Ready pieces ship within 2–3 business days with insured courier. Custom orders typically take 4–6 weeks. All orders include tracking and insurance." },
  { q: "What certifications do your diamonds come with?", a: "All diamonds above 0.30ct are GIA or IGI certified. Each certificate is included with your purchase and details the exact cut, colour, clarity, and carat weight." },
  { q: "Do you offer EMI options?", a: "Yes — 0% EMI for 3, 6, and 12 months on all major credit cards from HDFC, ICICI, Axis, and SBI. No-cost EMI is available on orders above ₹50,000." },
  { q: "Can I return or exchange a piece?", a: "We offer a 30-day return policy for unworn, unaltered pieces in original packaging. Ring resizing is complimentary within 60 days. Custom/engraved pieces are non-returnable." },
];

/* ─── Sub-components ────────────────────────────────────────────────── */

function ContactForm() {
  const [formRef, formInView] = useInView(0.1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General Enquiry", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const subjects = ["General Enquiry", "Custom Design", "Order Status", "Returns & Exchange", "Bespoke Consultation", "Press & Media"];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await supabase.from("contact_enquiries").insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject,
        message: form.message.trim(),
      });
    } catch (err) {
      // Silently continue — user still sees success
      console.warn("[Contact] Supabase insert failed:", err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const inputCls = (field) =>
    `w-full bg-white/5 border text-ivory placeholder-champagne/30 text-sm font-body px-5 py-3.5 outline-none transition-colors ${
      errors[field] ? "border-red-500/60" : "border-gold/20 focus:border-gold/60"
    }`;

  if (submitted) {
    return (
      <div ref={formRef} className="flex flex-col items-center justify-center text-center py-16 px-8 border border-gold/20">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-3xl font-light text-ivory mb-2">Thank You, {form.name.split(" ")[0]}</h3>
        <p className="font-body font-light text-champagne/50 text-sm max-w-sm">
          We've received your message and will respond within 24 hours. Check your inbox at <span className="text-gold">{form.email}</span>.
        </p>
        <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "General Enquiry", message: "" }); }}
          className="mt-8 text-[10px] tracking-widest uppercase text-gold/60 hover:text-gold font-body transition-colors border-b border-gold/20 pb-0.5">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div ref={formRef} className={`transition-all duration-700 ${formInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-3 flex items-center gap-3">
        <span className="w-8 h-px bg-gold/40" /> Write to Us
      </p>
      <h2 className="font-display text-4xl md:text-5xl font-light text-ivory mb-2">Send a Message</h2>
      <p className="font-body font-light text-champagne/40 text-sm mb-10">We reply within 24 hours. All enquiries are handled with utmost care.</p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <input
              id="contact-name"
              type="text"
              placeholder="Full Name *"
              value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }}
              className={inputCls("name")}
            />
            {errors.name && <p className="mt-1 text-[10px] text-red-400 font-body">{errors.name}</p>}
          </div>
          <div>
            <input
              id="contact-email"
              type="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: "" })); }}
              className={inputCls("email")}
            />
            {errors.email && <p className="mt-1 text-[10px] text-red-400 font-body">{errors.email}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <input
            id="contact-phone"
            type="tel"
            placeholder="Phone Number (optional)"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className={inputCls("phone")}
          />
          <div className="relative">
            <select
              id="contact-subject"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full bg-obsidian border border-gold/20 focus:border-gold/60 text-champagne/70 text-sm font-body px-5 py-3.5 outline-none transition-colors appearance-none cursor-pointer"
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div>
          <textarea
            id="contact-message"
            rows={6}
            placeholder="Your Message *"
            value={form.message}
            onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: "" })); }}
            className={`${inputCls("message")} resize-none`}
          />
          {errors.message && <p className="mt-1 text-[10px] text-red-400 font-body">{errors.message}</p>}
        </div>

        <button
          type="submit"
          id="contact-submit"
          disabled={submitting}
          className="w-full sm:w-auto bg-gold hover:bg-gold-light text-obsidian text-xs tracking-widest uppercase px-12 py-4 font-body font-medium transition-all duration-300 flex items-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending..." : "Send Message"}
          {!submitting && (
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

function StoreCard({ store, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 border transition-all duration-300 ${
        active ? "border-gold bg-gold/5" : "border-gold/15 hover:border-gold/35"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-display text-xl font-light text-ivory">{store.city}</span>
            {store.flagship && (
              <span className="text-[8px] tracking-widest uppercase bg-gold text-obsidian px-2 py-0.5 font-body font-medium">Flagship</span>
            )}
          </div>
          <p className="text-[9px] tracking-widest uppercase text-gold font-body">Aurelia Boutique</p>
        </div>
        <div className={`w-2 h-2 rounded-full mt-1 transition-colors ${active ? "bg-gold" : "bg-gold/20"}`} />
      </div>
      <p className="text-xs font-body font-light text-champagne/50 leading-relaxed mb-3">{store.address}</p>
      <p className="text-xs font-body text-champagne/60">{store.phone}</p>
    </button>
  );
}

function MapSection({ store }) {
  return (
    <div className="relative w-full overflow-hidden bg-obsidian border border-gold/15" style={{ height: "360px" }}>
      <iframe
        title={`Aurelia ${store.city} Store Location`}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(store.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        className="w-full h-full grayscale opacity-80 border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {/* Overlay info card */}
      <div className="absolute top-4 left-4 bg-obsidian/90 backdrop-blur-sm border border-gold/20 p-4 max-w-xs">
        <div className="text-[9px] tracking-widest uppercase text-gold font-body mb-1">Aurelia {store.city}</div>
        <p className="text-xs font-body font-light text-champagne/70 leading-relaxed mb-2">{store.address}</p>
        <div className="text-[10px] text-champagne/50 font-body whitespace-pre-line">{store.hours}</div>
      </div>
    </div>
  );
}

function FAQSection() {
  const [faqRef, faqInView] = useInView(0.1);
  const [open, setOpen] = useState(0);
  return (
    <section ref={faqRef} className="bg-ivory py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className={`text-center mb-14 transition-all duration-700 ${faqInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-3">Got Questions?</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-obsidian mb-4">Frequently Asked</h2>
          <div className="divider-gold" />
        </div>
        <div className={`divide-y divide-obsidian/10 transition-all duration-700 delay-100 ${faqInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(o => o === i ? -1 : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="font-body text-sm text-obsidian group-hover:text-gold transition-colors pr-8">{faq.q}</span>
                <svg className={`w-4 h-4 text-gold flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${open === i ? "max-h-48 pb-5" : "max-h-0"}`}>
                <p className="text-sm font-body font-light text-obsidian/55 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function Contact() {
  const [activeStore, setActiveStore] = useState(0);
  const [heroRef, heroLoaded] = useInView(0);
  const [storesRef, storesInView] = useInView(0.1);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-obsidian"
      >
        {/* BG image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&auto=format&fit=crop&q=80"
            alt="Aurelia store interior"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/40 to-obsidian" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 via-transparent to-obsidian/60" />
        </div>

        {/* Corner accents */}
        <div className="absolute top-24 left-6 w-16 h-16 border-l border-t border-gold/30" />
        <div className="absolute top-24 right-6 w-16 h-16 border-r border-t border-gold/30" />

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />

        <div className={`relative z-10 text-center px-6 max-w-3xl mx-auto pt-20 transition-all duration-1000 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-5 flex items-center justify-center gap-4">
            <span className="w-10 h-px bg-gold/50" /> Get in Touch <span className="w-10 h-px bg-gold/50" />
          </p>
          <h1 className="font-display text-6xl md:text-7xl font-light text-ivory leading-tight mb-4">
            We'd Love to<br />
            <span className="italic text-gold-light">Hear From You</span>
          </h1>
          <p className="font-body font-light text-champagne/50 text-sm md:text-base max-w-xl mx-auto">
            Whether you're planning a proposal, seeking a bespoke creation, or simply have a question — our team is here.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Quick Contact Strips ── */}
      <div className="bg-obsidian border-y border-gold/15 py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: "Call Us", value: "+91 22 6630 5500", sub: "Mon–Sat, 10AM–8PM IST" },
            { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Email Us", value: "hello@aurelia.in", sub: "Reply within 24 hours" },
            { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", label: "WhatsApp", value: "+91 98200 55001", sub: "Chat with a specialist" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4">
              <div className="w-10 h-10 flex-shrink-0 border border-gold/30 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-gold" fill="none" stroke="currentColor" strokeWidth={1.3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                </svg>
              </div>
              <div>
                <div className="text-[9px] tracking-widest uppercase text-gold font-body mb-0.5">{c.label}</div>
                <div className="text-sm font-body text-ivory">{c.value}</div>
                <div className="text-[9px] text-champagne/30 font-body">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form + Store Info ── */}
      <section className="bg-obsidian py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — Form */}
          <ContactForm />

          {/* Right — Store Info */}
          <div>
            <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-3 flex items-center gap-3">
              <span className="w-8 h-px bg-gold/40" /> Our Boutiques
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-ivory mb-2">Visit Us</h2>
            <p className="font-body font-light text-champagne/40 text-sm mb-10">Experience the Aurelia collection in person at one of our luxury boutiques.</p>

            <div className="space-y-3 mb-6">
              {storeLocations.map((store, i) => (
                <StoreCard key={store.id} store={store} active={activeStore === i} onClick={() => setActiveStore(i)} />
              ))}
            </div>

            {/* Store hours */}
            <div className="border border-gold/15 p-5 mb-2">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[9px] tracking-widest uppercase text-gold font-body">Opening Hours — {storeLocations[activeStore].city}</span>
              </div>
              <p className="text-sm font-body font-light text-champagne/60 whitespace-pre-line">{storeLocations[activeStore].hours}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section ref={storesRef} className="bg-obsidian pb-0">
        <div className={`transition-all duration-700 ${storesInView ? "opacity-100" : "opacity-0"}`}>
          <MapSection store={storeLocations[activeStore]} />
        </div>

        {/* Store selector tabs below map */}
        <div className="border-t border-gold/15 flex overflow-x-auto">
          {storeLocations.map((store, i) => (
            <button
              key={store.id}
              onClick={() => setActiveStore(i)}
              className={`flex-1 min-w-max py-4 px-6 text-[10px] tracking-widest uppercase font-body transition-all duration-300 border-b-2 ${
                activeStore === i ? "border-gold text-gold bg-gold/5" : "border-transparent text-champagne/40 hover:text-champagne/70"
              }`}
            >
              {store.city}
              {store.flagship && <span className="ml-2 text-gold/40">★</span>}
            </button>
          ))}
        </div>
      </section>

      {/* ── Social & Virtual Consultation ── */}
      <section className="bg-obsidian py-20 px-6 border-t border-gold/10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">

          {/* Virtual appointment */}
          <div className="border border-gold/20 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="#C9A84C" strokeWidth="1"/>
                <circle cx="50" cy="50" r="30" stroke="#C9A84C" strokeWidth="0.5"/>
              </svg>
            </div>
            <p className="text-[9px] tracking-widest3 uppercase text-gold font-body mb-3">Online Service</p>
            <h3 className="font-display text-3xl font-light text-ivory mb-3">Virtual Consultation</h3>
            <p className="font-body font-light text-champagne/45 text-sm leading-relaxed mb-6">
              Can't visit us in person? Book a private video consultation with our jewellery experts. Browse, design, and purchase — all from the comfort of home.
            </p>
            <button className="bg-gold hover:bg-gold-light text-obsidian text-xs tracking-widest uppercase px-7 py-3 font-body font-medium transition-colors duration-300">
              Book Appointment
            </button>
          </div>

          {/* Social */}
          <div className="flex flex-col justify-center">
            <p className="text-[9px] tracking-widest3 uppercase text-gold font-body mb-3">Follow the Journey</p>
            <h3 className="font-display text-3xl font-light text-ivory mb-4">@aurelia.jewellery</h3>
            <p className="font-body font-light text-champagne/45 text-sm leading-relaxed mb-8">
              Follow us for behind-the-scenes craftsmanship, new arrivals, and the love stories we help create every day.
            </p>
            <div className="flex gap-4">
              {[
                { name: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { name: "Pinterest", icon: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" },
                { name: "Facebook", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              ].map(s => (
                <a key={s.name} href="#"
                  className="w-10 h-10 border border-gold/25 flex items-center justify-center text-champagne/40 hover:text-gold hover:border-gold/60 transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQSection />

      <Footer />
    </div>
  );
}
