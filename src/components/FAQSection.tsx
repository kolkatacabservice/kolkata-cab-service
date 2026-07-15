'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
}

export default function FAQSection({ faqs, title = 'Frequently Asked Questions' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-16" id="faq-section">
      <div className="text-center mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 rounded-full text-amber-800 text-sm font-medium mb-3">
          <HelpCircle size={14} /> FAQs
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-secondary text-balance">{title}</h2>
      </div>
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`rounded-xl overflow-hidden transition-all duration-300 ${
              openIndex === i
                ? 'bg-white shadow-lg shadow-primary/5 border-2 border-primary/20'
                : 'bg-white border border-gray-200 hover:border-primary/30 hover:shadow-md'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors"
              aria-expanded={openIndex === i}
            >
              <div className="flex items-start gap-3 pr-4">
                <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                  openIndex === i ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {i + 1}
                </span>
                <span className={`font-semibold text-sm md:text-base transition-colors ${
                  openIndex === i ? 'text-primary' : 'text-secondary'
                }`}>{faq.question}</span>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all ${
                openIndex === i ? 'bg-primary/10 rotate-180' : 'bg-gray-100'
              }`}>
                <ChevronDown size={16} className={`transition-colors ${openIndex === i ? 'text-primary' : 'text-gray-400'}`} />
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 md:px-5 pb-4 md:pb-5 pl-14 md:pl-16">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Helper to generate FAQ schema - used server-side
export function generateFaqSchemaData(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
