import React from 'react';

export default function NewFooter() {
  return (
    <footer className="bg-[#EEF2F6] py-12 pb-2">
      <div className="flex flex-col border-b border-gray-300 pb-2 md:flex-row md:items-center md:justify-between md:px-12">
        <div className="flex items-center md:mr-8">
          <a href="/">
            <img
              src="https://storage.googleapis.com/staging-sst-01-staging-static/edvise-logo.svg"
              alt="Edvise Logo"
              className="mr-8 h-10 w-auto"
            />
          </a>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-8 text-base font-light text-black">
          <a
            href="mailto:education@datakind.org"
            className="me-12 flex text-base font-normal text-black underline hover:font-semibold md:me-6"
          >
            Contact Us
          </a>
          {/*
          <a
            href="#"
            className="me-12 flex text-base font-normal text-black underline hover:font-semibold md:me-6"
          >
            Press and Resources
          </a>
          */}
          <a
            href="/privacy-policy"
            className="me-12 flex text-base font-normal text-black underline hover:font-semibold md:me-6"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="me-12 flex text-base font-normal text-black underline hover:font-semibold md:me-6"
          >
            Terms of Service
          </a>
          <a
            href="/license"
            className="me-12 flex text-base font-normal text-black underline hover:font-semibold md:me-6"
          >
            License
          </a>
        </nav>
        <div className="mt-4 flex items-center justify-center gap-6 md:mt-0">
          <a
            href="https://www.linkedin.com/company/datakind/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <path
                d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </a>
          <a
            href="https://x.com/DataKind"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <path d="M18.42,14.009L27.891,3h-2.244l-8.224,9.559L10.855,3H3.28l9.932,14.455L3.28,29h2.244l8.684-10.095,6.936,10.095h7.576l-10.301-14.991h0Zm-3.074,3.573l-1.006-1.439L6.333,4.69h3.447l6.462,9.243,1.006,1.439,8.4,12.015h-3.447l-6.854-9.804h0Z"></path>
            </svg>
          </a>
          <a
            href="https://www.facebook.com/DataKindOrg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <path d="M16,2c-7.732,0-14,6.268-14,14,0,6.566,4.52,12.075,10.618,13.588v-9.31h-2.887v-4.278h2.887v-1.843c0-4.765,2.156-6.974,6.835-6.974,.887,0,2.417,.174,3.043,.348v3.878c-.33-.035-.904-.052-1.617-.052-2.296,0-3.183,.87-3.183,3.13v1.513h4.573l-.786,4.278h-3.787v9.619c6.932-.837,12.304-6.74,12.304-13.897,0-7.732-6.268-14-14-14Z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div className="py-4 text-center text-base font-light text-black">
        © 2025 DataKind
      </div>
    </footer>
  );
}
