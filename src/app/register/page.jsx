"use client";

import { useState } from "react";
import Link from "next/link";
import { signupUser } from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await signupUser(form);
      localStorage.setItem("skb_user", JSON.stringify(data.user));
      localStorage.setItem("skb_token", data.token);
      setSuccess("Registration successful. Redirecting...");
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-purple-800 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Create Account</h1>
          <p className="text-sm text-gray-500 mb-8">Register and start shopping at Sobkisu Bazar.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Full Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:ring-purple-500 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:ring-purple-500 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:ring-purple-500 outline-none"
              />
            </label>

            {error && <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">{error}</div>}
            {success && <div className="rounded-2xl bg-green-50 border border-green-200 text-green-700 px-4 py-3">{success}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-700 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
