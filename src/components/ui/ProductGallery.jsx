"use client";
import { useEffect, useState } from "react";

export default function ProductGallery({ images = [], name = "Product" }) {
  const list = Array.isArray(images) && images.length ? images : [];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!open) setZoomed(false);
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % list.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + list.length) % list.length);
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, list.length]);

  if (!list.length) {
    return (
      <div className="h-[420px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-[6rem]">No Image</span>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-3xl overflow-hidden border-b border-gray-100 bg-white">
        <div className="grid grid-cols-4 gap-4 p-6 items-start">
          <div className="col-span-3">
            <div className="h-[420px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden rounded-2xl">
              <img
                src={list[index]}
                alt={`${name} ${index + 1}`}
                className="h-full w-full object-contain cursor-zoom-in transition-transform"
                onClick={() => setOpen(true)}
              />
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {list.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`rounded-xl overflow-hidden border ${i === index ? "ring-2 ring-purple-500" : "border-gray-100"} bg-white`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt={`${name} thumb ${i + 1}`} className="h-20 w-20 object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-1 hidden sm:block">
            <div className="flex flex-col gap-3 sticky top-6">
              {list.map((src, i) => (
                <button key={i} onClick={() => setIndex(i)} className={`rounded-xl overflow-hidden ${i === index ? "ring-2 ring-purple-500" : "border border-gray-100"} bg-white`}>
                  <img src={src} alt={`${name} side ${i + 1}`} className="h-20 w-20 object-contain p-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="relative max-w-[95%] max-h-[95%] w-full">
            <button
              className="absolute top-4 right-4 z-20 bg-white/90 rounded-full p-2"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white text-3xl"
              onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
              aria-label="Previous"
            >
              ‹
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white text-3xl"
              onClick={() => setIndex((i) => (i + 1) % list.length)}
              aria-label="Next"
            >
              ›
            </button>

            <div className="w-full h-full flex items-center justify-center overflow-auto">
              <img
                src={list[index]}
                alt={`${name} large ${index + 1}`}
                onDoubleClick={() => setZoomed((z) => !z)}
                style={{ transform: zoomed ? "scale(1.6)" : "scale(1)", transition: "transform .2s" }}
                className="max-h-[90vh] max-w-full object-contain cursor-zoom-out"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
