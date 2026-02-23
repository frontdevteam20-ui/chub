import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import CreateBlogForm from "./CreateBlogForm";
import { db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function EditBlog({ handleLogout, blogId, user }) {
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      try {
        const docRef = doc(db, "blogs", blogId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInitialValues({
            title: data.title || "",
            description: data.description || "",
            slug: data.slug || "",
            sections: data.pointsWiseText
              ? Object.entries(data.pointsWiseText).map(([sectionName, dataArr]) => ({ sectionName, data: dataArr }))
              : [{ sectionName: "section1", data: [{ TopHeading: "", TopIntro: "" }] }],
            content: data.contentSection || [{ title: "", description: [""] }],
            faqs: data.faqSection?.faqs || [{ question: "", answer: "" }],
            tags: data.tagsSection || [],
            anchorWords: data.anchorWordsSection || [{ word: "", href: "" }],
            metaKeywords: data.metaKeywords || [],
            ctaSection: data.ctaSection || { ctaTitle: "", descriptions: [] },
            imageUrl: data.imageUrl || "",
          });
        } else {
          alert("Blog not found");
        }
      } catch (err) {
        alert("Failed to fetch blog data");
      } finally {
        setLoading(false);
      }
    }
    if (blogId) fetchBlog();
  }, [blogId]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!initialValues) return <div className="flex items-center justify-center h-screen">Blog not found.</div>;

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
          <CreateBlogForm mode="edit" initialValues={initialValues} blogId={blogId} user={user} />
        </div>
      </div>
    </div>
  );
}

export default EditBlog; 