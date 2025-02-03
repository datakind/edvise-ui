import AppLayout from '@/Layouts/AppLayout';
import LoadingDots from '@/Components/LoadingDots';
import Spinner from '@/Components/Spinner';

import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Dashboard
        </h2>
      )}
    >
    </AppLayout>
  );
}
