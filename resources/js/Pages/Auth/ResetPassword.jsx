import { useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import { router } from '@inertiajs/react';
import AuthenticationCard from '@/Components/Modals/AuthenticationCard';
import InputLabel from '@/Components/Fields/InputLabel';
import TextInput from '@/Components/Fields/TextInput';
import InputError from '@/Components/Modals/InputError';
import AuthLayout from '@/Layouts/AuthLayout';
import Button from '@/Components/Landing/Button';
import AuthFooter from '@/Components/AuthFooter';

export default function ResetPassword({ token, email }) {
  const form = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  });
  function onSubmit(e) {
    e.preventDefault();
    form.post(route('password.update'), {
      onFinish: () => form.reset('password', 'password_confirmation'),
    });
  }
  return (
    <AuthLayout>
      <div className="layout:box-container landing-rounded-lg relative mx-auto w-3/4 bg-white pb-20 sm:pb-44">
        <div className="mx-auto -mb-12 mt-12 w-full max-w-2xl p-4">
          <Head title="Reset Password" />
          <img
            className="w-1/3 pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/deemia-logo.svg"
            alt="Student Success Tool Logo"
          />
          <div className="pb-8 text-2xl">Please choose a new password:</div>
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

            <div className="mt-4">
              <InputLabel htmlFor="password">Password</InputLabel>
              <TextInput
                id="password"
                type="password"
                className="mt-1 block w-full"
                value={form.data.password}
                onChange={e => form.setData('password', e.currentTarget.value)}
                required
                autoComplete="new-password"
              />
              <InputError className="mt-2" message={form.errors.password} />
            </div>

            <div className="mt-4">
              <InputLabel htmlFor="password_confirmation">
                Confirm Password
              </InputLabel>
              <TextInput
                id="password_confirmation"
                type="password"
                className="mt-1 block w-full"
                value={form.data.password_confirmation}
                onChange={e =>
                  form.setData('password_confirmation', e.currentTarget.value)
                }
                required
                autoComplete="new-password"
              />
              <InputError
                className="mt-2"
                message={form.errors.password_confirmation}
              />
            </div>

            <div className="mt-4 flex items-center justify-end">
              <Button
                type="submit"
                className={classNames({ 'opacity-25': form.processing })}
                disabled={form.processing}
              >
                Reset Password
              </Button>
            </div>
          </form>
          <AuthFooter />
        </div>
      </div>
    </AuthLayout>
  );
}
