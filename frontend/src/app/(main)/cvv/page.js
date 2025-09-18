"use client";
import { useEffect, useState, useCallback } from "react";
import styles from "./Cvv.module.css";
import ReactPaginate from "react-paginate";
import api from "./../../../utils/api";

export default function CvvPage() {
  // State cho dữ liệu và UI
  const [cvvList, setCvvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu ở true
  const [isReady, setIsReady] = useState(false); // CỜ ĐỂ BIẾT KHI NÀO DỮ LIỆU NỀN ĐÃ TẢI XONG

  // State cho phân trang
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // State cho các giá trị filter
  const [filters, setFilters] = useState({
    bin: "",
    bank: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    dob: "",
    ssn: "",
    type: "",
    level: "",
    cardClass: "",
    vendor: "",
  });
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedPrice, setSelectedPrice] = useState([0, 0]);

  // State cho dữ liệu nền (options của select)
  const [countries, setCountries] = useState([]);
  const [dataBackgroundPage, setDataBackgroundPage] = useState({
    getCardTypes: [],
    getCardClass: [],
    getCardLevel: [],
    getMinPrice: 0,
    getMaxPrice: 0,
  });

  // ✅ BƯỚC 1: Tải tất cả dữ liệu nền trong một useEffect duy nhất
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        // Tải đồng thời cả 2 API để tăng tốc
        const [countriesRes, backgroundDataRes] = await Promise.all([
          fetch("/api/countries"),
          api.get("/cvvs/get_all_data_search"),
        ]);

        // Xử lý countries
        const countriesData = await countriesRes.json();
        const list = countriesData.map((c) => ({
          name: c.name.common,
          code: c.cca2,
        }));
        list.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);

        // Xử lý background data
        const backgroundData = backgroundDataRes.data;
        setDataBackgroundPage(backgroundData);
        setPriceRange([backgroundData.getMinPrice, backgroundData.getMaxPrice]);
        setSelectedPrice([
          backgroundData.getMinPrice,
          backgroundData.getMaxPrice,
        ]);

        // Sau khi tất cả state cần thiết đã được set, BẬT CỜ isReady
        setIsReady(true);
      } catch (err) {
        console.error("Error loading initial data:", err);
        // Có thể thêm state để hiển thị lỗi ra UI
      }
      // setIsLoading sẽ được set thành false trong hàm fetchCvvs
    }

    loadInitialData();
  }, []); // Chỉ chạy 1 lần duy nhất khi component mount

  // ✅ HÀM GỌI API CHÍNH
  const fetchCvvs = useCallback(
    async (pageToFetch) => {
      setIsLoading(true);
      try {
        const params = {
          page: pageToFetch,
          limit: perPage,
          bin: filters.bin || undefined,
          bank: filters.bank || undefined,
          country: filters.country || undefined,
          state: filters.state || undefined,
          city: filters.city || undefined,
          zip: filters.zip || undefined,
          ssn: filters.ssn ? filters.ssn === "1" : undefined,
          dob: filters.dob ? filters.dob === "1" : undefined,
          type: filters.type || undefined,
          level: filters.level || undefined,
          cardClass: filters.cardClass || undefined,
          vendor: filters.vendor || undefined,
          priceMin: selectedPrice[0],
          priceMax: selectedPrice[1],
        };

        console.log("params", params);

        const response = await api.post("/cvvs/get_list_cvv", params);

        console.log("response", response.data);
        setCvvList(response.data.data);
        setPageCount(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching CVV list:", error);
        setCvvList([]);
        setPageCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [perPage, filters, selectedPrice] // Dependencies không đổi
  );

  // ✅ BƯỚC 2: useEffect này sẽ chịu trách nhiệm gọi API fetchCvvs
  useEffect(() => {
    // CHỈ FETCH KHI DỮ LIỆU NỀN ĐÃ SẴN SÀNG
    if (isReady) {
      // currentPage là 1 trong lần đầu tiên, và sẽ thay đổi khi phân trang
      fetchCvvs(currentPage);
    }
  }, [isReady, currentPage, perPage, fetchCvvs]); // Thêm fetchCvvs và isReady vào dependency

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  // Phần JSX của bạn giữ nguyên, không cần thay đổi
  return (
    <div className="flex-1 bg-center pt-4 pl-6 pr-6 pb-10 text-[rgba(255,255,255,0.85)]">
      {/* Filter Form */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Tất cả các input filter đều dùng handleFilterChange */}
          {/* Bins */}
          <div>
            <label className="block text-sm font-medium mb-1">Bins</label>

            <input
              name="bin"
              value={filters.bin}
              onChange={handleFilterChange}
              placeholder="453721, 432369..."
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>
          {/* Bank */}
          <div>
            <label className="block text-sm font-medium mb-1">Bank</label>

            <input
              name="bank"
              value={filters.bank}
              onChange={handleFilterChange}
              placeholder="Bank..."
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>
          {/* Country */}
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>

            <select
              name="country"
              value={filters.country}
              onChange={handleFilterChange}
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
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
          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1">State</label>

            <input
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              placeholder="All"
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>
          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">City</label>

            <input
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="All"
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>
          {/* ZIP */}
          <div>
            <label className="block text-sm font-medium mb-1">ZIP</label>
            <input
              name="zip"
              value={filters.zip}
              onChange={handleFilterChange}
              placeholder="All"
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>
          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-1">DOB</label>
            <select
              name="dob"
              value={filters.dob}
              onChange={handleFilterChange}
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option value="" className="bg-[#1a1a1a]">
                - all -
              </option>

              <option value="1" className="bg-[#1a1a1a]">
                Yes
              </option>

              <option value="0" className="bg-[#1a1a1a]">
                No
              </option>
            </select>
          </div>
          {/* SSN */}
          <div>
            <label className="block text-sm font-medium mb-1">SSN</label>
            <select
              name="ssn"
              value={filters.ssn}
              onChange={handleFilterChange}
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option value="" className="bg-[#1a1a1a]">
                - all -
              </option>

              <option value="1" className="bg-[#1a1a1a]">
                Yes
              </option>

              <option value="0" className="bg-[#1a1a1a]">
                No
              </option>
            </select>
          </div>
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option value="" className="bg-[#1a1a1a]">
                - all -
              </option>

              {dataBackgroundPage.getCardTypes.map((type) => (
                <option key={type} value={type} className="bg-[#1a1a1a]">
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* Level */}
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>

            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option value="" className="bg-[#1a1a1a]">
                - all -
              </option>

              {dataBackgroundPage.getCardLevel.map((level) => (
                <option key={level} value={level} className="bg-[#1a1a1a]">
                  {level}
                </option>
              ))}
            </select>
          </div>
          {/* Class */}
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              name="cardClass"
              value={filters.cardClass}
              onChange={handleFilterChange}
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option value="" className="bg-[#1a1a1a]">
                - all -
              </option>

              {dataBackgroundPage.getCardClass.map((c) => (
                <option key={c} value={c} className="bg-[#1a1a1a]">
                  {c}
                </option>
              ))}
            </select>
          </div>
          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium mb-1">Vendor</label>
            <input
              name="vendor"
              value={filters.vendor}
              onChange={handleFilterChange}
              placeholder="All"
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>
          {/* Per Page */}
          <div>
            <label className="block text-sm font-medium mb-1">Per Page</label>

            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option value="10" className="bg-[#1a1a1a]">
                10
              </option>

              <option value="20" className="bg-[#1a1a1a]">
                20
              </option>

              <option value="30" className="bg-[#1a1a1a]">
                30
              </option>

              <option value="50" className="bg-[#1a1a1a]">
                50
              </option>
            </select>
          </div>
          {/* Price Range */}
          <div className="col-span-2 flex flex-col items-start gap-4">
            <label>Price:</label>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex flex-row">
                <label>From</label>
                <div className="ml-2">
                  <span>{selectedPrice[0]}$</span>
                  <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={selectedPrice[0]}
                    onChange={(e) =>
                      setSelectedPrice([+e.target.value, selectedPrice[1]])
                    }
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-row">
                <label>To</label>

                <div className="ml-2">
                  <span>{selectedPrice[1]}$</span>
                  <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={selectedPrice[1]}
                    onChange={(e) =>
                      setSelectedPrice([selectedPrice[0], +e.target.value])
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Data Table */}
      <div className="">
        <table className="w-full border border-white/20 text-sm">
          {/* ... thead ... */}
          <thead className="bg-white/10">
            <tr>
              <th className="p-2 border border-white/20">
                <input type="checkbox" />
              </th>
              <th className="p-2 border border-white/20">Type</th>
              <th className="p-2 border border-white/20">Bin</th>
              <th className="p-2 border border-white/20">Bank</th>
              <th className="p-2 border border-white/20">Class</th>
              <th className="p-2 border border-white/20">Level</th>
              <th className="p-2 border border-white/20">Expiry</th>
              <th className="p-2 border border-white/20">Country</th>
              <th className="p-2 border border-white/20">State</th>
              <th className="p-2 border border-white/20">Zip</th>
              <th className="p-2 border border-white/20">Database</th>
              <th className="p-2 border border-white/20">SSN</th>
              <th className="p-2 border border-white/20">DOB</th>
              <th className="p-2 border border-white/20">Vendor</th>
              <th className="p-2 border border-white/20">Price</th>
              <th className="p-2 border border-white/20">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={100} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="relative w-12 h-12">
                      <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : cvvList.length > 0 ? (
              cvvList.map((row) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="p-2 border border-white/20 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2 border border-white/20">{row.cardType}</td>
                  <td className="p-2 border border-white/20">
                    {row.binNumber
                      ? row.binNumber.slice(0, 6) +
                        "*".repeat(row.binNumber.length - 6)
                      : ""}
                  </td>
                  <td className="p-2 border border-white/20">
                    {row.issuingBank}
                  </td>
                  <td className="p-2 border border-white/20">
                    {row.cardClass}
                  </td>
                  <td className="p-2 border border-white/20">
                    {row.cardLevel}
                  </td>
                  <td className="p-2 border border-white/20">{row.expiry}</td>
                  <td className="p-2 border border-white/20">{row.country}</td>
                  <td className="p-2 border border-white/20">{row.state}</td>
                  <td className="p-2 border border-white/20">****</td>
                  <td className="p-2 border border-white/20">
                    {row.dataSource
                      ? (() => {
                          const parts = row.dataSource.split("_");
                          if (parts.length <= 2) return row.dataSource;
                          return (
                            parts.slice(0, 2).join("_") +
                            "_" +
                            "*".repeat(parts.slice(2).join("_").length)
                          );
                        })()
                      : ""}
                  </td>
                  <td className="p-2 border border-white/20">
                    {row.hasSsn ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border border-white/20">
                    {row.hasDob ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border border-white/20">
                    {row.sellerName}
                  </td>
                  <td className="p-2 border border-white/20 whitespace-nowrap">
                    {row.price} $
                  </td>
                  <td className="p-2 border border-white/20 text-center">
                    <button className="bg-gray-700 cursor-pointer  hover:bg-gray-600 px-3 py-1 rounded">
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16" className="text-center p-4">
                  No data found.
                </td>
              </tr>
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
            pageClassName="block w-8 h-8 flex items-center justify-center rounded border border-gray-600 cursor-pointer"
            previousClassName="block w-8 h-8 flex items-center justify-center rounded border border-gray-600 cursor-pointer"
            nextClassName="block w-8 h-8 flex items-center justify-center rounded border border-gray-600 cursor-pointer"
            breakClassName="block w-8 h-8 flex items-center justify-center rounded border border-gray-600"
            activeClassName="bg-blue-600 border-blue-600"
            forcePage={currentPage - 1}
            renderOnZeroPageCount={null}
          />
        )}
      </div>
    </div>
  );
}
