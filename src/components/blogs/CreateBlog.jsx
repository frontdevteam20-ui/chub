import React from "react";
import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import CreateBlogForm from "./CreateBlogForm";

function CreateBlog({ handleLogout, user }) {
  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      {/* Navbar */}
      <Navbar handleLogout={handleLogout} />
      {/* Content below navbar */}
      <div className="flex flex-1 w-full pt-15">
        {/* Sidebar / Hamburger */}
        <div className="sm:block">
          <HamburgerMenu handleLogout={handleLogout} />
        </div>
        {/* Main Content */}
        <div className="flex-1 max-w-6xl mx-auto flex items-center justify-center">
          <CreateBlogForm user={user} />
        </div>
      </div>
    </div>
  );
}

export default CreateBlog; 