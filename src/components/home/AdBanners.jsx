import Link from "next/link";

const adBanners = [
  { id: 1, tag: "Exclusive", title: "Super Savings", subtitle: "Up to 50% off select products", vendor: "SB Bazar", color: "#8b5cf6" },
  { id: 2, tag: "New", title: "Smart Home Deals", subtitle: "Essentials for every room", vendor: "Home Brands", color: "#ec4899" },
  { id: 3, tag: "Limited", title: "Beauty & Health", subtitle: "Premium self-care offers", vendor: "Wellness", color: "#f97316" },
  { id: 4, tag: "Trending", title: "Gadget Drops", subtitle: "Latest accessories and electronics", vendor: "Tech Zone", color: "#2563eb" },
];

export default function AdBanners() {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-black text-gray-800 border-l-4 border-purple-600 pl-3 mb-4">
        Advertisement
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {adBanners.map((ad) => (
          <Link
            key={ad.id}
            href="#"
            className="relative overflow-hidden rounded-2xl group cursor-pointer"
            style={{ paddingTop: "65%" }}
          >
            <div
              className="absolute inset-0 flex flex-col justify-end p-4"
              style={{ background: `linear-gradient(135deg, ${ad.color}, ${ad.color}aa)` }}
            >
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full w-fit mb-2">
                {ad.tag}
              </span>
              <h3 className="text-white font-black text-base leading-tight">{ad.title}</h3>
              <p className="text-white/70 text-xs mt-0.5">{ad.subtitle}</p>
              <p className="text-white/50 text-[10px] mt-1">{ad.vendor}</p>
            </div>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200 rounded-2xl" />
          </Link>
        ))}
      </div>
    </section>
  );
}
