
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (name.trim().length < 2) {
      toast.error("কমপক্ষে ২ অক্ষরের নাম লিখুন");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(
          result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি"
        );
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(
    provider: "google" | "github"
  ) {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      toast.error("সোশ্যাল লগইন শুরু করা যায়নি");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-[#e8e5dc] bg-white p-6 shadow-sm sm:p-9">
        <Link href="/" className="font-bold text-green-800">
          ← বাজার দর
        </Link>

        <div className="mt-7 text-center">
          <div className="text-5xl">🛒</div>
          <h1 className="mt-4 text-3xl font-black">
            নতুন অ্যাকাউন্ট
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            বাজার দর ব্যবহার করতে নিবন্ধন করো
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold">
              তোমার নাম
            </label>
            <input
              id="name"
              required
              minLength={2}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="পূর্ণ নাম"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              ইমেইল
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#28633b] px-5 py-3 font-bold text-white hover:bg-[#1d492b] disabled:opacity-60"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          অথবা
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold hover:bg-gray-50"
          >
            Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            className="rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold hover:bg-gray-50"
          >
            GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="font-bold text-green-800">
            সাইন ইন করো
          </Link>
        </p>
      </div>
    </main>
  );
}
