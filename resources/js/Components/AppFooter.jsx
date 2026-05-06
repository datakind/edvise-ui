import { usePage } from '@inertiajs/react';
import React from 'react';

export default function AppFooter() {
  const route = window.route;
  const { appVersion } = usePage().props;
  return (
    <footer className="grid grid-cols-4 items-center pb-4 pr-6 text-black">
      <div className="col-span-2 text-left">
        <ul className="items-left justify-left flex flex-wrap pl-12 text-gray-900 dark:text-white">
          <li>
            <a
              href={route('privacy-policy')}
              className="me-12 flex text-base font-medium text-black underline hover:font-semibold md:me-6"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href={route('terms-of-service')}
              className="me-12 flex text-base font-medium text-black underline hover:font-semibold md:me-6"
            >
              Terms of Service
            </a>
          </li>
          <li>
            <a
              href={route('license')}
              className="me-12 flex text-base font-medium text-black underline hover:font-semibold md:me-6"
            >
              License
            </a>
          </li>
        </ul>
      </div>
      <div></div>
      <div className="pr-12 text-right">
        &copy; 2025 Datakind
        {appVersion ? (
          <span className="text-gray-500"> · {appVersion}</span>
        ) : null}
      </div>
    </footer>
  );
}
