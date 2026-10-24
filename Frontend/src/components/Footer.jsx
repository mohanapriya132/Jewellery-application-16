const footerLinks = {
  Collections: ["Engagement Rings", "Wedding Bands", "Necklaces", "Earrings", "Bracelets", "Anklets"],
  Services: ["Custom Design", "Engraving", "Ring Sizing", "Jewelry Cleaning", "Appraisal", "Insurance"],
  Company: ["Our Story", "Craftsmanship", "Sustainability", "Careers", "Press", "Sitemap"],
};

export default function Footer() {
  return (
    <footer className="bg-obsidian text-champagne/70">
      {/* Newsletter */}
      <div className="border-b border-gold/20 py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] tracking-widest3 text-gold uppercase font-body mb-3">Exclusive Access</p>
          <h3 className="font-display text-4xl font-light text-ivory mb-3">
            Join the Inner Circle
          </h3>
          <p className="text-sm font-body font-light text-champagne/50 mb-8">
            Be the first to discover new collections, private sales, and the stories behind each masterpiece.
          </p>
          <div className="flex gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/5 border border-gold/20 text-ivory placeholder-champagne/30 text-sm font-body px-5 py-3.5 outline-none focus:border-gold/50 transition-colors"
            />
            <button className="bg-gold hover:bg-gold-light text-obsidian text-xs tracking-widest uppercase px-7 py-3.5 font-body font-medium transition-colors duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-5">
              <div className="font-display text-2xl font-light tracking-widest2 text-gold-light">AURELIA</div>
              <div className="text-[9px] tracking-widest3 text-champagne/40 uppercase font-body">Fine Jewellery</div>
            </div>
            <p className="text-sm font-body font-light leading-relaxed text-champagne/50 max-w-xs mb-6">
              Crafting heirloom-quality jewellery since 1972. Every piece is an expression of uncompromising artistry and timeless elegance.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              {["Instagram", "Pinterest", "Facebook", "YouTube"].map((s) => (
                <a key={s} href="#" className="text-[9px] tracking-widest uppercase text-champagne/30 hover:text-gold transition-colors font-body">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[10px] tracking-widest uppercase text-gold font-body font-medium mb-5">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs font-body text-champagne/50 hover:text-champagne transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-champagne/30 font-body">
            © 2025 Aurelia Fine Jewellery. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a key={l} href="#" className="text-[10px] text-champagne/30 hover:text-champagne/60 font-body transition-colors">
                {l}
              </a>
            ))}
          </div>
          {/* Payment icons */}
          <div className="flex gap-3 items-center">
            {["VISA", "MC", "UPI", "EMI"].map((p) => (
              <span key={p} className="text-[8px] tracking-widest border border-champagne/10 px-2 py-1 text-champagne/30 font-body">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
