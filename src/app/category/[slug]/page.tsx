
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/api";
import CategoryProducts from "@/components/CategoryProducts";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  let categories;
  let category;
  let products;

  try {
    [categories, category, products] = await Promise.all([
      getCategories(),
      getCategoryBySlug(slug),
      getProductsByCategory(slug),
    ]);
  } catch {
    throw new Error("Category data load করা যায়নি। আবার চেষ্টা করো।");
  }

  const validCategory = categories.find(
    (item) => item.slug === slug || item.id === slug
  );

  if (!validCategory || !category) {
    notFound();
  }

  const name = validCategory.nameBn;

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link href="/" className="text-sm font-semibold text-green-700">
          ← হোম পেজ
        </Link>

        <div className="mb-8 mt-6 rounded-3xl bg-[#e8efdf] p-6 sm:p-10">
          <p className="text-5xl">{validCategory.icon}</p>
          <h1 className="mt-4 text-3xl font-black">{name}</h1>
          <p className="mt-2 text-gray-600">
            {name} বিভাগের সব পণ্য ও বর্তমান দাম
          </p>
        </div>

        <CategoryProducts products={products} />
      </div>
    </main>
  );
}
