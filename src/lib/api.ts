
const API_BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
};

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${path} (status: ${response.status})`
    );
  }

  return response.json();
}

function extractArray<T>(result: unknown): T[] {
  if (Array.isArray(result)) {
    return result as T[];
  }

  if (result && typeof result === "object" && "data" in result) {
    const data = result.data;

    if (Array.isArray(data)) {
      return data as T[];
    }
  }

  return [];
}

function extractObject<T>(result: unknown): T | null {
  if (!result || typeof result !== "object") {
    return null;
  }

  if ("data" in result) {
    const data = result.data;

    if (data && typeof data === "object" && !Array.isArray(data)) {
      return data as T;
    }
  }

  return result as T;
}

export async function getCategories(): Promise<Category[]> {
  const result = await fetchJson("/categories");
  return extractArray<Category>(result);
}

export async function getProducts(): Promise<Product[]> {
  const result = await fetchJson("/products");
  return extractArray<Product>(result);
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const result = await fetchJson(
    `/categories/${encodeURIComponent(slug)}`
  );

  return extractObject<Category>(result);
}

export async function getProductsByCategory(
  slug: string
): Promise<Product[]> {
  const products = await getProducts();
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();

  console.log("Requested category slug:", normalizedSlug);
  console.log(
    "Available categories:",
    [...new Set(products.map((product) => product.category))]
  );

  return products.filter(
    (product) =>
      typeof product.category === "string" &&
      product.category.trim().toLowerCase() === normalizedSlug
  );
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const products = await getProducts();

  return (
    products.find(
      (product) =>
        product.slug === slug || String(product.id) === slug
    ) ?? null
  );
}
