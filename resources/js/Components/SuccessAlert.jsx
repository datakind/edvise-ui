import React from 'react';

export default function SuccessAlert({ errDict, mainMsg, className }) {
  if (errDict !== undefined && Object.keys(errDict).length !== 0) {
    return null;
  }
  return (
    <div className={className}>
      <div className="inline-flex rounded-lg bg-[#DAF8E6] px-[18px] py-4 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)]">
        <div className="flex items-center text-sm font-medium text-[#004434]">
          <span className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_961_15637)">
                <svg
                  data-slot="icon"
                  strokeWidth="1.5"
                  stroke="white"
                  className="bg-green"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  ></path>
                </svg>
              </g>
              <defs>
                <clipPath id="clip0_961_15637">
                  <rect width="12" height="12" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          {mainMsg}
        </div>
      </div>
    </div>
  );
}
