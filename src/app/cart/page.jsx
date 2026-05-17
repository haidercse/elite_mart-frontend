"use client";
import { useCart } from "@/lib/cartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, Truck } from "lucide-react";
import { useState } from "react";

const ProductPlaceholder = ({ category }) => {
  const emojis = {
    Electronics: "🔌", "Furniture World": "🛋️", "Fashion & Lifestyle": "👗",
    "Mobile World": "📱", "Health & Beauty": "💄", "Ceramic World": "🏺",
    "Gadget World": "⌚", "Baby World": "🧸",
  };
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl">
      <span className="text-3xl">{emojis[category] || "🛒"}</span>
    </div>
  );
};

export default function CartPage() {
  const { items, totalItems, totalPrice, dispatch } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const deliveryFee = totalPrice > 2000 ? 0 : 80;
  const discount = couponApplied ? Math.floor(totalPrice * 0.1) : 0;
  const finalTotal = totalPrice + deliveryFee - discount;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Browse our products and add something you love!</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-2xl font-bold transition-colors shadow-lg shadow-purple-500/20"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-500 hover:text-purple-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black text-gray-800">Shopping Cart</h1>
        <span className="bg-purple-100 text-purple-700 font-bold text-sm px-3 py-1 rounded-full">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-purple-200 transition-colors shadow-sm"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                  <ProductPlaceholder category={item.category} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-purple-600 font-semibold">{item.vendor}</p>
                      <h3 className="text-sm font-bold text-gray-800 leading-snug mt-0.5 line-clamp-2">
                        {item.name}
                      </h3>
                      {item.freeShipping && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-bold mt-1">
                          <Truck size={10} /> Free Shipping
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Price + Qty */}
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-lg font-black text-purple-700">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        ৳{item.price.toLocaleString()} each
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                      <button
                        onClick={() =>
                          dispatch({
                            type: item.quantity === 1 ? "REMOVE_ITEM" : "UPDATE_QTY",
                            payload: item.quantity === 1 ? item.id : { id: item.id, qty: item.quantity - 1 },
                          })
                        }
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.quantity + 1 } })
                        }
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Clear cart */}
          <div className="flex justify-between items-center pt-2">
            <Link href="/" className="flex items-center gap-2 text-purple-600 font-semibold text-sm hover:text-purple-700">
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
            <button
              onClick={() => dispatch({ type: "CLEAR_CART" })}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm font-semibold transition-colors"
            >
              <Trash2 size={15} />
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Tag size={16} className="text-orange-500" />
              Coupon Code
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 border border-gray-200 focus:border-purple-400 rounded-xl px-3 py-2 text-sm outline-none transition-colors"
              />
              <button
                onClick={() => {
                  if (coupon === "SAVE10") setCouponApplied(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-green-600 text-xs font-semibold mt-2">✓ Coupon applied! 10% off</p>
            )}
            <p className="text-gray-400 text-xs mt-2">Try: <span className="font-mono font-bold text-gray-500">SAVE10</span></p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold">৳{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-green-600 font-semibold" : "font-semibold"}>
                  {deliveryFee === 0 ? "Free" : `৳${deliveryFee}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">-৳{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-dashed border-gray-200 pt-3">
                <div className="flex justify-between font-black text-gray-900 text-base">
                  <span>Total</span>
                  <span className="text-purple-700">৳{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {totalPrice < 2000 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-600 font-medium">
                🚚 Add ৳{(2000 - totalPrice).toLocaleString()} more for free delivery!
              </div>
            )}

            <button className="w-full mt-4 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 text-white py-3.5 rounded-2xl font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2">
              <Link href="/checkout" className="w-full flex items-center justify-center gap-2">
                <ShoppingBag size={20} />
                Proceed to Checkout
              </Link>
            </button>

            {/* Payment Methods */}
            <div className="mt-4">
              <p className="text-xs text-gray-400 text-center mb-2">Accepted Payment Methods</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {["VISA", "bKash", "Nagad", "Rocket", "COD"].map((m) => (
                  <span
                    key={m}
                    className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
