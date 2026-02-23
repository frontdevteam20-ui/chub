// src/components/analytics/acquisition/Pagination.jsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ currentPage, rowsPerPage, totalRows, setCurrentPage }) {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  if (totalPages === 0) return null;

  // Helper to render page numbers, with ellipsis if needed
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full p-2 mx-1 bg-gray-100 text-gray-400 hover:text-[#05a7cc] hover:bg-[#05a7cc]/10 disabled:opacity-40 transition"
        aria-label="Previous page"
      >
        <FaChevronLeft size={16} />
      </button>
      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span key={idx} className="mx-1 text-gray-400 select-none">...</span>
        ) : (
          <button
            key={idx}
            onClick={() => setCurrentPage(page)}
            className={`rounded-full w-8 h-8 mx-1 flex items-center justify-center text-sm font-medium transition
              ${page === currentPage ? 'bg-[#05a7cc] text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-[#05a7cc]/10 hover:text-[#05a7cc]'}`}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-full p-2 mx-1 bg-gray-100 text-gray-400 hover:text-[#05a7cc] hover:bg-[#05a7cc]/10 disabled:opacity-40 transition"
        aria-label="Next page"
      >
        <FaChevronRight size={16} />
      </button>
      <span className="ml-4 text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
    </div>
  );
}

