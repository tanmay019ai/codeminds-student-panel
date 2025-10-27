"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const reloadSplashOnce = sessionStorage.getItem("reloadSplashOnce");

    // ✅ Show splash again on first reload
    if (!reloadSplashOnce) {
      sessionStorage.setItem("reloadSplashOnce", "true");
      router.replace("/");
      return;
    }

    // ✅ Prevent back button from returning to splash repeatedly
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => window.history.go(1);
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🧠 Replace these credentials with your own fixed ones
    const fixedEmail = "user@codeminds.com";
    const fixedPassword = "user123";

    setTimeout(() => {
      if (email === fixedEmail && password === fixedPassword) {
        sessionStorage.removeItem("reloadSplashOnce");
        sessionStorage.setItem("isLoggedIn", "true");
        router.replace("/dashboard");
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100 font-[Poppins] text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm p-8 rounded-2xl shadow-xl bg-white/60 backdrop-blur-lg border border-gray-200 text-center"
      >
        <div className="flex justify-center mb-6">
          <Image
            src="/codeminds-logo.png"
            alt="CodeMinds Logo"
            width={90}
            height={90}
            className="object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold mb-2">Welcome Back 👋</h1>
        <p className="text-gray-600 mb-8">Login to your CodeMinds dashboard</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} CodeMinds Community
        </p>
      </motion.div>
    </main>
  );
}
