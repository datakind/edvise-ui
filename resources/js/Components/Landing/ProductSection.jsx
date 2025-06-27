import ReactPlayer from 'react-player';

export default function ProductSection(props) {
  const products = [
    {
      name: 'Tailored alerts',
      description:
        'Know who to prioritize — and how to best support each student.',
      media:
        'https://storage.googleapis.com/staging-sst-01-staging-static/score_cards.mp4',
    },
    {
      name: 'Smart guidance',
      description: 'Use dashboards that highlight what matters most.',
      media:
        'https://storage.googleapis.com/staging-sst-01-staging-static/support%20overview.mp4',
    },
    {
      name: 'Clear insights',
      description: 'See indicators specific to your institution and students.',
      media:
        'https://storage.googleapis.com/staging-sst-01-staging-static/students_pie_chart.mp4',
    },
  ];

  return (
    <div
      className={`production-section pt-24 sm:pt-40 ${props.className}`}
      id="product"
    >
      <div className="layout:grid mb-14 md:mb-28">
        <div className="col-span-8 tb:col-span-4 md:col-span-8">
          <p className="type:section-label mb-9 md:mb-12">The product</p>
          <h2 className="type:section-title mb-7">
            Get relevant,{' '}
            <span className="whitespace-nowrap">data-informed</span>{' '}
            recommendations to keep students on their learning paths
          </h2>
        </div>
      </div>
      <div className="product-list layout:grid">
        <div className="products-wrapper relative col-start-1 col-end-[-1] space-y-8 tb:col-span-6 tb:col-start-2 md:col-span-full md:space-y-20">
          {products.map((product, index) => (
            <div
              className="product landing-rounded-md flex w-full flex-col items-stretch overflow-hidden md:h-[625px] md:flex-row"
              key={product.name}
            >
              <div className="product-copy bg-[#1E343F] p-6 text-white md:min-w-[380px] md:max-w-[580px] md:basis-[42%] md:p-12">
                <h3 className="product-title mb-4 text-[22px] font-light md:mb-10">
                  {product.name}
                </h3>
                <p className="product-number font-landing-secondary mb-8 ml-[-14px] text-[150px] leading-none tracking-[-0.05em] md:mb-10 md:text-[240px]">
                  0{index + 1}
                </p>
                <p className="product-description max-w-[300px] text-base font-light leading-[120%] md:text-[22px]">
                  {product.description}
                </p>
              </div>
              <div className="product-media flex flex-1 items-center justify-center bg-[#EEF2F6] p-6">
                <div className="media-wrapper max-w-[682px] overflow-hidden rounded-[8px] md:rounded-[20px]">
                  <ReactPlayer
                    url={product.media}
                    muted
                    loop
                    playsinline
                    playing
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
