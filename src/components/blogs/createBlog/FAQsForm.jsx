import styles from './Form.module.css';

const FAQsForm = ({ faqs = [], setFaqs }) => {

  console.log("Rendered with faqs:", faqs); // Debugging log

  // Handle FAQ question change
  const handleFaqChange = (index, field, value) => {
    setFaqs((prev) => {
      const updatedFaqs = [...prev];
      updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
      console.log("Updated faqs after editing:", updatedFaqs);
      return updatedFaqs;
    });
  };

  // Handle FAQ answer change
  const handleAnswerChange = (faqIndex, answerIndex, value) => {
    setFaqs((prev) => {
      const updatedFaqs = [...prev];
      if (!updatedFaqs[faqIndex].answers) {
        updatedFaqs[faqIndex].answers = [];
      }
      updatedFaqs[faqIndex].answers[answerIndex] = value;
      console.log("Updated faqs after editing answer:", updatedFaqs);
      return updatedFaqs;
    });
  };

  // Add new FAQ
  const addFaq = () => {
    setFaqs((prev) => [...prev, { question: "", title: "", description: "", answers: [""] }]);
  };

  // Remove a FAQ
  const removeFaq = (index) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  // Add new answer to a FAQ
  const addAnswer = (faqIndex) => {
    setFaqs((prev) => {
      return prev.map((faq, idx) => {
        if (idx !== faqIndex) return faq;
        const answers = Array.isArray(faq.answers) ? [...faq.answers, ""] : [""];
        return { ...faq, answers };
      });
    });
  };

  // Remove an answer from a FAQ
  const removeAnswer = (faqIndex, answerIndex) => {
    setFaqs((prev) => {
      const updatedFaqs = [...prev];
      updatedFaqs[faqIndex].answers.splice(answerIndex, 1);
      // If no answers left, remove the entire FAQ
      if (updatedFaqs[faqIndex].answers.length === 0) {
        updatedFaqs.splice(faqIndex, 1);
      }
      return updatedFaqs;
    });
  };

  return (
    <div className={styles.section}>
      <h3>Key Features</h3>

      {faqs.length > 0 ? (
        faqs.map((faq, faqIndex) => (
          <div key={faqIndex} className={styles.section}>
            <input
              className={styles.input}
              type="text"
              placeholder="Main Title"
              value={faq.question}
              onChange={(e) => handleFaqChange(faqIndex, "question", e.target.value)}
              required
              style={{ width: "100%", marginBottom: "5px" }}
            />
            <textarea
              className={styles.input}
              placeholder="Description"
              value={faq.description || ""}
              onChange={(e) => handleFaqChange(faqIndex, "description", e.target.value)}
              required
              style={{ width: "100%", marginBottom: "10px", minHeight: "60px", resize: "vertical" }}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Sub Title"
              value={faq.title || ""}
              onChange={(e) => handleFaqChange(faqIndex, "title", e.target.value)}
              required
              style={{ width: "100%", marginBottom: "5px" }}
            />
            
            
            {/* Multiple Answers Section */}
            <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
              <h4 style={{ fontSize: "14px", marginBottom: "5px" }}>Points:</h4>
              {faq.answers && faq.answers.length > 0 ? (
                faq.answers.map((answer, answerIndex) => (
                  <div key={answerIndex} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder={`Point ${answerIndex + 1}`}
                      value={answer}
                      onChange={(e) => handleAnswerChange(faqIndex, answerIndex, e.target.value)}
                      required
                      style={{ flex: 1, marginRight: "5px" }}
                    />
                    <button
                      className={styles.crossbutton}
                      onClick={() => removeAnswer(faqIndex, answerIndex)}
                      style={{ marginLeft: "5px" }}
                    >
                      ❌
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "12px", color: "#666" }}>No answers added for this question.</p>
              )}
              
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); addAnswer(faqIndex); }} 
                className={styles.addButton}
                style={{ fontSize: "12px", padding: "5px 10px", marginTop: "5px" }}
              >
                + Add Answer
              </button>
            </div>

            <button
              className={styles.crossbutton}
              onClick={() => removeFaq(faqIndex)}
              style={{ marginTop: "10px" }}
            >
              ❌ Remove FAQ
            </button>
          </div>
        ))
      ) : (
        <p>No FAQs added.</p> // Fallback when faqs is empty
      )}

      <button type="button" onClick={addFaq} className={styles.addButton}>
        + Add FAQ
      </button>
    </div>
  );
};

export default FAQsForm;