
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখুন");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(
          result.error.message || "লগইন করা যায়নি"
        );
        return;
      }

      toast.success("সফলভাবে লগইন হয়েছে");
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
            সাইন ইন
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            তোমার বাজার দর অ্যাকাউন্টে প্রবেশ করো
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              ইমেইল
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="তোমার পাসওয়ার্ড"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#28633b] px-5 py-3 font-bold text-white hover:bg-[#1d492b] disabled:opacity-60"
          >
            {loading ? "লগইন হচ্ছে..." : "সাইন ইন"}
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
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="font-bold text-green-800">
            সাইন আপ করো
          </Link>
        </p>
      </div>
    </main>
  );
}
