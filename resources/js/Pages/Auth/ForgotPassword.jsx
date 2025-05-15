import { useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import { router } from '@inertiajs/react';
import AuthenticationCard from '@/Components/Modals/AuthenticationCard';
import InputLabel from '@/Components/Fields/InputLabel';
import TextInput from '@/Components/Fields/TextInput';
import InputError from '@/Components/Modals/InputError';
import AuthLayout from '@/Layouts/AuthLayout';
import AuthFooter from '@/Components/AuthFooter';
import Button from '@/Components/Landing/Button';

export default function ForgotPassword({ status }) {
  const form = useForm({
    email: '',
  });
  function onSubmit(e) {
    e.preventDefault();
    form.post(route('password.email'));
  }
  return (
    <AuthLayout>
      <div className="layout:box-container landing-rounded-lg relative mx-auto w-3/4 bg-white pb-20 sm:pb-44">
        <div className="mx-auto -mb-12 mt-12 w-full max-w-2xl p-4">
          <Head title="Forgot Password" />
          <img
            className="w-1/3 pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/deemia-logo.svg"
            alt="Student Success Tool Logo"
          />
          <div className="mb-4 text-sm text-gray-600">
            Forgot your password? No problem. Just let us know your email
            address and we will email you a password reset link that will allow
            you to choose a new one.
          </div>

          {status && (
            <div className="mb-4 text-sm font-medium text-green-600">
              {status}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div>
              <InputLabel htmlFor="email">Email</InputLabel>
              <TextInput
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={form.data.email}
                onChange={e => form.setData('email', e.currentTarget.value)}
                required
                autoFocus
              />
              <InputError className="mt-2" message={form.errors.email} />
            </div>

            <div className="mt-4 flex items-center justify-end">
              <Button
                type="submit"
                className={classNames({ 'opacity-25': form.processing })}
                disabled={form.processing}
              >
                Email Password Reset Link
              </Button>
            </div>
          </form>
          <AuthFooter />
        </div>
      </div>
    </AuthLayout>
  );
}
