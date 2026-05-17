import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { getCategoryBySlug, getProductsByCategoryId } from "@/lib/api";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center max-w-xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ক্যাটাগরি পাওয়া যায়নি</h1>
          <p className="text-gray-500 mb-6">আপনি যে পাতাটি দেখতে চেয়েছেন সেটি পাওয়া যায়নি।</p>
          <Link href="/category" className="inline-flex items-center gap-2 rounded-2xl bg-purple-700 px-5 py-3 text-white font-semibold hover:bg-purple-800 transition-colors">
            ক্যাটাগরি লিস্টে ফিরুন
          </Link>
        </div>
      </div>
    );
  }

  const products = await getProductsByCategoryId(category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 rounded-3xl border border-gray-100 bg-gradient-to-r from-purple-50 to-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-purple-600 font-bold">Category</p>
            <h1 className="text-4xl font-black text-gray-900 mt-3">{category.name}</h1>
            <p className="text-gray-500 mt-3 max-w-2xl">
              {category.description || "এই বিভাগের সেরা পণ্যগুলো একেবারে হাতে-নিয়ে সাজানো হয়েছে। এখনই দেখুন সমস্ত বিস্তৃত সংগ্রহ।"}
            </p>
          </div>

          <div className="grid gap-3 text-right">
            <span className="inline-flex items-center justify-center rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-purple-700 shadow-sm border border-purple-100">
              {products.length} প্রোডাক্ট
            </span>
            <Link href="/" className="inline-flex items-center justify-center rounded-3xl border border-purple-200 bg-purple-50 px-4 py-3 text-purple-700 font-semibold hover:bg-purple-100 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
          এই ক্যাটাগরিতে এখনো কোন প্রোডাক্ট নেই।
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
