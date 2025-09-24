"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import api from "../../../utils/api";
import { useUser } from "@/contexts/UserContext";
import { useConfirm } from "../../../components/ConfirmDialog";
import { toast } from "react-hot-toast";

const API_BASE_URL = "http://localhost:3000"; // Thay bằng URL backend của bạn

// Component con cho links
const LinksCell = ({ links }) => {
  const [showMore, setShowMore] = useState(false);
  const MAX_LINKS = 6;

  if (!links || links.length === 0) return "-";
  const displayedLinks = showMore ? links : links.slice(0, MAX_LINKS);

  return (
    <div>
      {displayedLinks.join(" | ")}
      {links.length > MAX_LINKS && (
        <button
          className="text-blue-400 underline ml-2 whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            setShowMore(!showMore);
          }}
        >
          {showMore ? "Show less" : `+${links.length - MAX_LINKS} more`}
        </button>
      )}
    </div>
  );
};

// Format KB → MB/GB
const formatBytes = (kb, decimals = 2) => {
  if (!kb || kb === 0) return "0 KB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(kb) / Math.log(k));
  if (i < 0) return `${kb} KB`;
  return `${parseFloat((kb / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    total: 0,
    limit: 15,
  });
  const [dataBackgroundPage, setDataBackgroundPage] = useState({
    stealers: [],
    systems: [],
    vendors: [],
  });
  const [filters, setFilters] = useState({
    stealer: "",
    system: "",
    country: "",
    links_contains: "",
    outlook: "",
    state: "",
    city: "",
    zip: "",
    isp: "",
    email_contains: "",
    vendor: "",
  });
  const [buyingLogId, setBuyingLogId] = useState(null);
  const { updateUser } = useUser();
  const { confirm, ConfirmDialog } = useConfirm();

  // ref để lưu filters hiện tại
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // --- API fetch logs ---
  const fetchLogs = useCallback(async (pageToFetch = 1) => {
    setIsLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filtersRef.current).filter(
          ([_, value]) => value !== "" && value !== null
        )
      );

      const response = await api.post(`/logs/search`, {
        ...activeFilters,
        page: pageToFetch,
        limit: 10,
      });

      console.log("Fetched logs:", activeFilters);

      setLogs(response.data.data || []);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total,
        limit: response.data.limit,
      });
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      setLogs([]);
      setPagination({ page: 1, totalPages: 0, total: 0, limit: 15 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Load lần đầu ---
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [countriesRes, backgroundDataRes] = await Promise.all([
          fetch("/api/countries"),
          api.get("/logs/filterOptions"),
        ]);

        const countriesData = await countriesRes.json();
        const list = countriesData
          .map((c) => ({
            name: c.name.common,
            code: c.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);

        setDataBackgroundPage(backgroundDataRes.data);

        // Gọi API lần đầu
        await fetchLogs(1);
        setIsReady(true);
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    }
    loadInitialData();
  }, [fetchLogs]);

  const handleBuyClick = async (logToBuy) => {
    if (buyingLogId) return; // Không cho mua nếu đang có giao dịch khác
    console.log("Attempting to buy log:", logToBuy);

    const isConfirmed = await confirm({
      title: "Remove Items",
      message: `Are you sure you want to buy this log for $${Number(
        logToBuy.price
      ).toFixed(2)}?`,
    });
    if (!isConfirmed) return;

    setBuyingLogId(logToBuy.id);
    try {
      const response = await api.post(`/logs/${logToBuy.id}/buy`);

      // 1. Cập nhật số dư trên Header
      updateUser({ walletBalance: response.data.newBalance });

      // 2. Xóa log đã mua khỏi danh sách
      setLogs((currentLogs) =>
        currentLogs.filter((log) => log.id !== logToBuy.id)
      );

      // 3. Hiển thị thông báo thành công
      toast.success("Order completed successfully!", {
        duration: 3000,
      });
    } catch (error) {
      // Hiển thị thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message || "Purchase failed. Please try again.";
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setBuyingLogId(null); // Hoàn tất, cho phép mua tiếp
    }
  };

  // --- Event handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset về page 1 và fetch
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchLogs(1);
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchLogs(newPage);
  };

  return (
    <div className="p-6 text-[rgba(255,255,255,0.85)]">
      {/* Filter Form */}
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="mb-6">
            <label className="block text-sm mb-3">Stealer</label>
            <select
              name="stealer"
              value={filters.stealer}
              onChange={handleFilterChange}
              className="w-full bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {dataBackgroundPage.stealers.map((c) => (
                <option key={c} value={c} className="bg-[#1a1a1a]">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-3">System</label>

            <select
              name="system"
              value={filters.system}
              onChange={handleFilterChange}
              className="w-full bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {dataBackgroundPage.systems.map((c) => (
                <option key={c} value={c} className="bg-[#1a1a1a]">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-3">Country</label>

            <select
              name="country"
              value={filters.country}
              onChange={handleFilterChange}
              className="w-full bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., US, VN"
            >
              <option value="" className="bg-[#1a1a1a]">
                - all -
              </option>

              {countries.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#1a1a1a]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6 row-span-2">
            <label className="block text-sm mb-3">Links contains</label>
            <textarea
              name="links_contains"
              value={filters.links_contains}
              onChange={handleFilterChange}
              className="w-full h-full min-h-[80px] bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., amazon,chase"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-3">Outlook</label>
            <select
              name="outlook"
              value={filters.outlook}
              onChange={handleFilterChange}
              className="w-full bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-[#1a1a1a]">
                - all -
              </option>

              <option value="yes" className="bg-[#1a1a1a]">
                Yes
              </option>

              <option value="no" className="bg-[#1a1a1a]">
                No
              </option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-3">State</label>
            <input
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              className="w-full bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-3">City</label>
            <input
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-3">Zip</label>
            <input
              name="zip"
              value={filters.zip}
              onChange={handleFilterChange}
              className="w-full bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-3">ISP</label>
            <input
              name="isp"
              value={filters.isp}
              onChange={handleFilterChange}
              className="w-full bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-3">Email contains</label>
            <input
              name="email_contains"
              value={filters.email_contains}
              onChange={handleFilterChange}
              className="w-full bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-3">Vendor</label>
            <select
              name="vendor"
              value={filters.vendor}
              onChange={handleFilterChange}
              className="w-full bg-black/50 border border-gray-200 rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {dataBackgroundPage.vendors.map((c) => (
                <option key={c} value={c} className="bg-[#1a1a1a]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer px-6 bg-gray-700 hover:bg-gray-600 rounded-[8px] py-4 mb-6 text-[rgba(255,255,255,0.85)] disabled:bg-gray-800"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Results */}
      <h2 className="text-xl font-bold mb-4">Results</h2>
      <div className="overflow-x-auto text-[13px]">
        <table className="w-full border border-gray-700">
          <thead className="bg-black/40">
            <tr>
              <th className="border border-gray-700 px-3 py-2">Stealer</th>
              <th className="border border-gray-700 px-3 py-2">Country</th>
              <th className="border border-gray-700 px-3 py-2">Links</th>
              <th className="border border-gray-700 px-3 py-2">Outlook</th>
              <th className="border border-gray-700 px-3 py-2">Info</th>
              <th className="border border-gray-700 px-3 py-2">Struct</th>
              <th className="border border-gray-700 px-3 py-2">Date / Size</th>
              <th className="border border-gray-700 px-3 py-2">Vendor</th>
              <th className="border border-gray-700 px-3 py-2">Price</th>
              <th className="border border-gray-700 px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="text-center">
                <td colSpan={100} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="relative w-12 h-12">
                      <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="text-center hover:bg-black/30">
                  <td className="border border-gray-700 px-3 py-2">
                    {log.stealer}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {log.country}
                  </td>
                  <td className="border border-gray-700 px-3 py-2 text-left">
                    <LinksCell links={log.links} />
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {log.hasOutlook ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {log.city || "-"}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {log.struct}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {format(new Date(log.createdAt), "MM/dd/yyyy")}
                    <br />
                    <span className="text-gray-400">
                      {formatBytes(log.size)}
                    </span>
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {log.vendor}
                  </td>
                  <td className="border border-gray-700 px-3 py-2 text-green-400 font-bold">
                    ${Number(log.price).toFixed(2)}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    <button
                      onClick={() => handleBuyClick(log)}
                      disabled={buyingLogId === log.id}
                      className="bg-gray-700 cursor-pointer hover:bg-gray-500 rounded-[8px] px-3 py-1 text-[rgba(255,255,255,0.85)]"
                    >
                      {buyingLogId === log.id ? "..." : "Buy"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-8">
                  No results found for your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {pagination.totalPages > 1 && (
          <ReactPaginate
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
            forcePage={pagination.page - 1}
          />
        )}
      </div>
      <ConfirmDialog />
    </div>
  );
}
