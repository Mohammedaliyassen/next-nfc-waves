import React, { useState } from 'react';
import './QaComponent.css'; // تأكد من استيراد ملف CSS

const QaComponent = () => {
  const [questions, setQuestions] = useState([
    {
      question: 'What types of services do you offer?',
      answer: 'We offer a wide range of services, including web development, app development, and IT consulting.',
      isOpen: false
    },
    {
      question: 'How can I contact support?',
      answer: 'You can contact our support team via email at waves.devtech@gmail.com or by phone at +201095303755.',
      isOpen: false
    },
    {
      question: 'What are your business hours?',
      answer: 'Our business hours are all days.',
      isOpen: false
    },
    {
      question: 'Do you offer custom solutions?',
      answer: 'Yes, we provide custom solutions tailored to your specific needs. Please contact us to discuss your requirements.',
      isOpen: false
    }
  ]);

  const toggleAnswer = (index) => {
    setQuestions(questions.map((q, i) => {
      if (i === index) {
        q.isOpen = !q.isOpen;
      } else {
        q.isOpen = false;
      }
      return q;
    }));
  };

  return (
    <div className="qa-component">
      {questions.map((q, index) => (
        <div key={index} className="qa-item">
          <h2 className="qa-question" onClick={() => toggleAnswer(index)}>{q.question}</h2>
          <p className={`qa-answer ${q.isOpen ? 'open' : ''}`}>{q.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default QaComponent;
