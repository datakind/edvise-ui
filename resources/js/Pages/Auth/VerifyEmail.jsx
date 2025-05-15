import { Link, useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import { router } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import AuthFooter from '@/Components/AuthFooter';
import Button from '@/Components/Landing/Button';

export default function VerifyEmail({ status }) {
  const form = useForm({});
  const verificationLinkSent = status === 'verification-link-sent';
  function onSubmit(e) {
    e.preventDefault();
    form.post(route('verification.send'));
  }
  return (
    <AuthLayout>
      <div className="layout:box-container landing-rounded-lg relative mx-auto w-3/4 bg-white pb-20 sm:pb-44">
        <div className="mx-auto -mb-12 mt-12 w-full max-w-2xl p-4">
          <Head title="Email Verification" />
          <img
            className="w-1/3 pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/deemia-logo.svg"
            alt="Student Success Tool Logo"
          />
          <div className="mb-4 text-sm text-gray-600">
            Before continuing, could you verify your email address by clicking
            on the link we just emailed to you? If you didn't receive the email,
            we will gladly send you another.
          </div>

          {verificationLinkSent && (
            <div className="mb-4 text-sm font-medium text-green-600">
              A new verification link has been sent to the email address you
              provided during registration.
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mt-4 flex items-center justify-between">
              <Button
                type="submit"
                className={classNames({ 'opacity-25': form.processing })}
                disabled={form.processing}
              >
                Resend Verification Email
              </Button>

              <div>
                <Link
                  href={route('profile.show')}
                  className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Edit Profile
                </Link>
              </div>

              <Link
                href={route('logout')}
                method="post"
                as="button"
                className="ml-2 rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Log Out
              </Link>
            </div>
          </form>
          <AuthFooter />
        </div>
      </div>
    </AuthLayout>
  );
}
