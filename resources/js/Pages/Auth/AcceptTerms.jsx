import React, { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import Button from '@/Components/Landing/Button';
import AuthFooter from '@/Components/AuthFooter';
import TermsText from '@/Components/TermsText';

export default function AcceptTerms() {
  const scrollRef = useRef(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (isBottom) setScrolledToBottom(true);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const acceptTerms = () => {
    router.post(route('terms.accept'));
  };

  return (
    <AuthLayout>
      <div className="layout:box-container landing-rounded-lg relative mx-auto w-3/4 bg-white pb-20 sm:pb-44">
        <div className="mx-auto -mb-12 mt-12 w-full max-w-2xl p-4">
          <Head title="Accept Terms" />

          <img
            className="w-1/3 pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/edvise-logo.svg"
            alt="Edvise Logo"
          />

          <div className="pb-8 text-2xl">
            Please review and accept our Terms of Service:
          </div>

          <div
            ref={scrollRef}
            className="max-h-[50vh] space-y-4 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-6 text-sm shadow-inner"
            data-lenis-prevent
          >
            <TermsText />
          </div>

          <div className="mt-8 flex items-center justify-end">
            <Button onClick={acceptTerms} disabled={!scrolledToBottom}>
              I Agree
            </Button>
          </div>

          <div className="mt-20 text-center">
            <AuthFooter />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
