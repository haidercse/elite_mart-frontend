import Link from "next/link";
import { getProductById, getProductBySlug, getProducts } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import ProductDetails from "./ProductDetails";
import AddToCartButton from "./AddToCartButton";

function formatMoney(value) {
  return `৳${Number(value || 0).toLocaleString()}`;
}

function categoryHref(product) {
  const slug = product.categorySlug || product.category?.slug || product.category?.toLowerCase?.()
    ?.replace(/ & /g, "-")
    ?.replace(/ /g, "-");
  return slug ? `/category/${slug}` : "/category";
}

export const revalidate = 3600; // ISR: Revalidate every 1 hour

export async function generateMetadata({ params }) {
  try {
    const { id: slug } = await params;
    const product = await getProductBySlug(slug);
    
    if (!product || !product.name) {
      return { title: "Product not found" };
    }

    return {
      title: `${product.name} | Sobkisu Bazar`,
      description: product.description || `Buy ${product.name} at Sobkisu Bazar`,
      keywords: [product.name, product.category, product.vendor].filter(Boolean).join(", "),
    };
  } catch (error) {
    console.error("generateMetadata error:", error);
    return { title: "Sobkisu Bazar" };
  }
}

export default async function ProductDetailsPage({ params }) {
  const { id: slug } = await params;
  const product = await getProductBySlug(slug);
  
  // Fallback for old ID format
  if (!product && /^\d+$/.test(slug)) {
    const byId = await getProductById(slug);
    if (byId) return ProductDetailsPage({ params: { id: byId.slug } });
  }
  const allProducts = await getProducts();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center max-w-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <p className="text-gray-500 mb-6">The item you are looking for does not exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = allProducts.filter((item) => {
    const sameCategory = product.categoryId
      ? item.categoryId === product.categoryId
      : item.category === product.category;
    return sameCategory && item.id !== product.id;
  }).slice(0, 4);

  const images = product.images || product.photos || (product.image ? [product.image] : []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Product Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* Two Column Layout */}
          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr_1fr]">
            {/* Left: Thumbnails Sidebar */}
            <div className="hidden md:flex flex-col gap-3">
              {images.map((img, idx) => (
                <button key={idx} className="rounded-lg overflow-hidden border-2 border-gray-100 hover:border-purple-300 bg-gray-50 p-2 transition">
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-20 object-contain" />
                </button>
              ))}
            </div>

            {/* Center: Main Image */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 flex items-center justify-center min-h-96">
              <img src={images[0] || product.image} alt={product.name} className="max-h-96 max-w-full object-contain" />
            </div>

            {/* Right: Product Details */}
            <ProductDetails product={product} images={images} allProducts={allProducts} />
          </div>
        </div>
      </div>

      {/* Description/Reviews Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 flex gap-8 px-6 md:px-8">
            <button className="py-4 font-semibold text-gray-900 border-b-2 border-purple-600">Description</button>
            <button className="py-4 text-gray-500 hover:text-gray-900">Reviews ({product.reviews})</button>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-gray-700 leading-relaxed">{product.description || "This product is available with fast processing and reliable delivery."}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-gray-600">
            <span className="text-2xl">🚚</span>
            <span className="font-semibold">24 hour delivery</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <span className="text-2xl">💳</span>
            <span className="font-semibold">Cash on delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}
