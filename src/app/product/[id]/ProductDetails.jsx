"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { Heart, Truck, Shield, RotateCcw } from "lucide-react";

function formatMoney(value) {
  return `৳${Number(value || 0).toLocaleString()}`;
}

function parseVariantResponse(data, fallback) {
  if (!data || typeof data !== "object") return fallback;
  return Number(
    data.price ?? data.selling_price ?? data.final_price ?? data.unit_price ?? data.value ?? fallback
  );
}

export default function ProductDetails({ product }) {
  const colors = useMemo(() => {
    if (!Array.isArray(product.colors)) return [];
    return product.colors.map((item) =>
      typeof item === "string"
        ? { name: item, code: "#8b5cf6" }
        : { name: item.name || item.title || item.label || "Variant", code: item.code || item.color || "#8b5cf6" }
    );
  }, [product.colors]);

  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "");
  const [currentPrice, setCurrentPrice] = useState(product.price || 0);
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  useEffect(() => {
    if (!product.id || !selectedColor || !colors.length) {
      setCurrentPrice(product.price || 0);
      return;
    }

    const controller = new AbortController();
    async function fetchVariantPrice() {
      setIsPriceLoading(true);
      try {
        const url = new URL(`/api/proxy/products/variant/price`, window.location.origin);
        url.searchParams.set("product_id", String(product.id));
        url.searchParams.set("color", selectedColor);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        const data = await response.json();
        if (!response.ok) {
          console.warn("Variant price fetch failed:", data?.message || response.statusText);
          setCurrentPrice(product.price || 0);
          return;
        }

        const priceValue = parseVariantResponse(data, product.price || 0);
        setCurrentPrice(priceValue);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Variant price fetch failed:", error);
        }
        setCurrentPrice(product.price || 0);
      } finally {
        setIsPriceLoading(false);
      }
    }

    fetchVariantPrice();
    return () => controller.abort();
  }, [product.id, product.price, selectedColor, colors.length]);

  const savingAmount = product.originalPrice - currentPrice;

  return (
    <div className="flex flex-col gap-6">
      {/* Category & Seller */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href={categoryHref(product)} className="text-purple-700 font-semibold hover:underline">
            {product.category || "Category"}
          </Link>
          <span>›</span>
          <span>{product.vendor || "Seller"}</span>
        </div>
      </div>

      {/* Title & Rating */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">{product.name}</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold text-gray-900">{product.rating || 0}/5</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews || 0} reviews)</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">{product.short_description || product.description || "High quality product with fast delivery."}</p>

      {/* Price Section - Prominent */}
      <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">Price</p>
        <div className="flex items-baseline gap-3">
          <p className="text-4xl font-black text-purple-700">
            {isPriceLoading ? "..." : formatMoney(currentPrice)}
          </p>
          {product.originalPrice > currentPrice && (
            <>
              <p className="text-lg text-gray-400 line-through">{formatMoney(product.originalPrice)}</p>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                Save {formatMoney(savingAmount)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Color Variant Selection */}
      {colors.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-3">Select Color</p>
          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.name)}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                  color.name === selectedColor
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                }`}
              >
                <div className="w-5 h-5 rounded-full border-2" style={{ backgroundColor: color.code, borderColor: color.code }} />
                {color.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock & Availability */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Stock</p>
          <p className="font-bold text-gray-900">{product.stock ?? "Available"}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">SKU</p>
          <p className="font-bold text-gray-900 text-sm">{product.sku || product.id || "N/A"}</p>
        </div>
      </div>

      {/* Add to Cart & Wishlist */}
      <div className="flex gap-3">
        <div className="flex-1">
          <AddToCartButton product={product} selectedVariant={selectedColor || undefined} />
        </div>
        <button className="px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-pink-300 bg-white hover:bg-pink-50 transition-colors flex items-center justify-center">
          <Heart size={20} className="text-pink-500" />
        </button>
      </div>

      {/* Features */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Truck className="text-green-600" size={20} />
          <div>
            <p className="font-semibold text-sm text-gray-900">Free Delivery</p>
            <p className="text-xs text-gray-500">3-5 business days</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="text-blue-600" size={20} />
          <div>
            <p className="font-semibold text-sm text-gray-900">Secure Payment</p>
            <p className="text-xs text-gray-500">100% safe & secure</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="text-orange-600" size={20} />
          <div>
            <p className="font-semibold text-sm text-gray-900">Easy Returns</p>
            <p className="text-xs text-gray-500">30-day return policy</p>
          </div>
        </div>
      </div>

      {/* Brand Info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Seller Information</p>
        <p className="font-bold text-gray-900">{product.vendor || "Unknown"}</p>
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
