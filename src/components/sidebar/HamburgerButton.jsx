import React from 'react';

const HamburgerButton = ({ isOpen, onClick }) => {
  return (
    <button
      className={`fixed top-2 right-4 p-2 focus:outline-none bg-white shadow-lg md:hidden transition-all duration-300 hover:bg-gray-100 active:scale-95 rounded-full w-12 h-12 flex items-center justify-center ${
        isOpen ? 'transform rotate-90' : ''
      }`}
      style={{
        zIndex: 999,
        marginRight: 'env(safe-area-inset-right)'
      }}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      {isOpen ? (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
};

export default HamburgerButton;
