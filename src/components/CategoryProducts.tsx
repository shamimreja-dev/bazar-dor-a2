
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  categoryIcon?: string;
  unit?: string;
  image?: string;
  today: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type Props = {
  products?: Product[] | null;
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

export default function CategoryProducts({
  products: incomingProducts,
}: Props) {
  const [sort, setSort] = useState("default");

 const products = useMemo(
  () => (Array.isArray(incomingProducts) ? incomingProducts : []),
  [incomingProducts]
);

  const sortedProducts = useMemo(() => {
    const items = [...products];

    if (sort === "low-high") {
      items.sort((a, b) => a.today - b.today);
    } else if (sort === "high-low") {
      items.sort((a, b) => b.today - a.today);
    }

    return items;
  }, [products, sort]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          মোট {bnNumber(products.length)}টি পণ্য
        </p>

        <label className="flex items-center gap-2 text-sm">
          <span>সাজান:</span>

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

      {sortedProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-4xl">🛒</p>

          <h2 className="mt-3 text-xl font-bold">
            এই ক্যাটাগরিতে কোনো পণ্য নেই
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            ক্যাটাগরি অথবা API-এর ডেটা পরীক্ষা করো।
          </p>

          <Link
            href="/"
            className="mt-5 inline-block font-semibold text-green-700"
          >
            হোম পেজে ফিরে যান →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((product) => {
            const direction = product.change?.dir;

            const changeText =
              direction === "up"
                ? `▲ ${bnNumber(product.change?.pct ?? 0)}%`
                : direction === "down"
                  ? `▼ ${bnNumber(product.change?.pct ?? 0)}%`
                  : "—";

            const changeStyle =
              direction === "up"
                ? "bg-red-100 text-red-700"
                : direction === "down"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600";

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug || product.id}`}
                className="rounded-2xl border border-[#e8e5dc] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-24 items-center justify-center rounded-xl bg-[#f2f4ec] text-5xl">
                  {product.image || product.categoryIcon || "🛒"}
                </div>

                <h3 className="mt-4 font-bold">
                  {product.nameBn}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {unitBn[product.unit ?? ""] ??
                    product.unit ??
                    "প্রতি ইউনিট"}
                </p>

                <div className="mt-4 border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500">
                    আজকের দাম
                  </p>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-lg font-black text-[#28633b]">
                      {bnNumber(product.today)} টাকা
                    </p>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ${changeStyle}`}
                    >
                      {changeText}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}