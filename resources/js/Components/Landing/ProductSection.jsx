import ReactPlayer from 'react-player';

export default function ProductSection(props) {
  const products = [
    {
      name: 'Tailored alerts',
      description: 'See indicators specific to your institution and students.',
      media:
        'https://storage.googleapis.com/staging-sst-01-staging-static/videos/landing/product-placeholder-1.mp4',
    },
    {
      name: 'Smart guidance',
      description:
        'Know when to intervene — and how to best support each student.',
      media:
        'https://storage.googleapis.com/staging-sst-01-staging-static/videos/landing/product-placeholder-2.mp4',
    },
    {
      name: 'Clear insights',
      description: 'Use dashboards that highlight what matters most.',
      media:
        'https://storage.googleapis.com/staging-sst-01-staging-static/videos/landing/product-placeholder-3.mp4',
    },
  ];

  return (
    <div className={`production-section ${props.className}`}>
      <div className="layout:grid mb-14 sm:mb-28">
        <div className="col-span-8">
          <p className="type:section-label mb-9 sm:mb-12">The product</p>
          <h2 className="type:section-title mb-7">
            Get relevant,{' '}
            <span className="whitespace-nowrap">data-informed</span>{' '}
            recommendations to keep students on their learning paths
          </h2>
          <p className="text-base font-light leading-tight text-landing-gray">
            Deemia offers customized indicators and institution-specific actions
            to improve student outcomes.
          </p>
        </div>
      </div>
      <div className="product-list layout:grid">
        <div className="products-wrapper relative col-start-1 col-end-[-1] space-y-8 sm:space-y-20">
          {products.map((product, index) => (
            <div
              className="product landing-rounded-md flex w-full flex-col items-stretch overflow-hidden sm:h-[625px] sm:flex-row"
              key={product.name}
            >
              <div className="product-copy bg-[#1E343F] p-6 text-white sm:min-w-[380px] sm:max-w-[580px] sm:basis-[42%] sm:p-12">
                <h3 className="product-title mb-4 text-[22px] font-light sm:mb-10">
                  {product.name}
                </h3>
                <p className="product-number font-landing-secondary mb-8 ml-[-14px] text-[150px] leading-none tracking-[-0.05em] sm:mb-10 sm:text-[240px]">
                  0{index + 1}
                </p>
                <p className="product-description max-w-[300px] text-base font-light leading-[120%] sm:text-[22px]">
                  {product.description}
                </p>
              </div>
              <div className="product-media flex flex-1 items-center justify-center bg-[#EEF2F6] p-6">
                <div className="media-wrapper max-w-[682px] overflow-hidden rounded-[8px] sm:rounded-[20px]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
