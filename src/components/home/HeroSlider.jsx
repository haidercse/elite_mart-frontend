"use client";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import { heroSlides as fallbackSlides } from "@/data/mockData";

const gradients = [
  "from-slate-900 via-purple-900 to-pink-600",
  "from-cyan-900 via-blue-900 to-violet-600",
  "from-orange-900 via-rose-900 to-fuchsia-600",
];

const carIllustration = (color = "#e11d48") => (
  <svg viewBox="0 0 300 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="110" rx="130" ry="10" fill="rgba(0,0,0,0.3)" />
    <rect x="30" y="60" width="240" height="45" rx="8" fill={color} />
    <path d="M70 60 L90 30 L210 30 L240 60Z" fill={color} />
    <rect x="95" y="33" width="45" height="24" rx="3" fill="rgba(200,230,255,0.7)" />
    <rect x="148" y="33" width="45" height="24" rx="3" fill="rgba(200,230,255,0.7)" />
    <circle cx="80" cy="105" r="16" fill="#1f2937" />
    <circle cx="80" cy="105" r="8" fill="#374151" />
    <circle cx="220" cy="105" r="16" fill="#1f2937" />
    <circle cx="220" cy="105" r="8" fill="#374151" />
    <rect x="25" y="72" width="20" height="12" rx="3" fill="#fbbf24" opacity="0.9" />
    <rect x="255" y="72" width="20" height="12" rx="3" fill="#ef4444" opacity="0.7" />
  </svg>
);

export default function HeroSlider({ slides = fallbackSlides }) {
  const items = slides.length ? slides : fallbackSlides;
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goTo, items.length]);

  const slide = items[current] || fallbackSlides[0];
  const gradient = slide.bgColor || gradients[current % gradients.length];
  const carColors = ["#dc2626", "#7c3aed", "#ea580c"];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-xl" style={{ minHeight: 280 }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-700`} />
      {slide.image && (
        <img
          src={slide.image}
          alt={slide.title || "Slider"}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
      )}

      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 h-full min-h-[280px] items-center px-6 md:px-10 py-8 gap-6">
        <div className={`transition-all duration-500 ${isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
          <span className="inline-block bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full mb-3 tracking-wider">
            {slide.badge || slide.tag || "Featured"}
          </span>
          <h1 className="text-white text-2xl md:text-3xl font-black leading-tight mb-1">
            {slide.title || slide.name || "Featured Collection"}
          </h1>
          <p className="text-white/70 text-sm mb-1">{slide.subtitle || slide.description}</p>
          <p className="text-orange-300 font-bold text-base mb-5">{slide.offer || slide.main_text}</p>

          <a
            href={slide.link || "/products"}
            className="inline-flex bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30"
          >
            {slide.cta || "Shop Now"}
          </a>

          {current === 0 && (
            <div className="mt-5 space-y-1.5">
              {[
                { Icon: Phone, text: "+880 172 445-6776" },
                { Icon: Mail, text: "jahangir.jm@gmail.com" },
                { Icon: MapPin, text: "Biru Dhalan, 357 Kalindi, Dhaka-1000" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/60 text-xs">
                  <Icon size={11} className="text-orange-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`flex items-center justify-center transition-all duration-500 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          {slide.image ? (
            <div className="h-44 w-full max-w-[300px]" />
          ) : (
            <div className="w-full max-w-[300px]">{carIllustration(carColors[current % carColors.length])}</div>
          )}
        </div>
      </div>

      <button
        onClick={() => goTo((current - 1 + items.length) % items.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => goTo((current + 1) % items.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.map((item, i) => (
          <button
            key={item.id || i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-orange-400" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
