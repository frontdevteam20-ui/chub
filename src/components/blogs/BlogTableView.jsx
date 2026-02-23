import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaRegNewspaper, FaEdit, FaTrash } from 'react-icons/fa';

const BlogTableView = ({ blogs, handleDelete }) => {
  return (
    <div className="hidden lg:block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-500" />
                    Upload Date
                  </div>
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  <div className="flex items-center">
                    <FaRegNewspaper className="w-4 h-4 mr-2 text-gray-500" />
                    Blog Title
                  </div>
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog, idx) => (
                <tr key={blog.id || idx} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {blog.date}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-left text-gray-900 group-hover:text-[#05a7cc] transition-colors">
                      {blog.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <Link 
                        to={`/blogs/edit/${blog.id}`} 
                        className="inline-flex items-center px-3 py-1.5 bg-[#05a7cc] text-white text-sm font-medium rounded-lg hover:bg-[#0891b2] transition-colors"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Edit
                      </Link>
                      <button 
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors" 
                        onClick={() => handleDelete(blog.id)}
                      >
                        <FaTrash className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogTableView;
