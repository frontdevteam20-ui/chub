"use client";

import { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import TitleAndDescription from "./TitleAndDescription";
import SectionsForm from "./SectionsForm";
import ContentForm from "./ContentForm";
import TagsForm from "./TagsForm";
import AnchorWordsForm from "./AnchorWordsForm";
import CTASection from "./CTASection";
import FAQsForm from "./FAQsForm";
import ImageUpload from "./ImageUpload";
import MetaKeywordsForm from "./MetaKeywordsForm";

const AddSectionsForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [sections, setSections] = useState([{ sectionName: "section1", data: [{ TopHeading: "", TopIntro: "" }] }]);
  const [content, setContent] = useState([{ title: "", description: [""] }]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [tags, setTags] = useState([]);
  const [anchorWords, setAnchorWords] = useState([{ word: "", href: "" }]);
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [ctaSection, setCtaSection] = useState({ ctaTitle: "", description: "" });
  const [image, setImage] = useState(null);
  
  useEffect(() => {
    if (title) {
      setSlug(title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    } else {
      setSlug("");
    }
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const generatedSlug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!generatedSlug) {
      alert("Slug generation failed.");
      return;
    }

    try {
      await setDoc(doc(db, "blogPosts", generatedSlug), {
        title,
        description,
        slug: generatedSlug,
        createdAt: Timestamp.fromDate(new Date()),
        date: new Date().toISOString().split("T")[0],
        pointsWiseText: sections.reduce((acc, section) => {
          acc[section.sectionName] = section.data;
          return acc;
        }, {}),
        faqSection: { faqTitle: "FAQ'S", faqs },
        contentSection: content,
        ctaSection,
        tagsSection: tags,
        anchorWordsSection: anchorWords,
        metaKeywords
      });

      alert("Data successfully added!");
      setTitle(""); setDescription(""); setSlug(""); setSections([{ sectionName: "section1", data: [{ TopHeading: "", TopIntro: "" }] }]);
      setFaqs([{ question: "", answer: "" }]); setContent([{ title: "", description: [""] }]); setCtaSection({ ctaTitle: "", description: "" });
      setTags([]); setAnchorWords([]); setMetaKeywords([]);

    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding data.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Add Sections Data</h2>
      <form onSubmit={handleSubmit}>
        <TitleAndDescription title={title} setTitle={setTitle} description={description} setDescription={setDescription} slug={slug} />
        <SectionsForm sections={sections} setSections={setSections} />
        <ContentForm content={content} setContent={setContent} />
        <TagsForm tags={tags} setTags={setTags} />
        <AnchorWordsForm anchorWords={anchorWords} setAnchorWords={setAnchorWords} />
        <FAQsForm faqs={faqs} setFaqs={setFaqs} />
        <CTASection ctaSection={ctaSection} setCtaSection={setCtaSection} />
        <MetaKeywordsForm metaKeywords={metaKeywords} setMetaKeywords={setMetaKeywords} />
        <ImageUpload image={image} setImage={setImage} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddSectionsForm;