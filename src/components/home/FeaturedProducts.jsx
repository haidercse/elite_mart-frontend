import ProductCard from "@/components/ui/ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function FeaturedProducts({ products = [] }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-800 border-l-4 border-orange-500 pl-3">
          Featured Products
        </h2>
        <Link href="/products" className="flex items-center gap-1 text-purple-600 font-semibold text-sm hover:text-purple-700">
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-gray-500">No featured products available.</p>
        )}
      </div>
    </section>
  );
}
