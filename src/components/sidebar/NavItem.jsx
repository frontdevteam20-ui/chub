import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, icon: Icon, label, onClick, isActive }) => {
  const location = useLocation();
  const active = isActive || location.pathname.startsWith(to);
  
  return (
    <Link
      to={to}
      className={`block text-sm font-medium transition py-2 px-3 rounded-lg focus:outline-none ${
        active ? 'font-bold' : 'text-gray-700'
      }`}
      style={{
        color: active ? '#ef5226' : undefined,
        backgroundColor: active ? '#fef2f2' : undefined,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.target.style.color = '#ef5226';
          e.target.style.backgroundColor = '#fef2f2';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.target.style.color = '#374151';
          e.target.style.backgroundColor = 'transparent';
        }
      }}
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="text-xl" style={{ color: '#ef5226' }} /> {label}
      </span>
    </Link>
  );
};

export default NavItem;
