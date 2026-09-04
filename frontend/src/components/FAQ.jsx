import React, { useState, useMemo } from 'react';
import '../styles/FAQ.css'; 


const faqData = [
  {
    category: "General",
    questions: [
      {
        id: 1,
        q: "What is DermaCare AI?",
        a: "DermaCare AI is an AI-powered skin health application that provides general insights and information based on user-provided skin data."
      },
      {
        id: 2,
        q: "What does DermaCare AI do?",
        a: "It analyzes skin information provided by users and generates AI-based general insights and recommendations."
      },
      {
        id: 3,
        q: "Who can use DermaCare AI?",
        a: "Anyone interested in learning more about their skin health. However, it is not a substitute for professional medical advice."
      },
      {
        id: 4,
        q: "How does DermaCare AI work?",
        a: "Users upload or provide skin information, our AI analyzes the data, and generates an analysis report with general observations."
      },
      {
        id: 5,
        q: "What features are available?",
        a: "Key features include AI-powered skin analysis, detailed reports, and the ability to track your skin health over time."
      }
    ]
  },
  {
    category: "AI Skin Analysis",
    questions: [
      {
        id: 6,
        q: "How do I analyze my skin?",
        a: "Simply upload a clear image of your skin concern through the analysis section of the application."
      },
      {
        id: 7,
        q: "What type of image should I upload?",
        a: "Upload a well-lit, clear, and focused image of the skin area you'd like analyzed. Avoid blurry or low-resolution images."
      },
      {
        id: 8,
        q: "How does the AI analyze the image?",
        a: "The AI processes the image using trained models to identify patterns and provide general observations about skin conditions."
      },
      {
        id: 9,
        q: "How long does analysis take?",
        a: "⚠️ Analysis duration is being finalized. This will be confirmed by the project team."
      },
      {
        id: 10,
        q: "What information will I receive?",
        a: "You'll receive a detailed report with AI-generated observations about your skin concern."
      },
      {
        id: 11,
        q: "How accurate is the analysis?",
        a: "⚠️ Accuracy metrics are being finalized by our team. Specific accuracy information will be shared upon confirmation."
      },
      {
        id: 12,
        q: "Will the report show a confidence percentage?",
        a: "⚠️ The team is still evaluating whether to include confidence percentages in the analysis report. This will be confirmed later."
      },
      {
        id: 13,
        q: "What happens if the AI cannot identify the condition?",
        a: "⚠️ The behavior for unidentifiable conditions is being finalized. The project team will confirm the approach."
      }
    ]
  },
  {
    category: "Analysis Report",
    questions: [
      {
        id: 14,
        q: "What is included in the analysis report?",
        a: "⚠️ Report content is being defined by the team. Specific details about what the report includes will be confirmed."
      },
      {
        id: 15,
        q: "What does the AI recommendation mean?",
        a: "AI recommendations are general suggestions based on pattern recognition. They are not medical advice and should not replace professional consultation."
      },
      {
        id: 16,
        q: "Can I save or view my previous reports?",
        a: "⚠️ Report history features are being evaluated. Details about accessing previous reports will be confirmed."
      },
      {
        id: 17,
        q: "Can I use the result to make medical decisions?",
        a: "No. The analysis results are for informational purposes only. Always consult a qualified healthcare professional for medical decisions."
      }
    ]
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        id: 18,
        q: "Is my data safe?",
        a: "⚠️ Data security is a priority. Specific privacy measures and policies will be shared once finalized by our legal team."
      },
      {
        id: 19,
        q: "What happens to my uploaded image?",
        a: "⚠️ Image handling procedures are being finalized. Detailed information about image processing will be provided in the official privacy policy."
      },
      {
        id: 20,
        q: "How is my information used?",
        a: "⚠️ Your information is used solely for analysis purposes. Specific use cases will be outlined in the final privacy policy."
      },
      {
        id: 21,
        q: "Is my image stored?",
        a: "⚠️ Storage policies are being determined. Details about data retention will be provided upon finalization."
      },
      {
        id: 22,
        q: "Who can access my information?",
        a: "⚠️ Access policies are being defined. Official information will be shared when the privacy policy is finalized."
      },
      {
        id: 23,
        q: "Is my information shared with third parties?",
        a: "⚠️ Third-party sharing policies are being finalized. Transparency will be ensured in the official privacy policy."
      },
      {
        id: 24,
        q: "How long is my data retained?",
        a: "⚠️ Data retention periods are being determined. This will be clearly stated in the finalized privacy policy."
      }
    ]
  },
  {
    category: "Safety & Legal",
    questions: [
      {
        id: 25,
        q: "Can DermaCare AI diagnose my skin condition?",
        a: "No. DermaCare AI provides AI-generated information and general insights. It should not be considered a medical diagnosis or a replacement for professional medical advice."
      },
      {
        id: 26,
        q: "Should I consult a dermatologist?",
        a: "Yes. If you have a persistent, painful, severe, or rapidly changing skin concern, you should consult a qualified healthcare professional immediately."
      },
      {
        id: 27,
        q: "Is DermaCare AI FDA approved?",
        a: "⚠️ The regulatory status of DermaCare AI will be confirmed by the project team. Please refer to the official information provided by the application."
      }
    ]
  }
];

