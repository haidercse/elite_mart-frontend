import Link from "next/link";

const topNavLinks = [
  { id: 1, name: "Mobile", href: "/category/mobile-world", icon: "📱" },
  { id: 2, name: "Fashion", href: "/category/fashion-lifestyle", icon: "👗" },
  { id: 3, name: "Beauty", href: "/category/health-beauty", icon: "💄" },
  { id: 4, name: "Gadgets", href: "/category/gadget-world", icon: "🎧" },
  { id: 5, name: "Home", href: "/category/home-decor", icon: "🏡" },
  { id: 6, name: "Kids", href: "/category/baby-world", icon: "🧸" },
];

export default function TopModules() {
  return (
    <section className="mb-6">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {topNavLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
              {link.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
