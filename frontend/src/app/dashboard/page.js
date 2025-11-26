"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await api.getProfile();
      if (result.user) {
        setUser(result.user);
      }
    } catch (err) {
      // Not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <h1 className="mb-8 text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            ReTh!nk
          </h1>

          {user ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                  Welcome, {user.username}!
                </h2>
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  {user.rethinkPoints !== undefined && (
                    <p>
                      <strong>ReThink Points:</strong> {user.rethinkPoints}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
                Please login or sign up to continue.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:w-auto"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-auto"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
