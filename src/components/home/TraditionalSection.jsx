import Link from "next/link";
import { ChevronRight } from "lucide-react";

const traditionalDivisions = [
  { id: 1, name: "Rangpur Division", products: 58 },
  { id: 2, name: "Eco Friendly Products", products: 44 },
  { id: 3, name: "Dhaka Division", products: 86 },
  { id: 4, name: "Chattogram Division", products: 72 },
];

const divisionEmojis = {
  "Rangpur Division": "🏛️",
  "Eco Friendly Products": "🌿",
  "Dhaka Division": "🕌",
  "Chattogram Division": "⛵",
};

const divisionColors = [
  "from-amber-600 to-amber-800",
  "from-green-600 to-green-800",
  "from-blue-600 to-blue-800",
  "from-teal-600 to-teal-800",
];

export default function TraditionalSection() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-black text-gray-800 border-l-4 border-orange-500 pl-3">
            64 Traditional
          </h2>
          <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            District Products
          </span>
        </div>
        <Link href="/64-traditional" className="flex items-center gap-1 text-purple-600 font-semibold text-sm hover:text-purple-700">
          View More <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {traditionalDivisions.map((div, i) => (
          <Link
            key={div.id}
            href={`/category/64-traditional/${div.id}`}
            className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            style={{ paddingTop: "80%" }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${divisionColors[i]}`} />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center">
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {divisionEmojis[div.name] || "🏘️"}
              </span>
              <h3 className="font-bold text-sm leading-tight">{div.name}</h3>
              <span className="text-white/70 text-[11px] mt-1">{div.products} products</span>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl" />
          </Link>
        ))}
      </div>
    </section>
  );
}