const FAQ = () => {
  // ========== STATE MANAGEMENT ==========
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState([]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = faqData.map(item => item.category);
    return ['All', ...cats];
  }, []);

  // Filter by category and search
  const filteredQuestions = useMemo(() => {
    return faqData
      .filter(categoryGroup => {
        if (activeCategory === 'All') return true;
        return categoryGroup.category === activeCategory;
      })
      .map(categoryGroup => ({
        ...categoryGroup,
        questions: categoryGroup.questions.filter(q => 
          q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
      .filter(categoryGroup => categoryGroup.questions.length > 0);
  }, [activeCategory, searchTerm]); 

  // ========== HANDLERS ==========
  const toggleAccordion = (id) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setOpenItems([]); // Close all open items when changing category
  };

  // ========== RENDER ==========
  return (
    <div className="faq-container">
      {/* Header */}
      <div className="faq-header">
        <span className="faq-badge">FAQ</span>
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <p className="faq-subtitle">
          Find answers about DermaCare AI, skin analysis, privacy, and more.
        </p>
      </div>

      {/* Search Bar */}
      <div className="faq-search-wrapper">
        <input
          type="text"
          placeholder="🔍 Search frequently asked questions..."
          className="faq-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search FAQ"
        />
        {searchTerm && (
          <button
            className="faq-search-clear"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="faq-categories" role="tablist" aria-label="FAQ Categories">
        {categories.map(category => (
          <button
            key={category}
            className={`faq-category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
            role="tab"
            aria-selected={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="faq-accordion">
        {filteredQuestions.length === 0 ? (
          <p className="faq-no-results">No questions found. Try a different search term.</p>
        ) : (
          filteredQuestions.map((categoryGroup) => (
            <div key={categoryGroup.category} className="faq-category-group">
              {activeCategory === 'All' && (
                <h2 className="faq-category-title">{categoryGroup.category}</h2>
              )}
              {categoryGroup.questions.map((item) => (
                <div key={item.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={openItems.includes(item.id)}
                    aria-controls={`answer-${item.id}`}
                  >
                    <span>{item.q}</span>
                    <span className={`faq-icon ${openItems.includes(item.id) ? 'open' : ''}`}>
                      {openItems.includes(item.id) ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    id={`answer-${item.id}`}
                    className={`faq-answer ${openItems.includes(item.id) ? 'open' : ''}`}
                    role="region"
                    aria-hidden={!openItems.includes(item.id)}
                  >
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Medical Disclaimer */}
      <div className="faq-disclaimer">
        <div className="faq-disclaimer-content">
          <strong>⚠️ Medical Disclaimer</strong>
          <p>
            DermaCare AI provides AI-generated information and general insights. 
            It is <strong>not</strong> a replacement for professional medical advice, 
            diagnosis, or treatment. Always consult a qualified dermatologist or 
            healthcare provider for any skin concerns.
          </p>
          <p className="faq-disclaimer-small">
            Content subject to updates based on project requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;