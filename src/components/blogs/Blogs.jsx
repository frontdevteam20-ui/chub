import HamburgerMenu from "../HamburgerMenu";
import Navbar from "../Navbar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { FaPlus } from 'react-icons/fa';
import { logBlogActivity } from '../../utils/blogActivityLogger';
import BlogStatisticsCards from './BlogStatisticsCards';
import BlogCardView from './BlogCardView';
import BlogTableView from './BlogTableView';
import { DeleteConfirmationModal, SuccessPopup } from './BlogModals';
import BlogPagination from './BlogPagination';

function Blogs({ handleLogout, user }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, orderBy("createdAt", sortOrder));
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toLocaleDateString("en-GB") : "",
            name: data.title || "Untitled Blog",
            ...data
          };
        });
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [sortOrder]);

  useEffect(() => {
    console.log("Effect runs after every render");
  }, []);

  const handleDelete = async (blogId) => {
    setShowDeleteModal(true);
    setBlogToDelete(blogId);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      const blog = blogs.find(b => b.id === blogToDelete);
      await deleteDoc(doc(db, "blogs", blogToDelete));
      await logBlogActivity({ user, action: 'delete', blogId: blogToDelete, blogTitle: blog?.name || '' });
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogToDelete));
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setBlogToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:ml-64">
      {/* Navbar */}
      <Navbar handleLogout={handleLogout} />
      {/* Content below navbar */}
      <div className="flex flex-1 w-full pt-15"> {/* pt-20 for navbar height */}
        {/* Sidebar / Hamburger */}
        <div className="sm:block">
          <HamburgerMenu handleLogout={handleLogout} />
        </div>
        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto p-6 mt-3">
          {/* Statistics Cards */}
          <BlogStatisticsCards blogs={blogs} />

          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Management</h1>
                <p className="text-gray-600">Create, edit, and manage your blog posts</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-2 focus:ring-[#05a7cc] focus:border-[#05a7cc] transition-colors"
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
                <Link
                  to="/blogs/create"
                  className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#05a7cc] to-[#0891b2] hover:from-[#0891b2] hover:to-[#0e7490] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <FaPlus className="w-5 h-5 mr-2" />
                  Create Blog
                </Link>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-10 text-gray-500">Loading blogs...</div>
          ) : (
            <>
              <BlogCardView blogs={blogs} handleDelete={handleDelete} />
              <BlogTableView blogs={blogs} handleDelete={handleDelete} />
            </>
          )}
          <BlogPagination />
          <DeleteConfirmationModal 
            showDeleteModal={showDeleteModal}
            confirmDelete={confirmDelete}
            cancelDelete={cancelDelete}
          />
          <SuccessPopup showSuccessPopup={showSuccessPopup} />
        </div>
      </div>
    </div>
  );
}

export default Blogs; 