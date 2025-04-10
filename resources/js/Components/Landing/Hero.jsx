export default function Hero() {
  return (
    <div className="hero">
      <div className="layout:grid">
        <div className="hero-title col-span-10 col-start-7 mb-[32px]">
          <h1 className="mb-[72px] font-light leading-[103%] text-[48px]">
            Getting students the support they need to succeed
          </h1>
          <div className="mb-[10px]">
            <img src="/images/deemia-text-logo.svg" alt="Deemia" />
          </div>
          <p className="font-light text-[18px] leading-[120%] text-[#6A6A73]">
            Is a scalable solution that empowers student support teams with
            data-driven insights to enhance efficiency and better serve
            students.
          </p>
        </div>
      </div>
      <div className="hero-image m-full rounded-[50px] overflow-hidden">
        <img src="/images/landing-hero-image.png" alt="Hero" />
      </div>
    </div>
  );
}
