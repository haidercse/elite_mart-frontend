"use client";
import Link from "next/link";

export default function OfferBanners({ banners = [] }) {
  return (
    <section className="mb-6">
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {banners.length ? (
          banners.map((banner) => (
            <Link
              key={banner.id}
              href="/offers"
              className={`flex-shrink-0 bg-gradient-to-r ${banner.color || "from-purple-500 to-indigo-500"} rounded-2xl px-5 py-3 text-white flex flex-col items-center justify-center min-w-[130px] hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-md cursor-pointer`}
            >
              <span className="text-2xl font-black leading-none mb-1">{banner.tag || banner.title}</span>
              <span className="text-sm font-bold">{banner.title || banner.subtitle}</span>
              <span className="text-[10px] text-white/80">{banner.subtitle || banner.description}</span>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No special offers available.</p>
        )}
      </div>
    </section>
  );
}
