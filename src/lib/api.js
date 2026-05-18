import { API_BASE_URL, USE_MOCK, getApiOrigin } from "@/lib/config";
import {
  brands,
  categories,
  featuredProducts,
  flashSaleProducts,
  heroSlides,
  offerBanners,
  topNavLinks,
} from "@/data/mockData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildSlug(value) {
  return (value || "item")
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

function normalizeApiResponse(response) {
  if (response == null) return [];
  if (Array.isArray(response)) return response.map(normalizeProduct);
  if (typeof response !== "object") return response;

  let items = null;
  if (response.data !== undefined) items = response.data;
  else if (response.products !== undefined) items = response.products;
  else if (response.categories !== undefined) return response.categories;
  else if (response.brands !== undefined) return response.brands;
  else if (response.sliders !== undefined) return response.sliders;
  else if (response.banners !== undefined) return response.banners;
  else if (response.items !== undefined) items = response.items;
  else items = response;

  if (Array.isArray(items)) return items.map(normalizeProduct);
  if (items && typeof items === "object") return normalizeProduct(items);
  return items || [];
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function parsePrice(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return value ?? 0;
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeImage(value) {
  if (Array.isArray(value)) return normalizeImage(value[0]);
  if (value && typeof value === "object") {
    return firstValue(value.path, value.url, value.src, value.file_name, value.image) || null;
  }
  if (!value || typeof value !== "string") return null;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;

  const origin = getApiOrigin();
  if (!origin) return value;
  const cleanPath = value.replace(/^\/+/, "");
  return `${origin}/${cleanPath}`;
}

function normalizeCategory(category) {
  if (!category || typeof category !== "object") return category;
  const name = firstValue(category.name, category.title, category.category_name, "");
  return {
    ...category,
    id: category.id,
    name,
    title: firstValue(category.title, name),
    slug: category.slug || buildSlug(name || category.id),
    icon: category.icon || category.icon_class || "📦",
    image: normalizeImage(firstValue(category.image, category.banner, category.icon_image)),
  };
}

function normalizeBrand(brand) {
  if (!brand || typeof brand !== "object") return brand;
  const name = firstValue(brand.name, brand.title, "");
  return {
    ...brand,
    id: brand.id,
    name,
    slug: brand.slug || buildSlug(name || brand.id),
    logo: normalizeImage(firstValue(brand.logo, brand.image, brand.thumbnail_image)),
  };
}

function normalizeBanner(banner) {
  if (!banner || typeof banner !== "object") return banner;
  return {
    ...banner,
    id: banner.id,
    title: firstValue(banner.title, banner.name, banner.main_text, "Offer"),
    subtitle: firstValue(banner.subtitle, banner.description, banner.sub_text, ""),
    image: normalizeImage(firstValue(banner.image, banner.photo, banner.banner)),
    link: firstValue(banner.link, banner.url, "/offers"),
  };
}

function normalizeSuggestion(item) {
  if (typeof item === "string") {
    return {
      id: item,
      title: item,
      type: "keyword",
      href: `/search?q=${encodeURIComponent(item)}&exact=1`,
    };
  }

  if (!item || typeof item !== "object") return null;
  const title = firstValue(item.name, item.title, item.query, item.keyword, item.value, "");
  if (!title) return null;
  const productId = firstValue(item.id, item.product_id, null);
  const categorySlug = firstValue(item.slug, item.category_slug, null);
  const type = firstValue(item.type, productId ? "product" : "keyword");

  return {
    ...item,
    id: firstValue(productId, categorySlug, title),
    title,
    type,
    image: normalizeImage(firstValue(item.image, item.thumbnail_image, item.photo)),
    href:
      type === "category" && categorySlug
        ? `/category/${categorySlug}`
        : productId && type !== "keyword"
          ? `/product/${productId}`
          : `/search?q=${encodeURIComponent(title)}&exact=1`,
  };
}

function productMatchesQuery(product, query) {
  const value = query.toString().trim().toLowerCase();
  if (!value) return true;
  return [product.name, product.category, product.vendor]
    .filter(Boolean)
    .some((field) => field.toString().toLowerCase().includes(value));
}

function sortProductsByQuery(products, query) {
  const value = query.toString().trim().toLowerCase();
  return [...products].sort((a, b) => {
    const aName = (a.name || "").toLowerCase();
    const bName = (b.name || "").toLowerCase();
    const aStarts = aName.startsWith(value) ? 0 : 1;
    const bStarts = bName.startsWith(value) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    const aIndex = aName.indexOf(value);
    const bIndex = bName.indexOf(value);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });
}

function normalizeProduct(product) {
  if (!product || typeof product !== "object") return product;
  const price = parsePrice(firstValue(product.price, product.main_price, product.selling_price, product.unit_price, 0));
  const originalPrice = parsePrice(
    firstValue(product.originalPrice, product.original_price, product.stroked_price, product.regular_price, product.unit_price, price)
  );
  const discount = parsePrice(firstValue(product.discount, product.discount_percent, 0));
  const category = firstValue(
    product.category,
    product.category_name,
    product.category?.name,
    product.main_category,
    ""
  );

  return {
    ...product,
    id: product.id,
    name: firstValue(product.name, product.title, ""),
    price,
    originalPrice,
    discount,
    rating: parsePrice(firstValue(product.rating, product.average_rating, product.rating_count, 0)),
    reviews: parsePrice(firstValue(product.reviews, product.review_count, product.reviews_count, 0)),
    image: normalizeImage(firstValue(product.image, product.thumbnail_image, product.featured_image, product.photos, product.images)),
    category,
    categoryId: firstValue(product.categoryId, product.category_id, product.category?.id, null),
    vendor: firstValue(product.vendor, product.seller_name, product.shop_name, product.shop?.name, ""),
    vendorId: firstValue(product.vendorId, product.seller_id, product.user_id, product.shop?.user_id, null),
    badge: firstValue(product.badge, product.label, product.featured ? "Featured" : null),
    freeShipping: firstValue(product.freeShipping, product.free_shipping, false),
    description: firstValue(product.description, product.short_description, ""),
    slug: product.slug || buildSlug(firstValue(product.name, product.title, product.id)),
    stock: firstValue(product.stock, product.current_stock, product.qty, null),
  };
}

async function fetchJson(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured. Set NEXT_PUBLIC_API_URL in .env.local.");
  }

  const url = `${API_BASE_URL}${path}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("skb_token") : null;
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      credentials: "include",
    });
  } catch (error) {
    throw new Error(`Failed to fetch ${url}. Make sure the Laravel API is running and CORS allows localhost:3000.`, {
      cause: error,
    });
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || response.statusText || "Request failed.");
  }

  return normalizeApiResponse(data);
}

async function fetchRawJson(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured. Set NEXT_PUBLIC_API_URL in .env.local.");
  }

  const url = `${API_BASE_URL}${path}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("skb_token") : null;
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      credentials: "include",
    });
  } catch (error) {
    throw new Error(`Failed to fetch ${url}. Make sure the Laravel API is running and CORS allows localhost:3000.`, {
      cause: error,
    });
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || response.statusText || "Request failed.");
  }

  return data;
}

