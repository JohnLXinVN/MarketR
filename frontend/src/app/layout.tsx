// src/app/layout.js
"use client";

import "@/app/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Russia Market</title>
        <meta
          name="description"
          content="Russia Market - Your Gateway to Russian Products"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png"></link>
      </head>
      <body className="h-full overflow-hidden bg-[url(/images/bg-body.jpg)] text-white">
        {children}
      </body>
    </html>
  );
}
