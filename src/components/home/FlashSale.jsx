"use client";
import { useState, useEffect } from "react";
import { Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return { h, m, s };
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 text-white font-black text-xl w-10 h-10 rounded-lg flex items-center justify-center tabular-nums">
        {value}
      </div>
      <span className="text-[9px] text-gray-500 mt-0.5 uppercase">{label}</span>
    </div>
  );
}

export default function FlashSale({ products = [] }) {
  const { h, m, s } = useCountdown(9990);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-black shadow-lg shadow-orange-500/30">
            <Zap size={16} className="fill-white" />
            <span className="text-sm">Flash Sale</span>
          </div>
          <div className="flex items-center gap-1">
            <TimeBox value={h} label="hrs" />
            <span className="text-gray-400 font-bold text-lg mb-4">:</span>
            <TimeBox value={m} label="min" />
            <span className="text-gray-400 font-bold text-lg mb-4">:</span>
            <TimeBox value={s} label="sec" />
          </div>
        </div>
        <Link href="/flash-sale" className="flex items-center gap-1 text-purple-600 font-semibold text-sm hover:text-purple-700">
          View More <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-gray-500">No flash sale products available.</p>
        )}
      </div>
    </section>
  );
}
