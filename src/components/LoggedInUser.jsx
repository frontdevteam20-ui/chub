import React from 'react';

function LoggedInUser({ user, className = "" }) {
  if (!user) return null;

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm ${className}`}>
      <div className="flex items-center justify-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Logged in as</p>
          <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default LoggedInUser;
