"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import api from "../../../utils/api";
import { useConfirm } from "../../../components/ConfirmDialog";
import { toast } from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
// Component con để hiển thị trạng thái loading hoặc lỗi

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { confirm, ConfirmDialog } = useConfirm();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const { updateUser } = useUser();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);

        const response = await api.get("/cart/cart-items");


        setCartItems(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch cart data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const { subtotal, discount, summary, itemsToCheckout } = useMemo(() => {
    const discountPercent = 3;

    const selectedItems = cartItems.filter((item) =>
      selected.includes(item.id)
    );

    const currentSubtotal = selectedItems.reduce(
      (acc, item) => acc + parseFloat(item.cvv.price),
      0
    );

    const currentDiscount = (currentSubtotal * discountPercent) / 100;
    const currentSummary = currentSubtotal - currentDiscount;

    return {
      subtotal: currentSubtotal,
      discount: currentDiscount,
      summary: currentSummary,
      itemsToCheckout: selectedItems,
    };
  }, [cartItems, selected]);

  const handleRemoveItem = async (cartItemId) => {
    const isConfirmed = await confirm({
      title: "Remove Item",
      message: "Are you sure you want to remove this item?",
    });

    if (isConfirmed) {
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      try {
        await api.delete(`/cart/item/${cartItemId}`);
      } catch (err) {
        console.error("Failed to remove item:", err);

        setError("Could not remove item. Please refresh.");
      }
    }
  };

  const handleRemoveSelected = async () => {
    if (selected.length === 0) return;

    const isConfirmed = await confirm({
      title: "Remove Items",
      message: `Are you sure you want to remove ${selected.length} item?`,
    });

    if (isConfirmed) {
      const originalItems = [...cartItems];
      setCartItems((prev) =>
        prev.filter((item) => !selected.includes(item.id))
      );

      try {
        await api.delete("/cart/selected", {
          data: { cartItemIds: selected },
        });
        setSelected([]);
      } catch (err) {
        console.error("Failed to remove selected items:", err);
        setError("Could not remove selected items.");
        setCartItems(originalItems);
      }
    }
  };

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

  const handleCompleteOrder = async () => {
    if (itemsToCheckout.length === 0) {
      alert("Please select items to checkout.");
      return;
    }

    setOrderError(null);
    setIsCheckingOut(true);

    const itemIdsToCheckout = itemsToCheckout.map((item) => item.cvv.id);
    try {
      const response = await api.post("/orders-cvv", {
        cvvIds: itemIdsToCheckout,
      });

      const newBalance = response.data.newBalance;

      updateUser({ walletBalance: newBalance });

      const cartItemIdsToRemove = itemsToCheckout.map((item) => item.id);

      setCartItems((prev) =>
        prev.filter((item) => !cartItemIdsToRemove.includes(item.id))
      );

      toast.success("Order completed successfully!", {
        duration: 3000,
      });

      setSelected([]);
    } catch (err) {
      console.error("Failed to complete order", err);

      const errorMessage =
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setOrderError(errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="p-6 text-[rgba(255,255,255,0.85)]">
      <h1 className="text-2xl font-semibold mb-6">CVV2 Cards</h1>
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleRemoveSelected}
          disabled={selected.length === 0 || loading}
          className="bg-red-600 cursor-pointer hover:bg-red-700 px-4 py-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Remove Selected Items
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="relative w-12 h-12">
            <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#0f223a] rounded-lg shadow">
          {/* Table JSX không thay đổi */}
          <table className="w-full text-left text-sm">
            {/* ... thead ... */}
            <thead className="bg-[#132b4a]">
              <tr>
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={
                      cartItems.length > 0 &&
                      selected.length === cartItems.length
                    }
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
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    Your cart is empty.
                  </td>
                </tr>
              ) : (
                cartItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-700">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="accent-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      {" "}
                      {item.cvv.binNumber
                        ? item.cvv.binNumber.slice(0, 6) +
                          "*".repeat(item.cvv.binNumber.length - 6)
                        : ""}
                    </td>
                    <td className="px-3 py-2">{item.cvv.cardType}</td>
                    <td className="px-3 py-2">{item.cvv.cardLevel}</td>
                    <td className="px-3 py-2">
                      {item.cvv.expiryDate
                        ? "**/" + item.cvv.expiryDate.split("/")[1]
                        : ""}
                    </td>
                    <td className="px-3 py-2">{item.cvv.country}</td>
                    <td className="px-3 py-2">{item.cvv.issuingBank}</td>
                    <td className="px-3 py-2">
                      $
                      {item.cvv?.price
                        ? parseFloat(item.cvv.price).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="bg-red-500 cursor-pointer hover:bg-red-600 px-3 py-1 rounded text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6 max-w-sm bg-[#0f223a] rounded-lg p-4 shadow">
        <p className="text-red-400 text-sm mb-3">
          Please read carefully before buying!
        </p>
        <div className="flex justify-between py-1">
          <span>Discount (on selected):</span>
          <span>3% (-${discount.toFixed(2)})</span>
        </div>
        <div className="flex justify-between py-1 font-semibold">
          <span>Summary Amount (selected):</span>
          <span>${summary?.toFixed(2) ?? "0.00"}</span>
        </div>
      </div>

      {orderError && (
        <div className="mt-4 max-w-sm p-3 bg-red-900/50 border border-red-700 text-red-300 rounded text-sm">
          <p className="font-semibold">Order Failed</p>
          <p>{orderError}</p>
        </div>
      )}
      <div className="mt-6 flex gap-4">
        <Link
          href="/cvv"
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
        >
          Continue Shopping
        </Link>
        <button
          onClick={handleCompleteOrder}
          disabled={selected.length === 0 || isCheckingOut}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-4 py-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isCheckingOut ? "Processing..." : "Complete Order"}
        </button>
      </div>
      <ConfirmDialog />
    </div>
  );
}
