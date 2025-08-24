import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import classNames from 'classnames';
import InputError from '@/Components/Modals/InputError';
import InputLabel from '@/Components/Fields/InputLabel';
import TextInput from '@/Components/Fields/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import AuthFooter from '@/Components/AuthFooter';
import Button from '@/Components/Landing/Button';

export default function InviteValidation() {
  const { data, setData, post, processing, errors } = useForm({
    invite_code: '',
  });

  const submit = e => {
    e.preventDefault();
    post(route('invite.validate'));
  };

  return (
    <AuthLayout>
      <div className="layout:box-container landing-rounded-lg relative mx-auto w-3/4 bg-white pb-20 sm:pb-44">
        <div className="mx-auto -mb-12 mt-12 w-full max-w-2xl p-4">
          <Head title="Invite Validation" />
          <img
            className="w-1/3 pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/edvise-logo.svg"
            alt="Edvise Logo"
          />

          <div className="pb-8 text-2xl">
            Welcome! Please Enter Your Invite Code
          </div>

          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              <strong>New users:</strong> You need a valid invite code to access
              this application. Please enter the invite code you received via
              email.
            </p>
          </div>

          <form onSubmit={submit}>
            <div>
              <InputLabel htmlFor="invite_code">Invite Code</InputLabel>
              <TextInput
                id="invite_code"
                type="text"
                className="mt-1 block w-full"
                value={data.invite_code}
                onChange={e => setData('invite_code', e.target.value)}
                required
                autoFocus
                placeholder="Enter your invite code"
              />
              <InputError className="mt-2" message={errors.invite_code} />
            </div>

            <div className="mt-4 flex items-center justify-end">
              <Link
                href={route('login')}
                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Already have an account?
              </Link>

              <Button
                type="submit"
                className={classNames('ml-4', {
                  'opacity-25': processing,
                })}
                disabled={processing}
              >
                Validate Invite
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Don't have an invite code? Please contact your administrator.
            </p>
          </div>
          <div className="text-center">
            <AuthFooter />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
