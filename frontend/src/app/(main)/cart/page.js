"use client";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      bin: "522220",
      type: "MasterCard",
      subtype: "N/A",
      expDate: "03/xx",
      country: "United States",
      bank: "Columbus Bank and Trust Company",
      price: 51.0,
    },
  ]);

  const [selected, setSelected] = useState([]);

  const discountPercent = 3;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const discount = (subtotal * discountPercent) / 100;
  const summary = subtotal - discount;

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === cartItems.length) {
      setSelected([]);
    } else {
      setSelected(cartItems.map((item) => item.id));
    }
  };

  return (
    <div className="p-6  text-[rgba(255,255,255,0.85)]">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">CVV2 Cards</h1>

      {/* Action buttons */}
      <div className="flex gap-4 mb-4">
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          Remove Selected Items
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#0f223a] rounded-lg shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#132b4a]">
            <tr>
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selected.length === cartItems.length}
                  onChange={toggleSelectAll}
                  className="accent-blue-500"
                />
              </th>
              <th className="px-3 py-2">Bin</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Subtype</th>
              <th className="px-3 py-2">Exp Date</th>
              <th className="px-3 py-2">Country</th>
              <th className="px-3 py-2">Bank</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} className="border-t border-gray-700">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="accent-blue-500"
                  />
                </td>
                <td className="px-3 py-2">{item.bin}</td>
                <td className="px-3 py-2">{item.type}</td>
                <td className="px-3 py-2">{item.subtype}</td>
                <td className="px-3 py-2">{item.expDate}</td>
                <td className="px-3 py-2">{item.country}</td>
                <td className="px-3 py-2">{item.bank}</td>
                <td className="px-3 py-2">${item.price.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary box */}
      <div className="mt-6 max-w-sm bg-[#0f223a] rounded-lg p-4 shadow">
        <p className="text-red-400 text-sm mb-3">
          Please read carefully before buying!
        </p>
        <div className="flex justify-between py-1">
          <span>Discount:</span>
          <span>
            {discountPercent}% (-${discount.toFixed(2)})
          </span>
        </div>
        <div className="flex justify-between py-1 font-semibold">
          <span>Summary Amount:</span>
          <span>${summary.toFixed(2)}</span>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="mt-6 flex gap-4">
        <Link
          href="/cvv"
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
        >
          Continue Shopping
        </Link>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          Complete Order
        </button>
      </div>
    </div>
  );
}
