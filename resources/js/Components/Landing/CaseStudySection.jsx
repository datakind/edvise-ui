import VideoModule from '@/Components/Landing/VideoModule';
import { useState } from 'react';
export default function CaseStudySection({ className }) {
  return (
    <>
      <section className={className}>
        <div className="layout:grid mb-10 md:mb-3">
          <div className="col-span-7">
            <p className="type:section-label mb-9 md:mb-12">Case study</p>
            <h2 className="type:section-title">
              Graduation rates for John Jay College of Criminal Justice jumped
              from 54% to 86%. Ready to see what’s possible at your school?
            </h2>
          </div>
        </div>
        <div className="layout:grid">
          <div className="col-span-full mb-8 md:col-span-5">
            <p className="type:body-small mb-6 max-w-80 text-[18px] font-light leading-[120%] sm:mb-0 tb:mb-4 md:mt-36">
              As an early adopter of Edvise, developed by DataKind,{' '}
              <a
                href="https://www.jjay.cuny.edu/"
                className="text-inherit underline"
              >
                John Jay College
              </a>{' '}
              equipped advisors with the insights needed to identify students at
              risk, personalize support, and drive real results.
            </p>
          </div>
          <div className="col-span-full md:col-span-12 md:col-start-9">
            <div>
              <VideoModule videoUrl="https://www.youtube.com/watch?v=EfWgRAX0ICw" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
