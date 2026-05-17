import Link from "next/link";
import { getOfferBanners } from "@/lib/api";

export default async function OffersPage() {
  const banners = (await getOfferBanners()) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-4xl font-black text-gray-900">All offers</h1>
        <p className="text-gray-500 mt-2">Explore our current promotions and special deals.</p>
      </div>

      {banners.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {banners.map((banner) => (
            <div key={banner.id} className="rounded-3xl overflow-hidden border border-gray-100 bg-gradient-to-br from-purple-700 to-fuchsia-600 text-white shadow-lg">
              <div className="p-7">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80 mb-4">{banner.tag}</p>
                <h2 className="text-2xl font-black mb-3">{banner.title}</h2>
                <p className="text-sm text-white/80 mb-6">{banner.subtitle}</p>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-white hover:text-purple-700 transition-colors">
                  Shop now
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
          No offers available right now.
        </div>
      )}
    </div>
  );
}
