// /dashboard/layout.tsx
"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";
import { UserProvider, useUser } from "../../contexts/UserContext";
import { SocketProvider } from "../../contexts/SocketContext";
import { useState } from "react";
import { useRouteLoading } from "../../components/useRouteLoading";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading, startLoading } = useRouteLoading();

  return (
    <UserProvider>
      <AuthGuard>
        <SocketProvider>
          <div className="h-full overflow-hidden bg-[url(/images/bg-body.jpg)] text-white">
            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
                <div className="flex justify-center">
                  <div className="relative w-12 h-12">
                    <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            )}
            {/* Sidebar */}
            {/* Desktop: cố định, Mobile: dạng drawer */}
            <div
              className={`fixed inset-y-0 left-0 w-64 z-40 transform transition-transform duration-300 
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
              lg:translate-x-0 bg-[#0b1a27]`}
            >
              <Sidebar onLinkClick={startLoading} />
            </div>

            {/* Overlay khi mở sidebar mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Header */}
            <div className="fixed top-0 left-0 lg:left-64 right-0 h-14 z-50">
              <Header
                onLinkClick={startLoading}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              />
            </div>

            {/* Content */}
            <div className="lg:ml-64 mt-14 h-[100vh] overflow-y-auto">
              <div className="p-4 sm:p-6 mt-6">
                {children}

                {/* Footer link */}
                <div className="bottom-6 w-full flex flex-wrap justify-center items-center space-x-4 sm:space-x-6 text-gray-400 text-xs sm:text-sm">
                  <Link prefetch href="/dashboard" className="hover:text-white">
                    News
                  </Link>
                  <Link prefetch href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                  <Link
                    prefetch
                    href="/support/tickets"
                    className="hover:text-white"
                  >
                    Support
                  </Link>
                </div>
              </div>
            </div>

            <Toaster position="top-right" />
          </div>
        </SocketProvider>
      </AuthGuard>
    </UserProvider>
  );
}
