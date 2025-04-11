export default function ProductSection() {
  const products = [
    {
      name: 'Tailored alerts',
      description: 'See indicators specific to your institution and students.',
      media: '/images/product-placeholder.png',
    },
    {
      name: 'Smart guidance',
      description:
        'Know when to intervene — and how to best support each student.',
      media: '/images/product-placeholder.png',
    },
    {
      name: 'Clear insights',
      description: 'Use dashboards that highlight what matters most.',
      media: '/images/product-placeholder.png',
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
        <div className="products-wrapper col-start-1 col-end-[-1] space-y-32 relative">
          {products.map((product, index) => (
            <div
              className="product rounded-[40px] overflow-hidden flex h-[625px] items-stretch w-full sticky top-0"
              key={product.name}
            >
              <div className="product-copy bg-[#1E343F] text-white p-12 basis-[42%] min-w-[380px] max-w-[580px]">
                <h3 className="product-title text-[22px] font-light mb-10">
                  {product.name}
                </h3>
                <p className="product-number font-secondary text-[240px] tracking-[-0.05em] leading-none mb-10">
                  0{index + 1}
                </p>
                <p className="product-description text-[22px] font-light max-w-[300px]">
                  {product.description}
                </p>
              </div>
              <div className="product-media bg-[#EEF2F6] flex-1 flex items-center justify-center p-6">
                <div className="media-wrapper rounded-[20px] overflow-hidden">
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
