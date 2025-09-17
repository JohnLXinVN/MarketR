"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const exp = localStorage.getItem("access_token_exp");

    if (!token || !exp || Date.now() >= parseInt(exp) * 1000) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("access_token_exp");
      router.push("/login");
    } else {
      setLoading(false); // token hợp lệ, render children
    }
  }, [router]);

  if (loading)
    return (
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 rounded-md">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return <>{children}</>;
}
