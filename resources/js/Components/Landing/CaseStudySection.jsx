import VideoModule from '@/Components/Landing/VideoModule';
import { useState } from 'react';
export default function CaseStudySection({ className }) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className={className}>
        <div className="layout:grid mb-10 sm:mb-3">
          <div className="col-span-7">
            <p className="type:section-label mb-9 sm:mb-12">Case study</p>
            <h2 className="type:section-title">
              Graduation rates for John Jay College of Criminal Justice jumped
              from 54% to 86%. Ready to see what’s possible at your school?
            </h2>
          </div>
        </div>
        <div className="layout:grid">
          <div className="col-span-full sm:col-span-5">
            <p className="type:body-small mb-6 max-w-80 text-[18px] font-light leading-[120%] sm:mb-0 sm:mt-36">
              John Jay College partnered with DataKind to harness Student
              Success Tool – empowering academic advisors to more efficiently
              identify at-risk students, reach out, and build personalized plans
              for their success.
            </p>
          </div>
          <div className="col-span-full sm:col-span-12 sm:col-start-9">
            <div
              className="case-study-video"
              onClick={() => setIsOpen(true)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsOpen(true);
                }
              }}
              tabIndex={0}
              role="button"
            >
              <VideoModule />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
