"use client";
import { useCart } from "@/lib/cartContext";
import { placeOrder } from "@/lib/api";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Truck, Lock } from "lucide-react";

function getSavedUserInfo() {
  const emptyUser = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipcode: "",
  };

  if (typeof window === "undefined") return emptyUser;

  try {
    const user = JSON.parse(localStorage.getItem("auth_user"));
    return {
      ...emptyUser,
      fullName: user?.name || "",
      email: user?.email || "",
    };
  } catch {
    return emptyUser;
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, dispatch } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [userInfo, setUserInfo] = useState(getSavedUserInfo);
  const [errors, setErrors] = useState({});

  const deliveryFee = totalPrice > 2000 ? 0 : 80;
  const finalTotal = totalPrice + deliveryFee;

  const validateForm = () => {
    const newErrors = {};
    if (!userInfo.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!userInfo.email.trim()) newErrors.email = "Email is required";
    if (!userInfo.phone.trim()) newErrors.phone = "Phone number is required";
    if (!userInfo.address.trim()) newErrors.address = "Address is required";
    if (!userInfo.city.trim()) newErrors.city = "City is required";
    if (!userInfo.zipcode.trim()) newErrors.zipcode = "Zipcode is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        customer: userInfo,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        payment_method: paymentMethod,
        subtotal: totalPrice,
        delivery_fee: deliveryFee,
        total: finalTotal,
        notes: `Payment via ${paymentMethod}`,
      };

      const result = await placeOrder(orderData);
      setOrderPlaced(true);
      
      setTimeout(() => {
        dispatch({ type: "CLEAR_CART" });
        window.location.href = `/order-confirmation/${result.order_id || "12345"}`;
      }, 2000);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some products before checking out.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-2xl font-bold transition-colors"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="text-6xl mb-6 animate-bounce">✓</div>
          <h2 className="text-3xl font-black text-green-600 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-500 mb-4">Redirecting to order confirmation...</p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-700 border-t-purple-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/cart" className="text-gray-500 hover:text-purple-600 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-black text-gray-800">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-2xl font-black text-gray-800">Shipping Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={userInfo.fullName}
                  onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                  className="w-full border border-gray-200 focus:border-purple-400 rounded-xl px-4 py-3 outline-none transition-colors"
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full border border-gray-200 focus:border-purple-400 rounded-xl px-4 py-3 outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    className="w-full border border-gray-200 focus:border-purple-400 rounded-xl px-4 py-3 outline-none transition-colors"
                    placeholder="+880 1234 567890"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={userInfo.address}
                  onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                  className="w-full border border-gray-200 focus:border-purple-400 rounded-xl px-4 py-3 outline-none transition-colors"
                  placeholder="123 Main St, Apt 4B"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={userInfo.city}
                    onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
                    className="w-full border border-gray-200 focus:border-purple-400 rounded-xl px-4 py-3 outline-none transition-colors"
                    placeholder="Dhaka"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Zipcode</label>
                  <input
                    type="text"
                    value={userInfo.zipcode}
                    onChange={(e) => setUserInfo({ ...userInfo, zipcode: e.target.value })}
                    className="w-full border border-gray-200 focus:border-purple-400 rounded-xl px-4 py-3 outline-none transition-colors"
                    placeholder="1000"
                  />
                  {errors.zipcode && <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-2xl font-black text-gray-800">Payment Method</h2>
            </div>

            <div className="space-y-3">
              {[
                { id: "COD", label: "Cash on Delivery", icon: "💵" },
                { id: "BKASH", label: "bKash", icon: "📱" },
                { id: "NAGAD", label: "Nagad", icon: "📱" },
                { id: "CARD", label: "Credit/Debit Card", icon: "💳" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? "border-purple-700 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-semibold text-gray-800">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold">
                3
              </div>
              <h2 className="text-2xl font-black text-gray-800">Order Items</h2>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black text-purple-700">৳{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6 h-fit">
          {/* Delivery Info */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-purple-700">
              <Truck size={20} />
              <h3 className="font-bold text-lg">Delivery Info</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">📍 Standard Delivery</p>
              <p className="text-gray-600">⏱ 1-3 Business Days</p>
              <p className="text-gray-600">🔒 Safe & Secure</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-4">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm mb-4 pb-4 border-b border-dashed border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold">৳{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-green-600 font-semibold" : "font-semibold"}>
                  {deliveryFee === 0 ? "Free" : `৳${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between font-black text-lg">
                <span className="text-gray-900">Total</span>
                <span className="text-purple-700">৳{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Place Order
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">🔒 Secure checkout powered by SobKisu Bazar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
