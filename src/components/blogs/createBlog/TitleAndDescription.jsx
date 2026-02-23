import { useState, useEffect } from "react";
import styles from './Form.module.css';

const TitleAndDescription = ({ title, setTitle, description, setDescription }) => {
  const [slug, setSlug] = useState("");
  const [descriptionPoints, setDescriptionPoints] = useState([""]);

  useEffect(() => {
    if (title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/[^a-z0-9-]/g, "") // Remove special characters
      );
    } else {
      setSlug("");
    }
  }, [title]);

  // Update the main description when description points change
  useEffect(() => {
    const combinedDescription = descriptionPoints.filter(point => point.trim() !== "").join("\n");
    setDescription(combinedDescription);
  }, [descriptionPoints, setDescription]);

  const addDescriptionPoint = () => {
    setDescriptionPoints([...descriptionPoints, ""]);
  };

  const removeDescriptionPoint = (index) => {
    if (descriptionPoints.length > 1) {
      const newPoints = descriptionPoints.filter((_, i) => i !== index);
      setDescriptionPoints(newPoints);
    }
  };

  const updateDescriptionPoint = (index, value) => {
    const newPoints = [...descriptionPoints];
    newPoints[index] = value;
    setDescriptionPoints(newPoints);
  };

  return (
    <div className={styles.section}>
      <input className={styles.input}
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* Description Points Section */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Description Points ({descriptionPoints.length}):
        </label>
        
        {descriptionPoints.map((point, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "5px", gap: "5px" }}>
            <input 
              className={styles.input}
              placeholder={`Description point ${index + 1}`}
              value={point}
              onChange={(e) => updateDescriptionPoint(index, e.target.value)}
              style={{ flex: 1 }}
            />
            {descriptionPoints.length > 1 && (
              <button
                type="button"
                onClick={() => removeDescriptionPoint(index)}
                className={styles.crossbutton}
              >
               ❌

              </button>


            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={addDescriptionPoint}
         className={styles.addButton}
        >
          + Add Description Point
        </button>
      </div>

      <div>
        <label>Slug (Auto-generated):</label>
        <input type="text" value={slug} readOnly className={styles.input} />
      </div>
    </div>
  );
};

export default TitleAndDescription;