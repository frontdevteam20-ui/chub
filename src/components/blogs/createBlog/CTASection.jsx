// import styles from './Form.module.css';

const CTASection = ({ ctaSection, setCtaSection }) => {

  const handleCtaChange = (index, value) => {
    const updatedDescriptions = [...ctaSection.descriptions];
    updatedDescriptions[index] = value;
    setCtaSection({ ...ctaSection, descriptions: updatedDescriptions });
  };
  
  const removeDescription = (index) => {
    const updatedDescriptions = ctaSection.descriptions.filter((_, i) => i !== index);
    setCtaSection({ ...ctaSection, descriptions: updatedDescriptions });
  };

  const addDescription = () => {
    setCtaSection((prevContent) => {
      const updatedDescriptions = [...(prevContent.descriptions || []), ""]; // Ensure array update
      console.log("Updated descriptions array:", updatedDescriptions); // Debugging
      return {
        ...prevContent,
        descriptions: updatedDescriptions,
      };
    });
  };

  return (
    <div className="w-full mx-auto p-5 mb-5 rounded-lg bg-white font-sans shadow">
      <h3>Conclusion</h3>
      <input
        className="w-full p-2 mb-2 border border-gray-300 rounded"
        type="text"
        placeholder="CTA Title"
        value={ctaSection.ctaTitle}
        onChange={(e) => setCtaSection({ ...ctaSection, ctaTitle: e.target.value })}
        required
      />
      
      {ctaSection.descriptions && ctaSection.descriptions.map((desc, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Description"
            value={desc}
            onChange={(e) => handleCtaChange(index, e.target.value)}
            required
          />
          <button
            className="rounded px-3 py-2 border border-orange-200 bg-orange-50"
            type="button"
            onClick={() => removeDescription(index)}
          >
            ❌
          </button>
        </div>
      ))}

      <button
        className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-800 transition mt-2"
        type="button"
        onClick={addDescription}
      >
        + Add Description
      </button>
    </div>
  );
};

export default CTASection;
  