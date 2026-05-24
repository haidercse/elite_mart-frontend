import Link from "next/link";
import { getApiOrigin } from "@/lib/config";
import { getProductById, getProductBySlug, getProducts } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import ProductDetails from "./ProductDetails";
import ProductGallery from "@/components/ui/ProductGallery";

function firstNonEmpty(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function normalizeImageSource(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(normalizeImageSource);
  if (typeof value === "object") {
    return normalizeImageSource(
      firstNonEmpty(value.path, value.url, value.src, value.file_name, value.image)
    );
  }

  const trimmed = String(value).trim();
  if (!trimmed) return [];
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return [trimmed];
  }

  const hostPattern = /^localhost[_:](\d+)[_/](.+)$/i;
  const schemePattern = /^(https?)_+(.+)$/i;

  if (hostPattern.test(trimmed)) {
    const [, port, rest] = trimmed.match(hostPattern);
    const fixed = rest.replace(/^_+/, "").replace(/_/g, "/");
    return [`http://localhost:${port}/${fixed}`];
  }

  if (schemePattern.test(trimmed)) {
    const [, scheme, rest] = trimmed.match(schemePattern);
    const fixed = rest.replace(/^_+/, "").replace(/_/g, "/");
    return [`${scheme}://${fixed}`];
  }

  if (trimmed.startsWith("localhost:")) {
    return [`http://${trimmed}`];
  }

  const origin = getApiOrigin();
  return origin ? [`${origin}/${trimmed.replace(/^\/+/, "")}`] : [`/${trimmed.replace(/^\/+/, "")}`];
}

function getProductImages(product) {
  const candidates = [product.images, product.photos, product.image, product.thumbnail_image, product.featured_image];
  const normalized = candidates.flatMap(normalizeImageSource).filter(Boolean);
  return Array.from(new Set(normalized));
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

  const images = getProductImages(product);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-purple-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>

        {/* Main Product Section - Two Column with Gallery Prominent */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="grid md:grid-cols-[55%_45%] gap-8 p-6 md:p-10">
            {/* Left: Gallery with Side Thumbnails */}
            <div className="flex flex-col gap-4">
              <ProductGallery images={images} name={product.name} />
            </div>

            {/* Right: Product Details */}
            <ProductDetails product={product} images={images} allProducts={allProducts} />
          </div>
        </div>

        {/* Description/Reviews Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-10 overflow-hidden">
          <div className="border-b border-gray-200 flex gap-8 px-6 md:px-8">
            <button className="py-4 font-semibold text-gray-900 border-b-2 border-purple-600">Description</button>
            <button className="py-4 text-gray-500 hover:text-gray-900">Reviews ({product.reviews})</button>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-gray-700 leading-relaxed">{product.description || "This product is available with fast processing and reliable delivery."}</p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 text-white">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🚚</span>
              <div>
                <p className="font-bold">Free Delivery</p>
                <p className="text-sm text-purple-100">3-5 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">💳</span>
              <div>
                <p className="font-bold">Easy Payment</p>
                <p className="text-sm text-purple-100">Cash on delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🛡️</span>
              <div>
                <p className="font-bold">Secure</p>
                <p className="text-sm text-purple-100">100% safe shopping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

