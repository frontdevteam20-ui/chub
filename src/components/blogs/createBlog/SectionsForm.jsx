import React, { useState } from "react";
import styles from './Form.module.css';

const SectionForm = () => {
  const [sections, setSections] = useState([
    { sectionName: "Section 1", data: [{ TopHeading: "", TopIntro: "" }] },
  ]);

  // Handle input changes
  const handleChange = (sectionIndex, pointIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].data[pointIndex][field] = value;
    setSections(updatedSections);
  };

  // Add a new section
  const addSection = () => {
    setSections([...sections, { sectionName: `Section ${sections.length + 1}`, data: [{ TopHeading: "", TopIntro: "" }] }]);
  };

  // Remove a section
  const removeSection = (sectionIndex) => {
    setSections(sections.filter((_, index) => index !== sectionIndex));
  };

  // Add a new point in a section
  const addPoint = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].data.push({ title: "", description: "" });
    setSections(updatedSections);
  };

  // Remove a specific point from a section
  const removePoint = (sectionIndex, pointIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].data.splice(pointIndex, 1);
    setSections(updatedSections);
  };

  return (
    <div className={styles.formContainer}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={styles.section}>
          <h3>{section.sectionName}</h3>
          
          {/* Section Top Heading */}
          <input className={styles.input}
            type="text"
            placeholder="Section Top Heading"
            value={section.data[0].TopHeading}
            onChange={(e) => handleChange(sectionIndex, 0, "TopHeading", e.target.value)}
            required
          />

          {/* Section Top Intro */}
          <input className={styles.input}
            type="text"
            placeholder="Section Top Intro"
            value={section.data[0].TopIntro}
            onChange={(e) => handleChange(sectionIndex, 0, "TopIntro", e.target.value)}
            required
          />

          {/* Points in the section */}
          {section.data.slice(1).map((point, pointIndex) => (
            <div key={pointIndex} className={styles.point}>
              <input className={styles.input}
                type="text"
                placeholder="Point Title"
                value={point.title}
                onChange={(e) => handleChange(sectionIndex, pointIndex + 1, "title", e.target.value)}
                required
              />
              <input className={styles.input}
                type="text"
                placeholder="Point Description"
                value={point.description}
                onChange={(e) => handleChange(sectionIndex, pointIndex + 1, "description", e.target.value)}
                required
              />
              <button className={styles.crossbutton} type="button" onClick={() => removePoint(sectionIndex, pointIndex + 1)}>
                ❌
              </button>
            </div>
          ))}

          {/* Add Point Button */}
          <button className={styles.addButton} type="button" onClick={() => addPoint(sectionIndex)}>+ Add Point</button>
          
          {/* Add Section Button */}
          <button className={styles.addButton} type="button" onClick={addSection}>+ Add Section</button>
          
          {/* Remove Section Button */}
          <button className={styles.crossbutton} type="button" onClick={() => removeSection(sectionIndex)}>❌</button>
        </div>
      ))}
    </div>
  );
};

export default SectionForm;
  