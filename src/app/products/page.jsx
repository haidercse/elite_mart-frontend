import ProductCard from "@/components/ui/ProductCard";
import { getProducts } from "@/lib/api";

export default async function ProductsPage() {
  const products = (await getProducts()) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-purple-600 font-bold">All Products</p>
            <h1 className="text-4xl font-black text-gray-900 mt-3">Explore all items</h1>
            <p className="text-gray-500 mt-2">Browse our shop and find the best offers.</p>
          </div>
        </div>
      </div>

      {products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
          No products available at this time.
        </div>
      )}
    </div>
  );
}
