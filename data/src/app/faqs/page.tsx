'use client'

import React, { useState } from 'react'
import { WavyBackground } from '@/components/ui/wavy-background'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQs() {
  const [openSection, setOpenSection] = useState<number | null>(null)

  const faqData = [
    {
      question: "What is Personally Identifiable Information (PII)?",
      answer: "Personally Identifiable Information (PII) refers to any data that could potentially identify a specific individual. This includes but is not limited to government-issued identification numbers (such as Social Security Numbers, Aadhaar, etc.), financial account information, biometric data, and personal contact information."
    },
    {
      question: "Why is it important to identify and protect PII in documents and data?",
      answer: "Identifying and protecting PII is crucial to prevent unauthorized access, identity theft, and data breaches. Ensuring that PII is secure is not only a legal requirement in many jurisdictions but also a critical part of maintaining trust and protecting the privacy of individuals."
    },
    {
      question: "How does your application detect PII in documents?",
      answer: "Our application uses advanced algorithms and pattern recognition techniques to scan documents and data for common types of PII. It cross-references the detected information against predefined patterns of government-issued identification numbers, names, and other sensitive data."
    },
    {
      question: "Can the application handle various types of documents and data formats?",
      answer: "Yes, our application is designed to process a wide range of document types, including PDFs, Word documents, Excel sheets, and more. It can also analyze structured and unstructured data formats, making it versatile in identifying PII across different sources."
    },
    {
      question: "What actions can be taken once PII is identified in a document?",
      answer: "Once PII is identified, users can choose to mask, redact, or encrypt the sensitive information. The application also provides options for generating reports and logs for audit purposes, ensuring compliance with data protection regulations."
    },
    {
      question: "How does the application ensure the security of the documents processed?",
      answer: "Our application employs encryption protocols during the scanning and processing stages to ensure that all data remains secure. Additionally, we adhere to strict data privacy standards, and no document is stored or shared without explicit user consent."
    },
    {
      question: "Is your application compliant with data protection regulations (e.g., GDPR, CCPA)?",
      answer: "Yes, our application is designed to help organizations comply with various data protection regulations, including GDPR, CCPA, and others. By identifying and managing PII, the application aids in fulfilling legal obligations related to data privacy."
    },
    {
      question: "Who can benefit from using this application?",
      answer: "Organizations across various industries, including healthcare, finance, government, and legal sectors, can benefit from using our application. It is particularly useful for any entity that handles large volumes of sensitive personal data and needs to ensure its protection."
    },
    {
      question: "Can the application be customized to specific organizational needs?",
      answer: "Yes, our application is flexible and can be tailored to meet the specific needs of different organizations. Customization options include defining specific PII patterns, setting up automated scanning schedules, and integrating with existing data management systems."
    },
    {
      question: "What support is available if I encounter issues with the application?",
      answer: "We offer comprehensive support, including a detailed user guide, FAQs, and a dedicated customer service team available via email and phone. Additionally, we provide training sessions and on-demand support for more complex queries or customizations."
    }
  ]

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index)
  }

  return (
    <WavyBackground className="min-h-screen flex flex-col">
      <header className="py-6 bg-black bg-opacity-50 backdrop-blur-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* <Link href="/" className="text-white text-xl font-bold hover:text-gray-200 transition-colors">
            ← Back
          </Link> */}
          <h1 className="text-5xl mx-auto font-bold text-white">FAQs</h1>
          <div className="w-16"></div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 hover:bg-opacity-30"
            >
              <button
                className="w-full text-left p-6 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded-2xl"
                onClick={() => toggleSection(index)}
                aria-expanded={openSection === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h2 className="text-lg font-semibold text-white">{faq.question}</h2>
                {openSection === index ? (
                  <ChevronUp className="w-5 h-5 text-white flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white flex-shrink-0 ml-4" />
                )}
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openSection === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-6 text-white text-opacity-90">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="py-4 bg-black bg-opacity-50 backdrop-blur-md text-center text-white text-sm">
        <p>&copy; 2024 ENIGMA 2.0. All rights reserved.</p>
      </footer>
    </WavyBackground>
  )
}