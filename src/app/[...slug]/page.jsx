import Link from "next/link";

export default async function FallbackPage({ params }) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug || "home";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-3xl w-full rounded-3xl border border-gray-200 bg-white p-10 shadow-sm text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-600 mb-4">Coming soon</p>
        <h1 className="text-4xl font-black text-gray-900 mb-4">{slugPath.replace(/\-/g, " ")}</h1>
        <p className="text-gray-500 mb-8">এই পেজটি এখনো ডেভেলপমেন্ট-এ আছে। আপনি চাইলে পরে আবার দেখুন অথবা হোমে ফিরে যান।</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="rounded-2xl bg-purple-700 px-5 py-3 text-white font-semibold hover:bg-purple-800 transition-colors">
            Home
          </Link>
          <Link href="/products" className="rounded-2xl border border-purple-700 px-5 py-3 text-purple-700 font-semibold hover:bg-purple-50 transition-colors">
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}
