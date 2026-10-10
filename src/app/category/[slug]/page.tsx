
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/api";

type Props = {
  products?: Product[] | null;
  error?: string | null;
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
  error,
}: Props) {
  const [sort, setSort] = useState("default");

  const products = useMemo(
    () => (Array.isArray(incomingProducts) ? incomingProducts : []),
    [incomingProducts]
  );

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low") {
      result.sort((a, b) => a.today - b.today);
    } else if (sort === "high") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sort]);

  return (
    <section>
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-red-800">
            পণ্যের তথ্য লোড করা যায়নি
          </h2>
          <p className="mt-2 text-sm leading-6 text-red-700">
            {error}
          </p>
          <p className="mt-2 text-sm text-red-700">
            কিছুক্ষণ পরে আবার চেষ্টা করো।
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-xl bg-[#28633b] px-5 py-3 font-semibold text-white"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              মোট {bnNumber(products.length)}টি পণ্য
            </p>

            <label className="flex items-center gap-2 text-sm">
              <span className="font-medium">সাজান:</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-xl border border-green-600 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-200"
              >
                <option value="default">ডিফল্ট</option>
                <option value="low">দাম: কম থেকে বেশি</option>
                <option value="high">দাম: বেশি থেকে কম</option>
              </select>
            </label>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-4xl">🛒</p>
              <h2 className="mt-4 text-xl font-bold">
                এই বিভাগে কোনো পণ্য পাওয়া যায়নি
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                এই ক্যাটাগরিতে পণ্য নেই অথবা API থেকে খালি তালিকা এসেছে।
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex rounded-xl bg-[#28633b] px-5 py-3 font-semibold text-white transition hover:bg-[#1f4f2f]"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {sortedProducts.map((product) => {
                const direction = product.change?.dir;

                const changeText =
                  direction === "up"
                    ? `▲ ${bnNumber(product.change.pct)}%`
                    : direction === "down"
                      ? `▼ ${bnNumber(product.change.pct)}%`
                      : "— ০.০%";

                const changeStyle =
                  direction === "up"
                    ? "bg-red-100 text-red-700"
                    : direction === "down"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600";

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="rounded-2xl border border-[#e8e5dc] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-24 items-center justify-center rounded-xl bg-[#f2f4ec] text-5xl">
                      {product.image || product.categoryIcon || "🛒"}
                    </div>

                    <h3 className="mt-4 font-bold">
                      {product.nameBn}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {unitBn[product.unit] ?? product.unit ?? "প্রতি ইউনিট"}
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
        </>
      )}
    </section>
  );
}
