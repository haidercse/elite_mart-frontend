"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser as apiGetUser, logoutUser } from "@/lib/api";

function getUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("skb_user") || "null");
  } catch {
    return null;
  }
}

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiGetUser();
        setUser(data);
        localStorage.setItem("skb_user", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(getUser()); // fallback to localStorage
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("skb_user");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("skb_token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-700 border-t-purple-300 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">You are not logged in</h1>
          <p className="text-gray-500 mb-6">Please login or create an account to view your account details.</p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Link href="/login" className="inline-flex items-center justify-center rounded-2xl bg-purple-700 px-5 py-3 text-white font-semibold hover:bg-purple-800 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-2xl border border-purple-700 px-5 py-3 text-purple-700 font-semibold hover:bg-purple-50 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-[1fr_0.6fr]">
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-5">Welcome, {user.name}</h1>
          <p className="text-gray-600 mb-8">This is your account overview. You can manage your profile, orders, and favorites here.</p>

          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-gray-500">Account status</p>
              <p className="text-lg font-semibold text-green-600">Active</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="text-lg font-semibold text-gray-900">2024</p>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick links</h2>
            <div className="space-y-3">
              <Link href="/orders" className="block rounded-2xl border border-gray-200 px-4 py-3 hover:border-purple-300 transition-colors">Order history</Link>
              <Link href="/wishlist" className="block rounded-2xl border border-gray-200 px-4 py-3 hover:border-purple-300 transition-colors">Wishlist</Link>
              <Link href="/address" className="block rounded-2xl border border-gray-200 px-4 py-3 hover:border-purple-300 transition-colors">Shipping address</Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-2xl bg-red-500 px-5 py-3 text-white font-semibold hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </aside>
      </div>
    </div>
  );
}
