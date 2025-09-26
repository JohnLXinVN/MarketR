"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/contexts/UserContext";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

const SocketContext = createContext<Socket>(socket);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();

  // ✅ Nếu chưa có user, vẫn render Provider để tránh gọi hook conditionally
  const userId = user?.id;

  // ✅ Dùng useMemo để đảm bảo object không bị re-create mỗi render
  const currentUser = useMemo(() => ({ id: userId }), [userId]);

  useEffect(() => {
    if (!currentUser.id) return; // ⚠️ Gọi hook luôn, logic bên trong có thể điều kiện

    const handleConnect = () => {
      console.log("✅ Socket connected");
      socket.emit("identify", { userId: currentUser.id });
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [currentUser.id]); // ✅ chỉ phụ thuộc vào primitive

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
