"use client";
import "@/app/globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const publicPaths = ["/login", "/signup", "/2fa"]; // không cần token
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const exp =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token_exp")
        : null;

    if (publicPaths.includes(pathname)) {
      if (token && exp && Date.now() < parseInt(exp) * 1000) {
        router.push("/dashboard");
      }
    }
  }, [pathname, router]);
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/zwicon/css/zwicon.min.css"
        />
      </head>
      <body className="flex items-center justify-center min-h-screen bg-[url(/images/russian.jpg))] w-full h-full bg-cover">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
