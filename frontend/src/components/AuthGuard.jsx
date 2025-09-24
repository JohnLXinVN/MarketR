"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import api from "../utils/api";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  //💡 Thêm state isVerified để theo dõi trạng thái xác thực thành công
  const [isVerified, setIsVerified] = useState(false);
  const { setUser } = useUser();

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      // Nếu đang ở trang login, không cần kiểm tra, coi như "xác thực" thành công để hiển thị trang
      if (pathname === "/login") {
        setIsVerified(true);
        return;
      }

      const token = localStorage.getItem("access_token");
      const exp = localStorage.getItem("access_token_exp");

      if (!token || !exp || Date.now() >= parseInt(exp) * 1000) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("access_token_exp");
        setUser(null);
        router.replace("/login");
        // Không set isVerified, để nó vẫn là false
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
        // Chỉ khi lấy thông tin user thành công, chúng ta mới set isVerified thành true
        setIsVerified(true);
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin user, có thể token không hợp lệ phía server:",
          error
        );
        localStorage.removeItem("access_token");
        localStorage.removeItem("access_token_exp");
        setUser(null);
        router.replace("/login");
        // Không set isVerified, để nó vẫn là false
      }
    };

    checkAuthAndFetchUser();
  }, [pathname, router, setUser]);

  // Chỉ hiển thị spinner nếu chưa xác thực xong
  if (!isVerified) {
    return (
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 rounded-md">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Chỉ hiển thị children khi isVerified là true
  return <>{children}</>;
}
