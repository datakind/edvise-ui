import Accordion from '@/Components/Landing/Accordion';

export default function Faq({ className }) {
  const faqSections = [
    {
      title: null,
      description: null,
      faqs: [
        {
          question: 'How does the technology works?',
          answer:
            'The Student Success Tool uses predictive analytics to help academic advisors support students more proactively. Below are answers to common questions about how it works and how it fits into existing advising strategies.',
        },
        {
          question: 'What does it do?',
          answer:
            'It helps advisors identify students who may need support and offers insights into why, so they can intervene early and effectively.',
        },
        {
          question: 'How is it different?',
          answer:
            'It predicts future support needs—not just current status—and explains the top reasons behind each student’s risk.',
        },
        {
          question: 'How can advisors use this information?',
          answer:
            'You’ll see a support score (0–1), a "support needed" flag, and five key reasons tailored to each student.',
        },
        {
          question: 'How should I use this information?',
          answer:
            'Use it to prioritize outreach and personalize support, working alongside your existing tools and expertise.',
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
