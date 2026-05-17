"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPurchaseHistory } from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = 1; // Assume user ID from auth
        const data = await getPurchaseHistory(userId);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-700 border-t-purple-300 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-gray-900">Order History</h1>
        <p className="text-gray-500 mt-2">View your past orders and track their status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Order #{order.id}</p>
                  <p className="text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">${order.total}</p>
                  <p className="text-sm text-gray-500">{order.status}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/order-confirmation/${order.id}`} className="text-purple-600 hover:text-purple-800">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}