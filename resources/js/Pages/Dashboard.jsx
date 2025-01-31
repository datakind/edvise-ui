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
      <div className="py-12 w-full font-bold text-xl">
        TO TEST THE VALIDATION AND UPLOAD FLOW: please login using username:
        tester-frontend@datakind.org and password: "password" with no quotes.
        Then, go to Set Institution and follow the instructions there for the
        dev bucket and hit submit -- after that you will be able to upload to
        the dev bucket.
      </div>
    </AppLayout>
  );
}
