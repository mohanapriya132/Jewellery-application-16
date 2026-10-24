import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const jewelryTypes = [
  { id: "ring", label: "Ring", description: "A signature piece, made for you", basePrice: 42000 },
  { id: "necklace", label: "Necklace", description: "A keepsake worn close", basePrice: 56000 },
  { id: "bracelet", label: "Bracelet", description: "A personal everyday treasure", basePrice: 48000 },
];

const materials = [
  { id: "yellow-gold", label: "18K Yellow Gold", color: "#d7ad4b", highlight: "#f5dc8c", price: 18000 },
  { id: "white-gold", label: "18K White Gold", color: "#c8c9c7", highlight: "#f3f3f1", price: 22000 },
  { id: "rose-gold", label: "18K Rose Gold", color: "#c98f7c", highlight: "#f2c8bb", price: 20000 },
  { id: "platinum", label: "Platinum", color: "#aeb4b7", highlight: "#eef2f3", price: 38000 },
];

const gemstones = [
  { id: "diamond", label: "Diamond", detail: "Brilliant cut", color: "#eef8ff", price: 65000 },
  { id: "emerald", label: "Emerald", detail: "Deep green", color: "#176f4b", price: 44000 },
  { id: "sapphire", label: "Sapphire", detail: "Royal blue", color: "#244fa3", price: 39000 },
  { id: "ruby", label: "Ruby", detail: "Pigeon red", color: "#a91f3d", price: 42000 },
  { id: "none", label: "No Gemstone", detail: "Pure metal", color: "#d8d2c8", price: 0 },
];

const sizes = {
  ring: ["5", "6", "7", "8", "9", "10", "11"],
  necklace: ['16"', '18"', '20"', '22"', '24"'],
  bracelet: ['6"', '6.5"', '7"', '7.5"', '8"'],
};

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function JewelryPreview({ type, material, gemstone, engraving }) {
  const commonGem = (
    <>
      <path d="M142 84 180 58l38 26-15 43h-46z" fill={gemstone.color} stroke="rgba(255,255,255,.72)" strokeWidth="2" />
      <path d="m142 84 38 14 38-14M180 58v40m-23 29 23-29 23 29" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" />
    </>
  );

  return (
    <svg viewBox="0 0 360 300" className="h-full w-full drop-shadow-2xl" role="img" aria-label={`Custom ${type} preview`}>
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={material.highlight} />
          <stop offset=".35" stopColor={material.color} />
          <stop offset=".68" stopColor={material.highlight} />
          <stop offset="1" stopColor={material.color} />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>
      <ellipse cx="180" cy="255" rx="105" ry="15" fill="#000" opacity=".16" filter="url(#glow)" />

      {type === "ring" && (
        <>
          <ellipse cx="180" cy="172" rx="79" ry="84" fill="none" stroke="url(#metal)" strokeWidth="17" />
          <path d="M126 109c13-23 34-34 54-34s42 11 54 34" fill="none" stroke={material.highlight} strokeWidth="4" opacity=".7" />
          {gemstone.id !== "none" ? commonGem : <rect x="148" y="79" width="64" height="18" rx="8" fill="url(#metal)" />}
        </>
      )}

      {type === "necklace" && (
        <>
          <path d="M55 65c14 117 72 168 125 168S291 182 305 65" fill="none" stroke="url(#metal)" strokeWidth="7" strokeLinecap="round" />
          <path d="M62 65c16 106 70 153 118 153s102-47 118-153" fill="none" stroke={material.highlight} strokeWidth="1.5" opacity=".7" />
          <path d="M180 218v-22" stroke="url(#metal)" strokeWidth="6" />
          {gemstone.id !== "none" ? (
            <g transform="translate(0 128) scale(.72)" style={{ transformOrigin: "180px 98px" }}>{commonGem}</g>
          ) : (
            <circle cx="180" cy="202" r="15" fill="url(#metal)" />
          )}
        </>
      )}

      {type === "bracelet" && (
        <>
          <ellipse cx="180" cy="157" rx="112" ry="69" fill="none" stroke="url(#metal)" strokeWidth="13" />
          <ellipse cx="180" cy="153" rx="106" ry="63" fill="none" stroke={material.highlight} strokeWidth="2" opacity=".65" />
          {gemstone.id !== "none" ? (
            <g transform="translate(51 14) scale(.72)" style={{ transformOrigin: "180px 98px" }}>{commonGem}</g>
          ) : (
            <rect x="150" y="80" width="60" height="18" rx="9" fill="url(#metal)" />
          )}
        </>
      )}

      {engraving && (
        <text x="180" y="282" textAnchor="middle" fill="#9a7a35" fontFamily="Cormorant Garamond, serif" fontSize="14" fontStyle="italic">
          “{engraving}”
        </text>
      )}
    </svg>
  );
}

