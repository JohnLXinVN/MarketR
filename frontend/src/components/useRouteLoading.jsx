// hooks/useRouteLoading.ts
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useRouteLoading() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mỗi khi pathname đổi nghĩa là route đã xong -> tắt loading
    setLoading(false);
  }, [pathname]);

  const startLoading = () => setLoading(true);

  return { loading, startLoading };
}
