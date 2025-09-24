"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/contexts/UserContext";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"); // URL của backend NestJS

const SocketContext = createContext<Socket>(socket);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  // Giả sử bạn có cách lấy thông tin user đã đăng nhập

  const { user } = useUser();

  if (!user) return null; // 🚀 Đợi AuthGuard resolve user
  const userId = user.id;
  const currentUser = { id: userId }; // <-- Thay bằng logic lấy user thật

  useEffect(() => {
    // Khi socket kết nối, gửi thông tin định danh
    socket.on("connect", () => {
      console.log("");
      // Gửi sự kiện "identify" để backend biết user nào đang kết nối
      if (currentUser?.id) {
        socket.emit("identify", { userId: currentUser.id });
      }
    });

    socket.on("disconnect", () => {
      console.log("");
    });

    // Dọn dẹp khi component unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
