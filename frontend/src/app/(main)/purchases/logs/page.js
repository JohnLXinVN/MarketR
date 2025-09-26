"use client";
import { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { format } from "date-fns";
import api from "./../../../../utils/api";
import { useUser } from "@/contexts/UserContext";

const API_BASE_URL = "http://localhost:5000";

// Hàm chuyển đổi KB sang MB/GB cho dễ đọc
const formatBytes = (kb, decimals = 2) => {
  if (!kb || kb === 0) return "0 KB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(kb) / Math.log(k));
  if (i < 0) return `${kb} KB`;
  return `${parseFloat((kb / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function OrdersLogsTable() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [openRow, setOpenRow] = useState(null);

  const [downloadingId, setDownloadingId] = useState(null);

  const { user } = useUser(); // Lấy thông tin user hiện tại

  const fetchOrders = useCallback(
    async (page = 1) => {
      if (!user) return; // Chỉ fetch khi đã có thông tin user
      setIsLoading(true);
      try {
        const response = await api.post(`/logs/listLogsByUser`, {
          page,
          limit: 10,
        });
        setOrders(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Failed to fetch purchased logs:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchOrders(pagination.page);
  }, [pagination.page, fetchOrders]);

  const handlePageClick = (event) => {
    setPagination((prev) => ({ ...prev, page: event.selected + 1 }));
  };

  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const handleDownload = async (logId, fileName) => {
    if (downloadingId) return;
    setDownloadingId(logId);

    try {
      // SỬA Ở ĐÂY: Dùng `api.get` thay vì `axios`
      // Interceptor sẽ tự động gắn token vào header cho bạn
      const response = await api.get(
        `/logs/${logId}/download`, // Chỉ cần đường dẫn tương đối
        {
          responseType: "blob", // Vẫn giữ nguyên để nhận dữ liệu file
        }
      );

      // Logic tạo và tải file giữ nguyên
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Interceptor của bạn sẽ tự xử lý lỗi 401 (redirect).
      // Các lỗi khác (ví dụ: 404, 500) sẽ được log ở đây.
      console.error("Download failed:", error);
      // Bạn có thể thêm thông báo lỗi ở đây, ví dụ: toast.error("Download failed!");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex flex-col items-center w-full text-[rgba(255,255,255,0.85)]">
      <div className="max-w-6xl w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          My Purchased Logs
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-[12px] border-gray-700 text-sm">
            <thead className=" text-[rgba(255,255,255,0.85)]">
              <tr>
                <th className="border border-gray-700 px-3 py-2">ID</th>
                <th className="border border-gray-700 px-3 py-2">Stealer</th>
                <th className="border border-gray-700 px-3 py-2">Country</th>
                <th className="border border-gray-700 px-3 py-2">Date</th>
                <th className="border border-gray-700 px-3 py-2">Vendor</th>
                <th className="border border-gray-700 px-3 py-2">Price</th>
                <th className="border border-gray-700 px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="relative w-12 h-12">
                        <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <>
                    <tr key={order.id} className="  transition">
                      <td className="border border-gray-700 px-3 py-2">
                        {order.log.id}
                      </td>
                      <td className="border border-gray-700 px-3 py-2">
                        {order.log.stealer}
                      </td>
                      <td className="border border-gray-700 px-3 py-2">
                        {order.log.country}
                      </td>
                      <td className="border border-gray-700 px-3 py-2">
                        {format(new Date(order.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="border border-gray-700 px-3 py-2">
                        {order.log.vendor}
                      </td>
                      <td className="border border-gray-700 px-3 py-2">
                        ${Number(order.pricePaid).toFixed(2)}
                      </td>
                      <td className="border border-gray-700 px-3 py-2 text-center">
                        <button
                          onClick={() => toggleRow(order.id)}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-xs"
                        >
                          {openRow === order.id
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </td>
                    </tr>
                    {openRow === order.id && (
                      <tr className="">
                        <td
                          colSpan={7}
                          className="px-6 py-4 border border-gray-700"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p>
                                <span className="font-semibold">Links:</span>{" "}
                                {order.log.links.join(" | ")}
                              </p>
                              <p>
                                <span className="font-semibold">Outlook:</span>{" "}
                                {order.log.hasOutlook ? "Yes" : "No"}
                              </p>
                              <p>
                                <span className="font-semibold">Info:</span>{" "}
                                {order.log.city || "-"}
                              </p>
                              <p>
                                <span className="font-semibold">Struct:</span>{" "}
                                {order.log.struct}
                              </p>
                              <p>
                                <span className="font-semibold">File:</span>{" "}
                                {order.log.struct}
                              </p>
                              <p>
                                <span className="font-semibold">Size:</span>{" "}
                                {formatBytes(order.log.size)}
                              </p>
                            </div>
                            <div>
                              <button
                                onClick={() =>
                                  handleDownload(order.log.id, order.log.struct)
                                }
                                disabled={downloadingId === order.log.id}
                                className="px-3 py-1 cursor-pointer rounded bg-green-600 hover:bg-green-700 text-xs"
                              >
                                {downloadingId === order.log.id
                                  ? "..."
                                  : "Download"}
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    You haven&apos;t purchased any logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <ReactPaginate
              forcePage={pagination.page - 1}
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              pageCount={pagination.totalPages}
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
