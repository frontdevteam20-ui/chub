import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';

const BlogCardView = ({ blogs, handleDelete }) => {
  return (
    <div className="block lg:hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {blogs.map((blog, idx) => (
          <div
            key={blog.id || idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                <FaCalendarAlt className="w-3 h-3 mr-1" />
                {blog.date}
              </span>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#05a7cc] transition-colors line-clamp-2">{blog.name}</h3>
            </div>
            <div className="flex gap-3">
              <Link 
                to={`/blogs/edit/${blog.id}`} 
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[#05a7cc] text-white text-sm font-medium rounded-lg hover:bg-[#0891b2] transition-colors"
              >
                <FaEdit className="w-4 h-4 mr-1" />
                Edit
              </Link>
              <button 
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors" 
                onClick={() => handleDelete(blog.id)}
              >
                <FaTrash className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCardView;
