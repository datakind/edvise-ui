import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import HomeSection from '@/Components/Landing/HomeSection';

export default function Home() {
  return (
    <AppLayout
      title="Home"
      renderHeader={() => (
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Home
        </h2>
      )}
    >
      <HomeSection />
    </AppLayout>
  );
}
