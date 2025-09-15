import "@/app/globals.css";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function MainLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/zwicon/css/zwicon.min.css"
        />
      </head>
      <body className="h-full overflow-hidden bg-[url(/images/bg-body.jpg)] text-white">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 z-40">
          <Sidebar />
        </div>

        {/* Header */}
        <div className="fixed top-0 left-64 right-0 h-14 z-50">
          <Header />
        </div>

        {/* Content */}
        <main className="ml-64 mt-14 h-[100vh] overflow-y-auto">
          <div className="p-6 mt-6">
            {children}

            <div className="bottom-6 flex justify-center items-center  space-x-6 text-gray-400 text-sm">
              <Link href="/dashboard" className="hover:text-white">
                News
              </Link>
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
              <Link href="/support/tickets" className="hover:text-white">
                Support
              </Link>
            </div>
          </div>
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
