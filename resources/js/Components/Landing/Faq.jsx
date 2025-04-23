import Accordion from '@/Components/Landing/Accordion';

export default function Faq({ className }) {
  const faqSections = [
    {
      title: 'How the technology works',
      description: 'A short introduction to the questions in this section',
      faqs: [
        {
          question: 'What technology is behind SST?',
          answer:
            'Student-Success-Tool is a data-assisted advising product to help schools identify the students, programs and opportunities to increase graduation rates.',
        },
        {
          question: 'What technology is behind SST?',
          answer:
            'Student-Success-Tool is a data-assisted advising product to help schools identify the students, programs and opportunities to increase graduation rates.',
        },
        {
          question: 'What technology is behind SST?',
          answer:
            'Student-Success-Tool is a data-assisted advising product to help schools identify the students, programs and opportunities to increase graduation rates.',
        },
        {
          question: 'What technology is behind SST?',
          answer:
            'Student-Success-Tool is a data-assisted advising product to help schools identify the students, programs and opportunities to increase graduation rates.',
        },
      ],
    },
    {
      title: 'How the data works',
      description: 'A short introduction to the questions in this section',
      faqs: [
        {
          question: 'What technology is behind SST?',
          answer:
            'Student-Success-Tool is a data-assisted advising product to help schools identify the students, programs and opportunities to increase graduation rates.',
        },
        {
          question: 'What technology is behind SST?',
          answer:
            'Student-Success-Tool is a data-assisted advising product to help schools identify the students, programs and opportunities to increase graduation rates.',
        },
        {
          question: 'What technology is behind SST?',
          answer:
            'Student-Success-Tool is a data-assisted advising product to help schools identify the students, programs and opportunities to increase graduation rates.',
        },
      ],
    },
  ];

  return (
    <section className={className}>
      <div className="layout:grid">
        <div className="col-span-14">
          <p className="type:section-label mb-9 sm:mb-12">FAQ</p>
          <div className="w-full space-y-16 sm:space-y-32">
            {faqSections.map(section => (
              <div key={section.title} className="w-full">
                <h3 className="type:section-title mb-7 sm:mb-10">
                  {section.title}
                </h3>
                <p className="mb-8 text-base font-light leading-[120%] sm:mb-16">
                  {section.description}
                </p>
                <div className="space-y-5">
                  {section.faqs.map((faq, index) => (
                    <div key={faq.question + `-${index}`}>
                      <Accordion />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
