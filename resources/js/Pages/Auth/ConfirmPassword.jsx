import { useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import { router } from '@inertiajs/react';
import AuthenticationCard from '@/Components/Modals/AuthenticationCard';
import InputError from '@/Components/Modals/InputError';
import InputLabel from '@/Components/Fields/InputLabel';
import TextInput from '@/Components/Fields/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import AuthFooter from '@/Components/AuthFooter';
import Button from '@/Components/Landing/Button';

export default function ConfirmPassword() {
  const form = useForm({
    password: '',
  });
  function onSubmit(e) {
    e.preventDefault();
    form.post(route('password.confirm'), {
      onFinish: () => form.reset(),
    });
  }
  return (
    <AuthLayout>
      <div className="layout:box-container landing-rounded-lg relative mx-auto w-3/4 bg-white pb-20 sm:pb-44">
        <div className="mx-auto -mb-12 mt-12 w-full max-w-2xl p-4">
          <Head title="Secure Area" />
          <img
            className="w-1/3 pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/deemia-logo.svg"
            alt="Edvise Logo"
          />
          <div className="mb-4 text-sm text-gray-600">
            This is a secure area of the application. Please confirm your
            password before continuing.
          </div>

          <form onSubmit={onSubmit}>
            <div>
              <InputLabel htmlFor="password">Password</InputLabel>
              <TextInput
                id="password"
                type="password"
                className="mt-1 block w-full"
                value={form.data.password}
                onChange={e => form.setData('password', e.currentTarget.value)}
                required
                autoComplete="current-password"
                autoFocus
              />
              <InputError className="mt-2" message={form.errors.password} />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                className={classNames('ml-4', {
                  'opacity-25': form.processing,
                })}
                disabled={form.processing}
              >
                Confirm
              </Button>
            </div>
          </form>
          <AuthFooter />
        </div>
      </div>
    </AuthLayout>
  );
}
