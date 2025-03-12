import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import LoadingDots from '@/Components/LoadingDots';

// Front page. to-cyan-500 from-blue-600

export default function Welcome() {
  return (
    <AppLayout title="Home">
      <div className="flex flex-col text-4xl font-bold tracking-tight text-gray-900 p-6 pt-24 w-full justify-center items-center">
        <span class="text-transparent bg-clip-text bg-gradient-to-tr to-orange-200 from-orange-600">
          SST
        </span>
        LANDING PAGE PLACEHOLDER
      </div>
    </AppLayout>
  );
}
