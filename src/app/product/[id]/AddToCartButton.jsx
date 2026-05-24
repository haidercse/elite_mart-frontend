"use client";
import { useCart } from "@/lib/cartContext";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function AddToCartButton({ product, selectedVariant }) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: { ...product, quantity, selectedVariant },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 border border-gray-200 rounded-2xl p-1">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-bold text-gray-700"
        >
          −
        </button>
        <span className="flex-1 text-center font-bold text-lg">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-bold text-gray-700"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className={`w-full py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
          added
            ? "bg-green-500 text-white scale-95"
            : "bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 text-white hover:scale-[1.02]"
        }`}
      >
        <ShoppingBag size={20} />
        {added ? "✓ Added to Cart!" : "Add to Cart"}
      </button>
    </div>
  );
}
