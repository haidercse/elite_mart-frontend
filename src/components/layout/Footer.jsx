import Link from "next/link";
import { Phone, Mail, MapPin, Download } from "lucide-react";

const footerLinks = {
  "Sobkisu Bazar": [
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Sobkisu Bazar Blog", href: "/blog" },
    { label: "Web Mail", href: "/webmail" },
  ],
  "Customer Services": [
    { label: "Help Center", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Return Policy", href: "/returns" },
    { label: "Seller Policy", href: "/seller-policy" },
    { label: "Advertising Policy", href: "/ad-policy" },
    { label: "Customer Policy", href: "/customer-policy" },
  ],
};

const trustBadges = [
  { icon: "🚚", title: "Cash On Delivery", desc: "Pay when you get it" },
  { icon: "🔒", title: "Safe & Reliable Payment", desc: "100% secure checkout" },
  { icon: "↩️", title: "Money Back Guarantee", desc: "7 days return policy" },
  { icon: "🎧", title: "24/7 Customer Service", desc: "Always here for you" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Trust Badges */}
      <div className="bg-purple-800 border-b border-purple-700">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="flex items-center gap-3">
                <span className="text-3xl">{badge.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{badge.title}</div>
                  <div className="text-purple-300 text-xs">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-orange-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">SB</span>
              </div>
              <div>
                <div className="text-lg font-black text-white leading-none">SOBKISU</div>
                <div className="text-[10px] font-semibold text-orange-400 tracking-widest">BAZAR</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <a href="tel:+8801325319106" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={13} className="text-orange-400" />
                +8801325319106
              </a>
              <a href="mailto:info@sobkisubazar.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={13} className="text-orange-400" />
                info@sobkisubazar.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-orange-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs leading-relaxed">
                  107 Bir Uttam C R Dutta Road, 4th Floor, F Haque Tower, Dhaka-1205
                </span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold mb-4 text-sm">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-orange-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* App Downloads */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Download Apps</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 transition-colors"
              >
                <span className="text-2xl">🍎</span>
                <div>
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-white font-semibold text-sm">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 transition-colors"
              >
                <span className="text-2xl">▶️</span>
                <div>
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-white font-semibold text-sm">Google Play</div>
                </div>
              </a>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-gray-500">Verified By</span>
              <span className="text-xs font-bold text-green-400 border border-green-600 px-2 py-0.5 rounded">
                DBID
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Accepted Payment Methods
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {["VISA", "Mastercard", "bKash", "Nagad", "Rocket", "DBBL", "EBL", "PayPal"].map((method) => (
                  <span
                    key={method}
                    className="text-[10px] font-bold bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-600 text-center sm:text-right">
              <span>Copyright © 2026 • Sobkisu Bazar</span>
              <br />
              <span>
                Developed by{" "}
                <a href="#" className="text-orange-500 hover:underline font-semibold">
                  SKB Tech
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
