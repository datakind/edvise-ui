import Accordion from '@/Components/Landing/Accordion';

export default function Faq({ className }) {
  const faqSections = [
    {
      title: null,
      description: null,
      faqs: [
        {
          question: 'What is Edvise?',
          answer:
            'Edvise is an AI-powered platform that helps advisors identify students who may need support - and why - so they can take timely, informed action.',
        },
        {
          question: 'How does it work?',
          answer:
            'Edvise uses predictive analytics to analyze student data and flag those who may be at risk. It highlights key factors driving each prediction to help focus support efforts where they’re needed most.',
        },
        {
          question: 'What makes Edvise different?',
          answer:
            'Most tools report on what has already happened. Edvise looks ahead, predicting which students may need support and why, enabling earlier, more proactive interventions.',
        },
        {
          question: 'What appears in Edvise?',
          answer:
            'An easy-to-read dashboard showing each student’s support score, a “support needed” flag, and the top reasons behind predicted needs, making it easier to prioritize outreach and tailor support. Edvise complements existing advising tools and workflows.',
        },
        {
          question: 'Is student data protected?',
          answer:
            'Yes. Edvise operates on a “Secure By Design” infrastructure aligned with FERPA. In most cases, predictions are generated from de-identified data, which schools re-identify internally, keeping sensitive student information safe.',
        },
      ],
    },
  ];

  return (
    <section className={className}>
      <div className="layout:grid">
        <div className="col-span-14">
          <p className="type:section-label mb-9 sm:mb-12">FAQ</p>
          <h2 className="type:section-title mb-4">
            How Edvise works—and how it supports you.
          </h2>
          <div className="mb-4 mb-9 text-[#4f4f4f] sm:mb-12">
            Get quick answers about how Edvise fits into your advising workflow,
            what it does, and how it protects student data.
          </div>
          <div className="w-full space-y-16 sm:space-y-32">
            {faqSections.map(section => (
              <div key={section.title} className="w-full">
                <h3 className="type:section-title mb-7 sm:mb-10">
                  {section.title}
                </h3>
                <p className="relative mb-8 text-base font-light leading-[120%] sm:mb-16">
                  {section.description}
                </p>
                <div className="space-y-5">
                  {section.faqs.map((faq, index) => (
                    <div key={faq.question + `-${index}`}>
                      <Accordion title={faq.question}>
                        <p className="font-light tb:text-[20px]">
                          {faq.answer}
                        </p>
                      </Accordion>
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
