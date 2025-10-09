import GuestLayout from '@/Layouts/GuestLayout';
import React from 'react';

export default function License() {
  return (
    <GuestLayout title="License">
      <div className="mx-auto my-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="prose text-[#4F4F4F] lg:prose-xl">
          <h1 className="text-5xl font-light text-black">Copyright</h1>

          <p className="mb-6 text-base font-light">
            This site carries a Creative Commons (CC BY 4.0) license, which
            permits re-use of DataKind content when proper attribution is
            provided. This means you are free to copy, display and distribute
            DataKind's work, or include our content in derivative works, under
            the following conditions:
          </p>

          <h2 className="text-4xl font-light text-black">Attribution</h2>
          <p className="mb-6 text-base font-light">
            You must clearly attribute the work to DataKind, and provide a link
            back to{' '}
            <a
              href="https://www.datakind.org"
              target="_blank"
              className="font-bold hover:underline"
            >
              www.datakind.org
            </a>
            .
          </p>

          <p className="mb-6 text-base font-light">
            For the full legal code of this Creative Commons license, please
            click{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              className="font-bold hover:underline"
            >
              here
            </a>
            . Please note that some content on this site is owned or co-owned by
            third parties, and may carry additional copyright restrictions. This
            is especially true for photos and illustrations — many images have
            been purchased from shutterstock.com and are licensed only for use
            on this site, while others carry different Creative Commons licenses
            that have been determined by their owners. DataKind has made every
            effort to clearly label such content, regardless of type, but images
            should be approached with special care. If you have any questions
            about citing or re-using DataKind content, please contact us.
          </p>
        </div>
      </div>
    </GuestLayout>
  );
}
