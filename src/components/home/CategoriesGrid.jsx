import Link from "next/link";

const catColors = [
  "bg-purple-50 hover:bg-purple-100 text-purple-700",
  "bg-pink-50 hover:bg-pink-100 text-pink-700",
  "bg-orange-50 hover:bg-orange-100 text-orange-700",
  "bg-blue-50 hover:bg-blue-100 text-blue-700",
  "bg-green-50 hover:bg-green-100 text-green-700",
  "bg-yellow-50 hover:bg-yellow-100 text-yellow-700",
  "bg-red-50 hover:bg-red-100 text-red-700",
  "bg-teal-50 hover:bg-teal-100 text-teal-700",
];

function createSlug(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[\/\?\#]+/g, "")
    .replace(/[^a-z0-9\-]+/g, "-")
    .replace(/\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoriesGrid({ categories = [] }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-800 border-l-4 border-purple-600 pl-3">
          Categories
        </h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {categories.length ? (
          categories.map((cat, i) => {
            const slug = cat.slug || createSlug(cat.name || cat.title || "category");
            return (
              <Link
                key={cat.id || slug}
                href={`/category/${slug}`}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border border-transparent hover:border-current transition-all duration-200 cursor-pointer group ${catColors[i % catColors.length]}`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {cat.icon || "📦"}
                </span>
                <span className="text-[11px] font-semibold text-center leading-tight">
                  {cat.name || cat.title}
                </span>
              </Link>
            );
          })
        ) : (
          <p className="col-span-full text-gray-500">No categories available.</p>
        )}
      </div>
    </section>
  );
}
