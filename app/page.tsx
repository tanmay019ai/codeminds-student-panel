"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HomePage() {
  const [dots, setDots] = useState(".");
  const router = useRouter();

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Redirect logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn === "true") {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <Image
            src="/codeminds-logo.png"
            alt="CodeMinds Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          CodeMinds
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-600 font-medium">
          Loading your tech community<span>{dots}</span>
        </p>

        <motion.div
          className="mt-6 w-16 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1.2,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </main>
  );
}