function fallbackProductsByCategory(categoryId) {
  const category = categories.find((item) => item.id === Number(categoryId));
  if (!category) return [];
  return featuredProducts.filter((product) => product.category === category.name);
}

function normalizeAuthResponse(response) {
  const payload = response?.data && typeof response.data === "object" ? response.data : response || {};
  const user = firstValue(payload.user, response?.user, payload.customer, response?.customer, null);
  const token = firstValue(
    payload.token,
    payload.access_token,
    payload.accessToken,
    response?.token,
    response?.access_token,
    response?.accessToken,
    null
  );

  return {
    ...response,
    ...payload,
    user,
    token,
    success: firstValue(response?.success, payload.success, response?.result, payload.result, !!token),
    message: firstValue(response?.message, payload.message, ""),
  };
}

function buildAuthPayload(path, payload) {
  if (path !== "/signup") return payload;
  
  // Determine if registering by phone or email
  const registerByPhone = payload.phone && payload.phone.trim().length > 0;
  const emailOrPhone = registerByPhone ? payload.phone?.trim() : payload.email?.trim();
  
  return {
    name: payload.name,
    email_or_phone: emailOrPhone,
    password: payload.password,
    password_confirmation: payload.password_confirmation || payload.password,
    register_by: registerByPhone ? "phone" : "email",
  };
}

