
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#faf9f6] px-4">
      <div className="max-w-md text-center">
        <p className="text-7xl">🛒</p>
        <p className="mt-6 text-7xl font-black text-[#28633b]">404</p>

        <h1 className="mt-4 text-2xl font-bold">
          দুঃখিত! পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mt-3 leading-7 text-gray-500">
          তুমি যে পেজটি খুঁজছ, সেটি নেই অথবা সরিয়ে ফেলা হয়েছে।
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-[#28633b] px-6 py-3 font-bold text-white hover:bg-[#1d492b]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
