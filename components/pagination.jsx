import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-between items-center my-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Page Info */}
      <span className="text-gray-700 font-semibold text-lg bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
        Page <span className="text-indigo-600">{currentPage}</span> of{" "}
        <span className="text-purple-600">{totalPages}</span>
      </span>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-base rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex space-x-2">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                page === currentPage
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 hover:shadow-md"
              } transform hover:scale-105 active:scale-95`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-base bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
