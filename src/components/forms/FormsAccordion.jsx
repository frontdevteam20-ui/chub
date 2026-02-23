import React, { useState } from "react";
import { formatDateTime } from "./utils";
import { FaEnvelope, FaUser, FaPhone, FaBuilding, FaClock, FaTag, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const FormsAccordion = ({ forms }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (!forms || forms.length === 0) {
    return <div className="text-center text-gray-500 py-8">No forms found.</div>;
  }

  // Calculate pagination
  const totalPages = Math.ceil(forms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentForms = forms.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentForms.map(form => (
        <div
          key={form.id}
          className="bg-white border-l-4 border-orange-500 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white p-4">
            {/* <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate">{form.subject || "Contact Inquiry"}</h3>
            </div> */}
            <p className="text-orange-100 text-sm mt-1 font-mono">{form.id}</p>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-orange-600 text-sm" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{form.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaBuilding className="text-blue-600 text-sm" />
                </div>
                <p className="text-gray-700 text-sm">{form.companyName}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-blue-600 text-sm" />
                </div>
                <p className="text-gray-700 text-sm">{form.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaPhone className="text-green-600 text-sm" />
                </div>
                <p className="text-gray-700 text-sm">{form.phone}</p>
              </div>
            </div>

            {/* Message Section */}
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-1">
              <p className="text-gray-600 text-sm font-medium">Message :</p>
              <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">{form.message}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <FaClock className="text-xs" />
                <span className="text-xs">{formatDateTime(form.timestamp)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaTag className="text-orange-500 text-xs" />
                <span className="text-orange-600 text-xs font-medium">Form</span>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 space-x-4">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            <FaChevronLeft className="text-sm" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`w-10 h-10 rounded-full transition-colors ${
                  currentPage === index + 1
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            Next
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      )}

      {/* Pagination Info */}
      <div className="text-center mt-4 text-gray-600 text-sm mb-4">
        Showing {startIndex + 1} to {Math.min(endIndex, forms.length)} of {forms.length} forms
      </div>
    </div>
  );
};

export default FormsAccordion;