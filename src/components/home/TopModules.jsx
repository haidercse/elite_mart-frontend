import Link from "next/link";
import { topNavLinks as fallbackLinks } from "@/data/mockData";

export default function TopModules({ links = fallbackLinks }) {
  const items = links.length ? links : fallbackLinks;

  return (
    <section className="mb-6">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {items.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon || "Box"}</span>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
              {link.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
