import { usePage } from '@inertiajs/react';
import React from 'react';

export default function AppFooter() {
  const route = window.route;
  const currentYear = new Date().getFullYear();
  const { appVersion } = usePage().props;
  return (
    <footer className="flex flex-col gap-4 px-6 pb-4 text-black md:flex-row md:items-center md:justify-between">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-gray-900 dark:text-white">
        <li>
          <a
            href={route('privacy-policy')}
            className="text-base font-medium text-black underline hover:font-semibold"
          >
            Privacy Policy
          </a>
        </li>
        <li>
          <a
            href={route('terms-of-service')}
            className="text-base font-medium text-black underline hover:font-semibold"
          >
            Terms of Service
          </a>
        </li>
        <li>
          <a
            href={route('license')}
            className="text-base font-medium text-black underline hover:font-semibold"
          >
            License
          </a>
        </li>
      </ul>
      <div className="whitespace-nowrap md:text-right">
        &copy; {currentYear} Datakind &mdash; Edvise v{appVersion}
      </div>
    </footer>
  );
}
