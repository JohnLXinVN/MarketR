"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FaEnvelope,
  FaShoppingCart,
  FaRegBell,
  FaExpand,
} from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { useSocket } from "../contexts/SocketContext";

export default function Header() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { user } = useUser();

  const [balance, setBalance] = useState(user.walletBalance); // Số dư ban đầu
  const socket = useSocket();

  const [open, setOpenDropBox] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setBalance(user.walletBalance);
  }, [user]);

  useEffect(() => {
    // Lắng nghe sự kiện 'balanceUpdated' từ server
    socket.on("balanceUpdated", (data) => {
      console.log("Received balance update:", data);
      setBalance(data.walletBalance);
      // Có thể hiển thị một thông báo "Nạp tiền thành công!" ở đây
    });

    // Dọn dẹp listener khi component unmount
    return () => {
      socket.off("balanceUpdated");
    };
  }, [socket]);

  // đóng khi click ngoài
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropBox(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Yêu cầu bật fullscreen
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
        })
        .catch((err) => {
          console.error(
            `Error trying to enable full-screen mode: ${err.message}`
          );
        });
    } else {
      // Thoát fullscreen
      document
        .exitFullscreen()
        .then(() => {
          setIsFullScreen(false);
        })
        .catch((err) => {
          console.error(
            `Error trying to disable full-screen mode: ${err.message}`
          );
        });
    }
  };

  return (
    <header className="h-14 bg-black/40 border-b border-white/10 flex items-center justify-between px-6">
      {/* Logo */}
      <h1 className="text-lg font-bold tracking-wide">
        <img src="/images/namepage.png" alt="" />
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-5 text-lg">
        <FaEnvelope className="cursor-pointer hover:text-blue-400" />
        <Link
          href="/cart"
          aria-label="Đi tới giỏ hàng"
          className="cursor-pointer hover:text-blue-400"
        >
          <FaShoppingCart className="cursor-pointer" />
        </Link>
        <FaRegBell className="cursor-pointer hover:text-blue-400" />

        <FaExpand
          onClick={handleFullScreen}
          className="cursor-pointer hover:text-blue-400"
        />
        <div ref={dropdownRef}>
          <div
            onClick={() => setOpenDropBox(!open)}
            className="px-3 cursor-pointer py-1 bg-white/10 rounded-md"
          >
            {user ? `$${Number(balance).toFixed(2)}` : "Loading..."}
          </div>
          {open && (
            <div className="absolute right-5 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
              <ul className="flex flex-col">
                <li>
                  <a
                    href="/deposit"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Deposit
                  </a>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      localStorage.removeItem("access_token");
                      localStorage.removeItem("access_token_exp");

                      // Redirect về login
                      window.location.href = "/login";
                    }}
                    className="cursor-pointer w-full text-left block px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
