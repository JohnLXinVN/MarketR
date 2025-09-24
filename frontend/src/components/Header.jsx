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

export default function Header({ onToggleSidebar }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { user } = useUser();

  if (!user) return null; // 🚀 Đợi AuthGuard resolve user

  const [balance, setBalance] = useState(user.walletBalance); // Số dư ban đầu
  const socket = useSocket();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpenDropBox] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setBalance(user.walletBalance);
  }, [user]);

  useEffect(() => {
    // Lắng nghe sự kiện 'balanceUpdated' từ server
    socket.on("balanceUpdated", (data) => {
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

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`h-14 ${
        scrolled ? "bg-[rgba(0,0,0,0.96)]" : "bg-[rgba(0,0,0,0.4)]"
      } border-b border-white/10 transition flex items-center justify-between px-6`}
    >
      {/* Logo */}

      <div className="flex items-center gap-3">
        {/* Hamburger chỉ hiện mobile */}
        <button
          className="lg:hidden text-xl cursor-pointer"
          onClick={onToggleSidebar}
        >
          ☰
        </button>
        <h1 className="text-lg font-bold tracking-wide">
          <img src="/images/namepage.png" alt="" />
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5 text-lg">
        <Link
          href="/support/tickets"
          className="cursor-pointer hover:text-blue-400"
        >
          <FaEnvelope />
        </Link>
        <Link
          href="/cart"
          aria-label=""
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
