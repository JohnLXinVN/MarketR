"use client";

import { useState } from "react";

const paymentMethods = [
  { label: "Litecoin", value: "ltc" },
  { label: "Bitcoin", value: "btc" },
  { label: "USDT (TRC20)", value: "usdt" },
];

const paymentDetails = {
  ltc: {
    address: "LTcWalletExample123",
    warning:
      "Litecoin only, do not send any other coins or from other networks.",
    qr: "/images/qrcode-ltc.png",
  },
  btc: {
    address: "BTCWalletExample456",
    warning:
      "Bitcoin only, do not send any other coins or from other networks.",
    qr: "/images/qrcode-btc.png",
  },
  usdt: {
    address: "TAyiBhXwLnNdcTWnUp7C6M7Bd9ThmSKXBn",
    warning:
      "USDT only (TRC-20), do not try to send any tokens or to any different networks.",
    qr: "/images/qrcode-usdt.png",
  },
};

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const orders = [
    {
      id: 5398,
      status: "Approved",
      date: "Sept. 9, 2025, 11:51 p.m.",
      method: "USDT",
      amount: "2010 $",
      value: "5.500475 USDT_TRX",
      txUrl: "#",
    },
  ];

  return (
    <div className="text-[rgba(255,255,255,0.85)] p-8">
      {/* Payment Method */}
      <div className="flex gap-4 justify-center mb-6">
        {paymentMethods.map((pm) => (
          <button
            key={pm.value}
            onClick={() => setSelectedMethod(pm.value)}
            className={`px-6 py-3 rounded-md border transition ${
              selectedMethod === pm.value
                ? "bg-blue-500 border-blue-500"
                : "bg-white/10 border-white/20 hover:bg-white/20"
            }`}
          >
            {pm.label}
          </button>
        ))}
      </div>

      {/* Deposit Info */}
      {selectedMethod && (
        <div className="max-w-lg mx-auto text-center bg-white/5 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Minimal deposit = $20</h2>

          <p className="text-yellow-400 text-sm mb-2">
            All deposits less than $20 will be credited with a penalty of -$2.
          </p>

          <p className="text-red-400 text-sm mb-2">
            {paymentDetails[selectedMethod].warning}
          </p>

          <p className="break-words text-sm mb-4">
            Please send {selectedMethod.toUpperCase()} to:
            <br />
            <span className="font-mono text-green-400">
              {paymentDetails[selectedMethod].address}
            </span>
          </p>

          <div className="flex justify-center mb-4">
            <img
              src={paymentDetails[selectedMethod].qr}
              alt="QR Code"
              className="w-40 h-40"
            />
          </div>

          <p className="text-sm text-gray-300 mb-4">
            All deposits will be credited automatically when have 5
            confirmation.
          </p>

          <button className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600">
            I Paid
          </button>
        </div>
      )}

      {/* Orders */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Orders</h3>
        <table className="w-full border border-white/10 text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="p-2 border border-white/10">ID</th>
              <th className="p-2 border border-white/10">Status</th>
              <th className="p-2 border border-white/10">Date</th>
              <th className="p-2 border border-white/10">Method</th>
              <th className="p-2 border border-white/10">Amount</th>
              <th className="p-2 border border-white/10">Value</th>
              <th className="p-2 border border-white/10">Wallet</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="text-center">
                <td className="p-2 border border-white/10">{o.id}</td>
                <td className="p-2 border border-white/10 text-green-400">
                  {o.status}
                </td>
                <td className="p-2 border border-white/10">{o.date}</td>
                <td className="p-2 border border-white/10">{o.method}</td>
                <td className="p-2 border border-white/10">{o.amount}</td>
                <td className="p-2 border border-white/10">{o.value}</td>
                <td className="p-2 border border-white/10">
                  <a href={o.txUrl} className="text-blue-400 hover:underline">
                    View Transaction
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
