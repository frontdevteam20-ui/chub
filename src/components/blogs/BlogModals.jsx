import React from 'react';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';

export const DeleteConfirmationModal = ({ showDeleteModal, confirmDelete, cancelDelete }) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 mx-4 transform transition-all">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <FaExclamationTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Confirm Delete</h2>
            <p className="text-gray-600 text-sm">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-gray-700 mb-8">Are you sure you want to delete this blog post? This will permanently remove it from your collection.</p>
        <div className="flex gap-4">
          <button
            className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
            onClick={cancelDelete}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const SuccessPopup = ({ showSuccessPopup }) => {
  if (!showSuccessPopup) return null;

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out">
      <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-sm">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <FaCheck className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold">Blog deleted successfully!</span>
      </div>
    </div>
  );
};
