import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdExpandMore } from 'react-icons/md';

const NavDropdown = ({ icon: Icon, label, items, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if any dropdown item is active
  const active = isActive || items.some(item => location.pathname.startsWith(item.to));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`block w-full text-left text-sm font-medium transition py-2 px-3 rounded-lg focus:outline-none ${
          active ? 'font-bold' : 'text-gray-700'
        } flex items-center justify-between`}
        style={{
          color: active ? '#ef5226' : undefined,
          backgroundColor: active ? '#fef2f2' : undefined,
        }}
        onMouseEnter={() => {
          if (!active) {
            document.querySelector(`#${label}-button`).style.color = '#ef5226';
            document.querySelector(`#${label}-button`).style.backgroundColor = '#fef2f2';
          }
        }}
        onMouseLeave={() => {
          if (!active) {
            document.querySelector(`#${label}-button`).style.color = '#374151';
            document.querySelector(`#${label}-button`).style.backgroundColor = 'transparent';
          }
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={(e) => e.preventDefault()}
        id={`${label}-button`}
      >
        <span className="inline-flex items-center gap-2">
          <Icon className="text-xl" style={{ color: '#ef5226' }} /> {label}
        </span>
        <MdExpandMore className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <ul className="ml-6 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className="block py-2 px-3 text-sm text-gray-600 rounded-md transition-colors"
                onMouseEnter={(e) => {
                  e.target.style.color = '#ef5226';
                  e.target.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#4b5563';
                  e.target.style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  setIsOpen(false);
                  if (item.onClick) item.onClick();
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavDropdown;
