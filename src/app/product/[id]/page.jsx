import Link from "next/link";
import { getProductById, getProducts } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import AddToCartButton from "./AddToCartButton";

function formatMoney(value) {
  return `৳${Number(value || 0).toLocaleString()}`;
}

function categoryHref(product) {
  const slug = product.categorySlug || product.category?.slug || product.category?.toLowerCase?.()
    ?.replace(/ & /g, "-")
    ?.replace(/ /g, "-");
  return slug ? `/category/${slug}` : "/category";
}

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  const allProducts = await getProducts();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center max-w-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <p className="text-gray-500 mb-6">The item you are looking for does not exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = allProducts.filter((item) => {
    const sameCategory = product.categoryId
      ? item.categoryId === product.categoryId
      : item.category === product.category;
    return sameCategory && item.id !== product.id;
  }).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          <div className="h-[420px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
            ) : (
              <span className="text-[6rem]">Cart</span>
            )}
          </div>
          <div className="p-8">
            <div className="flex flex-wrap gap-3 items-center mb-5">
              {product.badge && (
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  {product.badge}
                </span>
              )}
              {product.freeShipping && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  Free shipping
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-purple-600 font-semibold">
                  {product.category || "Product"}
                </p>
                <h1 className="text-4xl font-black text-gray-900 mt-3">{product.name}</h1>
              </div>
              <Link href={categoryHref(product)} className="rounded-2xl bg-purple-50 px-4 py-2 text-purple-700 text-sm font-semibold hover:bg-purple-100 transition-colors">
                View category
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 items-end">
              <div>
                <p className="text-5xl font-black text-purple-700">{formatMoney(product.price)}</p>
                {product.originalPrice > product.price && (
                  <p className="text-sm text-gray-400 line-through">{formatMoney(product.originalPrice)}</p>
                )}
              </div>
              {!!product.discount && <div className="text-sm text-gray-500">{product.discount}% off</div>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-8 mt-8">
              <div className="rounded-3xl bg-gray-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Rating</p>
                <p className="text-3xl font-semibold text-orange-500">{product.rating} star</p>
                <p className="text-sm text-gray-500">{product.reviews} reviews</p>
              </div>
              <div className="rounded-3xl bg-gray-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Vendor</p>
                <p className="text-lg font-semibold text-gray-900">{product.vendor || "Sobkisu Bazar"}</p>
              </div>
            </div>

            <div className="space-y-4 text-gray-600">
              <p>{product.description || "This product is available from Sobkisu Bazar with fast processing and reliable delivery."}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-100 overflow-hidden shadow-sm bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase options</h2>
            <div className="space-y-3">
              <div className="rounded-3xl bg-purple-50 p-4">
                <p className="text-sm text-gray-500">Cash on delivery available</p>
              </div>
              <div className="rounded-3xl bg-purple-50 p-4">
                <p className="text-sm text-gray-500">Secure online payment supported</p>
              </div>
              <div className="rounded-3xl bg-purple-50 p-4">
                <p className="text-sm text-gray-500">Fast delivery in 1-3 business days</p>
              </div>
            </div>

            <div className="mt-6">
              <AddToCartButton product={product} />
            </div>

            <Link href="/cart" className="block mt-3 text-center text-sm text-purple-600 hover:text-purple-700 font-semibold underline">
              View your cart
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-100 overflow-hidden shadow-sm bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product details</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><strong className="text-gray-900">Category:</strong> {product.category || "General"}</li>
              <li><strong className="text-gray-900">Vendor:</strong> {product.vendor || "Sobkisu Bazar"}</li>
              <li><strong className="text-gray-900">Stock status:</strong> {product.stock === 0 ? "Out of stock" : "In stock"}</li>
              <li><strong className="text-gray-900">Delivery:</strong> 1-3 business days</li>
              <li><strong className="text-gray-900">Return policy:</strong> 7-day easy return</li>
            </ul>
          </div>
        </aside>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-purple-600 font-bold">More from this category</p>
              <h2 className="text-3xl font-black text-gray-900 mt-3">Related products</h2>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
