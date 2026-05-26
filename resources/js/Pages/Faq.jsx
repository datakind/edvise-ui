import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

const FAQ = () => {
  const [expanded, setExpanded] = useState(null);

  const faqs = [
    {
      category: 'Category 1',
      items: [
        {
          question: 'Question 1.1',
          answer: 'Answer 1.1',
        },
        {
          question: 'Question 1.2',
          answer: 'Answer 1.2',
        },
      ],
    },
    {
      category: 'Category 2',
      items: [
        {
          question: 'Question 2.1',
          answer: 'Answer 2.1',
        },
      ],
    },
  ];

  const toggleExpand = index => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <AppLayout title="FAQ">
      <div className="mx-auto my-12 flex w-full p-24">
        <div className="prose-xl">
          <h2 className="text-header">FAQ</h2>
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="my-8">
              <h2 className="text-subheader">{section.category}</h2>
              {section.items.map((item, itemIndex) => {
                const isExpanded = expanded === `${sectionIndex}-${itemIndex}`;
                return (
                  <div key={itemIndex} className="mt-4">
                    <div
                      onClick={() =>
                        toggleExpand(`${sectionIndex}-${itemIndex}`)
                      }
                      className="text-subheader flex cursor-pointer items-center gap-2 text-xl font-semibold"
                    >
                      {isExpanded ? (
                        <MinusIcon className="h-5 w-5" />
                      ) : (
                        <PlusIcon className="h-5 w-5" />
                      )}
                      <span>{item.question}</span>
                    </div>
                    {isExpanded && (
                      <p className="mt-2 ml-8 text-lg text-gray-700">
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default FAQ;
