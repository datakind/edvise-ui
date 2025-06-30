import DotCanvas from '@/Components/Landing/DotCanvas';
import { useState, useEffect, useRef } from 'react';

export default function ImpactSection(props) {
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef(null);
  const sectionRef = useRef(null);

  const cards = [
    {
      label: 'Transformative earning potential',
      title: '$90M',
      description:
        'Every 100 additional grads inject up to $90 million in lifetime earnings into the economy.',
      source: 'SSA.gov',
      image: {
        url: 'https://storage.googleapis.com/staging-sst-01-staging-static/impact-1.jpg',
        alt: 'Dara Byrne',
      },
    },
    {
      label: 'A smart investment',
      title: '$900K',
      description:
        "A bachelor's degree can boost a student's earnings by nearly a million dollars over their lifetime.",
      source: 'SSA.gov',
      image: {
        url: 'https://storage.googleapis.com/staging-sst-01-staging-static/impact-2.jpg',
        alt: 'Dara Byrne',
      },
    },
    {
      label: 'Improved employment outcomes',
      title: '2.2%',
      description:
        'College grads are far less likely to be unemployed – less than half the rate of those without a degree.',
      source: 'Bureau of Labor Statistics',
      image: {
        url: 'https://storage.googleapis.com/staging-sst-01-staging-static/impact-3.jpg',
        alt: 'Dara Byrne',
      },
    },
    {
      label: 'Stronger health and stability',
      title: '3x',
      description:
        'Graduates are three times more likely to have employer-provided health insurance.',
      source: 'US Census Bureau',
      image: {
        url: 'https://storage.googleapis.com/staging-sst-01-staging-static/impact-4.jpg',
        alt: 'Dara Byrne',
      },
    },
    {
      label: 'Better life outcomes',
      title: '2x',
      description:
        'Higher education is linked to greater life satisfaction and overall well being.',
      source: 'Pew Research Center',
      image: {
        url: 'https://storage.googleapis.com/staging-sst-01-staging-static/impact-5.jpg',
        alt: 'Dara Byrne',
      },
    },
  ];

  function onCardClick(index) {
    setActiveCardIndex(index);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isVisible) {
      intervalRef.current = setInterval(() => {
        setActiveCardIndex(prevIndex => (prevIndex + 1) % cards.length);
      }, 5000);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          setActiveCardIndex(0);

          intervalRef.current = setInterval(() => {
            setActiveCardIndex(prevIndex => (prevIndex + 1) % cards.length);
          }, 5000);
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setActiveCardIndex(null);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`impact-section relative ${props.className}`}
      ref={sectionRef}
    >
      <div className="absolute top-0 z-0 grid aspect-video w-full translate-y-[-60px] place-items-center opacity-0 md:opacity-100">
        <DotCanvas animation={activeCardIndex} />
      </div>
      <div className="z-1 relative">
        <div className="layout:grid mb-3 md:mb-16">
          <div className="col-span-8">
            <p className="type:section-label mb-12">The broader impact</p>
            <h2 className="type:section-title mb-7">
              Boost student success and
              <br />
              unlock lifelong opportunity
            </h2>
          </div>
        </div>
        <div className="layout:grid mb-28 grid-rows-[repeat(4,_auto)] sm:gap-x-2">
          {cards.map((card, index) => (
            <div
              key={card.label}
              className={`impact-card-wrapper group relative col-span-full grid font-light leading-[normal] tb:col-span-6 tb:col-start-2 md:col-span-4 md:row-span-full md:grid-rows-subgrid ${
                activeCardIndex === index ? 'active' : ''
              } `}
            >
              {/* <div className="relative z-[0] h-56 w-full translate-y-[40px] overflow-hidden rounded-t-[40px] bg-red transition-transform duration-300 ease-out md:translate-y-[101%] md:group-hover:translate-y-[calc(100%-20px)] md:group-[.active]:translate-y-[40px]"> */}
              <div className="impact-thumbnail relative z-[0] h-56 w-full translate-y-[40px] overflow-hidden rounded-t-[40px] transition-transform duration-300 ease-out md:translate-y-[101%] md:group-[.active]:translate-y-[40px]">
                <img
                  className="h-full w-full object-cover"
                  src={card.image.url}
                  alt={card.image.alt}
                />
              </div>
              <div
                className={`bg-[#D5E5EE] ${activeCardIndex === index ? 'active md:bg-[#D5E5EE] md:bg-[#EEF2F6]' : 'md:bg-[#EEF2F6] md:hover:bg-[#D5E5EE]'} impact-card relative z-[1] grid cursor-pointer rounded-[40px] px-5 pb-5 pt-8 transition-colors duration-100 ease-out`}
                onClick={() => onCardClick(index)}
              >
                <div className="mb-4">{card.label}</div>
                <div className="font-landing-secondary mb-6 text-5xl lg:text-7xl">
                  {card.title}
                </div>
                <div className="mb-2 text-[18px] leading-[120%]">
                  {card.description}
                </div>
                <div className="mb-7 text-sm italic opacity-50">
                  {card.source}
                </div>
                <div className="hidden items-center gap-4 md:flex">
                  <div className="bg-landing-orange grid h-8 w-8 place-items-center rounded-full transition-transform duration-300 ease-out md:group-[.active]:scale-[0.25]">
                    <svg
                      className="transition-opacity duration-200 ease-out md:group-[.active]:opacity-0"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="currentColor"
                    >
                      <title>Arrow</title>
                      <path d="m553.85-253.85-42.16-43.38L664.46-450H180v-60h484.46L511.69-662.77l42.16-43.38L780-480 553.85-253.85Z" />
                    </svg>
                  </div>
                  <div
                    className={`mr-4 hidden h-1 grow overflow-hidden rounded-full bg-white transition-opacity md:block ${activeCardIndex === index ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <div
                      className={`h-full w-full translate-x-[-100%] rounded-full bg-[#4F4F4F] transition-transform ${activeCardIndex === index ? 'translate-x-[0] transition-transform duration-[5000ms] ease-linear' : 'translate-x-[-100%]'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
