import React from 'react';
import Navbar from './Navbar';
import HamburgerMenu from './HamburgerMenu';

const ComingSoon = ({ title, description, icon: Icon, handleLogout, user }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white flex-col">
      <Navbar handleLogout={handleLogout} />
      <div className="flex-1 w-full">
        <div className="sm:block">
          <HamburgerMenu handleLogout={handleLogout} user={user} />
        </div>
        <div className="md:ml-64 flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            {Icon && <Icon className="text-3xl text-white" />}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {title}
        </h1>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full mb-6">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-orange-700 font-semibold text-sm uppercase tracking-wide">
            Coming Soon
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          {description || "We're working hard to bring you this exciting new feature. Stay tuned for updates!"}
        </p>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Development Progress</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full w-3/4 transition-all duration-300"></div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Notify Me When Ready
          </button>
          <button className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors duration-200">
            Back to Dashboard
          </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ComingSoon;
