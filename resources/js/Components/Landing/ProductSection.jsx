export default function ProductSection(props) {
  const products = [
    {
      name: 'Tailored alerts',
      description: 'See indicators specific to your institution and students.',
      media: '/images/landing/product-placeholder.jpg',
    },
    {
      name: 'Smart guidance',
      description:
        'Know when to intervene — and how to best support each student.',
      media: '/images/landing/product-placeholder-2.jpg',
    },
    {
      name: 'Clear insights',
      description: 'Use dashboards that highlight what matters most.',
      media: '/images/landing/product-placeholder-3.jpg',
    },
  ];

  return (
    <div className={`production-section ${props.className}`}>
      <div className="layout:grid mb-14 sm:mb-28">
        <div className="col-span-8">
          <p className="type:section-label mb-9 sm:mb-12">The product</p>
          <h2 className="type:section-title mb-7">
            Get relevant, data-informed recommendations to keep students on
            their learning paths
          </h2>
          <p className="text-base font-light leading-tight text-[#6A6A73]">
            Deemia offers customized indicators and institution-specific actions
            to improve student outcomes.
          </p>
        </div>
      </div>
      <div className="product-list layout:grid">
        <div className="products-wrapper relative col-start-1 col-end-[-1] space-y-8 sm:space-y-32">
          {products.map((product, index) => (
            <div
              className="product landing-rounded-md flex w-full flex-col items-stretch overflow-hidden sm:h-[625px] sm:flex-row"
              key={product.name}
            >
              <div className="product-copy bg-[#1E343F] p-6 text-white sm:min-w-[380px] sm:max-w-[580px] sm:basis-[42%] sm:p-12">
                <h3 className="product-title mb-4 text-[22px] font-light sm:mb-10">
                  {product.name}
                </h3>
                <p className="product-number font-secondary mb-8 text-[150px] leading-none tracking-[-0.05em] sm:mb-10 sm:text-[240px]">
                  0{index + 1}
                </p>
                <p className="product-description max-w-[300px] text-base font-light leading-[120%] sm:text-[22px]">
                  {product.description}
                </p>
              </div>
              <div className="product-media flex flex-1 items-center justify-center bg-[#EEF2F6] p-6">
                <div className="media-wrapper max-w-[682px] overflow-hidden rounded-[8px] sm:rounded-[20px]">
                  <img src={product.media} alt={product.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
