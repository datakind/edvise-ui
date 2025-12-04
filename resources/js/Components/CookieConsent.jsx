import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookiesAccepted');
    if (!hasAccepted) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-100 px-6 py-8">
      <div className="container mx-auto flex max-w-4xl items-center gap-6">
        {/* Cookie icon */}
        <div className="flex-shrink-0">
          <svg className="h-16 w-16" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" fill="#D1D5DB" stroke="#6B7280" strokeWidth="2"/>
            <circle cx="35" cy="35" r="4" fill="#6B7280"/>
            <circle cx="55" cy="30" r="3" fill="#6B7280"/>
            <circle cx="40" cy="55" r="5" fill="#6B7280"/>
            <circle cx="65" cy="50" r="4" fill="#6B7280"/>
            <circle cx="50" cy="70" r="3" fill="#6B7280"/>
            <path d="M 30 25 Q 35 15 45 20" stroke="#6B7280" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* Content */}
        <div className="flex-1 text-left">
          <h3 className="mb-2 text-2xl font-bold text-gray-900">Cookies anyone?</h3>
          <p className="text-base text-gray-700">
            Your experience on this site will be improved by allowing cookies.
          </p>
        </div>
        
        {/* Button */}
        <div className="flex-shrink-0">
          <button
            onClick={acceptCookies}
            className="rounded-lg border-2 border-black bg-white px-12 py-4 text-lg font-semibold text-black transition hover:bg-gray-50"
          >
            Allow cookies
          </button>
        </div>
      </div>
    </div>
  );
}

