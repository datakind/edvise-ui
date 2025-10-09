import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import TermsText from '@/Components/TermsText';

const TermsOfService = () => {
  return (
    <GuestLayout title="Terms of Service">
      <Head title="Terms of Service" />
      <div className="mx-auto my-12 mb-24 max-w-6xl px-4 sm:px-6 lg:px-8">
        <TermsText />
      </div>
    </GuestLayout>
  );
};

export default TermsOfService;
