import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { getCategories, searchProducts } from "@/lib/api";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q : "";
  const exact = params?.exact === "1";
  const [results, categories] = await Promise.all([
    query ? searchProducts(query) : [],
    getCategories(),
  ]);
  const visibleResults = exact
    ? results.filter((product) => product.name?.toLowerCase() === query.toLowerCase())
    : results;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-purple-600 font-bold">Search</p>
            <h1 className="text-4xl font-black text-gray-900 mt-3">Search results</h1>
            <p className="text-gray-500 mt-2">Search results for “{query || "all items"}”.</p>
          </div>
          <form action="/search" className="w-full sm:w-auto">
            <label className="sr-only" htmlFor="search">Search query</label>
            <div className="flex gap-2">
              <input
                id="search"
                name="q"
                defaultValue={query}
                placeholder="Search products, brands or categories"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:ring-purple-500 outline-none"
              />
              <button type="submit" className="rounded-2xl bg-purple-700 px-5 py-3 text-white font-semibold hover:bg-purple-800 transition-colors">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {categories.slice(0, 12).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="whitespace-nowrap rounded-2xl border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {!query ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-sm">
          Search any product name or category to see matching results.
        </div>
      ) : visibleResults.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-sm">
          No products found matching “{query}”. Try another keyword.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
