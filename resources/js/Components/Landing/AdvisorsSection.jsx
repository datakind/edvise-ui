export default function AdvisorsSection(props) {
  const testimonies = [
    {
      name: 'Dara Byrne',
      role: 'Google.org',
      image: {
        url: '/images/landing/advisor-1.png',
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
        url: '/images/landing/advisor-2.png',
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
        url: '/images/landing/advisor-3.png',
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
              <div className="relative z-10 aspect-[396/360] max-h-[400px] w-full overflow-hidden rounded-t-[40px]">
                {testimony.image.url && (
                  <img
                    src={testimony.image.url}
                    alt={testimony.image.alt}
                    className="w-full object-cover"
                  />
                )}
              </div>
              <div className="relative z-40 mt-[-40px] rounded-[40px] bg-[#EEF2F6] pb-12 pl-7 pr-14 pt-7">
                <div className="mb-6 flex gap-5">
                  <div className="bg-landing-orange flex h-[34px] w-[34px] items-center justify-center rounded-full">
                    <span className="font-secondary relative top-[4px] text-[28px] leading-none">
                      “
                    </span>
                  </div>
                  <div className="mt-1">
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
