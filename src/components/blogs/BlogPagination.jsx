import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BlogPagination = () => {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#05a7cc] hover:bg-[#05a7cc]/10 transition-colors">
        <FaChevronLeft className="w-5 h-5" />
      </button>
      <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors font-medium">
        1
      </button>
      <button className="w-10 h-10 rounded-xl bg-[#05a7cc] text-white flex items-center justify-center font-medium shadow-sm">
        2
      </button>
      <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors font-medium">
        3
      </button>
      <span className="px-2 text-gray-400">...</span>
      <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors font-medium">
        10
      </button>
      <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#05a7cc] hover:bg-[#05a7cc]/10 transition-colors">
        <FaChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default BlogPagination;
