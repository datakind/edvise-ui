export default function ProductSection() {
  const products = [
    {
      name: 'Tailored alerts',
      description: 'See indicators specific to your institution and students.',
      media: '/images/landing/product-placeholder.png',
    },
    {
      name: 'Smart guidance',
      description:
        'Know when to intervene — and how to best support each student.',
      media: '/images/landing/product-placeholder.png',
    },
    {
      name: 'Clear insights',
      description: 'Use dashboards that highlight what matters most.',
      media: '/images/landing/product-placeholder.png',
    },
  ];

  return (
    <div className="product-section">
      <div className="layout:grid mb-28">
        <div className="col-span-8">
          <p className="type:section-label mb-12">The product</p>
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
        <div className="products-wrapper relative col-start-1 col-end-[-1] space-y-32">
          {products.map((product, index) => (
            <div
              className="product sticky top-0 flex h-[625px] w-full items-stretch overflow-hidden rounded-[40px]"
              key={product.name}
            >
              <div className="product-copy min-w-[380px] max-w-[580px] basis-[42%] bg-[#1E343F] p-12 text-white">
                <h3 className="product-title mb-10 text-[22px] font-light">
                  {product.name}
                </h3>
                <p className="product-number font-secondary mb-10 text-[240px] leading-none tracking-[-0.05em]">
                  0{index + 1}
                </p>
                <p className="product-description max-w-[300px] text-[22px] font-light">
                  {product.description}
                </p>
              </div>
              <div className="product-media flex flex-1 items-center justify-center bg-[#EEF2F6] p-6">
                <div className="media-wrapper overflow-hidden rounded-[20px]">
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
