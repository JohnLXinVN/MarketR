"use client";
import "@/app/globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Thêm useState
import { Toaster } from "react-hot-toast";

// Một component loading đơn giản để hiển thị trong lúc chờ
const FullScreenLoader = () => (
  <div className="flex items-center justify-center min-h-screen w-full h-full bg-cover bg-[url(/images/russian.jpg)]">
    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  // ✅ Bước 1: Thêm state để theo dõi trạng thái kiểm tra
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Bên trong useEffect, chúng ta chắc chắn đang ở phía client,
    // không cần kiểm tra `typeof window` nữa.
    const token = localStorage.getItem("access_token");
    const exp = localStorage.getItem("access_token_exp");

    // Nếu có token hợp lệ
    if (token && exp && Date.now() < parseInt(exp) * 1000) {
      router.replace("/dashboard"); // Dùng replace để không tạo lịch sử trình duyệt
    } else {
      // ✅ Nếu không có token, cho phép hiển thị trang
      setIsChecking(false);
    }
  }, [router, pathname]);

  // ✅ Bước 2: Hiển thị màn hình chờ trong khi đang kiểm tra
  if (isChecking) {
    return <FullScreenLoader />;
  }

  // ✅ Bước 3: Chỉ hiển thị nội dung trang khi đã kiểm tra xong
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/zwicon/css/zwicon.min.css"
        />
      </head>
      <body className="flex items-center justify-center min-h-screen bg-[url(/images/russian.jpg)] w-full h-full bg-cover">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
