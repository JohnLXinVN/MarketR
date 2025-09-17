"use client";
import { useEffect, useState } from "react";
import styles from "./Cvv.module.css";
import ReactPaginate from "react-paginate";

export default function CvvPage() {
  const [price, setPrice] = useState([4, 30]);

  let pageCount = 10;
  let handlePageClick = () => {};

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDOB, setSelectedDOB] = useState("");
  const [selectedSSN, setSelectedSSN] = useState("");

  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch("/api/countries");
        const data = await res.json();
        const list = data.map((c) => ({
          name: c.name.common,
          code: c.cca2, // ISO 3166-1 alpha-2 (US, VN…)
        }));
        list.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      } catch (err) {
        console.error("Error loading countries:", err);
      }
    }

    loadCountries();
  }, []);

  const data = [
    {
      id: 1,
      type: "VISA",
      bin: "432369",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "03/27",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_432369_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 50,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 2,
      type: "VISA",
      bin: "453721",
      bank: "BANK",
      class: "DEBIT",
      level: "-",
      expiry: "02/26",
      country: "🇺🇸",
      state: "-",
      zip: "***",
      database: "DB_BANK_453721_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 36,
    },
    {
      id: 3,
      type: "MasterCard",
      bin: "545324",
      bank: "BANK",
      class: "CREDIT",
      level: "-",
      expiry: "12/29",
      country: "🇹🇳",
      state: "-",
      zip: "***",
      database: "DB_BANK_545324_20250912",
      ssn: "-",
      dob: "-",
      vendor: "VEND### [Platinum]",
      price: 92,
    },
  ];

  return (
    <div className="flex-1 bg-center pt-4 pl-6 pr-6 pb-10 text-[rgba(255,255,255,0.85)]">
      {/* Filter Form */}
      <div className="p-6">
        {/* Filter Form */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Bins */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              Bins
            </label>
            <input
              placeholder="Search..."
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>

          {/* Bank */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              Bank
            </label>
            <input
              placeholder="Bank..."
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]">
                - all -
              </option>
              {countries.map((c) => (
                <option
                  key={c.code}
                  value={c.code}
                  className="bg-[#1a1a1a] text-[rgba(255,255,255,0.85)]"
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              State
            </label>
            <input
              placeholder="All"
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              City
            </label>
            <input
              placeholder="All"
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>

          {/* ZIP */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              ZIP
            </label>
            <input
              placeholder="All"
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              DOB
            </label>
            <select
              value={selectedDOB}
              onChange={(e) => setSelectedDOB(e.target.value)}
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option
                value=""
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                - all -
              </option>
              <option
                value="1"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                Yes
              </option>
              <option
                value="0"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                No
              </option>
            </select>
          </div>

          {/* SSN */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              SSN
            </label>
            <select
              value={selectedSSN}
              onChange={(e) => setSelectedSSN(e.target.value)}
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option
                value=""
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                - all -
              </option>
              <option
                value="1"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                Yes
              </option>
              <option
                value="0"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                No
              </option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              Type
            </label>
            <select
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]">
                - all -
              </option>
              <option
                value="visa"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                VISA
              </option>
              <option
                value="mastercard"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                MASTERCARD
              </option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              Level
            </label>
            <select
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option
                value=""
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                - all -
              </option>
              <option
                value="platinum"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                PLATINUM
              </option>
              <option
                value="gold"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                GOLD
              </option>
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              Class
            </label>
            <select
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option
                value=""
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                - all -
              </option>
              <option
                value="debit"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                DEBIT
              </option>
              <option
                value="credit"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                CREDIT
              </option>
            </select>
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              Vendor
            </label>
            <input
              placeholder="All"
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            />
          </div>

          {/* Per Page */}
          <div>
            <label className="block text-sm font-medium text-[rgba(255,255,255,0.85)] mb-1">
              Per Page
            </label>
            <select
              className="bg-transparent border border-white/20 px-3 py-2 rounded-md 
         w-full text-sm placeholder-gray-400 
         focus:outline-none focus:ring-1 focus:ring-blue-400;"
            >
              <option
                value="10"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                10
              </option>
              <option
                value="20"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                20
              </option>
              <option
                value="30"
                className="text-[rgba(255,255,255,0.85)] bg-[#1a1a1a]"
              >
                30
              </option>
            </select>
          </div>
          <div>
            <div></div>
            <div className="col-span-3 flex items-center gap-4">
              <span>Price:</span>
              <div className="flex items-center gap-2">
                <span>{price[0]}$</span>
                <input
                  type="range"
                  min="4"
                  max="30"
                  value={price[1]}
                  onChange={(e) => setPrice([price[0], +e.target.value])}
                />
                <span>{price[1]}$</span>
              </div>
            </div>
          </div>
          <div></div>
          <div className="flex justify-end">
            <button className="bg-white/10  cursor-pointer text-[rgba(255,255,255,0.85)] px-6 py-2 rounded-md hover:bg-white/20 transition">
              Search
            </button>
          </div>
        </div>

        {/* Search Button */}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-white/20 text-sm">
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
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-white/5">
                <td className="p-2 border border-white/20">
                  <input type="checkbox" />
                </td>
                <td className="p-2 border border-white/20">{row.type}</td>
                <td className="p-2 border border-white/20">{row.bin}</td>
                <td className="p-2 border border-white/20">{row.bank}</td>
                <td className="p-2 border border-white/20">{row.class}</td>
                <td className="p-2 border border-white/20">{row.level}</td>
                <td className="p-2 border border-white/20">{row.expiry}</td>
                <td className="p-2 border border-white/20">{row.country}</td>
                <td className="p-2 border border-white/20">{row.state}</td>
                <td className="p-2 border border-white/20">{row.zip}</td>
                <td className="p-2 border border-white/20">{row.database}</td>
                <td className="p-2 border border-white/20">{row.ssn}</td>
                <td className="p-2 border border-white/20">{row.dob}</td>
                <td className="p-2 border border-white/20">{row.vendor}</td>
                <td className="p-2 border border-white/20">{row.price} $</td>
                <td className="p-2 border border-white/20">
                  <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={null} // ❌ bỏ Previous
          nextLabel={null}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center space-x-2 mt-6"
          pageClassName="px-3 py-1 border cursor-pointer rounded bg-gray-700 text-[rgba(255,255,255,0.85)]"
          activeClassName="bg-blue-600"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}
