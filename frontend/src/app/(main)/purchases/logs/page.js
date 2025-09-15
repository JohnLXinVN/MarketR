"use client";
import { useState } from "react";
import ReactPaginate from "react-paginate";

const logs = [
  {
    id: 1001,
    stealer: "racoon",
    country: "🇳🇦 Namibia",
    date: "Sept. 12, 2025",
    vendor: "Observer [Diamond]",
    price: "$6.99",
    details: {
      links: [
        "amazon.com",
        "aliexpress.com",
        "ebay.com",
        "walmart.com",
        "bestbuy.com",
      ],
      outlook: "No",
      info: "-",
      struct: "+",
      file: "archive1.zip",
      size: "29248 KB",
    },
  },
  {
    id: 1002,
    stealer: "redline",
    country: "🇺🇸 USA",
    date: "Sept. 12, 2025",
    vendor: "Observer [Diamond]",
    price: "$4.99",
    details: {
      links: [
        "target.com",
        "flipkart.com",
        "noon.com",
        "ozon.ru",
        "mercadolibre.com",
      ],
      outlook: "Yes",
      info: "Has cookies",
      struct: "+",
      file: "archive2.zip",
      size: "15842 KB",
    },
  },
  {
    id: 1003,
    stealer: "azorult",
    country: "🇯🇵 Japan",
    date: "Sept. 12, 2025",
    vendor: "Observer [Diamond]",
    price: "$7.49",
    details: {
      links: [
        "rakuten.co.jp",
        "jd.com",
        "zalando.com",
        "argos.co.uk",
        "carrefour.fr",
      ],
      outlook: "No",
      info: "Includes autofill",
      struct: "+",
      file: "archive3.zip",
      size: "19320 KB",
    },
  },
];

export default function OrdersLogsTable() {
  const [openRow, setOpenRow] = useState(null);
  let pageCount = 10;
  let handlePageClick = () => {};

  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  return (
    <div className="flex flex-col items-center w-full text-[rgba(255,255,255,0.85)]">
      <div className="max-w-6xl w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          My Purchased Logs
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 text-sm">
            <thead className="bg-[#132230] text-gray-200">
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
              {logs.map((log) => (
                <>
                  {/* Row cha */}
                  <tr
                    key={log.id}
                    className="bg-[#1a2d3d] hover:bg-[#22384a] transition"
                  >
                    <td className="border border-gray-700 px-3 py-2">
                      {log.id}
                    </td>
                    <td className="border border-gray-700 px-3 py-2">
                      {log.stealer}
                    </td>
                    <td className="border border-gray-700 px-3 py-2">
                      {log.country}
                    </td>
                    <td className="border border-gray-700 px-3 py-2">
                      {log.date}
                    </td>
                    <td className="border border-gray-700 px-3 py-2">
                      {log.vendor}
                    </td>
                    <td className="border border-gray-700 px-3 py-2">
                      {log.price}
                    </td>
                    <td className="border border-gray-700 px-3 py-2 text-center">
                      <button
                        onClick={() => toggleRow(log.id)}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        {openRow === log.id ? "Hide Logs" : "View Logs"}
                      </button>
                    </td>
                  </tr>

                  {/* Row con */}
                  {openRow === log.id && (
                    <tr className="bg-[#172736]">
                      <td
                        colSpan={7}
                        className="px-6 py-4 border border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p>
                              <span className="font-semibold">Links:</span>{" "}
                              {log.details.links.join(" | ")}
                            </p>
                            <p>
                              <span className="font-semibold">Outlook:</span>{" "}
                              {log.details.outlook}
                            </p>
                            <p>
                              <span className="font-semibold">Info:</span>{" "}
                              {log.details.info}
                            </p>
                            <p>
                              <span className="font-semibold">Struct:</span>{" "}
                              {log.details.struct}
                            </p>
                            <p>
                              <span className="font-semibold">File:</span>{" "}
                              {log.details.file}
                            </p>
                            <p>
                              <span className="font-semibold">Size:</span>{" "}
                              {log.details.size}
                            </p>
                          </div>
                          <div>
                            <button
                              onClick={() =>
                                alert(`Downloading ${log.details.file}`)
                              }
                              className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-xs"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
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
    </div>
  );
}
