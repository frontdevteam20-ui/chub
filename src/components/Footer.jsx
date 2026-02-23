import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-center px-6 py-3">
        <p className="text-sm text-gray-600">
          © {currentYear} Powdered by Tech Cloud ERP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer; 