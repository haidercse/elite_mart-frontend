"use client";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useState } from "react";

const badgeColors = {
  Hot: "bg-red-500",
  Sale: "bg-orange-500",
  New: "bg-green-500",
  Traditional: "bg-purple-500",
};

// Placeholder product image
const ProductPlaceholder = ({ category }) => {
  const emojis = {
    Electronics: "🔌",
    "Furniture World": "🛋️",
    "Fashion & Lifestyle": "👗",
    "Mobile World": "📱",
    "Health & Beauty": "💄",
    "Ceramic World": "🏺",
    "Gadget World": "⌚",
    "Baby World": "🧸",
  };
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <span className="text-5xl">{emojis[category] || "🛒"}</span>
    </div>
  );
};

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch({ type: "ADD_ITEM", payload: product });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ paddingTop: "75%" }}>
          <div className="absolute inset-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <ProductPlaceholder category={product.category} />
            )}
          </div>

          {/* Badges */}
          {product.badge && (
            <span
              className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${
                badgeColors[product.badge] || "bg-gray-500"
              }`}
            >
              {product.badge}
            </span>
          )}
          <span className="absolute top-2 right-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            -{product.discount || 0}%
          </span>

          {/* Wishlist */}
          <button
            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
            onClick={(e) => {
              e.preventDefault();
              setWishlisted(!wishlisted);
            }}
          >
            <Heart
              size={14}
              className={wishlisted ? "text-red-500 fill-red-500" : "text-gray-400"}
            />
          </button>

          {/* Free Shipping */}
          {product.freeShipping && (
            <span className="absolute bottom-2 left-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Free Shipping
            </span>
          )}

          {/* Add to cart hover overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-2">
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                addedAnim
                  ? "bg-green-500 text-white"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              {addedAnim ? (
                <>✓ Added!</>
              ) : (
                <>
                  <ShoppingCart size={13} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <p className="text-xs text-purple-600 font-semibold mb-0.5 truncate">{product.vendor}</p>
          <h3 className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 mb-auto">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={10}
                  className={
                    s <= Math.floor(product.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({product.reviews || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-purple-700">
              ৳{(product.price || 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ৳{(product.originalPrice || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
