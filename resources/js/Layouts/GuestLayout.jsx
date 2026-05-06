import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import LoadingDots from '@/Components/LoadingDots';
import '../../css/landing.css';
import GuestHeader from '@/Components/Landing/GuestHeader';
import { LenisProvider } from '@/Components/Landing/LenisProvider';
import Hero from '@/Components/Landing/Hero';
import AdvisorsSection from '@/Components/Landing/AdvisorsSection';
import ProductSection from '@/Components/Landing/ProductSection';
import ImpactSection from '@/Components/Landing/ImpactSection';
import CaseStudySection from '@/Components/Landing/CaseStudySection';
import Faq from '@/Components/Landing/Faq';
import RequestDemoSection from '@/Components/Landing/RequestDemoSection';
import Footer from '@/Components/Landing/Footer';
import DotGrid from '@/Components/Landing/DotGrid';
import { Head } from '@inertiajs/react';

export default function GuestLayout({ children }) {
  return (
    <>
      <Head title="Home">
        <meta
          name="description"
          content="Edvise is a scalable solution that empowers student support teams with data-driven insights to enhance efficiency and better serve students."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />

        <link
          rel="icon"
          href="/images/landing/favicon-light-mode.ico"
          type="image/x-icon"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/images/landing/favicon-dark-mode.ico"
          type="image/x-icon"
          media="(prefers-color-scheme: dark)"
        />

        <link
          rel="icon"
          href="/images/landing/favicon-light-mode.png"
          type="image/png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/images/landing/favicon-dark-mode.png"
          type="image/png"
          media="(prefers-color-scheme: dark)"
        />

        <link
          rel="icon"
          href="/images/landing/favicon-light-mode.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/images/landing/favicon-dark-mode.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <LenisProvider>
        <main className="min-h-screen bg-[#EEF2F6] pb-10">
          <div className="w-full">
            <GuestHeader />
            <div className="w-full bg-white py-20 sm:pb-44">{children}</div>
            <Footer />
          </div>
        </main>
      </LenisProvider>
    </>
  );
}
