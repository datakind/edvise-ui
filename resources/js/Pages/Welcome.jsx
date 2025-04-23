import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import LoadingDots from '@/Components/LoadingDots';
import '../../css/landing.css';
import Header from '@/Components/Landing/Header';
import { LenisProvider } from '@/Components/Landing/LenisProvider';
import Hero from '@/Components/Landing/Hero';
import AdvisorsSection from '@/Components/Landing/AdvisorsSection';
import ProductSection from '@/Components/Landing/ProductSection';
import RequestDemoSection from '@/Components/Landing/RequestDemoSection';
import CaseStudySection from '@/Components/Landing/CaseStudySection';
import Footer from '@/Components/Landing/Footer';
import DotGrid from '@/Components/Landing/DotGrid';
import { Head } from '@inertiajs/react';
import Faq from '@/Components/Landing/Faq';
export default function Welcome() {
  return (
    <>
      <Head title="Deemia">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <LenisProvider>
        <main className="main min-h-screen bg-[#EEF2F6] pb-10">
          <div className="layout:max-width">
            <Header />
            <div className="pt-[180px]">
              <Hero />
            </div>
            <div className="layout:box-container landing-rounded-lg bg-white pb-20 pt-20 sm:pb-44 md:pt-32">
              <DotGrid />
              <AdvisorsSection className="mb-24 sm:mb-40" />
              <ProductSection />
              <CaseStudySection className="mb-24 sm:mb-40" />
              <Faq className="mb-24 sm:mb-40" />
              <RequestDemoSection />
            </div>
            <Footer />
          </div>
        </main>
      </LenisProvider>
    </>
  );
}
