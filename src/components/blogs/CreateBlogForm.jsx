import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebaseConfig";
import { doc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { logBlogActivity } from '../../utils/blogActivityLogger';
import TitleAndDescription from "./createBlog/TitleAndDescription";
import SectionsForm from "./createBlog/SectionsForm";
import ContentForm from "./createBlog/ContentForm";
import TagsForm from "./createBlog/TagsForm";
import AnchorWordsForm from "./createBlog/AnchorWordsForm";
import CTASection from "./createBlog/CTASection";
import FAQsForm from "./createBlog/FAQsForm";
import ImageUpload from "./createBlog/ImageUpload";
import MetaKeywordsForm from "./createBlog/MetaKeywordsForm";
import { FaEdit, FaPlus, FaSave, FaSpinner, FaFileAlt, FaImage, FaTags, FaQuestionCircle, FaBullhorn, FaKeyboard, FaCheckCircle, FaChevronDown, FaChevronUp, FaEye, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const CreateBlogForm = ({
  mode = "create", // "create" or "edit"
  initialValues = {},
  blogId = null, // slug or id for editing
  onSuccess = () => {},
  user = null,
}) => {
  // Use initial values if provided, otherwise default
  const [title, setTitle] = useState(initialValues.title || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [slug, setSlug] = useState(initialValues.slug || "");
  const [sections, setSections] = useState(initialValues.sections || [{ sectionName: "section1", data: [{ TopHeading: "", TopIntro: "" }] }]);
  const [content, setContent] = useState(initialValues.content || [{ title: "", description: [""] }]);
  const [faqs, setFaqs] = useState(initialValues.faqs || [{ question: "", answer: "" }]);
  const [tags, setTags] = useState(initialValues.tags || []);
  const [anchorWords, setAnchorWords] = useState(initialValues.anchorWords || [{ word: "", href: "" }]);
  const [metaKeywords, setMetaKeywords] = useState(initialValues.metaKeywords || []);
  const [ctaSection, setCtaSection] = useState(initialValues.ctaSection || { ctaTitle: "", descriptions: [] });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [completedSections, setCompletedSections] = useState(new Set());

  useEffect(() => {
    if (title) {
      setSlug(title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    } else {
      setSlug("");
    }
  }, [title]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (title || description) {
        setAutoSaveStatus('Saving...');
        // Simulate auto-save
        setTimeout(() => {
          setAutoSaveStatus('Saved');
          setTimeout(() => setAutoSaveStatus(''), 2000);
        }, 1000);
      }
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [title, description, content, sections]);

  // Form validation
  useEffect(() => {
    const errors = {};
    const completed = new Set();

    if (!title.trim()) errors.title = 'Title is required';
    else completed.add('title');
    
    if (!description.trim()) errors.description = 'Description is required';
    else completed.add('description');
    
    if (sections.length > 0 && sections[0].data[0].TopHeading) completed.add('sections');
    if (content.length > 0 && content[0].title) completed.add('content');
    if (tags.length > 0) completed.add('tags');
    if (faqs.length > 0 && faqs[0].question) completed.add('faqs');
    if (ctaSection.ctaTitle) completed.add('cta');
    if (metaKeywords.length > 0) completed.add('meta');
    if (imageUrl || image) completed.add('image');

    setFormErrors(errors);
    setCompletedSections(completed);
  }, [title, description, sections, content, tags, faqs, ctaSection, metaKeywords, imageUrl, image]);

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getSectionIcon = (sectionId) => {
    return completedSections.has(sectionId) ? 
      <FaCheckCircle className="w-5 h-5 text-green-500" /> : 
      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>;
  };

  const progressPercentage = Math.round((completedSections.size / 9) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const generatedSlug = slug;
    if (!generatedSlug) {
      alert("Slug generation failed.");
      return;
    }
    let finalImageUrl = imageUrl;
    if (image && typeof image !== "string") {
      try {
        setUploading(true);
        const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
        const imageRef = ref(storage, `blogs_images/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        finalImageUrl = await getDownloadURL(imageRef);
        setImageUrl(finalImageUrl);
      } catch (error) {
        alert("Image upload failed. Please try again.");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }
    try {
      setUploading(true);
      const blogData = {
        title,
        description,
        slug: generatedSlug,
        createdAt: Timestamp.fromDate(new Date()),
        pointsWiseText: sections.reduce((acc, section) => {
          acc[section.sectionName] = section.data;
          return acc;
        }, {}),
        faqSection: { faqTitle: "FAQ'S", faqs },
        contentSection: content,
        ctaSection,
        tagsSection: tags,
        anchorWordsSection: anchorWords,
        metaKeywords,
        imageUrl: finalImageUrl || "",
      };
      if (mode === "edit" && blogId) {
        // Update existing blog
        await updateDoc(doc(db, "blogs", blogId), blogData);
        await logBlogActivity({ user, action: 'edit', blogId, blogTitle: title });
        alert("✅ Blog successfully updated!");
      } else {
        // Create new blog
        await setDoc(doc(db, "blogs", generatedSlug), blogData);
        await logBlogActivity({ user, action: 'create', blogId: generatedSlug, blogTitle: title });
        alert("🎉 Blog successfully created!");
        setTitle(""); setDescription(""); setSlug(""); setSections([{ sectionName: "section1", data: [{ TopHeading: "", TopIntro: "" }] }]);
        setFaqs([{ question: "", answer: "" }]); setContent([{ title: "", description: [""] }]); setCtaSection({ ctaTitle: "", descriptions: [] });
        setTags([]); setAnchorWords([]); setMetaKeywords([]); setImage(null); setImageUrl("");
      }
      onSuccess();
    } catch (error) {
      alert(mode === "edit" ? "❌ Error updating blog. Please try again." : "❌ Error creating blog. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-6 px-4 sm:py-12 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {mode === "edit" ? "Edit Blog Post" : "Create New Blog"}
          </h1>
          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-[#05a7cc]">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-[#05a7cc] to-[#0891b2] h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Auto-save Status */}
          {autoSaveStatus && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200">
              {autoSaveStatus === 'Saving...' ? (
                <FaClock className="w-4 h-4 animate-pulse" />
              ) : (
                <FaCheckCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{autoSaveStatus}</span>
            </div>
          )}
          
          {/* Preview Toggle */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <FaEye className="w-4 h-4" />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="space-y-8">
              {/* Title & Description Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 overflow-hidden">
                <div 
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-blue-100/50 transition-colors"
                  onClick={() => toggleSection('title')}
                >
                  <div className="flex items-center">
                    {getSectionIcon('title')}
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-3">
                      <FaFileAlt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Title & Description</h3>
                      {formErrors.title && (
                        <div className="flex items-center gap-1 mt-1">
                          <FaExclamationTriangle className="w-3 h-3 text-red-500" />
                          <span className="text-sm text-red-600">{formErrors.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {collapsedSections.title ? <FaChevronDown className="w-5 h-5 text-gray-500" /> : <FaChevronUp className="w-5 h-5 text-gray-500" />}
                </div>
                {!collapsedSections.title && (
                  <div className="px-6 pb-6">
                    <TitleAndDescription title={title} setTitle={setTitle} description={description} setDescription={setDescription} />
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <span>Title: {title.length}/100 characters</span>
                      <span>Description: {description.length}/300 characters</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sections */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-green-100/50 transition-colors"
                    onClick={() => toggleSection('sections')}
                  >
                    <div className="flex items-center">
                      {getSectionIcon('sections')}
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mx-3">
                        <FaFileAlt className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Sections</h3>
                    </div>
                    {collapsedSections.sections ? <FaChevronDown className="w-5 h-5 text-gray-500" /> : <FaChevronUp className="w-5 h-5 text-gray-500" />}
                  </div>
                  {!collapsedSections.sections && (
                    <div className="px-6 pb-6">
                      <SectionsForm sections={sections} setSections={setSections} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-purple-100/50 transition-colors"
                    onClick={() => toggleSection('content')}
                  >
                    <div className="flex items-center">
                      {getSectionIcon('content')}
                      <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mx-3">
                        <FaKeyboard className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Content</h3>
                    </div>
                    {collapsedSections.content ? <FaChevronDown className="w-5 h-5 text-gray-500" /> : <FaChevronUp className="w-5 h-5 text-gray-500" />}
                  </div>
                  {!collapsedSections.content && (
                    <div className="px-6 pb-6">
                      <ContentForm content={content} setContent={setContent} />
                    </div>
                  )}
                </div>
              </div>

              {/* Tags & Anchor Words */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-orange-100/50 transition-colors"
                    onClick={() => toggleSection('tags')}
                  >
                    <div className="flex items-center">
                      {getSectionIcon('tags')}
                      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mx-3">
                        <FaTags className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Tags ({tags.length})</h3>
                    </div>
                    {collapsedSections.tags ? <FaChevronDown className="w-5 h-5 text-gray-500" /> : <FaChevronUp className="w-5 h-5 text-gray-500" />}
                  </div>
                  {!collapsedSections.tags && (
                    <div className="px-6 pb-6">
                      <TagsForm tags={tags} setTags={setTags} />
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-teal-100/50 transition-colors"
                    onClick={() => toggleSection('anchor')}
                  >
                    <div className="flex items-center">
                      {getSectionIcon('anchor')}
                      <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mx-3">
                        <FaKeyboard className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Anchor Words ({anchorWords.length})</h3>
                    </div>
                    {collapsedSections.anchor ? <FaChevronDown className="w-5 h-5 text-gray-500" /> : <FaChevronUp className="w-5 h-5 text-gray-500" />}
                  </div>
                  {!collapsedSections.anchor && (
                    <div className="px-6 pb-6">
                      <AnchorWordsForm anchorWords={anchorWords} setAnchorWords={setAnchorWords} />
                    </div>
                  )}
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100 overflow-hidden">
                <div 
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-yellow-100/50 transition-colors"
                  onClick={() => toggleSection('faqs')}
                >
                  <div className="flex items-center">
                    {getSectionIcon('faqs')}
                    <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center mx-3">
                      <FaQuestionCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">FAQs ({faqs.length})</h3>
                  </div>
                  {collapsedSections.faqs ? <FaChevronDown className="w-5 h-5 text-gray-500" /> : <FaChevronUp className="w-5 h-5 text-gray-500" />}
                </div>
                {!collapsedSections.faqs && (
                  <div className="px-6 pb-6">
                    <FAQsForm faqs={faqs} setFaqs={setFaqs} />
                  </div>
                )}
              </div>

              {/* CTA & Meta Keywords */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-pink-100/50 transition-colors"
                    onClick={() => toggleSection('cta')}
                  >
                    <div className="flex items-center">
                      {getSectionIcon('cta')}
                      <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center mx-3">
                        <FaBullhorn className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Call To Action</h3>
                    </div>
                    {collapsedSections.cta ? <FaChevronDown className="w-5 h-5 text-gray-500" /> : <FaChevronUp className="w-5 h-5 text-gray-500" />}
                  </div>
                  {!collapsedSections.cta && (
                    <div className="px-6 pb-6">
                      <CTASection ctaSection={ctaSection} setCtaSection={setCtaSection} />
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-indigo-100/50 transition-colors"
                    onClick={() => toggleSection('meta')}
                  >
                    <div className="flex items-center">
                      {getSectionIcon('meta')}
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center mx-3">
                        <FaTags className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Meta Keywords ({metaKeywords.length})</h3>
                    </div>
                    {collapsedSections.meta ? <FaChevronDown className="w-5 h-5 text-gray-500" /> : <FaChevronUp className="w-5 h-5 text-gray-500" />}
                  </div>
                  {!collapsedSections.meta && (
                    <div className="px-6 pb-6">
                      <MetaKeywordsForm metaKeywords={metaKeywords} setMetaKeywords={setMetaKeywords} />
                    </div>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200 overflow-hidden">
                <div 
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100/50 transition-colors"
                  onClick={() => toggleSection('image')}
                >
                  <div className="flex items-center">
                    {getSectionIcon('image')}
                    <div className="w-10 h-10 bg-gray-500 rounded-xl flex items-center justify-center mx-3">
                      <FaImage className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Featured Image</h3>
                  </div>
                  {collapsedSections.image ? <FaChevronDown className="w-5 h-5 text-gray-500" /> : <FaChevronUp className="w-5 h-5 text-gray-500" />}
                </div>
                {!collapsedSections.image && (
                  <div className="px-6 pb-6">
                    <ImageUpload image={image} setImage={setImage} />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-12 flex justify-center">
              <button
                type="submit"
                className={`group relative px-12 py-4 bg-gradient-to-r from-[#05a7cc] to-[#0891b2] hover:from-[#0891b2] hover:to-[#0e7490] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 min-w-[200px] ${uploading ? 'animate-pulse' : ''}`}
                disabled={uploading}
              >
                {uploading ? (
                  <FaSpinner className="w-5 h-5 animate-spin" />
                ) : (
                  <FaSave className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-lg">
                  {uploading 
                    ? (mode === "edit" ? "Updating..." : "Creating...") 
                    : (mode === "edit" ? "Update Blog" : "Create Blog")
                  }
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogForm; 