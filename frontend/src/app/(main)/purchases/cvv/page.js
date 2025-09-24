"use client";

import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import api from "../../../../utils/api";

export default function OrdersPage() {
  const [orderItems, setOrderItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu khi trang thay đổi
  const fetchOrders = async (currentPage) => {
    try {
      setLoading(true);
      const response = await api.get(`/orders-cvv?page=${currentPage}`);
      setOrderItems(response.data.data);
      setPageCount(response.data.meta.totalPages);
    } catch (err) {
      setError(err.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handlePageClick = (event) => {
    fetchOrders(event.selected + 1);
  };

  return (
    <div className="flex flex-col items-center justify-start w-full text-[rgba(255,255,255,0.85)]">
      <div className="max-w-5xl w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Orders</h1>

        <div className="flex justify-center mb-6">
          <button className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            CVV Orders
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-600 text-sm">
            <thead className="bg-[#132230] text-gray-200">
              <tr>
                <th className="border border-gray-600 px-4 py-2 text-left">
                  ID
                </th>
                <th className="border border-gray-600 px-4 py-2 text-left">
                  CVV
                </th>
                <th className="border border-gray-600 px-4 py-2 text-left">
                  Date
                </th>
                <th className="border border-gray-600 px-4 py-2 text-left">
                  Check
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="relative w-12 h-12">
                        <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-red-400">
                    {error}
                  </td>
                </tr>
              ) : orderItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    You have no orders.
                  </td>
                </tr>
              ) : (
                orderItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-700">
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2 font-mono whitespace-pre-wrap break-all">
                      {item.formattedCvv}
                    </td>
                    <td className="px-4 py-2">{item.expiryDate}</td>
                    <td className="px-4 py-2">
                      <span className="px-3 py-1 rounded  text-white text-xs">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {pageCount > 1 && (
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="flex justify-center items-center space-x-2 mt-6"
              pageClassName="w-8 h-8"
              pageLinkClassName="flex w-full h-full items-center justify-center rounded border border-gray-600 cursor-pointer"
              previousClassName="w-8 h-8"
              previousLinkClassName="flex w-full h-full items-center justify-center rounded border border-gray-600 cursor-pointer"
              nextClassName="w-8 h-8"
              nextLinkClassName="flex w-full h-full items-center justify-center rounded border border-gray-600 cursor-pointer"
              breakClassName="w-8 h-8"
              breakLinkClassName="flex w-full h-full items-center justify-center rounded border border-gray-600"
              activeLinkClassName="bg-blue-600 border-blue-600 text-white"
              renderOnZeroPageCount={null}
            />
          )}
        </div>
      </div>
    </div>
  );
}
