"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const brandData = [
  { id: 1, name: "SOLOVE", color: "#1e40af" },
  { id: 2, name: "amazfit", color: "#7c3aed" },
  { id: 3, name: "Apple", color: "#1f2937" },
  { id: 4, name: "G·TIDE", color: "#0f766e" },
  { id: 5, name: "HAYLOU", color: "#c2410c" },
  { id: 6, name: "imilab", color: "#15803d" },
  { id: 7, name: "KIESLECT", color: "#9f1239" },
  { id: 8, name: "Xiaomi", color: "#dc2626" },
  { id: 9, name: "Samsung", color: "#1d4ed8" },
  { id: 10, name: "Realme", color: "#ea580c" },
];

export default function BrandsSection() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-800 border-l-4 border-purple-600 pl-3">
          Shop by Brands
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
      >
        {brandData.map((brand) => (
          <button
            key={brand.id}
            className="flex-shrink-0 bg-white border-2 border-gray-100 hover:border-purple-300 hover:shadow-md rounded-2xl px-6 py-4 transition-all duration-200 hover:scale-105 min-w-[100px] flex items-center justify-center"
          >
            <span
              className="font-black text-sm tracking-tight"
              style={{ color: brand.color }}
            >
              {brand.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
