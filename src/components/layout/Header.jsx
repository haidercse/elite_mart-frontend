"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Heart, User, ChevronDown, Menu, X, Bell } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { getCategories } from "@/lib/api";

export default function Header() {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getCategories().then((data) => setCategories(data || [])).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* Main Header */}
      <header
        className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-black text-sm">SB</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-lg font-black text-purple-700 leading-none">SOBKISU</div>
                  <div className="text-[10px] font-semibold text-orange-500 tracking-widest">BAZAR</div>
                </div>
              </div>
            </Link>

            {/* Category Dropdown */}
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
              >
                <Menu size={16} />
                Categories
                <ChevronDown size={14} className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <form
              className="flex-1 flex items-center relative"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) window.location.href = `/search?q=${searchQuery}`;
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Your Product..."
                className="w-full border-2 border-gray-200 focus:border-purple-500 rounded-xl py-2.5 pl-4 pr-14 text-sm outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-r-xl transition-colors flex items-center"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-colors"
              >
                <Heart size={22} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </Link>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors hidden sm:flex">
                <Bell size={22} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  2
                </span>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-bounce">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* All Offers Button */}
              <Link
                href="/offers"
                className="hidden md:flex items-center gap-1 px-3 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors"
              >
                All Offer
                <span className="bg-white text-orange-500 px-1 rounded text-[10px] font-black">SKB</span>
              </Link>

              {/* User */}
              <Link
                href="/account"
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors ml-1"
              >
                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                  <User size={14} className="text-purple-600" />
                </div>
                <span className="hidden md:block text-sm text-gray-700 font-medium">Account</span>
              </Link>

              {/* Mobile Menu */}
              <button
                className="lg:hidden p-2 text-gray-600 hover:text-purple-600 rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Nav Bar */}
      <nav className="bg-purple-700 text-white hidden md:block sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 h-10 text-sm font-medium overflow-x-auto">
            <Link href="/blog" className="hover:text-orange-300 transition-colors whitespace-nowrap">Blog</Link>
            <Link href="/become-seller" className="hover:text-orange-300 transition-colors whitespace-nowrap">Be a Seller</Link>
            <Link href="/become-customer" className="hover:text-orange-300 transition-colors whitespace-nowrap">Be a Customer</Link>
            <Link href="/customer-care" className="hover:text-orange-300 transition-colors whitespace-nowrap">Customer Care</Link>

            <div className="flex-1" />

            <Link href="/live" className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs font-bold transition-colors">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Live
            </Link>
            <Link href="/entertainment" className="bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded-md text-xs font-bold transition-colors">Entertainment</Link>
            <Link href="/apps" className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-xs font-bold transition-colors">Get Apps</Link>
            <Link href="/login" className="bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-md text-xs font-bold transition-colors">Log In</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="bg-white w-72 h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-bold text-purple-700">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-sm text-gray-700 border-b border-gray-100 last:border-0"
                >
                  <span className="text-xl">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
