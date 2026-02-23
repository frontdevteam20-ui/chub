
import React from "react";
import Logo from '../assets/logo.png';


function Navbar({ handleLogout }) {
  return (
    <nav className="w-full fixed top-0 left-0 bg-white z-50 shadow flex items-center justify-between px-6 py-3 h-16" >    
      <div className="flex items-center h-full md:hidden" style={ {boxShadow: 'rgba(0, 0, 0, 0.01) -1px 0px 25px 0px inset, rgb(90, 200, 250) -1px -1px 4px, rgb(234, 155, 147) 1px 2px 8px, rgb(240, 246, 251) 0px 2px 16px'}}>
        <img 
          src={Logo} 
          alt="Logo" 
          className="h-20 w-auto"
          style={{ maxHeight: '40px' }}
        />
      </div>
      <div className="hidden md:block"></div> {/* This empty div pushes the logout button to the right on larger screens */}
      <div className="flex gap-2 md:flex hidden">
        <button className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition flex items-center gap-2" onClick={handleLogout}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;