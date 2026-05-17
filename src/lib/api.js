import { API_BASE_URL, USE_MOCK } from "@/lib/config";
import { categories, featuredProducts, flashSaleProducts, offerBanners } from "@/data/mockData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildSlug(value) {
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

function normalizeApiResponse(response) {
  if (response == null) return [];
  if (Array.isArray(response)) return response.map(normalizeProduct);
  if (typeof response !== "object") return response;

  let items = null;
  if (response.data !== undefined) items = response.data;
  else if (response.products !== undefined) items = response.products;
  else if (response.categories !== undefined) return response.categories;
  else if (response.banners !== undefined) return response.banners;
  else if (response.items !== undefined) items = response.items;
  else items = response;

  if (Array.isArray(items)) return items.map(normalizeProduct);
  if (items && typeof items === "object") return normalizeProduct(items);
  return items || [];
}

function normalizeProduct(product) {
  if (!product || typeof product !== "object") return product;
  
  return {
    id: product.id,
    name: product.name || product.title || "",
    price: product.price ?? product.selling_price ?? product.unit_price ?? 0,
    originalPrice: product.originalPrice ?? product.original_price ?? product.regular_price ?? product.price ?? product.selling_price ?? 0,
    discount: product.discount ?? 0,
    rating: product.rating ?? product.average_rating ?? 0,
    reviews: product.reviews ?? product.review_count ?? 0,
    image: product.image ?? product.images?.[0] ?? null,
    category: product.category ?? product.category_name ?? "",
    vendor: product.vendor ?? product.seller_name ?? "",
    vendorId: product.vendorId ?? product.seller_id ?? null,
    badge: product.badge ?? product.label ?? null,
    freeShipping: product.freeShipping ?? product.free_shipping ?? false,
    description: product.description ?? "",
    slug: product.slug ?? "",
  };
}

async function fetchJson(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured. Set NEXT_PUBLIC_API_URL in .env.local.");
  }

  const url = `${API_BASE_URL}${path}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("skb_token") : null;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || response.statusText || "Request failed.");
  }

  return normalizeApiResponse(data);
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

  return fetchJson("/auth" + path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
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
      ? result.map((item) => ({ ...item, slug: item.slug || buildSlug(item.name) }))
      : [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return categories.map((category) => ({ ...category, slug: category.slug || buildSlug(category.name) }));
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
  return fetchJson(`/products/${id}`);
}

export async function getProductsByCategoryId(categoryId) {
  if (USE_MOCK) {
    await delay(250);
    const category = categories.find((item) => item.id === Number(categoryId));
    if (!category) return [];
    return featuredProducts.filter((product) => product.category === category.name);
  }
  return fetchJson(`/products/category/${categoryId}`);
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
  return fetchJson(`/products/search?q=${encodeURIComponent(query)}`);
}

export async function getOfferBanners() {
  if (USE_MOCK) {
    await delay(250);
    return offerBanners;
  }
  try {
    return fetchJson("/banners");
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return offerBanners;
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

