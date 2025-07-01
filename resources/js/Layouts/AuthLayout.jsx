import React, { useState, useEffect } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import { LenisProvider } from '@/Components/Landing/LenisProvider';
import Header from '@/Components/Landing/Header';
import Footer from '@/Components/Landing/Footer';
import '../../css/landing.css';
import ReactGA from 'react-ga4';

ReactGA.initialize(import.meta.env.VITE_GTM_ID);

export default function AuthLayout({ children }) {
  return (
    <>
      <Head title="Edvise">
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
        <main className="main min-h-screen bg-[#1E343F] pb-10">
          <div className="layout:max-width">
            <div className="pt-[90px]">{children}</div>
          </div>
        </main>
      </LenisProvider>
    </>
  );
}
