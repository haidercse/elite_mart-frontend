"use client";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

function formatMoney(value) {
  return `৳${Number(value || 0).toLocaleString()}`;
}

export default function ProductDetails({ product }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 text-sm text-gray-500">
          <Link href={categoryHref(product)} className="text-purple-700 font-semibold hover:underline">
            {product.category || "Category"}
          </Link>
          <span className="mx-2">›</span>
          <span>{product.vendor || "Seller"}</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-gray-900">{product.name || "Product"}</h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{product.short_description || product.description || "High quality product with fast delivery."}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-3xl font-black text-purple-700">{formatMoney(product.price)}</p>
          </div>
          {product.originalPrice > product.price && (
            <div className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
              Save {formatMoney(product.originalPrice - product.price)}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Stock</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{product.stock ?? "Available"}</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Rating</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{product.rating || 0} / 5</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Brand</p>
            <p className="mt-2 text-base font-semibold text-gray-900">{product.vendor || "Unknown"}</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">SKU</p>
            <p className="mt-2 text-base font-semibold text-gray-900">{product.sku || product.id || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Delivery</p>
            <p className="mt-1 text-base font-semibold text-gray-900">3-5 business days</p>
          </div>
          <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">Free Shipping</div>
        </div>
        <div className="mt-5">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}

function categoryHref(product) {
  const slug = product.categorySlug || product.category?.slug || product.category?.toLowerCase?.()
    ?.replace(/ & /g, "-")
    ?.replace(/ /g, "-");
  return slug ? `/category/${slug}` : "/category";
}