function ChoiceLabel({ number, title, note }) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-obsidian text-[10px] text-gold">{number}</span>
      <div>
        <h2 className="font-display text-2xl font-medium text-obsidian">{title}</h2>
        {note && <p className="mt-0.5 text-xs font-light text-obsidian/45">{note}</p>}
      </div>
    </div>
  );
}

export default function CustomJewelry() {
  const { addToCart } = useCart();
  const [typeId, setTypeId] = useState("ring");
  const [materialId, setMaterialId] = useState("yellow-gold");
  const [gemstoneId, setGemstoneId] = useState("diamond");
  const [size, setSize] = useState("7");
  const [engraving, setEngraving] = useState("");
  const [added, setAdded] = useState(false);

  const type = jewelryTypes.find((item) => item.id === typeId);
  const material = materials.find((item) => item.id === materialId);
  const gemstone = gemstones.find((item) => item.id === gemstoneId);
  const engravingPrice = engraving.trim() ? 2500 : 0;
  const estimatedPrice = type.basePrice + material.price + gemstone.price + engravingPrice;

  const progress = [typeId, materialId, gemstoneId, size].filter(Boolean).length * 25;

  const cartImage = useMemo(() => {
    const initial = type.label[0];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="600"><rect width="100%" height="100%" fill="#f2ede8"/><circle cx="250" cy="255" r="120" fill="none" stroke="${material.color}" stroke-width="30"/><circle cx="250" cy="130" r="45" fill="${gemstone.color}" stroke="#fff" stroke-width="5"/><text x="250" y="475" text-anchor="middle" font-family="serif" font-size="42" fill="#0d0d0d">${initial}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }, [type, material, gemstone]);

  const chooseType = (id) => {
    setTypeId(id);
    setSize(sizes[id][Math.floor(sizes[id].length / 2)]);
    setAdded(false);
  };

  const handleAddToCart = () => {
    const customId = `custom-${typeId}-${materialId}-${gemstoneId}-${size}-${engraving.trim() || "plain"}`;
    addToCart({
      id: customId,
      name: `Custom ${type.label}`,
      category: `${material.label} · ${gemstone.label}`,
      price: money.format(estimatedPrice),
      priceNum: estimatedPrice,
      image: cartImage,
    }, 1, size);
    setAdded(true);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <header className="relative overflow-hidden bg-obsidian px-6 pb-16 pt-32 text-center">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-[10px] uppercase tracking-widest3 text-gold">The Bespoke Atelier</p>
          <h1 className="font-display text-5xl font-light text-ivory md:text-7xl">
            Designed by you. <span className="italic text-gold-light">Made forever.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-7 text-champagne/55">
            Shape a one-of-a-kind piece with precious metals, exceptional gemstones, and a message only you know.
          </p>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-6 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <div className="space-y-6">
            <section className="border border-obsidian/10 bg-white p-5 sm:p-8">
              <ChoiceLabel number="01" title="Choose your piece" note="Start with the silhouette that tells your story." />
              <div className="grid gap-3 sm:grid-cols-3">
                {jewelryTypes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => chooseType(item.id)}
                    className={`group p-5 text-left transition-all ${typeId === item.id ? "bg-obsidian text-ivory shadow-xl" : "border border-obsidian/10 hover:border-gold/60"}`}
                  >
                    <span className={`mb-5 flex h-10 w-10 items-center justify-center rounded-full border font-display text-xl ${typeId === item.id ? "border-gold/50 text-gold" : "border-obsidian/15 text-obsidian/55"}`}>
                      {item.label[0]}
                    </span>
                    <span className="block font-display text-xl">{item.label}</span>
                    <span className={`mt-1 block text-[10px] leading-4 ${typeId === item.id ? "text-champagne/50" : "text-obsidian/40"}`}>{item.description}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="border border-obsidian/10 bg-white p-5 sm:p-8">
              <ChoiceLabel number="02" title="Select your metal" />
              <div className="grid gap-3 sm:grid-cols-2">
                {materials.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setMaterialId(item.id); setAdded(false); }}
                    className={`flex items-center gap-4 border p-4 text-left transition-all ${materialId === item.id ? "border-gold bg-gold/5" : "border-obsidian/10 hover:border-gold/50"}`}
                  >
                    <span className="h-8 w-8 shrink-0 rounded-full border-4 border-white shadow-md" style={{ background: `linear-gradient(135deg, ${item.highlight}, ${item.color})` }} />
                    <span className="flex-1 text-xs font-medium uppercase tracking-wider text-obsidian/75">{item.label}</span>
                    {materialId === item.id && <span className="text-gold">✓</span>}
                  </button>
                ))}
              </div>
            </section>

            <section className="border border-obsidian/10 bg-white p-5 sm:p-8">
              <ChoiceLabel number="03" title="Choose a gemstone" note="Each stone is ethically sourced and independently certified." />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {gemstones.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setGemstoneId(item.id); setAdded(false); }}
                    className={`p-3 text-center transition-all ${gemstoneId === item.id ? "bg-obsidian text-ivory" : "border border-obsidian/10 hover:border-gold/50"}`}
                  >
                    <span className="mx-auto mb-3 block h-9 w-9 rotate-45 border-2 border-white shadow-md" style={{ backgroundColor: item.color }} />
                    <span className="block text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
                    <span className={`mt-1 block text-[9px] ${gemstoneId === item.id ? "text-champagne/45" : "text-obsidian/35"}`}>{item.detail}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="border border-obsidian/10 bg-white p-5 sm:p-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <ChoiceLabel number="04" title={typeId === "ring" ? "Select your size" : "Select the length"} />
                  <div className="flex flex-wrap gap-2">
                    {sizes[typeId].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => { setSize(item); setAdded(false); }}
                        className={`h-10 min-w-10 px-3 text-xs transition-all ${size === item ? "bg-obsidian text-gold" : "border border-obsidian/15 text-obsidian/60 hover:border-gold"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <ChoiceLabel number="05" title="Make it personal" note="Up to 18 characters." />
                  <div className="relative">
                    <input
                      value={engraving}
                      maxLength={18}
                      onChange={(event) => { setEngraving(event.target.value); setAdded(false); }}
                      placeholder="e.g. Always, 22.06.26"
                      className="w-full border-b border-obsidian/20 bg-transparent px-0 py-3 pr-12 font-display text-lg italic text-obsidian outline-none transition-colors placeholder:text-obsidian/25 focus:border-gold"
                    />
                    <span className="absolute bottom-3 right-0 text-[9px] text-obsidian/30">{engraving.length}/18</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden border border-gold/20 bg-mist">
              <div className="relative h-[360px] overflow-hidden bg-[radial-gradient(circle_at_center,_#fff_0%,_#f2ede8_58%,_#e4ddd3_100%)] sm:h-[430px]">
                <div className="absolute left-5 top-5 rounded-full bg-white/70 px-3 py-1.5 text-[9px] uppercase tracking-widest text-obsidian/45 backdrop-blur">
                  Live preview
                </div>
                <JewelryPreview type={typeId} material={material} gemstone={gemstone} engraving={engraving} />
              </div>

              <div className="bg-obsidian p-6 text-ivory sm:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-[9px] uppercase tracking-widest3 text-gold">Your creation</p>
                    <h2 className="font-display text-3xl font-light">The Bespoke {type.label}</h2>
                  </div>
                  <span className="shrink-0 border border-gold/30 px-3 py-1 text-[9px] uppercase tracking-wider text-gold">Made to order</span>
                </div>

                <div className="space-y-3 border-y border-champagne/10 py-5 text-xs">
                  {[
                    ["Piece", type.label],
                    ["Metal", material.label],
                    ["Gemstone", gemstone.label],
                    [typeId === "ring" ? "Size" : "Length", size],
                    ["Engraving", engraving.trim() || "None"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-champagne/40">{label}</span>
                      <span className="text-right text-champagne/80">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-end justify-between py-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-champagne/35">Estimated price</p>
                    <p className="mt-1 font-display text-3xl text-gold-light">{money.format(estimatedPrice)}</p>
                  </div>
                  <p className="text-right text-[9px] leading-4 text-champagne/30">Includes taxes<br />Complimentary shipping</p>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-4 text-[10px] font-medium uppercase tracking-widest2 transition-all ${added ? "bg-emerald-800 text-white" : "bg-gold text-obsidian hover:bg-gold-light"}`}
                >
                  {added ? "Added to your bag ✓" : "Add custom piece to bag"}
                </button>
                {added && (
                  <Link to="/cart" className="mt-3 block text-center text-[10px] uppercase tracking-widest text-gold hover:text-gold-light">
                    View shopping bag →
                  </Link>
                )}

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-[8px] uppercase tracking-wider text-champagne/30">
                    <span>Design complete</span><span>{progress}%</span>
                  </div>
                  <div className="h-px bg-white/10"><div className="h-px bg-gold transition-all duration-500" style={{ width: `${progress}%` }} /></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 border-x border-b border-obsidian/10 bg-white py-5 text-center">
              {["4–6 week delivery", "Lifetime care", "Certified stones"].map((item) => (
                <div key={item} className="border-r border-obsidian/10 px-2 text-[8px] uppercase tracking-wider text-obsidian/45 last:border-r-0">{item}</div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <section className="bg-obsidian px-6 py-16 text-center">
        <p className="text-[10px] uppercase tracking-widest3 text-gold">Need a little guidance?</p>
        <h2 className="mt-3 font-display text-4xl font-light text-ivory">Create it with a designer</h2>
        <p className="mx-auto mt-3 max-w-md text-sm font-light leading-6 text-champagne/45">Book a complimentary private consultation and bring your most ambitious idea to life.</p>
        <Link to="/contact" className="mt-7 inline-block border border-gold/50 px-7 py-3 text-[10px] uppercase tracking-widest text-gold transition-colors hover:bg-gold hover:text-obsidian">
          Book a consultation
        </Link>
      </section>

      <Footer />
    </div>
  );
}
