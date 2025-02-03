import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import icons for edit and delete
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { programmingstockdata } from "../dummyData/FormData";

// Utility function to join class names conditionally
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProgramingTable = ({ columns, data, searchEnabled = false }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Make sure data is an array, and get the programming stocks
  const requests = Array.isArray(data?.data) ? data?.data : [];

  const filteredData = requests
    .flatMap((request) => request.programming_stocks || []) // Ensure it's an array
    .map(({ product_name, serial_no, product_id, description }) => ({
      product_name,
      serial_no,
      product_id,
      description,
    }));

  // Apply search term filtering
  const searchedData = searchTerm
    ? filteredData.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : filteredData;

  return (
    <div className="mt-8 flow-root z-10">
      <ToastContainer />

      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle px-4">
          {/* Search Input */}
          {searchEnabled && (
            <div className="relative flex rounded-md shadow-lg bg-white outline-1 outline-gray-300 max-w-sm mb-6">
              <input
                type="text"
                className="block w-full border-2 rounded-md pl-10 pr-4 py-2 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Search Icon */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Table */}
          <div className="max-h-[600px] overflow-y-auto hide-scrollbar border">
            <table className="min-w-full table-auto border-separate border-spacing-0 shadow-xl rounded-lg overflow-hidden bg-white">
              <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                <tr className="text-center">
                  {programmingstockdata.map((column) => (
                    <th
                      key={column.key}
                      className="sticky top-0 z-10 py-4 px-6 text-base font-semibold tracking-wider text-start capitalize"
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchedData.length > 0 ? (
                  searchedData.map((row, index) => {
                    // Find the original request object that contains this row
                    const request = requests.find((req) =>
                      req.programming_stocks?.some(
                        (stock) => stock.product_id === row.product_id
                      )
                    );

                    return (
                      <tr
                        key={index}
                        className="hover:bg-indigo-50 transition-all duration-200 ease-in-out text-white"
                      >
                        {programmingstockdata.map((column) => (
                          <td
                            key={column.key}
                            className={classNames(
                          " py-4 px-6 text-base font-medium text-gray-800 whitespace-nowrap sm:text-base text-start border-b-2",
                          request?.final_pdf ? "border-red-500" : "border-green-500"
                        )}
                          >
                            {row[column.key] || "N/A"}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={programmingstockdata.length}
                      className="text-center py-4 text-gray-500"
                    >
                      No programming stock data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramingTable;