import Link from "next/link";
import { getCategories } from "@/lib/api";

export default async function CategoryIndexPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.25em] text-purple-600 font-bold">Categories</p>
        <h1 className="text-4xl font-black text-gray-900 mt-3">Browse categories</h1>
        <p className="text-gray-500 mt-3 max-w-2xl">
          Choose a category to explore the best products from different collections.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.length ? (
          categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-3xl bg-purple-50 flex items-center justify-center text-3xl">
                  {category.icon || "📦"}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{category.name || category.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">Explore products in this category</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}
