"use client";

import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import api from "@/utils/api";

const PAYMENT_METHODS = [
  { value: "btc", label: "Bitcoin" },
  { value: "ltc", label: "Litecoin" },
  { value: "usdt", label: "USDT (TRC20)" },
];

const bonusTiers = [
  { label: "Over than 200$", bonus: "+5 %", color: "bg-white/10" },

  { label: "Over than 500$", bonus: "+10 %", color: "bg-blue-500" },

  { label: "Over than 1500$", bonus: "+15 %", color: "bg-green-600" },
];

const API_BASE_URL = "http://localhost:3000"; // Sửa lại URL backend của bạn

export default function DepositPage() {
  const [poolStatus, setPoolStatus] = useState({ btc: 0, ltc: 0, usdt: 0 });
  const [depositInfo, setDepositInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchPoolStatus = useCallback(async () => {
    try {
      const { data } = await api.get(`/deposits/pool-status`);
      setPoolStatus(data);
    } catch (error) {
      console.error("Failed to fetch pool status", error);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get(`/deposits/history`);
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  }, []);

  useEffect(() => {
    fetchPoolStatus();
    fetchOrders();
    const statusInterval = setInterval(fetchPoolStatus, 15000);
    return () => clearInterval(statusInterval);
  }, [fetchPoolStatus, fetchOrders]);

  useEffect(() => {
    if (!depositInfo?.expiresAt) return;
    const timerInterval = setInterval(() => {
      const distance = new Date(depositInfo.expiresAt).getTime() - Date.now();
      if (distance < 0) {
        clearInterval(timerInterval);
        setTimeLeft(0);
        setDepositInfo(null);
        alert(
          "Deposit time has expired. Please request a new address if you haven`t paid."
        );
      } else {
        setTimeLeft(distance);
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [depositInfo]);

  const handleRequestAddress = async (currency) => {
    setIsLoading(true);
    setDepositInfo(null);
    try {
      const { data } = await api.post(`/deposits/request-address`, {
        currency,
      });
      setDepositInfo(data);
      console.log("data: ", data);
      await fetchPoolStatus();
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms) => {
    if (ms === null) return "10:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Address copied to clipboard!");
  };

  return (
    <div className="text-[rgba(255,255,255,0.85)] p-8">
      <div className="flex gap-4 justify-center mb-6">
        {PAYMENT_METHODS.map((pm) => {
          const isAvailable = poolStatus[pm.value] > 0;
          return (
            <button
              key={pm.value}
              onClick={() => handleRequestAddress(pm.value)}
              disabled={!isAvailable || isLoading || !!depositInfo}
              className={`px-6 py-3 rounded-md border transition font-semibold w-40
            ${
              !isAvailable
                ? "bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed"
                : ""
            }
            ${
              isAvailable && !isLoading && !depositInfo
                ? "bg-white/10 border-white/20 hover:bg-white/20"
                : ""
            }
            ${
              isLoading || depositInfo
                ? "bg-gray-500 border-gray-400 text-gray-300 cursor-not-allowed"
                : ""
            }
        `}
            >
              {pm.label} {!isAvailable && "(Busy)"}
            </button>
          );
        })}
      </div>

      {depositInfo && (
        <div className="max-w-lg mx-auto text-center bg-white/5 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">
            Pay within
            <span className="text-yellow-400">{formatTime(timeLeft)}</span>
          </h2>
          <h2 className="text-xl font-bold mb-4">Minimal deposit = $50</h2>

          <p className="text-yellow-400 text-sm mb-2">
            All deposits less than $50 will be credited with a penalty of -$5.
          </p>

          {depositInfo.currency == "usdt" && (
            <p className="text-red-400 text-sm mb-2">
              USDT only (TRC-20), do not try to send any tokens or to any
              different networks.
            </p>
          )}
          {depositInfo.currency == "btc" && (
            <p className="text-red-400 text-sm mb-2">
              Bitcoin only, do not send any other coins or from other networks.
            </p>
          )}
          {depositInfo.currency == "ltc" && (
            <p className="text-red-400 text-sm mb-2">
              Litecoin only, do not send any other coins or from other networks.
            </p>
          )}

          <p className="break-words text-sm mb-4">
            Please send {depositInfo.currency.toUpperCase()} to:
          </p>
          <br />
          <p className="text-sm mb-4 text-gray-400">
            This address is reserved exclusively for you.
          </p>
          <div
            className="flex justify-center mb-4 bg-white p-2 rounded-lg w-fit mx-auto cursor-pointer"
            onClick={() => copyToClipboard(depositInfo.address)}
          >
            <QRCodeSVG value={depositInfo.address} size={160} />
          </div>
          <div
            className="font-mono break-all p-3 bg-gray-900 rounded cursor-pointer"
            onClick={() => copyToClipboard(depositInfo.address)}
          >
            {depositInfo.address}
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

      <div className="max-w-[300px] mx-auto space-y-3 mb-3 mt-2">
        {bonusTiers.map((tier, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-2 py-1 rounded-lg"
          >
            <span
              className={`px-2 py-1 rounded-md text-sm font-medium ${tier.color}`}
            >
              {tier.label}
            </span>
            <span className="px-2 py-1 rounded-md bg-white/10">
              {tier.bonus}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Orders History</h3>
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
              <tr key={o.id} className="text-center hover:bg-white/10">
                <td className="p-2 border border-white/10">{o.id}</td>
                <td className="p-2 border border-white/10 text-green-400">
                  {o.status}
                </td>
                <td className="p-2 border border-white/10">
                  {format(new Date(o.createdAt), "PPpp")}
                </td>
                <td className="p-2 border border-white/10">
                  {o.currency.toUpperCase()}
                </td>
                <td className="p-2 border border-white/10">
                  {o.amountUSD ? `$${o.amountUSD.toFixed(2)}` : "N/A"}
                </td>
                <td className="p-2 border border-white/10">
                  {o.amountCrypto || "N/A"}
                </td>
                <td className="p-2 border border-white/10">
                  {o.transactionHash ? (
                    <a href="#" className="text-blue-400 hover:underline">
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
