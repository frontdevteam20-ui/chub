import React from "react";
// import styles from "./Form.module.css";

const AnchorWordsForm = ({ anchorWords = [], setAnchorWords }) => {
  // ✅ Add a new anchor word directly
  const addAnchorWord = () => {
    setAnchorWords((prev) => [...prev, { word: "", href: "" }]);
  };

  // ✅ Remove an anchor word directly
  const removeAnchorWord = (index) => {
    setAnchorWords((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Update anchor words in parent state directly on change
  const handleAnchorWordChange = (index, field, value) => {
    setAnchorWords((prev) => {
      const updatedWords = [...prev];
      updatedWords[index] = { ...updatedWords[index], [field]: value };
      return updatedWords;
    });
  };

  return (
    <div className="w-full mx-auto p-5 mb-5 rounded-lg bg-white font-sans shadow">
      <h3>Anchor Words</h3>
      {anchorWords.length > 0 ? (
        anchorWords.map((item, index) => (
          <div key={index} className="w-full mx-auto p-5 mb-5 rounded-lg bg-white font-sans shadow">
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="text"
              placeholder="Anchor Word"
              value={item.word}
              onChange={(e) => handleAnchorWordChange(index, "word", e.target.value)}
              required
            />
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="text"
              placeholder="Href (URL)"
              value={item.href}
              onChange={(e) => handleAnchorWordChange(index, "href", e.target.value)}
              required
            />
            <button
              className="rounded px-3 py-2 border border-orange-200 bg-orange-50"
              onClick={() => removeAnchorWord(index)}
            >
              ❌
            </button>
          </div>
        ))
      ) : (
        <p>No anchor words added yet.</p>
      )}
      <button
        className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-800 transition mt-2"
        type="button"
        onClick={addAnchorWord}
      >
        + Add Anchor Word
      </button>
    </div>
  );
};

export default AnchorWordsForm;