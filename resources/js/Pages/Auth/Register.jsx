import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import classNames from 'classnames';
import InputError from '@/Components/Modals/InputError';
import InputLabel from '@/Components/Fields/InputLabel';
import TextInput from '@/Components/Fields/TextInput';
import Checkbox from '@/Components/Fields/Checkbox';
import AuthLayout from '@/Layouts/AuthLayout';
import AuthFooter from '@/Components/AuthFooter';
import Button from '@/Components/Landing/Button';
import TermsText from '@/Components/TermsText';

export default function Register({ invite, isSsoUser = false }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: invite?.email || '',
    password: '',
    password_confirmation: '',
    accepted_terms: false,
  });

  const submit = e => {
    e.preventDefault();

    // Ensure email is included in the request
    const formData = {
      ...data,
      email: invite?.email || data.email,
    };

    post(route('register.post'), formData);
  };

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

  return (
    <AuthLayout>
      <div className="layout:box-container landing-rounded-lg relative mx-auto w-3/4 bg-white pb-20 sm:pb-44">
        <div className="mx-auto -mb-12 mt-12 w-full max-w-2xl p-4">
          <Head title="Register" />
          <img
            className="w-1/3 pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/edvise-logo.svg"
            alt="Edvise Logo"
          />

          <div className="pb-8 text-2xl">Complete Your Registration</div>

          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              <strong>Welcome!</strong> You've been invited to join with email:{' '}
              <strong>{invite?.email}</strong>
            </p>
          </div>

          {isSsoUser && (
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-800">
                <strong>SSO User:</strong> Since you're using Single Sign-On,
                you won't need to create a password.
              </p>
            </div>
          )}

          <form onSubmit={submit}>
            {/* Hidden email field for the backend */}
            <input type="hidden" name="email" value={data.email} />

            <div>
              <InputLabel htmlFor="name" value="Name" />
              <TextInput
                id="name"
                type="text"
                className="mt-1 block w-full"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                required
                autoFocus
                autoComplete="name"
              />
              <InputError message={errors.name} className="mt-2" />
            </div>

            {!isSsoUser && (
              <>
                <div className="mt-4">
                  <InputLabel htmlFor="password" value="Password" />
                  <TextInput
                    id="password"
                    type="password"
                    className="mt-1 block w-full"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                  <InputLabel
                    htmlFor="password_confirmation"
                    value="Confirm Password"
                  />
                  <TextInput
                    id="password_confirmation"
                    type="password"
                    className="mt-1 block w-full"
                    value={data.password_confirmation}
                    onChange={e =>
                      setData('password_confirmation', e.target.value)
                    }
                    required
                    autoComplete="new-password"
                  />
                  <InputError
                    message={errors.password_confirmation}
                    className="mt-2"
                  />
                </div>
              </>
            )}

            <div className="mt-8">
              <InputLabel htmlFor="accepted_terms">
                <div className="mb-4">
                  Please review and accept our Terms of Service:
                </div>
                <div
                  ref={scrollRef}
                  className="max-h-[50vh] space-y-4 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-6 text-sm shadow-inner"
                  data-lenis-prevent
                >
                  <TermsText />
                </div>
                <div className="mt-4 flex items-center">
                  <Checkbox
                    name="accepted_terms"
                    id="accepted_terms"
                    checked={data.accepted_terms}
                    onChange={e => setData('accepted_terms', e.target.checked)}
                    required
                  />
                  <label
                    htmlFor="accepted_terms"
                    className="ml-2 text-sm text-gray-600"
                  >
                    I have read and agree to the Terms of Service above
                  </label>
                </div>
                <InputError className="mt-2" message={errors.accepted_terms} />
              </InputLabel>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <Link
                href={route('login')}
                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Already registered?
              </Link>

              <Button
                type="submit"
                className={classNames('ml-4', {
                  'opacity-25':
                    processing || !scrolledToBottom || !data.accepted_terms,
                })}
                disabled={
                  processing || !scrolledToBottom || !data.accepted_terms
                }
              >
                Complete Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="text-center">
        <AuthFooter />
      </div>
    </AuthLayout>
  );
}