async function authRequest(path, payload) {
  if (USE_MOCK) {
    await delay(400);
    if (path === "/login") {
      if (payload.email && payload.password) {
        return {
          success: true,
          token: "demo-token",
          user: { name: "Demo User", email: payload.email },
        };
      }
      throw new Error("Login failed. Check your email and password.");
    }

    if (path === "/signup") {
      if (payload.name && payload.email && payload.password) {
        return {
          success: true,
          token: "demo-token",
          user: { name: payload.name, email: payload.email },
        };
      }
      throw new Error("Please complete all fields to register.");
    }
  }

  const data = await fetchRawJson("/auth" + path, {
    method: "POST",
    body: JSON.stringify(buildAuthPayload(path, payload)),
  });
  return normalizeAuthResponse(data);
}

export function loginUser(payload) {
  return authRequest("/login", payload);
}

export function signupUser(payload) {
  return authRequest("/signup", payload);
}

export async function getCategories() {
  if (USE_MOCK) {
    await delay(250);
    return categories.map((category) => ({ ...category, slug: category.slug || buildSlug(category.name) }));
  }

  try {
    const result = await fetchJson("/categories");
    return Array.isArray(result)
      ? result.map(normalizeCategory)
      : [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return categories.map(normalizeCategory);
  }
}

export async function getCategoryBySlug(slug) {
  const categoryList = await getCategories();
  return categoryList.find((item) => item.slug === slug) || null;
}

export async function getProducts() {
  if (USE_MOCK) {
    await delay(250);
    return featuredProducts;
  }
  try {
    return fetchJson("/products");
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return featuredProducts;
  }
}

export async function getProductById(id) {
  if (!id) return null;
  if (USE_MOCK) {
    await delay(250);
    return featuredProducts.find((product) => product.id?.toString() === id.toString()) || null;
  }
  try {
    return fetchJson(`/products/${id}`);
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return featuredProducts.find((product) => product.id?.toString() === id.toString()) || null;
  }
}

export async function getProductsByCategoryId(categoryId) {
  if (USE_MOCK) {
    await delay(250);
    const category = categories.find((item) => item.id === Number(categoryId));
    if (!category) return [];
    return featuredProducts.filter((product) => product.category === category.name);
  }
  try {
    return fetchJson(`/products/category/${categoryId}`);
  } catch (error) {
    console.error(`Failed to fetch category products ${categoryId}:`, error);
    return fallbackProductsByCategory(categoryId);
  }
}

export async function searchProducts(query) {
  if (USE_MOCK) {
    await delay(250);
    const value = query.toString().trim().toLowerCase();
    if (!value) return [];
    return featuredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value) ||
        product.vendor.toLowerCase().includes(value)
    );
  }
  try {
    const result = await fetchJson(`/products/search?q=${encodeURIComponent(query)}`);
    if (Array.isArray(result) && result.length > 0) {
      return sortProductsByQuery(result.filter((product) => productMatchesQuery(product, query)), query);
    }
    const nameResult = await fetchJson(`/products/search?name=${encodeURIComponent(query)}`);
    return Array.isArray(nameResult)
      ? sortProductsByQuery(nameResult.filter((product) => productMatchesQuery(product, query)), query)
      : [];
  } catch (error) {
    console.error("Failed to search products:", error);
    const value = query.toString().trim().toLowerCase();
    return sortProductsByQuery(
      featuredProducts.filter((product) => product.name.toLowerCase().includes(value)),
      query
    );
  }
}

