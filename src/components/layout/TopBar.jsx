"use client";
import { useState } from "react";
import Link from "next/link";
import { PhoneCall, Mail, Globe, ChevronDown, Package } from "lucide-react";

export default function TopBar() {
  const [lang, setLang] = useState("English");

  return (
    <div className="bg-gray-900 text-gray-300 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1 hover:text-white transition-colors"
            onClick={() => setLang(lang === "English" ? "বাংলা" : "English")}
          >
            <Globe size={12} />
            {lang}
            <ChevronDown size={10} />
          </button>
          <a href="tel:+8801325319106" className="flex items-center gap-1 hover:text-white transition-colors">
            <PhoneCall size={12} />
            +8801325319106
          </a>
          <a href="mailto:info@sobkisubazar.com" className="flex items-center gap-1 hover:text-white transition-colors">
            <Mail size={12} />
            info@sobkisubazar.com
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Link href="/track-order" className="flex items-center gap-1 hover:text-white transition-colors">
            <Package size={12} />
            Track My Order
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Follow us:</span>
            {["f", "in", "tw", "yt"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-5 h-5 bg-gray-700 rounded-sm flex items-center justify-center hover:bg-purple-600 transition-colors text-[10px] font-bold uppercase"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
