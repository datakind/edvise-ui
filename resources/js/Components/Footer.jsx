import React from 'react';

export default function Footer() {
  return (
    <footer className="flex grid h-[10%] grid-cols-4 items-end justify-center pb-12 pr-6 text-black">
      <div className="col-span-2 text-left">
        <ul class="items-left justify-left flex flex-wrap pl-12 text-gray-900 dark:text-white">
          <li>
            <a
              href={route('privacy-policy')}
              class="text-md me-12 flex font-semibold text-black hover:underline md:me-6"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href={route('terms-of-service')}
              class="text-md me-12 flex font-semibold text-black hover:underline md:me-6"
            >
              Terms of Service
            </a>
          </li>
          <li>
            <a
              href={route('license')}
              class="text-md me-12 flex font-semibold text-black hover:underline md:me-6"
            >
              License
            </a>
          </li>
        </ul>
      </div>
      <div></div>
      <div className="pr-12 text-right">&copy; 2025 Datakind</div>
    </footer>
  );
}
