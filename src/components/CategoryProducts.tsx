
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: string | number;
  slug?: string;
  nameBn?: string;
  name?: string;
  icon?: string;
  unit?: string;
  price?: number | string;
  currentPrice?: number | string;
  averagePrice?: number | string;
  priceSummary?: {
    average?: number | string;
  };
};

function getPrice(product: Product): number {
  const value =
    product.currentPrice ??
    product.price ??
    product.averagePrice ??
    product.priceSummary?.average ??
    0;

  if (typeof value === "number") return value;

  // বাংলা সংখ্যা থাকলেও numeric sorting কাজ করবে।
  const englishDigits = value
    .replace(/[০-৯]/g, (digit) =>
      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
    )
    .replace(/,/g, "")
    .replace(/٫/g, ".");

  const parsed = Number(englishDigits);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(price);
}

export default function CategoryProducts({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState("default");

  const sortedProducts = useMemo(() => {
    const items = [...products];

    if (sort === "low-high") {
      items.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sort === "high-low") {
      items.sort((a, b) => getPrice(b) - getPrice(a));
    }

    return items;
  }, [products, sort]);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-4xl">🛒</p>
        <h2 className="mt-3 text-xl font-bold">
          এই ক্যাটাগরিতে কোনো পণ্য নেই
        </h2>
        <Link href="/" className="mt-5 inline-block font-semibold text-green-700">
          হোম পেজে ফিরে যান →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          মোট {formatPrice(products.length)}টি পণ্য
        </p>

        <label className="flex items-center gap-2 text-sm">
          সাজান:
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:border-green-700"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sortedProducts.map((product) => {
          const name = product.nameBn ?? product.name ?? "পণ্য";
          const price = getPrice(product);

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug ?? product.id}`}
              className="rounded-2xl border border-[#e8e5dc] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-24 items-center justify-center rounded-xl bg-[#f2f4ec] text-5xl">
                {product.icon ?? "🛒"}
              </div>

              <h3 className="mt-4 font-bold">{name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {product.unit ?? "একক API অনুযায়ী"}
              </p>

              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500">আজকের দাম</p>
                <p className="mt-1 text-lg font-black text-[#28633b]">
                  {formatPrice(price)} টাকা
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
