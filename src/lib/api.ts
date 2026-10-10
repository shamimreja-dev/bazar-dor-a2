
const API_BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Categories load করা যায়নি");
  }

  const result = await response.json();

  // API array সরাসরি অথবা data property-তে দিতে পারে।
  const categories = Array.isArray(result) ? result : result.data;

  if (!Array.isArray(categories)) {
    throw new Error("Categories API response সঠিক নয়");
  }

  return categories;
}

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Products load করা যায়নি");
  }

  const result = await response.json();

  return Array.isArray(result) ? result : result.data ?? [];
}

export async function getCategoryBySlug(slug: string) {
  const response = await fetch(
    `${API_BASE_URL}/categories/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return null;
  }

  const result = await response.json();
  return result?.data ?? result;
}

export async function getProductsByCategory(slug: string) {
  const response = await fetch(
    `${API_BASE_URL}/products?category=${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Category products load করা যায়নি");
  }

  const result = await response.json();
  const data = Array.isArray(result) ? result : result?.data;

  return Array.isArray(data) ? data : [];
}

