
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import type { Category } from "@/lib/api";

type Product = {
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
};

const bnNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD").format(value);

const unitBn: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
};

export default async function HomePage() {
  let categories: Category[] = [];
  let products: Product[] = [];
  let apiError = false;

  try {
    const results = await Promise.all([
      getCategories(),
      getProducts(),
    ]);

    categories = results[0] as Category[];
    products = results[1] as Product[];
  } catch {
    apiError = true;
  }

  const risers = products
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change?.dir === "down")
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, 6);

  function ProductCard({ product }: { product: Product }) {
    const change = product.change;
    const changeText =
      change?.dir === "up"
        ? `▲ ${bnNumber(change.pct)}%`
        : change?.dir === "down"
          ? `▼ ${bnNumber(change.pct)}%`
          : "— ০.০%";

    const changeStyle =
      change?.dir === "up"
        ? "bg-green-100 text-green-800"
        : change?.dir === "down"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-600";

    return (
      <Link
        href={`/product/${product.slug}`}
        className="rounded-2xl border border-[#e8e5dc] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
      >
        <div className="flex h-24 items-center justify-center rounded-xl bg-[#f2f4ec] text-5xl">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <h3 className="mt-4 font-bold">{product.nameBn}</h3>

        <p className="mt-1 text-sm text-gray-500">
          {unitBn[product.unit] ?? product.unit}
        </p>

        <div className="mt-4 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500">আজকের দাম</p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-lg font-black text-[#28633b]">
              {bnNumber(product.today)} টাকা
            </p>

            <span className={`rounded-full px-2 py-1 text-xs font-bold ${changeStyle}`}>
              {changeText}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  function ProductSection({
    title,
    subtitle,
    items,
  }: {
    title: string;
    subtitle: string;
    items: Product[];
  }) {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>

        {items.length === 0 ? (
          <p className="rounded-xl bg-white p-5 text-gray-500">
            এই মুহূর্তে কোনো পণ্যের তথ্য নেই।
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#252b22]">
      <header className="border-b border-[#e8e5dc] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <Link href="/" className="text-2xl font-black text-[#28633b]">
            🛒 বাজার দর
            <span className="mt-1 block text-xs font-normal text-gray-500">
              বাংলাদেশের নিত্যপণ্যের বাজার
            </span>
          </Link>

          <div className="flex gap-2">
            <Link href="/signin" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold">
              সাইন ইন
            </Link>
            <Link href="/signup" className="rounded-xl bg-[#28633b] px-4 py-2 text-sm font-semibold text-white">
              সাইন আপ
            </Link>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 pb-4">
          <Link href="/" className="shrink-0 rounded-full bg-[#28633b] px-4 py-2 text-sm text-white">
            সব পণ্য
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm hover:border-[#28633b]"
            >
              {category.icon} {category.nameBn}
            </Link>
          ))}
        </nav>
      </header>

      <div className="overflow-hidden bg-[#234f32] py-3 text-sm text-white">
        <div className="flex justify-center gap-8 whitespace-nowrap">
          {products.slice(0, 8).map((product) => (
            <span key={product.id}>
              {product.image} {product.nameBn}: {bnNumber(product.today)} টাকা
              {" "}
              {product.change?.dir === "up" ? "▲" : product.change?.dir === "down" ? "▼" : "—"}
              {" "}{bnNumber(product.change?.pct ?? 0)}%
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 font-semibold text-[#397447]">
            আপনার নিত্যদিনের বাজার সঙ্গী
          </p>

          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            প্রতিদিনের
            <span className="block text-[#397447]">বাজার দর</span>
            এখন এক নজরে
          </h1>

          <p className="mt-5 max-w-lg leading-8 text-gray-600">
            চাল, ডাল, তেল, সবজি ও অন্যান্য নিত্যপ্রয়োজনীয় পণ্যের দাম এক জায়গায় দেখুন।
          </p>

          <a href="#সব-পণ্য" className="mt-7 inline-flex rounded-xl bg-[#28633b] px-6 py-3 font-bold text-white hover:bg-[#1d492b]">
            সব পণ্য দেখুন ↓
          </a>
        </div>

        <div className="flex min-h-64 items-center justify-center rounded-3xl bg-[#e8efdf] p-8">
          <div className="grid grid-cols-3 gap-5 text-5xl md:text-6xl">
            <span>🍚</span><span>🥬</span><span>🐟</span>
            <span>🫘</span><span>🧅</span><span>🥚</span>
          </div>
        </div>
      </section>

      {apiError ? (
        <p className="mx-auto mb-10 max-w-6xl rounded-xl bg-red-50 p-5 text-red-700">
          API থেকে তথ্য আনা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>
      ) : (
        <>
          <ProductSection
            title="আজ দাম বেড়েছে ▲"
            subtitle="যেসব পণ্যের দাম গতকালের তুলনায় বেড়েছে"
            items={risers}
          />

          <ProductSection
            title="আজ দাম কমেছে ▼"
            subtitle="যেসব পণ্যের দাম গতকালের তুলনায় কমেছে"
            items={fallers}
          />

          <section className="mx-auto max-w-6xl px-4 pb-16">
            <h2 className="mb-2 text-2xl font-black">জনপ্রিয় ক্যাটাগরি</h2>
            <p className="mb-6 text-sm text-gray-500">আপনার প্রয়োজনীয় পণ্য বেছে নিন</p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="rounded-2xl border border-[#e8e5dc] bg-white p-5 transition hover:shadow-md"
                >
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="mt-3 font-bold">{category.nameBn}</h3>
                  <p className="mt-1 text-sm text-gray-500">পণ্য দেখুন →</p>
                </Link>
              ))}
            </div>
          </section>

          <section id="সব-পণ্য" className="mx-auto max-w-6xl px-4 pb-20">
            <h2 className="text-2xl font-black">সব পণ্য</h2>
            <p className="mb-6 mt-2 text-sm text-gray-500">
              নিত্যপ্রয়োজনীয় পণ্যের তালিকা
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}

      <footer className="bg-[#203e2b] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-black">বাজার দর</p>
            <p className="mt-1 text-sm text-gray-300">
              প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>
          <p className="max-w-md text-sm leading-6 text-gray-300">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </footer>
    </main>
  );
}
