import DotCanvas from '@/Components/Landing/DotCanvas';

export default function ImpactSection(props) {
  const cards = [
    {
      label: 'Transformative earning potential',
      title: '$90M',
      description:
        'Every 100 additional grads inject up to $90 million in lifetime earnings into the economy.',
      image: {
        url: '/images/landing/advisor-1.png',
        alt: 'Dara Byrne',
      },
    },
    {
      label: 'A smart investment',
      title: '$900K',
      description:
        'A bachelor’s degree can boost a student’s earnings by nearly a million dollars over their lifetime.',
      image: {
        url: '/images/landing/advisor-1.png',
        alt: 'Dara Byrne',
      },
    },
    {
      label: 'Improved employment outcomes',
      title: '2.2%',
      description:
        'There is a 2.2% unemployment rate for college grads – less than half the rate of those without a degree.',
      image: {
        url: '/images/landing/advisor-1.png',
        alt: 'Dara Byrne',
      },
    },
    {
      label: 'Stronger health and stability',
      title: '3x',
      description:
        '3x more likely to have health coverage Graduates are three times more likely to have employer-provided health insurance.',
      image: {
        url: '/images/landing/advisor-1.png',
        alt: 'Dara Byrne',
      },
    },
    {
      label: 'Better life outcomes',
      title: '2x',
      description:
        'College grads are 2x more likely to be “very happy”. Higher education is linked to greater life satisfaction.',
      image: {
        url: '/images/landing/advisor-1.png',
        alt: 'Dara Byrne',
      },
    },
  ];

  return (
    <div className={`impact-section relative ${props.className}`}>
      <div className="absolute top-0 z-0 grid aspect-video w-full place-items-center">
        {/* <DotCanvas /> */}
      </div>
      <div className="z-1 relative">
        <div className="layout:grid mb-64">
          <div className="col-span-8">
            <p className="type:section-label mb-12">Our impact</p>
            <h2 className="type:section-title mb-7">
              Proven impact. <br /> Changing lives.
            </h2>
          </div>
        </div>
        <div className="layout:grid mb-28 grid-rows-[repeat(4,_auto)] gap-x-2">
          {cards.map((card, index) => (
            <div className="col-span-4 row-span-full grid cursor-pointer grid-rows-subgrid rounded-[40px] bg-[#EEF2F6] px-6 pb-6 pt-8 font-light transition-colors duration-100 hover:bg-[#D5E5EE]">
              <div className="mb-4">{card.label}</div>
              <div className="font-secondary mb-6 text-7xl">{card.title}</div>
              <div className="mb-7 text-lg">{card.description}</div>
              <div className="flex items-center gap-5">
                <div className="bg-landing-orange grid h-8 w-8 place-items-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                  >
                    <path d="m553.85-253.85-42.16-43.38L664.46-450H180v-60h484.46L511.69-662.77l42.16-43.38L780-480 553.85-253.85Z" />
                  </svg>
                </div>
                <div className="h-1 grow overflow-hidden rounded-full bg-white opacity-0">
                  <div className="h-full w-5 rounded-full bg-[#4F4F4F]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
