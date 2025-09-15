import "@/app/globals.css";

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/zwicon/css/zwicon.min.css"
        />
      </head>
      <body className="flex items-center justify-center min-h-screen bg-[url(/images/russian.jpg))] w-full h-full bg-cover">
        {children}
      </body>
    </html>
  );
}