export async function getSearchSuggestions(query) {
  const value = query.toString().trim();
  if (!value) return [];

  if (USE_MOCK) {
    await delay(150);
    const lowered = value.toLowerCase();
    return featuredProducts
      .filter((product) => product.name.toLowerCase().includes(lowered))
      .slice(0, 6)
      .map((product) => normalizeSuggestion({ ...product, title: product.name, type: "product" }));
  }

  const products = await searchProducts(value);
  return products
    .slice(0, 8)
    .map((product) => normalizeSuggestion({ ...product, title: product.name, type: "product" }))
    .filter(Boolean);
}

export async function getOfferBanners() {
  if (USE_MOCK) {
    await delay(250);
    return offerBanners;
  }
  try {
    const result = await fetchJson("/banners");
    return Array.isArray(result) ? result.map(normalizeBanner) : [];
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return offerBanners;
  }
}

export async function getFeaturedProducts() {
  if (USE_MOCK) {
    await delay(250);
    return featuredProducts;
  }
  try {
    return fetchJson("/products/featured");
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return featuredProducts;
  }
}

export async function getFlashSaleProducts() {
  if (USE_MOCK) {
    await delay(250);
    return flashSaleProducts;
  }
  try {
    return fetchJson("/products/todays-deal");
  } catch (error) {
    console.error("Failed to fetch flash sale products:", error);
    return flashSaleProducts;
  }
}

export async function getBrands() {
  if (USE_MOCK) {
    await delay(250);
    return brands.map(normalizeBrand);
  }
  try {
    const result = await fetchJson("/brands/top");
    return Array.isArray(result) ? result.map(normalizeBrand) : [];
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return brands.map(normalizeBrand);
  }
}

export async function getSliders() {
  if (USE_MOCK) {
    await delay(250);
    return heroSlides;
  }
  try {
    const result = await fetchJson("/sliders");
    return Array.isArray(result) ? result.map(normalizeBanner) : [];
  } catch (error) {
    console.error("Failed to fetch sliders:", error);
    return heroSlides;
  }
}

export async function getTopNavLinks() {
  const categoryList = await getCategories();
  if (categoryList.length) {
    return categoryList.slice(0, 6).map((category) => ({
      id: category.id,
      name: category.name,
      href: `/category/${category.slug}`,
      icon: category.icon || "📦",
    }));
  }
  return topNavLinks;
}

export async function placeOrder(orderData) {
  if (USE_MOCK) {
    await delay(800);
    return {
      success: true,
      order_id: "ORD" + Date.now(),
      message: "Order placed successfully",
    };
  }

  return fetchJson("/carts/process", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function getUser() {
  if (USE_MOCK) {
    await delay(250);
    return { name: "Demo User", email: "demo@example.com" };
  }
  return fetchJson("/auth/user");
}

export async function logoutUser() {
  if (USE_MOCK) {
    await delay(250);
    return { success: true };
  }
  return fetchJson("/auth/logout");
}

export async function addToCart(cartData) {
  if (USE_MOCK) {
    await delay(250);
    return { success: true };
  }
  return fetchJson("/carts/add", {
    method: "POST",
    body: JSON.stringify(cartData),
  });
}

export async function getCart(userId) {
  if (USE_MOCK) {
    await delay(250);
    return [];
  }
  return fetchJson(`/carts/${userId}`, {
    method: "POST",
  });
}

export async function updateCartQuantity(cartData) {
  if (USE_MOCK) {
    await delay(250);
    return { success: true };
  }
  return fetchJson("/carts/change-quantity", {
    method: "POST",
    body: JSON.stringify(cartData),
  });
}

export async function removeFromCart(cartId) {
  if (USE_MOCK) {
    await delay(250);
    return { success: true };
  }
  return fetchJson(`/carts/${cartId}`, {
    method: "DELETE",
  });
}

export async function getPurchaseHistory(userId) {
  if (USE_MOCK) {
    await delay(250);
    return [];
  }
  return fetchJson(`/purchase-history/${userId}`);
}

export async function getOrderDetails(orderId) {
  if (USE_MOCK) {
    await delay(250);
    return { id: orderId, status: "completed" };
  }
  return fetchJson(`/purchase-history-details/${orderId}`);
}

