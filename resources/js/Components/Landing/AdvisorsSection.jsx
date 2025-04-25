export default function AdvisorsSection(props) {
  const testimonies = [
    {
      name: 'Dara Byrne',
      role: 'Google.org',
      image: {
        url: '/advisor-1.jpg',
        alt: 'Dara Byrne',
      },
      quotes: [
        'When you bring data and AI into the mix, you reshape the fundamental way that institutions see these students.',
        "The data itself can't tell us who these students are. But what it can do is tell us a story about their barriers and reveal pathways to unlock their success.",
      ],
    },
    {
      name: 'Hanna Gentry',
      role: 'Student advisor at John Jay College',
      image: {
        url: '/advisor-2.jpg',
        alt: 'Hanna Gentry',
      },
      quotes: [
        "When you bring data and AI into the mix, you reshape the fundamental way that institutions see these students. The data itself can't tell us who these students are.",
        'But what it can do is tell us a story about their barriers and reveal pathways to unlock their success',
      ],
    },
    {
      name: 'Osian Sampson',
      role: 'Student advisor / Institution',
      image: {
        url: '/advisor-3.jpg',
        alt: 'Osian Sampson',
      },
      quotes: [
        'For any institution looking to enhance student advising, improve retention, and create a more personalized support system, Deemia is a must-have.',
        'It bridges the gap between students and advisors, ensuring that no student falls through the cracks.',
      ],
    },
  ];

  return (
    <div className={`landing-advisors-section ${props.className}`}>
      <style>{`
        @media screen and (min-width: 576px) {
          .landing-advisors-section .advisor-section-grid div:nth-child(2) {
            grid-column-start: 8;
          }
          .landing-advisors-section .advisor-section-grid div:nth-child(3) {
            grid-column-start: 15;
          }
        }
      `}</style>
      <div className="layout:grid mb-14 sm:mb-28">
        <div className="col-span-8">
          <p className="type:section-label text-landing-gray mb-9 sm:mb-12">
            Hear from advisors already using Student Success Tool
          </p>
          <h2 className="type:section-title">
            Identify students in need of timely intervention and develop
            personalized success plans
          </h2>
        </div>
      </div>

      <div className="layout:grid advisor-section-grid gap-y-7 sm:gap-y-0">
        {testimonies.map((testimony, index) => (
          <div
            key={testimony.name}
            className="col-span-full items-stretch sm:col-span-6"
          >
            <div className="relative flex h-full flex-col">
              <div className="landing-rounded-md relative z-10 aspect-[396/360] max-h-[400px] w-full overflow-hidden !rounded-b-none">
                {testimony.image.url && (
                  <img
                    src={testimony.image.url}
                    alt={testimony.image.alt}
                    className="w-full object-cover"
                  />
                )}
              </div>
              <div className="landing-rounded-md relative z-40 mt-[-40px] flex-1 bg-[#EEF2F6] p-6 sm:pb-12 sm:pl-7 sm:pr-14 sm:pt-7">
                <div className="mb-6 flex gap-5">
                  <div className="bg-landing-orange flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full">
                    <span className="font-landing-secondary relative top-[4px] text-[28px] leading-none">
                      “
                    </span>
                  </div>
                  <div className="mt-[8px]">
                    <h3 className="mb-1.5 text-[22px] font-light leading-none">
                      {testimony.name}
                    </h3>
                    <p className="text-base font-light leading-none">
                      {testimony.role}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 text-lg text-gray-700">
                  {testimony.quotes.map(quote => (
                    <p
                      key={quote.substring(0, 20)}
                      className="text-[18px] font-light leading-tight text-[#4F4F4F]"
                    >
                      {quote}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
