import HeroSlider from "@/components/home/HeroSlider";
import TopModules from "@/components/home/TopModules";
import OfferBanners from "@/components/home/OfferBanners";
import FlashSale from "@/components/home/FlashSale";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import TraditionalSection from "@/components/home/TraditionalSection";
import AdBanners from "@/components/home/AdBanners";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandsSection from "@/components/home/BrandsSection";
import {
  getBrands,
  getCategories,
  getFeaturedProducts,
  getFlashSaleProducts,
  getOfferBanners,
  getSliders,
  getTopNavLinks,
} from "@/lib/api";

export default async function HomePage() {
  const [categories, featuredProducts, offerBanners, flashSaleProducts, sliders, brands, topNavLinks] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getOfferBanners(),
    getFlashSaleProducts(),
    getSliders(),
    getBrands(),
    getTopNavLinks(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      {/* Hero + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5 mb-6">
        {/* Sidebar Categories */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-purple-700 text-white px-4 py-3 font-bold text-sm flex items-center gap-2">
              <span>☰</span> Categories
            </div>
            <nav className="divide-y divide-gray-50">
              {categories.slice(0, 14).map((cat) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:pl-6 transition-all duration-150"
                >
                  {cat.name || cat.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Hero Slider */}
        <div>
          <HeroSlider slides={sliders} />
        </div>
      </div>

      {/* Top Module Links */}
      <TopModules links={topNavLinks} />

      {/* Offer Banners */}
      <OfferBanners banners={offerBanners} />

      {/* Flash Sale */}
      <FlashSale products={flashSaleProducts} />

      {/* Categories Grid */}
      <CategoriesGrid categories={categories} />

      {/* 64 Traditional */}
      <TraditionalSection />

      {/* Ad Banners */}
      <AdBanners />

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* Brands */}
      <BrandsSection brands={brands} />
    </div>
  );
}
