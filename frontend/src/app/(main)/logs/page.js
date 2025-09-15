"use client";
import { useState } from "react";
import ReactPaginate from "react-paginate";

export default function LogsPage() {
  const [showMore, setShowMore] = useState(false);
  let handlePageClick = () => {};
  let pageCount = 10;

  const links = [
    "amazon.com",
    "aliexpress.com",
    "ebay.com",
    "walmart.com",
    "etsy.com",
    "bestbuy.com",
    "target.com",
    "flipkart.com",
    "noon.com",
    "ozon.ru",
    "mercadolibre.com",
    "rakuten.co.jp",
    "jd.com",
    "zalando.com",
    "argos.co.uk",
    "carrefour.fr",
    "chase.com",
    "bankofamerica.com",
    "wellsfargo.com",
    "citibank.com",
    "hsbc.co.uk",
    "barclays.co.uk",
    "santander.es",
    "bbva.es",
    "itau.com.br",
  ];

  return (
    <div className="p-6 text-[rgba(255,255,255,0.85)]">
      {/* Filter Form */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="mb-6">
          <label className="block  text-sm mb-3">Stealer</label>
          <select className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]">
            <option>lumma</option>
            <option>racoon</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block  text-sm mb-3">System</label>
          <select className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]">
            <option>Windows 10 Pro (10.0.19045) x64</option>
            <option>Windows 11</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block  text-sm mb-3">Country</label>
          <select className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]">
            <option>AF</option>
            <option>US</option>
          </select>
        </div>

        {/* Links contains (chiếm 2 hàng) */}
        <div className="mb-6 row-span-2">
          <label className="block  text-sm mb-3">Links contains</label>
          <textarea className="w-full h-full min-h-[80px] bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]" />
        </div>

        <div className="mb-6">
          <label className="block  text-sm mb-3">Outlook</label>
          <select className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block  text-sm mb-3">State</label>
          <input className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]" />
        </div>

        <div className="mb-6">
          <label className="block  text-sm mb-3">City</label>
          <input className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]" />
        </div>

        <div className="mb-6">
          <label className="block  text-sm mb-3">Zip</label>
          <input className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]" />
        </div>

        <div className="mb-6">
          <label className="block  text-sm mb-3">ISP</label>
          <input className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]" />
        </div>

        <div className="mb-6">
          <label className="block  text-sm mb-3">Email contains</label>
          <input className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]" />
        </div>

        <div className="mb-6">
          <label className="block  text-sm mb-3">Vendor</label>
          <select className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[rgba(255,255,255,0.85)]">
            <option>Private</option>
            <option>Observer</option>
          </select>
        </div>
      </div>

      <button className="cursor-pointer px-6 bg-gray-700 hover:bg-gray-600 rounded py-4 mb-6 text-[rgba(255,255,255,0.85)]">
        Search
      </button>

      {/* Results */}
      <h2 className="text-xl font-bold mb-4">Results</h2>

      <div className="overflow-x-auto">
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
            <tr className="text-center">
              <td className="border border-gray-700 px-3 py-2">racoon</td>
              <td className="border border-gray-700 px-3 py-2">🇳🇦</td>
              <td className="border border-gray-700 px-3 py-2 text-left">
                {showMore ? (
                  <div>
                    {links.join(" | ")}{" "}
                    <button
                      className="text-blue-400 underline ml-2"
                      onClick={() => setShowMore(false)}
                    >
                      Show less
                    </button>
                  </div>
                ) : (
                  <div>
                    {links.slice(0, 6).join(" | ")}{" "}
                    <button
                      className="text-blue-400 underline ml-2"
                      onClick={() => setShowMore(true)}
                    >
                      Show more
                    </button>
                  </div>
                )}
              </td>
              <td className="border border-gray-700 px-3 py-2">No</td>
              <td className="border border-gray-700 px-3 py-2">-</td>
              <td className="border border-gray-700 px-3 py-2">archive.zip</td>
              <td className="border border-gray-700 px-3 py-2">
                Sept. 12, 2025 <br /> 29248 KB
              </td>
              <td className="border border-gray-700 px-3 py-2">
                Observer [Diamond]
              </td>
              <td className="border border-gray-700 px-3 py-2">$6.99</td>
              <td className="border border-gray-700 px-3 py-2">
                <button className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-[rgba(255,255,255,0.85)]">
                  Buy
                </button>
              </td>
            </tr>
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
          pageClassName="px-3 py-1 border cursor-pointer rounded bg-gray-700 text-white"
          activeClassName="bg-blue-600"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}
