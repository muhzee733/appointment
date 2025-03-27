"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "What is ProMedicine?",
    answer:
      "ProMedicine is an online medical clinic providing natural treatment care to Australians. We connect patients with highly qualified doctors and nurses experienced in alternative medicine.",
  },
  {
    question: "Who can benefit from ProMedicine's services?",
    answer:
      "Our services are suitable for individuals exploring alternative healthcare options, whether you're new to holistic medicine or have prior experience.",
  },
  {
    question: "What conditions can be treated with alternative medicine?",
    answer:
      "Alternative medicine has been prescribed for more than 140 conditions. Our doctors often assist patients experiencing issues with stress, mental health, pain management, and sleep disorders.",
  },
  {
    question: "How does the consultation process work?",
    answer:
      "30-Second Pre-screening: Complete a simple questionnaire to assess eligibility. Online Consultation: Engage in a two-step telehealth appointment with a nurse and a doctor. Express Delivery: If eligible, receive your plant-based medicine delivered directly to your doorstep.",
  },
  {
    question: "Is the consultation process secure and confidential?",
    answer:
      "Yes, we follow strict privacy and security measures to protect your medical information.",
  },
  {
    question: "How long does the consultation take?",
    answer:
      "The consultation process, including screening and appointments, typically takes less than 24 hours.",
  },
  {
    question: "How do I get started?",
    answer:
      "Visit our website, complete the pre-screening, and schedule your online consultation.",
  },
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(0); // First FAQ is active by default

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-130 faqs" id="faqs">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="text-center pb-0">FAQs</h2>
            <div className="accordion" id="accordionExample">
              {faqs.map((faq, index) => (
                <div key={index} className="accordion-item">
                  <h4 className="accordion-header" id={`heading-${index}`}>
                    <button
                      className={`accordion-button ${activeIndex === index ? "" : "collapsed"}`}
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={activeIndex === index}
                      aria-controls={`collapse-${index}`}
                    >
                      {faq.question}
                    </button>
                  </h4>
                  <div
                    id={`collapse-${index}`}
                    className={`accordion-collapse collapse ${activeIndex === index ? "show" : ""}`}
                    aria-labelledby={`heading-${index}`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
