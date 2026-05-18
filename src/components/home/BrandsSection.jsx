"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { brands as fallbackBrands } from "@/data/mockData";

const colors = ["#1e40af", "#7c3aed", "#1f2937", "#0f766e", "#c2410c", "#15803d", "#9f1239", "#dc2626"];

export default function BrandsSection({ brands = fallbackBrands }) {
  const scrollRef = useRef(null);
  const items = brands.length ? brands : fallbackBrands;

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

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((brand, index) => (
          <a
            key={brand.id || brand.slug || brand.name}
            href={brand.slug ? `/products?brand=${brand.slug}` : "/products"}
            className="flex-shrink-0 bg-white border-2 border-gray-100 hover:border-purple-300 hover:shadow-md rounded-2xl px-6 py-4 transition-all duration-200 hover:scale-105 min-w-[100px] flex items-center justify-center"
          >
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="h-8 max-w-[92px] object-contain" />
            ) : (
              <span className="font-black text-sm tracking-tight" style={{ color: colors[index % colors.length] }}>
                {brand.name}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
