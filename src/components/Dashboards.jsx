import React from "react";
import Navbar from "./Navbar";
import HamburgerMenu from "./HamburgerMenu";
import Dashboard from "./dashboard/Dashboard";

function Dashboards({ handleLogout, user }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white flex-col">
      <Navbar handleLogout={handleLogout} />
      <div>
      <div className="flex-1 w-full">
        <div className="sm:block">
          <HamburgerMenu handleLogout={handleLogout} user={user} />
        </div>
        
        
        <Dashboard />
      </div>
      </div>
    </div>
  );
}

export default Dashboards;