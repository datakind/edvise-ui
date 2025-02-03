import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import LoadingDots from '@/Components/LoadingDots';

// Front page.

export default function Welcome() {
  return (
    <AppLayout title="Home">
      <div className="flex auto flex-col px-12">
        <div className="w-full mb-12">
          <div className="items-center">SST WEBAPP FRONT PAGE!</div>
                <div className="py-12 w-full font-bold text-xl">
        TO TEST THE VALIDATION AND UPLOAD FLOW: please login using username:
        tester-frontend@datakind.org and password: "password" with no quotes.
        Then, go to 'Admin Actions' > 'Set Institution' and follow the instructions there for the
        dev bucket and hit submit -- after that you will be able to upload to
        the dev bucket (this particular dev inst is set to PDP type data).
      </div>
        </div>
      </div>
    </AppLayout>
  );
}
