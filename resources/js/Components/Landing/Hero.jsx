import Button from '@/Components/Landing/Button';

export default function Hero() {
  return (
    <div className="hero">
      <div className="layout:grid">
        <div className="hero-title col-span-6 mb-[32px] md:col-span-10 md:col-start-7">
          <h1 className="mb-14 text-[42px] font-light leading-[103%] sm:text-[48px] md:mb-[72px]">
            Getting students the support they need to succeed
          </h1>
        </div>
      </div>
      <div className="layout:grid">
        <div className="bg-landing-orange col-start-5 mt-[-8px] hidden h-10 w-10 items-center justify-center rounded-full md:flex">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#1f1f1f"
          >
            <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
          </svg>
        </div>
        <div className="col-span-6 mb-5 mb-[32px] md:col-span-10 md:col-start-7">
          <img
            className="mb-5"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/deemia-text-logo.svg"
            alt="Student Success Tool Logo"
          />
          <p className="text-[18px] font-light leading-[120%] text-[#6A6A73]">
            Is a scalable solution that empowers student support teams with
            data-driven insights to enhance efficiency and better serve
            students.
          </p>
        </div>
      </div>
      <div className="hero-image m-full relative">
        <div className="landing-rounded-lg relative aspect-[343/343] md:aspect-[1380/847]">
          <img
            src="https://storage.googleapis.com/staging-sst-01-staging-static/landing-hero-image.jpg"
            alt="Hero"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="hero-image-overlay landing-rounded-lg absolute left-0 right-0 top-[calc(100%)] flex -translate-y-full flex-col bg-[#D5E5EE] px-4 py-4 md:h-[100px] md:-translate-y-full md:flex-row md:items-center md:px-10 md:py-0">
          <div className="mb-3 mr-8 sm:mb-0">
            <img
              src="https://storage.googleapis.com/staging-sst-01-staging-static/NYT-logo.svg"
              alt="NYT Logo"
            />
          </div>
          <p className="text-[18px] font-light leading-tight">
            “How A.I. Increased the Graduation Rate at John Jay College by 32
            Points”
          </p>
          <a
            href="https://www.nytimes.com/2023/09/20/nyregion/ai-john-jay-college.html"
            className="absolute right-[6px] top-[6px] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white tb:right-[26px] tb:top-[26px] md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M2.42296 15.0833C2.00199 15.0833 1.64567 14.9375 1.354 14.6458C1.06234 14.3541 0.916504 13.9978 0.916504 13.5768V2.42308C0.916504 2.00211 1.06234 1.64579 1.354 1.35413C1.64567 1.06246 2.00199 0.916626 2.42296 0.916626H7.05421C7.23157 0.916626 7.38012 0.976487 7.49984 1.09621C7.61942 1.21579 7.67921 1.36426 7.67921 1.54163C7.67921 1.71899 7.61942 1.86746 7.49984 1.98704C7.38012 2.10677 7.23157 2.16663 7.05421 2.16663H2.42296C2.3588 2.16663 2.30005 2.19336 2.24671 2.24683C2.19324 2.30017 2.1665 2.35892 2.1665 2.42308V13.5768C2.1665 13.641 2.19324 13.6998 2.24671 13.7531C2.30005 13.8066 2.3588 13.8333 2.42296 13.8333H13.5767C13.6409 13.8333 13.6996 13.8066 13.753 13.7531C13.8064 13.6998 13.8332 13.641 13.8332 13.5768V8.94559C13.8332 8.76822 13.893 8.61968 14.0128 8.49996C14.1323 8.38038 14.2808 8.32058 14.4582 8.32058C14.6355 8.32058 14.784 8.38038 14.9036 8.49996C15.0233 8.61968 15.0832 8.76822 15.0832 8.94559V13.5768C15.0832 13.9978 14.9373 14.3541 14.6457 14.6458C14.354 14.9375 13.9977 15.0833 13.5767 15.0833H2.42296ZM13.8332 3.04475L6.53838 10.3398C6.42296 10.455 6.27789 10.5141 6.10317 10.5168C5.92859 10.5195 5.78088 10.4604 5.66005 10.3398C5.53935 10.2189 5.479 10.0725 5.479 9.90059C5.479 9.72864 5.53935 9.58225 5.66005 9.46142L12.955 2.16663H10.2915C10.1141 2.16663 9.96567 2.10677 9.84609 1.98704C9.72637 1.86746 9.6665 1.71899 9.6665 1.54163C9.6665 1.36426 9.72637 1.21579 9.84609 1.09621C9.96567 0.976487 10.1141 0.916626 10.2915 0.916626H14.3298C14.5447 0.916626 14.7239 0.9885 14.8675 1.13225C15.0113 1.27586 15.0832 1.4551 15.0832 1.66996V5.70829C15.0832 5.88565 15.0233 6.03413 14.9036 6.15371C14.784 6.27343 14.6355 6.33329 14.4582 6.33329C14.2808 6.33329 14.1323 6.27343 14.0128 6.15371C13.893 6.03413 13.8332 5.88565 13.8332 5.70829V3.04475Z"
                fill="#1C1B1F"
              />
            </svg>
          </a>
          <Button
            className="hidden md:ml-auto md:block"
            kind="dark"
            href="https://www.nytimes.com/2023/09/20/nyregion/ai-john-jay-college.html"
          >
            Read more
          </Button>
        </div>
      </div>
    </div>
  );
}
