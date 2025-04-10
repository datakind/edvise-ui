export default function AdvisorsSection(props) {
  const testimonies = [
    {
      name: 'Dara Byrne',
      role: 'Google.org',
      image: {
        url: '/images/advisor-1.png',
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
        url: '/images/advisor-2.png',
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
        url: '/images/advisor-3.png',
        alt: 'Osian Sampson',
      },
      quotes: [
        'For any institution looking to enhance student advising, improve retention, and create a more personalized support system, Deemia is a must-have.',
        'It bridges the gap between students and advisors, ensuring that no student falls through the cracks.',
      ],
    },
  ];

  const colStarts = [1, 8, 15];

  return (
    <div className={`advisors-section ${props.className}`}>
      <div className="layout:grid mb-28">
        <div className="col-span-8">
          <p className="type:section-label mb-12">
            Hear from advisors already using Deemia
          </p>
          <h2 className="type:section-title">
            Identify students in need of timely intervention and{' '}
            <span>develop personalized success plans</span>
          </h2>
        </div>
      </div>

      <div className="layout:grid">
        {testimonies.map((testimony, index) => (
          <div
            key={testimony.name}
            className="col-span-6"
            style={{ gridColumnStart: colStarts[index] }}
          >
            <div className="relative">
              <div className="rounded-t-[40px] overflow-hidden relative z-10 aspect-[396/360] max-h-[400px] w-full">
                {testimony.image.url && (
                  <img
                    src={testimony.image.url}
                    alt={testimony.image.alt}
                    className="w-full object-cover"
                  />
                )}
              </div>
              <div className="mt-[-40px] relative z-40 bg-[#EEF2F6] rounded-[40px] pb-12 pl-7 pt-7 pr-14">
                <div className="flex mb-6 gap-5">
                  <div className="w-[34px] h-[34px] bg-landing-orange rounded-full flex items-center justify-center">
                    <span className="text-[28px] font-secondary leading-none relative top-[4px]">
                      “
                    </span>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-[22px] font-light leading-none mb-1.5">
                      {testimony.name}
                    </h3>
                    <p className="text-base font-light leading-none">
                      {testimony.role}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 text-gray-700 text-lg">
                  {testimony.quotes.map(quote => (
                    <p
                      key={quote.substring(0, 20)}
                      className="font-light text-[18px] text-[#4F4F4F] leading-tight"
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
