import React from 'react';
import { FaRegNewspaper, FaCalendarAlt, FaEdit, FaClock } from 'react-icons/fa';

const BlogStatisticsCards = ({ blogs }) => {
  const currentDate = new Date();
  
  const thisMonthBlogs = blogs.filter(blog => {
    const blogDate = new Date(blog.date.split('/').reverse().join('-'));
    return blogDate.getMonth() === currentDate.getMonth() && 
           blogDate.getFullYear() === currentDate.getFullYear();
  }).length;

  const todayBlogs = blogs.filter(blog => {
    const blogDate = new Date(blog.date.split('/').reverse().join('-'));
    const today = new Date();
    return blogDate.toDateString() === today.toDateString();
  }).length;

  const thisWeekBlogs = blogs.filter(blog => {
    const blogDate = new Date(blog.date.split('/').reverse().join('-'));
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return blogDate >= weekStart && blogDate <= weekEnd;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Blogs Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 rounded-xl shadow-xl p-6 flex flex-col items-center">
        <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
        <div className="relative z-10">
          <span className="text-3xl font-bold text-white mb-2 block">{blogs.length}</span>
          <span className="text-teal-100 font-medium">Total Blogs</span>
        </div>
        <div className="absolute top-4 right-4">
          <FaRegNewspaper className="w-8 h-8 text-white opacity-80" />
        </div>
      </div>

      {/* Published This Month Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-xl shadow-xl p-6 flex flex-col items-center">
        <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
        <div className="relative z-10">
          <span className="text-3xl font-bold text-white mb-2 block">{thisMonthBlogs}</span>
          <span className="text-emerald-100 font-medium">This Month</span>
        </div>
        <div className="absolute top-4 right-4">
          <FaCalendarAlt className="w-8 h-8 text-white opacity-80" />
        </div>
      </div>

      {/* Today Blogs Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-xl shadow-xl p-6 flex flex-col items-center">
        <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
        <div className="relative z-10">
          <span className="text-3xl font-bold text-white mb-2 block">{todayBlogs}</span>
          <span className="text-orange-100 font-medium">Today</span>
        </div>
        <div className="absolute top-4 right-4">
          <FaCalendarAlt className="w-8 h-8 text-white opacity-80" />
        </div>
      </div>

      {/* This Week Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 rounded-xl shadow-xl p-6 flex flex-col items-center">
        <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
        <div className="relative z-10">
          <span className="text-3xl font-bold text-white mb-2 block">{thisWeekBlogs}</span>
          <span className="text-purple-100 font-medium">This Week</span>
        </div>
        <div className="absolute top-4 right-4">
          <FaClock className="w-8 h-8 text-white opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default BlogStatisticsCards;
