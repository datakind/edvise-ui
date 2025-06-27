export default function AdvisorsSection(props) {
  const testimonies = [
    {
      name: 'Dara N. Byrne, PhD',
      role: 'Former Associate Provost for Undergraduate Retention & Dean of Undergraduate Studies, John Jay College of Criminal Justice',
      image: {
        url: 'https://storage.googleapis.com/staging-sst-01-staging-static/Dara_Action_Shot.jpeg',
        alt: 'Dara Byrne',
      },
      quotes: [
        "Partnering with DataKind showed us what’s possible when data is used not just smartly, but compassionately. Their leadership in data philanthropy helped us boost John Jay's senior graduation rate from 54% to 86% in just two years—transforming lives by turning insight into action. This is what the human side of AI looks like: real people, real progress, and a future driven by purpose.",
      ],
    },
    {
      name: 'Tyler Walsh',
      role: 'Director, Center for Higher Education Innovation, University of Central Florida',
      image: {
        url: 'https://storage.googleapis.com/staging-sst-01-staging-static/Tyler_Walsh_Headshot.jpg',
        alt: 'Tyler Walsh',
      },
      quotes: [
        'For any institution looking to enhance student advising, improve retention, and create a more personalized support system, Edvise is a must-have. The actionable insights have influenced more than just how we use data—they’ve enhanced our operations and are transforming how we understand student success and well-being at UCF.',
      ],
    },
    {
      name: 'Marty Schmidt',
      role: 'Product Manager, Postsecondary Data Partnership, National Student Clearinghouse',
      image: {
        url: 'https://storage.googleapis.com/staging-sst-01-staging-static/Marty_Headshot.png',
        alt: 'Marty Schmidt',
      },
      quotes: [
        'At the National Student Clearinghouse, we’re proud to see our Postsecondary Data Partnership (PDP) powering DataKind’s Edvise. By enhancing the PDP’s Analysis-Ready (AR) files, DataKind is accelerating the delivery of actionable insights to institutions—enabling them to make timely, data-informed decisions that improve student outcomes. This collaboration underscores the value and impact of PDP in advancing student success through data.',
      ],
    },
  ];

  return (
    <div
      className={`landing-advisors-section ${props.className}`}
      id="advisors"
    >
      <style>{`
        @media screen and (min-width: 1152px) {
          .landing-advisors-section .advisor-section-grid div:nth-child(2) {
            grid-column-start: 8;
          }
          .landing-advisors-section .advisor-section-grid div:nth-child(3) {
            grid-column-start: 15;
          }
        }
      `}</style>
      <div className="layout:grid mb-14 md:mb-28">
        <div className="col-span-8">
          <p className="type:section-label mb-9 text-landing-gray md:mb-12">
            The growing Edvise community
          </p>
          <h2 className="type:section-title">
            Identify students in need of timely intervention and develop
            personalized success plans
          </h2>
        </div>
      </div>

      <div className="layout:grid advisor-section-grid gap-y-7 md:gap-y-0">
        {testimonies.map((testimony, index) => (
          <div
            key={testimony.name}
            className="col-span-full items-stretch tb:col-span-6 tb:col-start-2 md:col-span-6"
          >
            <div className="relative flex h-full flex-col">
              <div className="landing-rounded-md relative z-10 aspect-[396/360] max-h-[400px] w-full overflow-hidden !rounded-b-none">
                {testimony.image.url && (
                  <img
                    src={testimony.image.url}
                    alt={testimony.image.alt}
                    className="h-full w-full object-cover object-center"
                  />
                )}
              </div>
              <div className="landing-rounded-md relative z-40 mt-[-40px] flex-1 bg-[#EEF2F6] p-6 md:pb-12 md:pl-7 md:pr-14 md:pt-7">
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
