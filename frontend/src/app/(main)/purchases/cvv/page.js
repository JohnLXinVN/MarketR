"use client";

import ReactPaginate from "react-paginate";

export default function OrdersPage() {
  let pageCount = 10;
  let handlePageClick = () => {};

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
              <tr>
                <td className="border border-gray-600 px-4 py-2">9760</td>
                <td className="border border-gray-600 px-4 py-2">
                  4183764698235548 | 11/2026 | 781 | Thomas Hernandez | PSC
                  7779, Box 2706 APO AA 92129
                </td>
                <td className="border border-gray-600 px-4 py-2">—</td>
                <td className="border border-gray-600 px-4 py-2">
                  <span className="px-3 py-1 rounded bg-gray-600 text-white text-xs">
                    no refund
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-4 py-2">9755</td>
                <td className="border border-gray-600 px-4 py-2">
                  4963814754653484 | 05/2030 | 871 | Molly Schwartz | USNS
                  Bartlett FPO AP 75211
                </td>
                <td className="border border-gray-600 px-4 py-2">—</td>
                <td className="border border-gray-600 px-4 py-2">
                  <span className="px-3 py-1 rounded bg-gray-600 text-white text-xs">
                    no refund
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-4 py-2">9754</td>
                <td className="border border-gray-600 px-4 py-2">
                  4725723346247888 | 10/2031 | 556 | Patrick Harris | 30434 Evan
                  Lodge Apt. 793 Josephfort, CT 39006
                </td>
                <td className="border border-gray-600 px-4 py-2">—</td>
                <td className="border border-gray-600 px-4 py-2">
                  <span className="px-3 py-1 rounded bg-gray-600 text-white text-xs">
                    no refund
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-4 py-2">9748</td>
                <td className="border border-gray-600 px-4 py-2">
                  4221970457834363 | 07/2031 | 922 | Dawn Marshall | Unit 7584
                  Box 1164 DPO AE 66504
                </td>
                <td className="border border-gray-600 px-4 py-2">—</td>
                <td className="border border-gray-600 px-4 py-2">
                  <span className="px-3 py-1 rounded bg-gray-600 text-white text-xs">
                    no refund
                  </span>
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
            pageClassName="px-3 py-1 border cursor-pointer rounded bg-gray-700 text-[rgba(255,255,255,0.85)]"
            activeClassName="bg-blue-600"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>

      {/* Footer */}
    </div>
  );
}
