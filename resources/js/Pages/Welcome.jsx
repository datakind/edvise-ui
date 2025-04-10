import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import LoadingDots from '@/Components/LoadingDots';
import '../../css/landing.css';
import Header from '@/Components/Landing/Header';
import { LenisProvider } from '@/Components/Landing/LenisProvider';
import Hero from '@/Components/Landing/Hero';
import AdvisorsSection from '@/Components/Landing/AdvisorsSection';
import ProductSection from '@/Components/Landing/ProductSection';
import Footer from '@/Components/Landing/Footer';
import { Head } from '@inertiajs/react';

export default function Welcome() {
  return (
    <>
      {/* Add google font to the page */}
      <Head title="Deemia">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <LenisProvider>
        <main className="main bg-[#EEF2F6] min-h-screen pb-10">
          <div className="layout:max-width">
            <Header />
            <div className="pt-[120px]">
              <Hero />
            </div>
            <div className="layout:box-container pt-[120px] pb-[220px]">
              <AdvisorsSection className="mb-40" />
              <ProductSection />
            </div>
            <Footer />
          </div>
        </main>
      </LenisProvider>
    </>
  );
}
