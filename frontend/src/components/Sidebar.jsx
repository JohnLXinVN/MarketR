"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUser,
  FaNewspaper,
  FaCreditCard,
  FaCog,
  FaHeadset,
  FaShoppingCart,
  FaHouseUser,
  FaChevronDown,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../contexts/UserContext";
import { useRouteLoading } from "./useRouteLoading";

export default function Sidebar({ onLinkClick }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState([]);
  const [open, setOpenDropBox] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useUser();

  if (!user) return null; // 🚀 Đợi AuthGuard resolve user

  const access_token = localStorage.getItem("access_token");
  const tokenDecoded = jwtDecode(access_token);
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

  const toggleMenu = (label) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const navItems = [
    { label: "News", href: "/dashboard", icon: <FaNewspaper /> },
    {
      label: "CVV",
      icon: <FaCreditCard />,
      href: "/cvv",
    },
    { label: "Logs", href: "/logs", icon: <FaHouseUser /> },
    {
      label: "Tools",
      icon: <FaCog />,
      children: [
        { label: "Checker", href: "/tools/checker" },
        { label: "Converter", href: "/tools/cookie-converter" },
      ],
    },
    {
      label: "My Purchases",
      icon: <FaShoppingCart />,
      children: [
        { label: "CVV", href: "/purchases/cvv" },
        { label: "Logs", href: "/purchases/logs" },
      ],
    },
    {
      label: "Support",
      icon: <FaHeadset />,
      children: [{ label: "Tickets", href: "/support/tickets" }],
    },
  ];

  const { loading, startLoading } = useRouteLoading();

  return (
    <aside className="w-64 border-r border-white/10 flex flex-col bg-[#0b1a27]">
      {/* User Info */}
      <div className="py-4 px-5 lg:mt-0 mt-7" ref={dropdownRef}>
        <div
          onClick={() => setOpenDropBox(!open)}
          className="flex items-center gap-3 py-3 px-2 cursor-pointer border-b bg-[rgba(255,255,255,.1)] border-white/10"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
            <img src="/images/user.png" alt="" />
          </div>
          <div>
            <p className="font-semibold text-[rgba(255,255,255,.85)]">
              {tokenDecoded.username}
            </p>
            <p className="text-sm text-blue-400">User</p>
          </div>
        </div>
        {open && (
          <div className="absolute left-5 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
            <ul className="flex flex-col">
              <li>
                <Link
                  onClick={onLinkClick}
                  prefetch
                  href="/deposit"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Deposit
                </Link>
              </li>
              <li>
                <button
                  onClick={async () => {
                    // Xóa token ở localStorage
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

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const childActive =
            item.children?.some((child) => pathname === child.href) ?? false;

          // cha active nếu: pathname === item.href (nếu có) hoặc 1 child active
          const isActive = pathname === item.href || childActive;

          const isOpen = openMenus.includes(item.label) || childActive;
          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`flex items-center justify-between gap-3 w-full text-[rgba(255,255,255,.85)] px-3 py-2 rounded-md transition 
    hover:bg-white/10 ${
      isActive ? "bg-white/20 text-white font-semibold" : ""
    }`}
                >
                  <span className="flex items-center gap-3">
                    {item.icon} {item.label}
                  </span>
                  <FaChevronDown
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pl-10 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          onClick={onLinkClick}
                          prefetch
                          key={child.href}
                          href={child.href}
                          className={`block text-sm text-[rgba(255,255,255,.85)] px-3 py-2 rounded-md transition 
                          ${
                            childActive
                              ? "bg-white/20 text-white font-semibold"
                              : "hover:bg-white/10"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              onClick={onLinkClick}
              prefetch
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 w-full text-[rgba(255,255,255,.85)] hover:text-white px-3 py-2 rounded-md transition 
                ${
                  isActive
                    ? "bg-white/20 text-white font-semibold"
                    : "hover:bg-white/10"
                }
              `}
            >
              {item.icon} {item.label}
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="p-4">
        <Link
          onClick={onLinkClick}
          prefetch
          href="/earn-money"
          className="w-full block text-center cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Earn money
        </Link>
      </div>
    </aside>
  );
}
