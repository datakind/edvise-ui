import Button from '@/Components/Landing/Button';

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
      <div className="hero-image m-full rounded-[50px] overflow-hidden relative">
        <div class="relative">
          <img src="/images/landing-hero-image.png" alt="Hero" />
        </div>

        <div className="hero-image-overlay px-10 py-6 items-center absolute bottom-2.5 left-2.5 right-2.5 bg-[#D5E5EE] rounded-full flex">
          <div className="mr-8">
            <img src="/images/NYt-logo.svg" alt="NYT Logo" />
          </div>
          <p className="text-[18px] font-light leading-tight">
            “How A.I. Increased the Graduation Rate at John Jay College by 32
            Points”
          </p>
          <Button className="ml-auto">Read the article</Button>
        </div>
      </div>
    </div>
  );
}
