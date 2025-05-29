import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import NewHomeSection from '@/Components/Landing/NewHomeSection';

export default function NewHome() {
  return (
    <AppLayout
      title="Home"
      renderHeader={() => (
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Home
        </h2>
      )}
    >
      <NewHomeSection />
    </AppLayout>
  );
}
