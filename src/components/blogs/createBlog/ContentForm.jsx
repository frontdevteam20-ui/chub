// import styles from "./Form.module.css";

const ContentForm = ({ content = [], setContent }) => {
  // Handle title change
  const handleContentChange = (index, field, value) => {
    setContent((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent[index] = { ...updatedContent[index], [field]: value };
      console.log("Updated Content:", updatedContent); // Debugging
      return updatedContent;
    });
  };

  // Handle description change for a specific point
  const handleDescriptionChange = (contentIndex, descIndex, value) => {
    setContent((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent[contentIndex].description[descIndex] = value;
      console.log("Updated Content:", updatedContent);
      return updatedContent;
    });
  };

  // Add a new description point inside a content section
  const addDescriptionPoint = (contentIndex) => {
    setContent((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent[contentIndex] = {
        ...updatedContent[contentIndex],
        description: [...updatedContent[contentIndex].description, ""],
      };
      console.log("Updated Content:", updatedContent);
      return updatedContent;
    });
  };

  // Remove a description point
  const removeDescriptionPoint = (contentIndex, descIndex) => {
    setContent((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent[contentIndex] = {
        ...updatedContent[contentIndex],
        description: updatedContent[contentIndex].description.filter(
          (_, i) => i !== descIndex
        ),
      };
      console.log("Updated Content:", updatedContent);
      return updatedContent;
    });
  };

  // Add a new content section
  const addContentItem = () => {
    setContent((prevContent) => {
      const updatedContent = [
        ...prevContent,
        { title: "", description: [""] },
      ];
      console.log("Updated Content:", updatedContent);
      return updatedContent;
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-5 mb-5 rounded-lg bg-white font-sans shadow">
      <h3>Content Section</h3>

      {/* Ensure content is an array before mapping */}
      {Array.isArray(content) && content.length > 0 ? (
        content.map((item, contentIndex) => (
          <div key={contentIndex}>
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="text"
              placeholder="Content Title"
              value={item.title}
              onChange={(e) =>
                handleContentChange(contentIndex, "title", e.target.value)
              }
              required
            />

            {Array.isArray(item.description) &&
              item.description.map((desc, descIndex) => (
                <div
                  key={descIndex}
                  className="flex items-center gap-2 mb-2"
                >
                  <input
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    placeholder={`Description Point ${descIndex + 1}`}
                    value={desc}
                    onChange={(e) =>
                      handleDescriptionChange(contentIndex, descIndex, e.target.value)
                    }
                    required
                  />
                  <button
                    className="rounded px-3 py-2 border border-orange-200 bg-orange-50"
                    type="button"
                    onClick={() =>
                      removeDescriptionPoint(contentIndex, descIndex)
                    }
                  >
                    ❌
                  </button>
                </div>
              ))}

            <button
              className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-800 transition mr-2"
              type="button"
              onClick={() => addDescriptionPoint(contentIndex)}
            >
              + Add Description Point
            </button>
          </div>
        ))
      ) : (
        <p>No content added yet.</p>
      )}

      <button
        style={{ marginTop: "10px" }}
        className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-800 transition mt-2"
        type="button"
        onClick={addContentItem}
      >
        + Add Content
      </button>
    </div>
  );
};

export default ContentForm;
