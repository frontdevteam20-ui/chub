import { useState } from "react";
// import styles from './Form.module.css';

const MetaKeywordsForm = ({ metaKeywords, setMetaKeywords }) => {
      const [metaKeywordInput, setMetaKeywordInput] = useState("");
    
    const addMetaKeyword = (e) => {
      if (e.key === "Enter" && e.target.value) {
        setMetaKeywords([...metaKeywords, e.target.value]);
        e.target.value = "";
      }
      
    };
    const removeMetaKeyword = (index) => {
        setMetaKeywords(metaKeywords.filter((_, i) => i !== index));
      };
      const addMetaKeywordItem = () => {
        if (metaKeywordInput.trim() !== "") {
          setMetaKeywords([...metaKeywords, metaKeywordInput.trim()]);
          setMetaKeywordInput("");
        }
      };
      
    return (
        <div className="w-full mx-auto p-5 mb-5 rounded-lg bg-white font-sans shadow">
        <h3>Meta Keywords</h3>

        <input
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          type="text"
          placeholder="meta keywords"
          value={metaKeywordInput}
          onChange={(e) => setMetaKeywordInput(e.target.value)}
          onKeyDown={addMetaKeyword} // Enter Key to Add
        />

        {/* Add Button */}
        <button
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-800 transition mt-2"
          type="button"
          onClick={addMetaKeywordItem}
        >
          + Add Meta Keyword
        </button>

        {/* Meta Keywords List */}
        <div className="mt-2">
          {metaKeywords.map((keyword, index) => (
            <span
              key={index}
              className="mr-2 mb-2 px-2 py-1 border border-gray-400 rounded inline-block"
            >
              {keyword} 
              <button
                className="rounded px-2 py-1 border border-orange-200 bg-orange-50 ml-2"
                onClick={() => removeMetaKeyword(index)}
              >
                x
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };
  
  export default MetaKeywordsForm;
  