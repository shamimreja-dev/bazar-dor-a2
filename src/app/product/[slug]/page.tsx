
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/api";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

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
  markets: Market[];
};

type Props = {
  params: Promise<{ slug: string }>;
};

const numberBn = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);

const moneyBn = (value: number) => `${numberBn(value)} টাকা`;

const unitBn: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
};

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;

  let products: Product[];

  try {
    products = (await getProducts()) as Product[];
  } catch {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
  }

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const markets = product.markets ?? [];

  const minPrice = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : product.today;

  const maxPrice = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : product.today;

  // প্রতিটি বাজারের min ও max-এর মধ্যবিন্দু ধরে গড়।
  const averagePrice = markets.length
    ? markets.reduce(
        (sum, market) => sum + (market.min + market.max) / 2,
        0
      ) / markets.length
    : product.today;

  const change = product.change;
  const changeText =
    change?.dir === "up"
      ? `▲ ${numberBn(change.pct)}%`
      : change?.dir === "down"
        ? `▼ ${numberBn(change.pct)}%`
        : "— ০.০%";

  const changeColor =
    change?.dir === "up"
      ? "bg-green-100 text-green-800"
      : change?.dir === "down"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-600";

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#252b22]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Link
          href={`/category/${product.category}`}
          className="text-sm font-semibold text-[#28633b] hover:underline"
        >
          ← {product.categoryNameBn} বিভাগে ফিরে যান
        </Link>

        <section className="mt-6 rounded-3xl border border-[#e8e5dc] bg-white p-5 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-[#f2f4ec] text-6xl">
              {product.image || product.categoryIcon}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#e8efdf] px-3 py-1 text-sm font-medium text-[#28633b]">
                  {product.categoryIcon} {product.categoryNameBn}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                  {unitBn[product.unit] ?? product.unit}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black sm:text-4xl">
                {product.nameBn}
              </h1>

              <p className="mt-2 leading-7 text-gray-600">
                বাংলাদেশের বিভিন্ন বাজারে {product.nameBn}-এর
                আজকের দাম ও বাজারভিত্তিক মূল্য দেখুন।
              </p>
            </div>

            <div className="rounded-2xl bg-[#f2f4ec] p-5 sm:min-w-48">
              <p className="text-sm text-gray-600">আজকের দাম</p>
              <p className="mt-2 text-2xl font-black text-[#28633b]">
                {moneyBn(product.today)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-bold ${changeColor}`}
              >
                {changeText}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-black">দামের সারসংক্ষেপ</h2>
          <p className="mt-2 text-sm text-gray-500">
            বাজারের দেওয়া সর্বনিম্ন ও সর্বোচ্চ দামের ভিত্তিতে হিসাব।
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e8e5dc] bg-white p-5">
              <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
              <p className="mt-3 text-2xl font-black text-green-700">
                {moneyBn(minPrice)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8e5dc] bg-white p-5">
              <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
              <p className="mt-3 text-2xl font-black text-red-600">
                {moneyBn(maxPrice)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8e5dc] bg-white p-5">
              <p className="text-sm text-gray-500">আনুমানিক গড় দাম</p>
              <p className="mt-3 text-2xl font-black text-[#28633b]">
                {moneyBn(averagePrice)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-black">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            বিভিন্ন বাজারে {product.nameBn}-এর দামের তুলনা।
          </p>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-[#e8e5dc] bg-white">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-[#e8efdf]">
                <tr>
                  <th className="px-4 py-4 font-bold">বাজার</th>
                  <th className="px-4 py-4 font-bold">বিভাগ</th>
                  <th className="px-4 py-4 font-bold">সর্বনিম্ন</th>
                  <th className="px-4 py-4 font-bold">সর্বোচ্চ</th>
                </tr>
              </thead>

              <tbody>
                {markets.map((market, index) => (
                  <tr
                    key={`${market.market}-${index}`}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-semibold">
                      {market.market}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {market.division}
                    </td>
                    <td className="px-4 py-4 font-medium text-green-700">
                      {moneyBn(market.min)}
                    </td>
                    <td className="px-4 py-4 font-medium text-red-600">
                      {moneyBn(market.max)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-[#e8efdf] p-5">
          <h2 className="font-bold">আগের দামের সঙ্গে তুলনা</h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">গতকাল</p>
              <p className="mt-1 text-lg font-bold">
                {moneyBn(product.yesterday)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">গত সপ্তাহ</p>
              <p className="mt-1 text-lg font-bold">
                {moneyBn(product.lastWeek)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">গত মাস</p>
              <p className="mt-1 text-lg font-bold">
                {moneyBn(product.lastMonth)}
              </p>
            </div>
          </div>
        </section>

        <p className="mt-6 text-sm leading-6 text-gray-500">
          নোট: বাজারভিত্তিক মূল্য API-তে দেওয়া তথ্য থেকে নেওয়া হয়েছে।
          গড় মূল্য হলো প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের
          মধ্যবিন্দুর গড়; এটি API-প্রদত্ত আলাদা গড় মূল্য নয়।
        </p>
      </div>
    </main>
  );
}
