"use client";
import Link from "next/link";

export default function EarnMoneyPage() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 w-full text-[rgba(255,255,255,0.9)] bg-gradient-to-b">
      <div className="max-w-2xl text-center">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold mb-6">
          Unlock Your Earning Potential 🚀
        </h1>

        {/* Subheading / note */}
        <p className="text-lg mb-6 leading-relaxed text-gray-300">
          To access the{" "}
          <span className="text-green-400 font-semibold">Earn Money</span>{" "}
          program, your account must be{" "}
          <span className="font-semibold text-yellow-400">
            verified at a premium level
          </span>
          .
          <br />
          Requirement: a{" "}
          <span className="font-bold text-red-400">net deposit of $500</span>.
        </p>

        {/* Marketing-style highlight box */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8 shadow-lg">
          <p className="text-md text-gray-200">
            ✅ Premium verification gives you full access to earning tools,
            higher limits, and exclusive benefits.
          </p>
          <p className="mt-2 text-md text-gray-200">
            ⚡ Start your journey today and unlock financial opportunities
            waiting for you.
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/deposit"
          className="inline-block px-8 py-4 rounded-lg bg-green-600 hover:bg-green-700 transition text-lg font-semibold shadow-lg"
        >
          Go to Deposit Page
        </Link>
      </div>
    </div>
  );
}
