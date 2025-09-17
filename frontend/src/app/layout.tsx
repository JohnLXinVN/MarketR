// src/app/layout.js
"use client";

import "@/app/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-full overflow-hidden bg-[url(/images/bg-body.jpg)] text-white">
        {children}
      </body>
    </html>
  );
}
