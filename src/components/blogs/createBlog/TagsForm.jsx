import { useState } from "react";

const TagsForm = ({ tags = [], setTags }) => {
  const [tagInput, setTagInput] = useState("");

  // ✅ Add tags dynamically
  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const addTagItem = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // ✅ Remove a tag
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full p-5 mb-5 rounded-lg bg-white font-sans shadow-[0_0_10px_0_rgba(252,226,219,1)]">
      <h3 className="text-lg font-semibold mb-4">Tags</h3>
      <input
        className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        type="text"
        placeholder="Enter tags..."
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={addTag}
      />

      {/* Add Button */}
      <button
        type="button"
        className="bg-[#05A7CC] text-white px-4 py-2.5 rounded-md cursor-pointer hover:bg-[#005f79] transition-colors duration-200"
        onClick={addTagItem}
      >
        + Add tag
      </button>

      {/* Tags List */}
      <div className="mt-2.5 w-full">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 w-full">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-400 rounded-md bg-gray-50"
              >
                <span className="text-sm">{tag}</span>
                <button
                  className="rounded px-2 py-1 border border-[#FAC5B7] bg-[#FDEEE9] text-gray-600 hover:bg-[#FCE2DB] transition-colors duration-200 text-xs font-medium"
                  onClick={() => removeTag(index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No tags added yet</p>
        )}
      </div>
    </div>
  );
};

export default TagsForm;